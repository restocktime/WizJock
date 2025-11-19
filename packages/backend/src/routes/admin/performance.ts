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
const getPerformanceSchema = z.object({
  sport: z.enum(['NFL', 'NCAA', 'NBA', 'UFC']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  betType: z.enum(['moneyline', 'spread', 'overunder', 'playerprop']).optional(),
  hierarchy: z.enum(['lock', 'featured', 'high', 'medium', 'value']).optional(),
});

// GET /api/admin/performance - Get performance metrics with aggregation
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getPerformanceSchema.parse(req.query);

    // Build base query for picks with outcomes
    let baseQuery = `
      SELECT 
        p.id,
        p.sport,
        p.bet_type,
        p.hierarchy,
        p.outcome,
        p.game_time,
        r.sport as report_sport
      FROM picks p
      INNER JOIN reports r ON p.report_id = r.id
      WHERE p.outcome IS NOT NULL
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.sport) {
      conditions.push(`r.sport = $${paramIndex}`);
      params.push(filters.sport);
      paramIndex++;
    }

    if (filters.startDate) {
      conditions.push(`p.game_time >= $${paramIndex}`);
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      conditions.push(`p.game_time <= $${paramIndex}`);
      params.push(filters.endDate);
      paramIndex++;
    }

    if (filters.betType) {
      conditions.push(`p.bet_type = $${paramIndex}`);
      params.push(filters.betType);
      paramIndex++;
    }

    if (filters.hierarchy) {
      conditions.push(`p.hierarchy = $${paramIndex}`);
      params.push(filters.hierarchy);
      paramIndex++;
    }

    if (conditions.length > 0) {
      baseQuery += ' AND ' + conditions.join(' AND ');
    }

    const picksResult = await pool.query(baseQuery, params);
    const picks = picksResult.rows;

    // Calculate overall statistics
    const totalPicks = picks.length;
    const wins = picks.filter(p => p.outcome === 'win').length;
    const losses = picks.filter(p => p.outcome === 'loss').length;
    const pushes = picks.filter(p => p.outcome === 'push').length;

    const winRate = totalPicks > 0 ? (wins / totalPicks) * 100 : 0;
    const lossRate = totalPicks > 0 ? (losses / totalPicks) * 100 : 0;
    const pushRate = totalPicks > 0 ? (pushes / totalPicks) * 100 : 0;

    // Calculate performance by sport
    const bySport: Record<string, any> = {};
    ['NFL', 'NCAA', 'NBA', 'UFC'].forEach(sport => {
      const sportPicks = picks.filter(p => p.report_sport === sport);
      const sportTotal = sportPicks.length;
      const sportWins = sportPicks.filter(p => p.outcome === 'win').length;
      const sportLosses = sportPicks.filter(p => p.outcome === 'loss').length;
      const sportPushes = sportPicks.filter(p => p.outcome === 'push').length;

      bySport[sport] = {
        total: sportTotal,
        wins: sportWins,
        losses: sportLosses,
        pushes: sportPushes,
        winRate: sportTotal > 0 ? (sportWins / sportTotal) * 100 : 0,
      };
    });

    // Calculate performance by bet type
    const byBetType: Record<string, any> = {};
    ['moneyline', 'spread', 'overunder', 'playerprop'].forEach(betType => {
      const betTypePicks = picks.filter(p => p.bet_type === betType);
      const betTypeTotal = betTypePicks.length;
      const betTypeWins = betTypePicks.filter(p => p.outcome === 'win').length;
      const betTypeLosses = betTypePicks.filter(p => p.outcome === 'loss').length;
      const betTypePushes = betTypePicks.filter(p => p.outcome === 'push').length;

      byBetType[betType] = {
        total: betTypeTotal,
        wins: betTypeWins,
        losses: betTypeLosses,
        pushes: betTypePushes,
        winRate: betTypeTotal > 0 ? (betTypeWins / betTypeTotal) * 100 : 0,
      };
    });

    // Calculate performance by hierarchy
    const byHierarchy: Record<string, any> = {};
    ['lock', 'featured', 'high', 'medium', 'value'].forEach(hierarchy => {
      const hierarchyPicks = picks.filter(p => p.hierarchy === hierarchy);
      const hierarchyTotal = hierarchyPicks.length;
      const hierarchyWins = hierarchyPicks.filter(p => p.outcome === 'win').length;
      const hierarchyLosses = hierarchyPicks.filter(p => p.outcome === 'loss').length;
      const hierarchyPushes = hierarchyPicks.filter(p => p.outcome === 'push').length;

      byHierarchy[hierarchy] = {
        total: hierarchyTotal,
        wins: hierarchyWins,
        losses: hierarchyLosses,
        pushes: hierarchyPushes,
        winRate: hierarchyTotal > 0 ? (hierarchyWins / hierarchyTotal) * 100 : 0,
      };
    });

    // Build trend data (group by week)
    const trends: any[] = [];
    if (picks.length > 0) {
      // Sort picks by game time
      const sortedPicks = [...picks].sort((a, b) =>
        new Date(a.game_time).getTime() - new Date(b.game_time).getTime()
      );

      // Group by week
      const weeklyData: Record<string, any> = {};
      sortedPicks.forEach(pick => {
        const gameDate = new Date(pick.game_time);
        // Get the start of the week (Sunday)
        const weekStart = new Date(gameDate);
        weekStart.setDate(gameDate.getDate() - gameDate.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            week: weekKey,
            total: 0,
            wins: 0,
            losses: 0,
            pushes: 0,
          };
        }

        weeklyData[weekKey].total++;
        if (pick.outcome === 'win') weeklyData[weekKey].wins++;
        if (pick.outcome === 'loss') weeklyData[weekKey].losses++;
        if (pick.outcome === 'push') weeklyData[weekKey].pushes++;
      });

      // Convert to array and calculate win rates
      Object.keys(weeklyData).sort().forEach(weekKey => {
        const data = weeklyData[weekKey];
        trends.push({
          week: data.week,
          total: data.total,
          wins: data.wins,
          losses: data.losses,
          pushes: data.pushes,
          winRate: data.total > 0 ? (data.wins / data.total) * 100 : 0,
        });
      });
    }

    res.json({
      success: true,
      overall: {
        total: totalPicks,
        wins,
        losses,
        pushes,
        winRate: Math.round(winRate * 100) / 100,
        lossRate: Math.round(lossRate * 100) / 100,
        pushRate: Math.round(pushRate * 100) / 100,
      },
      bySport,
      byBetType,
      byHierarchy,
      trends,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

export default router;
