import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import pool, { transaction } from '../../db/connection';
import { AppError } from '../../utils/AppError';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();

// Apply authentication and admin role requirement to all routes
router.use(authenticate);
router.use(requireRole('admin'));

// Validation schemas
const createPlayerPropSchema = z.object({
  pickId: z.string().uuid('Invalid pick ID format'),
  playerId: z.string().min(1, 'Player ID is required'),
  playerName: z.string().min(1, 'Player name is required'),
  statType: z.string().min(1, 'Stat type is required'),
  line: z.number(),
  overUnder: z.enum(['over', 'under'], {
    errorMap: () => ({ message: 'Over/Under must be either "over" or "under"' }),
  }),
  odds: z.string().min(1, 'Odds are required'),
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
  reasoning: z.string().optional(),
});

const getPlayerPropsSchema = z.object({
  pickId: z.string().uuid().optional(),
  playerId: z.string().optional(),
  reportId: z.string().uuid().optional(),
});

const setOutcomeSchema = z.object({
  outcome: z.enum(['win', 'loss', 'push'], {
    errorMap: () => ({ message: 'Outcome must be one of: win, loss, push' }),
  }),
});

// POST /api/admin/player-props - Add a new player prop
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propData = createPlayerPropSchema.parse(req.body);

    // Verify pick exists
    const pickCheck = await pool.query(
      'SELECT id, report_id FROM picks WHERE id = $1',
      [propData.pickId]
    );

    if (pickCheck.rows.length === 0) {
      throw new AppError('Pick not found', 404);
    }

    const pick = pickCheck.rows[0];

    // Check if player has any critical injuries that would affect this prop
    const injuryCheck = await pool.query(
      `SELECT i.* FROM injuries i
       WHERE i.report_id = $1 
       AND i.player_id = $2
       AND i.status IN ('out', 'season-ending')`,
      [pick.report_id, propData.playerId]
    );

    const hasCriticalInjury = injuryCheck.rows.length > 0;

    // Insert player prop
    const result = await pool.query(
      `INSERT INTO player_props (
        pick_id, player_id, player_name, stat_type, 
        line, over_under, odds, confidence, reasoning
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        propData.pickId,
        propData.playerId,
        propData.playerName,
        propData.statType,
        propData.line,
        propData.overUnder,
        propData.odds,
        propData.confidence,
        propData.reasoning || null,
      ]
    );

    const prop = result.rows[0];

    // Return warning if player has critical injury
    let warning = null;
    if (hasCriticalInjury) {
      warning = `Warning: ${propData.playerName} has a critical injury. This prop should be reviewed or removed.`;
    }

    res.status(201).json({
      success: true,
      prop,
      warning,
      flagged: hasCriticalInjury,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// GET /api/admin/player-props - Get player props with filtering
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getPlayerPropsSchema.parse(req.query);

    // Build query dynamically based on filters
    let query = `
      SELECT 
        pp.*,
        p.matchup,
        p.game_time,
        p.report_id,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM injuries i
            WHERE i.report_id = p.report_id
            AND i.player_id = pp.player_id
            AND i.status IN ('out', 'season-ending')
          ) THEN true
          ELSE false
        END as is_flagged
      FROM player_props pp
      INNER JOIN picks p ON pp.pick_id = p.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.pickId) {
      conditions.push(`pp.pick_id = $${paramIndex}`);
      params.push(filters.pickId);
      paramIndex++;
    }

    if (filters.playerId) {
      conditions.push(`pp.player_id = $${paramIndex}`);
      params.push(filters.playerId);
      paramIndex++;
    }

    if (filters.reportId) {
      conditions.push(`p.report_id = $${paramIndex}`);
      params.push(filters.reportId);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY pp.created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      props: result.rows,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// POST /api/admin/player-props/:propId/outcome - Set prop outcome for tracking
router.post('/:propId/outcome', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { propId } = req.params;
    const { outcome } = setOutcomeSchema.parse(req.body);

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(propId)) {
      throw new AppError('Invalid prop ID format', 400);
    }

    // Check if prop exists
    const propCheck = await pool.query(
      'SELECT id FROM player_props WHERE id = $1',
      [propId]
    );

    if (propCheck.rows.length === 0) {
      throw new AppError('Player prop not found', 404);
    }

    // Update prop outcome
    const result = await pool.query(
      'UPDATE player_props SET outcome = $1 WHERE id = $2 RETURNING *',
      [outcome, propId]
    );

    res.json({
      success: true,
      prop: result.rows[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

export default router;
