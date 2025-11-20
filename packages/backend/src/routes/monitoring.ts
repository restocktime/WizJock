import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import monitoringService from '../services/MonitoringService';
import pool from '../db/connection';
import { logger } from '../utils/logger';

const router = Router();

// Middleware to require admin role
const requireAdmin = [authenticate, requireRole('admin')];

/**
 * GET /api/monitoring/health - Public health check endpoint
 */
router.get('/health', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await monitoringService.checkSystemHealth();
    
    const statusCode = health.status === 'healthy' ? 200 : 
                       health.status === 'degraded' ? 200 : 503;
    
    res.status(statusCode).json(health);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/monitoring/metrics - Get all metrics (admin only)
 */
router.get(
  '/metrics',
  ...requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await monitoringService.getMetricsSummary();
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/applications - Get application metrics (admin only)
 */
router.get(
  '/applications',
  ...requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await monitoringService.getApplicationMetrics();
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/applications/list - Get list of applications (admin only)
 */
router.get(
  '/applications/list',
  ...requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          id, 
          full_name, 
          email, 
          phone, 
          betting_experience, 
          sms_consent, 
          status, 
          notes,
          created_at, 
          updated_at
        FROM applications
      `;
      const params: any[] = [];

      if (status && ['pending', 'approved', 'rejected', 'contacted'].includes(status)) {
        query += ' WHERE status = $1';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await pool.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM applications';
      const countParams: any[] = [];
      if (status && ['pending', 'approved', 'rejected', 'contacted'].includes(status)) {
        countQuery += ' WHERE status = $1';
        countParams.push(status);
      }
      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total);

      res.json({
        applications: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/applications/:id - Get single application (admin only)
 */
router.get(
  '/applications/:id',
  ...requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT 
          id, 
          full_name, 
          email, 
          phone, 
          betting_experience, 
          sms_consent, 
          status, 
          notes,
          created_at, 
          updated_at
        FROM applications
        WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Application not found',
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/monitoring/applications/:id - Update application status (admin only)
 */
router.patch(
  '/applications/:id',
  ...requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      // Validate status
      if (status && !['pending', 'approved', 'rejected', 'contacted'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value',
        });
      }

      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (status) {
        updates.push(`status = $${paramIndex++}`);
        params.push(status);
      }

      if (notes !== undefined) {
        updates.push(`notes = $${paramIndex++}`);
        params.push(notes);
      }

      updates.push(`updated_at = NOW()`);
      params.push(id);

      const query = `
        UPDATE applications 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Application not found',
        });
      }

      logger.info('Application updated', {
        applicationId: id,
        status,
        updatedBy: (req as any).user?.id,
      });

      res.json({
        success: true,
        application: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/emails - Get email metrics (admin only)
 */
router.get(
  '/emails',
  ...requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = monitoringService.getEmailMetrics();
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
