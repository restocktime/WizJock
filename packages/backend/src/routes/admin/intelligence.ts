import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import pool from '../../db/connection';
import { AppError } from '../../utils/AppError';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();

// Apply authentication and admin role requirement to all routes
router.use(authenticate);
router.use(requireRole('admin'));

// Credibility rating mapping based on source type
const CREDIBILITY_RATINGS: Record<string, number> = {
  'official': 95,
  'verified-social': 85,
  'media': 80,
  'forum': 70,
  'insider': 75, // Default for insider, can be adjusted
};

// Validation schemas
const createIntelligenceSchema = z.object({
  reportId: z.string().uuid('Invalid report ID format'),
  entityId: z.string().min(1, 'Entity ID is required'),
  entityName: z.string().min(1, 'Entity name is required'),
  updateType: z.enum(['training', 'weight-cut', 'personal', 'lineup', 'other'], {
    errorMap: () => ({ message: 'Update type must be one of: training, weight-cut, personal, lineup, other' }),
  }),
  content: z.string().min(1, 'Content is required'),
  source: z.string().min(1, 'Source is required'),
  sourceType: z.enum(['official', 'verified-social', 'media', 'forum', 'insider'], {
    errorMap: () => ({ message: 'Source type must be one of: official, verified-social, media, forum, insider' }),
  }),
  credibilityRating: z.number().min(0).max(100).optional(), // Allow manual override
});

const getIntelligenceSchema = z.object({
  reportId: z.string().uuid().optional(),
  entityId: z.string().optional(),
  minCredibility: z.string().transform(Number).pipe(z.number().min(0).max(100)).optional(),
});

// POST /api/admin/intelligence - Add a new intelligence update
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const intelligenceData = createIntelligenceSchema.parse(req.body);

    // Verify report exists
    const reportCheck = await pool.query(
      'SELECT id FROM reports WHERE id = $1',
      [intelligenceData.reportId]
    );

    if (reportCheck.rows.length === 0) {
      throw new AppError('Report not found', 404);
    }

    // Assign credibility rating based on source type if not provided
    const credibilityRating = intelligenceData.credibilityRating !== undefined
      ? intelligenceData.credibilityRating
      : CREDIBILITY_RATINGS[intelligenceData.sourceType];

    // Insert intelligence update
    const result = await pool.query(
      `INSERT INTO intelligence_updates (
        report_id, entity_id, entity_name, update_type, 
        content, source, source_type, credibility_rating, 
        is_new, reported_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
      RETURNING *`,
      [
        intelligenceData.reportId,
        intelligenceData.entityId,
        intelligenceData.entityName,
        intelligenceData.updateType,
        intelligenceData.content,
        intelligenceData.source,
        intelligenceData.sourceType,
        credibilityRating,
      ]
    );

    res.status(201).json({
      success: true,
      intelligence: result.rows[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// GET /api/admin/intelligence - Get intelligence updates with filtering
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getIntelligenceSchema.parse(req.query);

    // Build query dynamically based on filters
    let query = `
      SELECT 
        *,
        CASE 
          WHEN reported_at > NOW() - INTERVAL '24 hours' THEN true
          ELSE false
        END as is_new
      FROM intelligence_updates
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.reportId) {
      conditions.push(`report_id = $${paramIndex}`);
      params.push(filters.reportId);
      paramIndex++;
    }

    if (filters.entityId) {
      conditions.push(`entity_id = $${paramIndex}`);
      params.push(filters.entityId);
      paramIndex++;
    }

    if (filters.minCredibility !== undefined) {
      conditions.push(`credibility_rating >= $${paramIndex}`);
      params.push(filters.minCredibility);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY credibility_rating DESC, reported_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      updates: result.rows,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

export default router;
