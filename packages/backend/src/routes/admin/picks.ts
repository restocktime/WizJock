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
const updatePickSchema = z.object({
  hierarchy: z.enum(['lock', 'featured', 'high', 'medium', 'value']).optional(),
  units: z.number().int().min(1).max(5).optional(),
  reasoning: z.string().optional(),
  detailedAnalysis: z.string().optional(),
});

const setOutcomeSchema = z.object({
  outcome: z.enum(['win', 'loss', 'push'], {
    errorMap: () => ({ message: 'Outcome must be one of: win, loss, push' }),
  }),
});

// PATCH /api/admin/picks/:pickId - Update pick details
router.patch('/:pickId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pickId } = req.params;
    const updates = updatePickSchema.parse(req.body);

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pickId)) {
      throw new AppError('Invalid pick ID format', 400);
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      throw new AppError('No updates provided', 400);
    }

    // Check if pick exists
    const pickCheck = await pool.query(
      'SELECT * FROM picks WHERE id = $1',
      [pickId]
    );

    if (pickCheck.rows.length === 0) {
      throw new AppError('Pick not found', 404);
    }

    const currentPick = pickCheck.rows[0];

    // If hierarchy is being changed to 'lock', check for multiple locks in the same report
    if (updates.hierarchy === 'lock') {
      const lockCheck = await pool.query(
        `SELECT COUNT(*) as lock_count 
         FROM picks 
         WHERE report_id = $1 AND hierarchy = 'lock' AND id != $2`,
        [currentPick.report_id, pickId]
      );

      const lockCount = parseInt(lockCheck.rows[0].lock_count);

      // Return warning but allow the update (manual override)
      if (lockCount > 0) {
        // We'll include this warning in the response
        console.warn(`Warning: Report ${currentPick.report_id} will have multiple locks`);
      }
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (updates.hierarchy !== undefined) {
      updateFields.push(`hierarchy = $${paramIndex}`);
      updateValues.push(updates.hierarchy);
      paramIndex++;
    }

    if (updates.units !== undefined) {
      updateFields.push(`units = $${paramIndex}`);
      updateValues.push(updates.units);
      paramIndex++;
    }

    if (updates.reasoning !== undefined) {
      updateFields.push(`reasoning = $${paramIndex}`);
      updateValues.push(updates.reasoning);
      paramIndex++;
    }

    if (updates.detailedAnalysis !== undefined) {
      updateFields.push(`detailed_analysis = $${paramIndex}`);
      updateValues.push(updates.detailedAnalysis);
      paramIndex++;
    }

    updateValues.push(pickId);

    const updateQuery = `
      UPDATE picks 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, updateValues);

    // Check for multiple locks warning
    let warning = null;
    if (updates.hierarchy === 'lock') {
      const lockCheck = await pool.query(
        `SELECT COUNT(*) as lock_count 
         FROM picks 
         WHERE report_id = $1 AND hierarchy = 'lock'`,
        [currentPick.report_id]
      );

      const lockCount = parseInt(lockCheck.rows[0].lock_count);
      if (lockCount > 1) {
        warning = `This report now has ${lockCount} locks. Consider maintaining exclusivity for "Lock of the Week".`;
      }
    }

    res.json({
      success: true,
      pick: result.rows[0],
      warning,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// POST /api/admin/picks/:pickId/outcome - Set pick outcome for performance tracking
router.post('/:pickId/outcome', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pickId } = req.params;
    const { outcome } = setOutcomeSchema.parse(req.body);

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pickId)) {
      throw new AppError('Invalid pick ID format', 400);
    }

    // Check if pick exists
    const pickCheck = await pool.query(
      'SELECT id FROM picks WHERE id = $1',
      [pickId]
    );

    if (pickCheck.rows.length === 0) {
      throw new AppError('Pick not found', 404);
    }

    // Update pick outcome
    const result = await pool.query(
      'UPDATE picks SET outcome = $1 WHERE id = $2 RETURNING *',
      [outcome, pickId]
    );

    res.json({
      success: true,
      pick: result.rows[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

export default router;
