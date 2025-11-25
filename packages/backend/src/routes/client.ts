import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import pool from '../db/connection';
import { AppError } from '../utils/AppError';
import { CacheService } from '../cache/cacheService';

const router = Router();

// Validation schemas
const getPicksSchema = z.object({
  sport: z.enum(['NFL', 'NCAA', 'NBA', 'UFC']).optional(),
  betType: z.enum(['moneyline', 'spread', 'overunder', 'playerprop']).optional(),
  hierarchy: z.enum(['lock', 'featured', 'high', 'medium', 'value']).optional(),
});

// Helper function to convert hierarchy to stars
const hierarchyToStars = (hierarchy: string): number => {
  const starMap: Record<string, number> = {
    lock: 5,
    featured: 4,
    high: 3,
    medium: 2,
    value: 1,
  };
  return starMap[hierarchy] || 1;
};

// Helper function to transform admin Pick to ClientPick
const transformToClientPick = (pick: any, injuries: any[]): any => {
  // Find relevant injuries for this pick
  const relevantInjuries = injuries.filter(injury =>
    injury.affectedPicks && injury.affectedPicks.includes(pick.id)
  );

  // Create simplified injury summary
  let injurySummary: string | undefined;
  if (relevantInjuries.length > 0) {
    const criticalInjuries = relevantInjuries.filter(i => i.impact === 'critical');
    if (criticalInjuries.length > 0) {
      injurySummary = criticalInjuries.length === 1
        ? 'Key player out'
        : 'Multiple key players out';
    } else {
      injurySummary = 'Player injury update';
    }
  }

  return {
    id: pick.id,
    matchup: pick.matchup,
    gameTime: pick.game_time,
    betType: formatBetType(pick.bet_type),
    recommendation: pick.recommendation,
    currentOdds: pick.current_odds,
    hierarchy: pick.hierarchy,
    stars: hierarchyToStars(pick.hierarchy),
    units: pick.units,
    reasoning: pick.reasoning,
    injurySummary,
  };
};

// Helper function to format bet type for display
const formatBetType = (betType: string): string => {
  const typeMap: Record<string, string> = {
    moneyline: 'Money Line',
    spread: 'Spread',
    overunder: 'Over/Under',
    playerprop: 'Player Prop',
  };
  return typeMap[betType] || betType;
};

// Helper function to transform player props to client format
const transformToClientPlayerProp = (prop: any): any => {
  return {
    playerName: prop.player_name,
    statType: prop.stat_type,
    line: parseFloat(prop.line),
    pick: prop.over_under,
    odds: prop.odds,
    confidence: parseFloat(prop.confidence),
  };
};

// GET /api/picks - Get published picks with filtering
router.get('/picks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sport, betType, hierarchy } = getPicksSchema.parse(req.query);

    // Build cache key
    const cacheKey = `picks:${sport || 'all'}:${betType || 'all'}:${hierarchy || 'all'}`;

    // Try to get from cache first
    const cachedData = await CacheService.get(cacheKey);
    if (cachedData) {
      // Add cache control headers
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      return res.json(cachedData);
    }

    // Build query to get published picks
    let query = `
      SELECT 
        p.*,
        r.published_at,
        r.sport as report_sport
      FROM picks p
      INNER JOIN reports r ON p.report_id = r.id
      WHERE r.status = 'published'
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (sport) {
      conditions.push(`r.sport = $${paramIndex}`);
      params.push(sport);
      paramIndex++;
    }

    if (betType) {
      conditions.push(`p.bet_type = $${paramIndex}`);
      params.push(betType);
      paramIndex++;
    }

    if (hierarchy) {
      conditions.push(`p.hierarchy = $${paramIndex}`);
      params.push(hierarchy);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    // Sort by hierarchy first (locks at top), then by game time
    query += `
      ORDER BY 
        CASE p.hierarchy
          WHEN 'lock' THEN 1
          WHEN 'featured' THEN 2
          WHEN 'high' THEN 3
          WHEN 'medium' THEN 4
          WHEN 'value' THEN 5
        END,
        p.game_time ASC
    `;

    const picksResult = await pool.query(query, params);

    if (picksResult.rows.length === 0) {
      const response = {
        success: true,
        picks: [],
        publishedAt: null,
        nextUpdate: null,
        lockOfWeek: null,
      };

      // Cache empty result for shorter time
      await CacheService.set(cacheKey, response, 60); // 1 minute

      res.set('Cache-Control', 'public, max-age=60');
      return res.json(response);
    }

    // Get injuries for these picks
    const reportIds = [...new Set(picksResult.rows.map(p => p.report_id))];
    const injuriesResult = await pool.query(
      `SELECT i.*, array_agg(ipi.pick_id) as affectedPicks
       FROM injuries i
       LEFT JOIN injury_pick_impact ipi ON i.id = ipi.injury_id
       WHERE i.report_id = ANY($1)
       GROUP BY i.id`,
      [reportIds]
    );

    // Transform picks to client format
    const clientPicks = picksResult.rows.map(pick =>
      transformToClientPick(pick, injuriesResult.rows)
    );

    // Find lock of the week
    const lockOfWeek = clientPicks.find(p => p.hierarchy === 'lock') || null;

    // Get the most recent published_at timestamp
    const publishedAt = picksResult.rows[0]?.published_at || null;

    const response = {
      success: true,
      picks: clientPicks,
      publishedAt,
      nextUpdate: null, // Can be implemented later with scheduled updates
      lockOfWeek,
    };

    // Cache the response for 5 minutes
    await CacheService.set(cacheKey, response, 300);

    // Add cache control headers
    res.set('Cache-Control', 'public, max-age=300');
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// GET /api/picks/sports - Get navigation data with pick counts
router.get('/picks/sports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get from cache first
    const cacheKey = 'picks:sports:navigation';
    const cachedData = await CacheService.get(cacheKey);

    if (cachedData) {
      res.set('Cache-Control', 'public, max-age=300');
      return res.json(cachedData);
    }

    // Get pick counts by sport for published reports
    const result = await pool.query(`
      SELECT 
        r.sport,
        COUNT(p.id) as pick_count,
        MAX(CASE WHEN p.hierarchy = 'lock' THEN p.matchup END) as lock_of_week
      FROM reports r
      INNER JOIN picks p ON r.id = p.report_id
      WHERE r.status = 'published'
      GROUP BY r.sport
      ORDER BY r.sport
    `);

    const sports = result.rows.map(row => ({
      name: row.sport,
      pickCount: parseInt(row.pick_count),
      lockOfWeek: row.lock_of_week || undefined,
    }));

    const response = {
      success: true,
      sports,
    };

    // Cache for 5 minutes
    await CacheService.set(cacheKey, response, 300);

    res.set('Cache-Control', 'public, max-age=300');
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/picks/:pickId/props - Get player props for a specific pick
router.get('/picks/:pickId/props', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pickId } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pickId)) {
      throw new AppError('Invalid pick ID format', 400);
    }

    // Try to get from cache first
    const cacheKey = `picks:${pickId}:props`;
    const cachedData = await CacheService.get(cacheKey);

    if (cachedData) {
      res.set('Cache-Control', 'public, max-age=300');
      return res.json(cachedData);
    }

    // Verify pick exists and is published
    const pickResult = await pool.query(`
      SELECT p.id
      FROM picks p
      INNER JOIN reports r ON p.report_id = r.id
      WHERE p.id = $1 AND r.status = 'published'
    `, [pickId]);

    if (pickResult.rows.length === 0) {
      throw new AppError('Pick not found or not published', 404);
    }

    // Get player props for this pick
    const propsResult = await pool.query(
      `SELECT * FROM player_props WHERE pick_id = $1 ORDER BY confidence DESC`,
      [pickId]
    );

    const clientProps = propsResult.rows.map(transformToClientPlayerProp);

    const response = {
      success: true,
      props: clientProps,
    };

    // Cache for 5 minutes
    await CacheService.set(cacheKey, response, 300);

    res.set('Cache-Control', 'public, max-age=300');
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/injuries - Get recent injuries from published reports
router.get('/injuries', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'client:injuries';
    const cachedData = await CacheService.get(cacheKey);

    if (cachedData) {
      res.set('Cache-Control', 'public, max-age=300');
      return res.json(cachedData);
    }

    // Get injuries from published reports, ordered by reported date
    const result = await pool.query(`
      SELECT 
        i.player_name,
        i.team,
        i.status,
        i.injury_type,
        i.impact,
        i.details,
        i.reported_at,
        r.sport
      FROM injuries i
      INNER JOIN reports r ON i.report_id = r.id
      WHERE r.status = 'published'
      ORDER BY i.reported_at DESC
      LIMIT 50
    `);

    const injuries = result.rows.map(row => ({
      playerName: row.player_name,
      team: row.team,
      status: row.status,
      injuryType: row.injury_type,
      impact: row.impact,
      details: row.details,
      reportedAt: row.reported_at,
      sport: row.sport,
    }));

    const response = {
      success: true,
      injuries,
    };

    await CacheService.set(cacheKey, response, 300);
    res.set('Cache-Control', 'public, max-age=300');
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/schedule - Get upcoming games/fights from published reports
router.get('/schedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'client:schedule';
    const cachedData = await CacheService.get(cacheKey);

    if (cachedData) {
      res.set('Cache-Control', 'public, max-age=300');
      return res.json(cachedData);
    }

    // Get unique games/fights from published picks
    // Group by game_time and matchup to avoid duplicates if multiple picks exist for same game
    const result = await pool.query(`
      SELECT DISTINCT ON (p.matchup, p.game_time)
        p.matchup,
        p.game_time,
        r.sport,
        COUNT(p.id) as pick_count
      FROM picks p
      INNER JOIN reports r ON p.report_id = r.id
      WHERE r.status = 'published' AND p.game_time > NOW()
      GROUP BY p.matchup, p.game_time, r.sport
      ORDER BY p.game_time ASC
      LIMIT 50
    `);

    const schedule = result.rows.map(row => ({
      matchup: row.matchup,
      gameTime: row.game_time,
      sport: row.sport,
      pickCount: parseInt(row.pick_count),
    }));

    const response = {
      success: true,
      schedule,
    };

    await CacheService.set(cacheKey, response, 300);
    res.set('Cache-Control', 'public, max-age=300');
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
