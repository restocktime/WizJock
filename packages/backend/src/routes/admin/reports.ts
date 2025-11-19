import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import pool, { transaction } from '../../db/connection';
import { AppError } from '../../utils/AppError';
import { authenticate, requireRole } from '../../middleware/auth';
import { ReportGenerationService } from '../../services/ReportGenerationService';
import { invalidatePicksCache } from '../../cache/cacheService';

const router = Router();

// Apply authentication and admin role requirement to all routes
router.use(authenticate);
router.use(requireRole('admin'));

// Validation schemas
const generateReportSchema = z.object({
  sport: z.enum(['NFL', 'NCAA', 'NBA', 'UFC'], {
    errorMap: () => ({ message: 'Sport must be one of: NFL, NCAA, NBA, UFC' }),
  }),
});

const getReportsSchema = z.object({
  sport: z.enum(['NFL', 'NCAA', 'NBA', 'UFC']).optional(),
  status: z.enum(['draft', 'published', 'unpublished']).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
});

// POST /api/admin/reports/generate - Generate a new report
router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sport } = generateReportSchema.parse(req.body);

    // Generate report using the service
    // Generate report using the service
    const report = await ReportGenerationService.generateReport(sport);

    res.status(201).json({
      success: true,
      reportId: report.id,
      report,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// GET /api/admin/reports - Get all reports with filtering
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sport, status, limit = 50, offset = 0 } = getReportsSchema.parse(req.query);

    // Build query dynamically based on filters
    let query = `
      SELECT 
        r.id,
        r.sport,
        r.status,
        r.generated_at,
        r.published_at,
        r.published_by,
        r.system_performance,
        COUNT(DISTINCT p.id) as pick_count,
        COUNT(DISTINCT i.id) as injury_count,
        COUNT(DISTINCT iu.id) as intelligence_count
      FROM reports r
      LEFT JOIN picks p ON r.id = p.report_id
      LEFT JOIN injuries i ON r.id = i.report_id
      LEFT JOIN intelligence_updates iu ON r.id = iu.report_id
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (sport) {
      conditions.push(`r.sport = $${paramIndex}`);
      params.push(sport);
      paramIndex++;
    }

    if (status) {
      conditions.push(`r.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY r.id, r.sport, r.status, r.generated_at, r.published_at, r.published_by, r.system_performance
      ORDER BY r.generated_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM reports r';
    const countConditions: string[] = [];
    const countParams: any[] = [];
    let countParamIndex = 1;

    if (sport) {
      countConditions.push(`r.sport = $${countParamIndex}`);
      countParams.push(sport);
      countParamIndex++;
    }

    if (status) {
      countConditions.push(`r.status = $${countParamIndex}`);
      countParams.push(status);
      countParamIndex++;
    }

    if (countConditions.length > 0) {
      countQuery += ' WHERE ' + countConditions.join(' AND ');
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      reports: result.rows,
      total,
      limit,
      offset,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// GET /api/admin/reports/:reportId - Get detailed report view
router.get('/:reportId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reportId)) {
      throw new AppError('Invalid report ID format', 400);
    }

    // Get report details
    const reportResult = await pool.query(
      'SELECT * FROM reports WHERE id = $1',
      [reportId]
    );

    if (reportResult.rows.length === 0) {
      throw new AppError('Report not found', 404);
    }

    const report = reportResult.rows[0];

    // Get all picks for this report
    const picksResult = await pool.query(
      `SELECT * FROM picks WHERE report_id = $1 ORDER BY hierarchy, game_time`,
      [reportId]
    );

    // Get all injuries for this report
    const injuriesResult = await pool.query(
      `SELECT * FROM injuries WHERE report_id = $1 ORDER BY reported_at DESC`,
      [reportId]
    );

    // Get all intelligence updates for this report
    const intelligenceResult = await pool.query(
      `SELECT * FROM intelligence_updates WHERE report_id = $1 ORDER BY credibility_rating DESC, reported_at DESC`,
      [reportId]
    );

    // Get all line movements for picks in this report
    const lineMovementsResult = await pool.query(
      `SELECT lm.* FROM line_movements lm
       INNER JOIN picks p ON lm.pick_id = p.id
       WHERE p.report_id = $1
       ORDER BY lm.timestamp DESC`,
      [reportId]
    );

    // Get player props for picks in this report
    const playerPropsResult = await pool.query(
      `SELECT pp.* FROM player_props pp
       INNER JOIN picks p ON pp.pick_id = p.id
       WHERE p.report_id = $1
       ORDER BY pp.created_at`,
      [reportId]
    );

    // Get injury-pick relationships
    const injuryPicksResult = await pool.query(
      `SELECT injury_id, pick_id FROM injury_pick_impact
       WHERE injury_id IN (SELECT id FROM injuries WHERE report_id = $1)`,
      [reportId]
    );

    // Build injury impact map
    const injuryImpactMap: Record<string, string[]> = {};
    injuryPicksResult.rows.forEach(row => {
      if (!injuryImpactMap[row.injury_id]) {
        injuryImpactMap[row.injury_id] = [];
      }
      injuryImpactMap[row.injury_id].push(row.pick_id);
    });

    // Add affected picks to injuries
    const injuries = injuriesResult.rows.map(injury => ({
      ...injury,
      affectedPicks: injuryImpactMap[injury.id] || [],
    }));

    // Build player props map by pick
    const playerPropsMap: Record<string, any[]> = {};
    playerPropsResult.rows.forEach(prop => {
      if (!playerPropsMap[prop.pick_id]) {
        playerPropsMap[prop.pick_id] = [];
      }
      playerPropsMap[prop.pick_id].push(prop);
    });

    // Add player props to picks
    const picks = picksResult.rows.map(pick => ({
      ...pick,
      playerProps: playerPropsMap[pick.id] || [],
    }));

    res.json({
      success: true,
      report: {
        ...report,
        picks,
        injuries,
        intelligenceUpdates: intelligenceResult.rows,
        lineMovements: lineMovementsResult.rows,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/reports/:reportId/publish - Publish a report
router.post('/:reportId/publish', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reportId)) {
      throw new AppError('Invalid report ID format', 400);
    }

    await transaction(async (client) => {
      // Check if report exists and is in draft status
      const reportResult = await client.query(
        'SELECT id, sport, status FROM reports WHERE id = $1',
        [reportId]
      );

      if (reportResult.rows.length === 0) {
        throw new AppError('Report not found', 404);
      }

      const report = reportResult.rows[0];

      if (report.status === 'published') {
        throw new AppError('Report is already published', 400);
      }

      // Unpublish any previously published reports for the same sport
      await client.query(
        `UPDATE reports 
         SET status = 'unpublished', updated_at = NOW()
         WHERE sport = $1 AND status = 'published' AND id != $2`,
        [report.sport, reportId]
      );

      // Publish the new report
      await client.query(
        `UPDATE reports 
         SET status = 'published', 
             published_at = NOW(), 
             published_by = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [req.user?.email || 'admin', reportId]
      );
    });

    // Invalidate cache for this sport
    const reportResult = await pool.query('SELECT sport FROM reports WHERE id = $1', [reportId]);
    if (reportResult.rows.length > 0) {
      await invalidatePicksCache(reportResult.rows[0].sport);
    }

    res.json({
      success: true,
      publishedAt: new Date(),
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/reports/:reportId/unpublish - Unpublish a report
router.delete('/:reportId/unpublish', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reportId)) {
      throw new AppError('Invalid report ID format', 400);
    }

    await transaction(async (client) => {
      // Check if report exists and is published
      const reportResult = await client.query(
        'SELECT id, sport, status FROM reports WHERE id = $1',
        [reportId]
      );

      if (reportResult.rows.length === 0) {
        throw new AppError('Report not found', 404);
      }

      const report = reportResult.rows[0];

      if (report.status !== 'published') {
        throw new AppError('Report is not currently published', 400);
      }

      // Unpublish the report
      await client.query(
        `UPDATE reports 
         SET status = 'unpublished', updated_at = NOW()
         WHERE id = $1`,
        [reportId]
      );
    });

    // Invalidate cache for this sport
    const reportResult = await pool.query('SELECT sport FROM reports WHERE id = $1', [reportId]);
    if (reportResult.rows.length > 0) {
      await invalidatePicksCache(reportResult.rows[0].sport);
    }

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
