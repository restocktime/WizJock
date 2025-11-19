import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import pool from '../../db/connection';
import { AppError } from '../../utils/AppError';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();

// Apply authentication and admin role requirement to all routes
router.use(authenticate);
router.use(requireRole('admin'));

// Validation schemas
const createLineMovementSchema = z.object({
  pickId: z.string().uuid('Invalid pick ID format'),
  openingLine: z.string().min(1, 'Opening line is required'),
  currentLine: z.string().min(1, 'Current line is required'),
  sharpMoney: z.boolean().optional(),
  notes: z.string().optional(),
});

// Helper function to calculate movement percentage and direction
function calculateLineMovement(openingLine: string, currentLine: string): {
  movementPercentage: number;
  direction: 'toward' | 'away';
} {
  // Parse line values (handle spreads, totals, and moneylines)
  const parseLineValue = (line: string): number => {
    // Remove any non-numeric characters except +, -, and .
    const cleaned = line.replace(/[^\d.+-]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const openingValue = parseLineValue(openingLine);
  const currentValue = parseLineValue(currentLine);

  // Calculate percentage change
  const difference = Math.abs(currentValue - openingValue);
  const movementPercentage = openingValue !== 0
    ? (difference / Math.abs(openingValue)) * 100
    : 0;

  // Determine direction (simplified logic - in production, this would be more sophisticated)
  // For spreads: if line moves toward 0, it's moving toward the favorite
  // For totals: movement is just the change
  // For moneylines: movement toward + is away from favorite
  const direction: 'toward' | 'away' = currentValue > openingValue ? 'away' : 'toward';

  return {
    movementPercentage: Math.round(movementPercentage * 100) / 100,
    direction,
  };
}

// POST /api/admin/line-movements - Track a line change
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movementData = createLineMovementSchema.parse(req.body);

    // Verify pick exists
    const pickCheck = await pool.query(
      'SELECT id FROM picks WHERE id = $1',
      [movementData.pickId]
    );

    if (pickCheck.rows.length === 0) {
      throw new AppError('Pick not found', 404);
    }

    // Calculate movement percentage and direction
    const { movementPercentage, direction } = calculateLineMovement(
      movementData.openingLine,
      movementData.currentLine
    );

    // Insert line movement
    const result = await pool.query(
      `INSERT INTO line_movements (
        pick_id, opening_line, current_line, 
        movement_percentage, direction, sharp_money, notes, timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *`,
      [
        movementData.pickId,
        movementData.openingLine,
        movementData.currentLine,
        movementPercentage,
        direction,
        movementData.sharpMoney || false,
        movementData.notes || null,
      ]
    );

    const movement = result.rows[0];

    // Check if movement is significant (>10%)
    const isSignificant = movementPercentage > 10;

    res.status(201).json({
      success: true,
      movement: {
        ...movement,
        isSignificant,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// GET /api/admin/line-movements/:pickId - Get movement history for a pick
router.get('/:pickId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pickId } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pickId)) {
      throw new AppError('Invalid pick ID format', 400);
    }

    // Verify pick exists
    const pickCheck = await pool.query(
      'SELECT id, matchup, current_odds FROM picks WHERE id = $1',
      [pickId]
    );

    if (pickCheck.rows.length === 0) {
      throw new AppError('Pick not found', 404);
    }

    const pick = pickCheck.rows[0];

    // Get all line movements for this pick
    const result = await pool.query(
      `SELECT 
        *,
        CASE 
          WHEN movement_percentage > 10 THEN true
          ELSE false
        END as is_significant
      FROM line_movements
      WHERE pick_id = $1
      ORDER BY timestamp DESC`,
      [pickId]
    );

    res.json({
      success: true,
      pick: {
        id: pick.id,
        matchup: pick.matchup,
        currentOdds: pick.current_odds,
      },
      movements: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
