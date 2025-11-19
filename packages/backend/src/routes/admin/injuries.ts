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
const createInjurySchema = z.object({
  reportId: z.string().uuid('Invalid report ID format'),
  playerId: z.string().min(1, 'Player ID is required'),
  playerName: z.string().min(1, 'Player name is required'),
  team: z.string().optional(),
  status: z.enum(['out', 'questionable', 'probable', 'season-ending'], {
    errorMap: () => ({ message: 'Status must be one of: out, questionable, probable, season-ending' }),
  }),
  injuryType: z.string().min(1, 'Injury type is required'),
  impact: z.enum(['critical', 'moderate', 'minor'], {
    errorMap: () => ({ message: 'Impact must be one of: critical, moderate, minor' }),
  }),
  details: z.string().optional(),
});

const updateInjurySchema = z.object({
  status: z.enum(['out', 'questionable', 'probable', 'season-ending']).optional(),
  impact: z.enum(['critical', 'moderate', 'minor']).optional(),
  details: z.string().optional(),
});

const getInjuriesSchema = z.object({
  reportId: z.string().uuid().optional(),
  playerId: z.string().optional(),
  status: z.enum(['out', 'questionable', 'probable', 'season-ending']).optional(),
});

// POST /api/admin/injuries - Add a new injury update
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const injuryData = createInjurySchema.parse(req.body);

    const result = await transaction(async (client) => {
      // Verify report exists
      const reportCheck = await client.query(
        'SELECT id FROM reports WHERE id = $1',
        [injuryData.reportId]
      );

      if (reportCheck.rows.length === 0) {
        throw new AppError('Report not found', 404);
      }

      // Insert injury
      const injuryResult = await client.query(
        `INSERT INTO injuries (
          report_id, player_id, player_name, team, status, 
          injury_type, impact, details, reported_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *`,
        [
          injuryData.reportId,
          injuryData.playerId,
          injuryData.playerName,
          injuryData.team || null,
          injuryData.status,
          injuryData.injuryType,
          injuryData.impact,
          injuryData.details || null,
        ]
      );

      const injury = injuryResult.rows[0];

      // Auto-flag picks if injury is critical (out or season-ending)
      if (injuryData.status === 'out' || injuryData.status === 'season-ending') {
        // Find picks in the same report that might be affected
        // This is a simplified approach - in production, you'd have more sophisticated matching
        const affectedPicksResult = await client.query(
          `SELECT id FROM picks 
           WHERE report_id = $1 
           AND (
             matchup ILIKE $2 
             OR matchup ILIKE $3
           )`,
          [
            injuryData.reportId,
            `%${injuryData.playerName}%`,
            `%${injuryData.team || ''}%`,
          ]
        );

        // Link injury to affected picks
        for (const pick of affectedPicksResult.rows) {
          await client.query(
            `INSERT INTO injury_pick_impact (injury_id, pick_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [injury.id, pick.id]
          );
        }

        // Get the affected pick IDs
        const affectedPickIds = affectedPicksResult.rows.map(row => row.id);

        return {
          injury,
          affectedPicks: affectedPickIds,
        };
      }

      return {
        injury,
        affectedPicks: [],
      };
    });

    res.status(201).json({
      success: true,
      injury: result.injury,
      affectedPicks: result.affectedPicks,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// PATCH /api/admin/injuries/:injuryId - Update injury status
router.patch('/:injuryId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { injuryId } = req.params;
    const updates = updateInjurySchema.parse(req.body);

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(injuryId)) {
      throw new AppError('Invalid injury ID format', 400);
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      throw new AppError('No updates provided', 400);
    }

    const result = await transaction(async (client) => {
      // Check if injury exists
      const injuryCheck = await client.query(
        'SELECT * FROM injuries WHERE id = $1',
        [injuryId]
      );

      if (injuryCheck.rows.length === 0) {
        throw new AppError('Injury not found', 404);
      }

      const currentInjury = injuryCheck.rows[0];

      // Build update query dynamically
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (updates.status !== undefined) {
        updateFields.push(`status = $${paramIndex}`);
        updateValues.push(updates.status);
        paramIndex++;
      }

      if (updates.impact !== undefined) {
        updateFields.push(`impact = $${paramIndex}`);
        updateValues.push(updates.impact);
        paramIndex++;
      }

      if (updates.details !== undefined) {
        updateFields.push(`details = $${paramIndex}`);
        updateValues.push(updates.details);
        paramIndex++;
      }

      updateValues.push(injuryId);

      const updateQuery = `
        UPDATE injuries 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const updateResult = await client.query(updateQuery, updateValues);
      const updatedInjury = updateResult.rows[0];

      // If status changed to critical, update affected picks
      if (updates.status && (updates.status === 'out' || updates.status === 'season-ending')) {
        // Find picks that might be affected
        const affectedPicksResult = await client.query(
          `SELECT id FROM picks 
           WHERE report_id = $1 
           AND (
             matchup ILIKE $2 
             OR matchup ILIKE $3
           )`,
          [
            currentInjury.report_id,
            `%${currentInjury.player_name}%`,
            `%${currentInjury.team || ''}%`,
          ]
        );

        // Link injury to affected picks
        for (const pick of affectedPicksResult.rows) {
          await client.query(
            `INSERT INTO injury_pick_impact (injury_id, pick_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [injuryId, pick.id]
          );
        }
      }

      return updatedInjury;
    });

    res.json({
      success: true,
      injury: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// GET /api/admin/injuries - Get injuries with filtering
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getInjuriesSchema.parse(req.query);

    // Build query dynamically based on filters
    let query = `
      SELECT 
        i.*,
        COALESCE(
          json_agg(
            DISTINCT ipi.pick_id
          ) FILTER (WHERE ipi.pick_id IS NOT NULL),
          '[]'
        ) as affected_picks
      FROM injuries i
      LEFT JOIN injury_pick_impact ipi ON i.id = ipi.injury_id
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.reportId) {
      conditions.push(`i.report_id = $${paramIndex}`);
      params.push(filters.reportId);
      paramIndex++;
    }

    if (filters.playerId) {
      conditions.push(`i.player_id = $${paramIndex}`);
      params.push(filters.playerId);
      paramIndex++;
    }

    if (filters.status) {
      conditions.push(`i.status = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY i.id, i.report_id, i.player_id, i.player_name, i.team, 
               i.status, i.injury_type, i.impact, i.details, i.reported_at, i.created_at
      ORDER BY i.reported_at DESC
    `;

    const result = await pool.query(query, params);

    // Parse the JSON aggregated affected_picks
    const injuries = result.rows.map(row => ({
      ...row,
      affectedPicks: row.affected_picks,
    }));

    res.json({
      success: true,
      injuries,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

export default router;
