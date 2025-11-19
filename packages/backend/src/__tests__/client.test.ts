import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from '../middleware/logger';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler';
import clientRoutes from '../routes/client';
import adminRoutes from '../routes/admin';
import authRoutes from '../routes/auth';
import pool from '../db/connection';
import { generateAccessToken } from '../utils/jwt';
import { CacheService } from '../cache/cacheService';

// Create test app
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', clientRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

let authToken: string;
let testReportId: string;
let testPickId: string;
let testPickWithPropsId: string;

beforeAll(async () => {
  // Generate auth token for admin operations
  authToken = generateAccessToken({
    userId: 'test-user-id',
    email: 'admin@test.com',
    role: 'admin',
  });

  // Clear cache before tests
  await CacheService.clear();

  // Create a test report with picks
  const reportResult = await pool.query(`
    INSERT INTO reports (sport, status, generated_at, published_at, published_by)
    VALUES ('NFL', 'published', NOW(), NOW(), 'test-admin')
    RETURNING id
  `);
  testReportId = reportResult.rows[0].id;

  // Create test picks with different hierarchies and bet types
  const pickResults = await pool.query(`
    INSERT INTO picks (
      report_id, game_id, matchup, game_time, bet_type, recommendation,
      confidence_score, hierarchy, units, current_odds, reasoning, detailed_analysis
    ) VALUES
      ($1, 'game1', 'Team A vs Team B', NOW() + INTERVAL '1 day', 'spread', 'Team A -7', 
       95, 'lock', 5, '-110', 'Strong matchup advantage', 'Detailed analysis here'),
      ($1, 'game2', 'Team C vs Team D', NOW() + INTERVAL '2 days', 'moneyline', 'Team C ML',
       85, 'featured', 4, '+150', 'Good value play', 'More details'),
      ($1, 'game3', 'Team E vs Team F', NOW() + INTERVAL '3 days', 'overunder', 'Over 45.5',
       75, 'high', 3, '-105', 'High scoring expected', 'Analysis'),
      ($1, 'game4', 'Team G vs Team H', NOW() + INTERVAL '4 days', 'spread', 'Team G +3',
       60, 'value', 2, '+110', 'Value opportunity', 'Details')
    RETURNING id
  `, [testReportId]);

  testPickId = pickResults.rows[0].id;
  testPickWithPropsId = pickResults.rows[1].id;

  // Create test injuries
  const injuryResult = await pool.query(`
    INSERT INTO injuries (
      report_id, player_id, player_name, team, status, injury_type, impact, details
    ) VALUES
      ($1, 'player1', 'John Doe', 'Team A', 'out', 'hamstring', 'critical', 'Out for game')
    RETURNING id
  `, [testReportId]);

  // Link injury to pick
  await pool.query(`
    INSERT INTO injury_pick_impact (injury_id, pick_id)
    VALUES ($1, $2)
  `, [injuryResult.rows[0].id, testPickId]);

  // Create test player props
  await pool.query(`
    INSERT INTO player_props (
      pick_id, player_id, player_name, stat_type, line, over_under, odds, confidence, reasoning
    ) VALUES
      ($1, 'player2', 'Jane Smith', 'passing yards', 275.5, 'over', '-110', 80, 'Strong passing game expected'),
      ($1, 'player3', 'Bob Johnson', 'receptions', 6.5, 'over', '+105', 75, 'High target share')
  `, [testPickWithPropsId]);
});

afterAll(async () => {
  // Clean up test data
  if (testReportId) {
    await pool.query('DELETE FROM reports WHERE id = $1', [testReportId]);
  }
  await CacheService.clear();
  await pool.end();
});

describe('Client API Endpoints', () => {
  describe('GET /api/picks', () => {
    it('should get all published picks', async () => {
      const response = await request(app)
        .get('/api/picks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.picks).toBeDefined();
      expect(Array.isArray(response.body.picks)).toBe(true);
      expect(response.body.picks.length).toBeGreaterThan(0);
      expect(response.body.publishedAt).toBeDefined();
    });

    it('should return picks sorted by hierarchy then game time', async () => {
      const response = await request(app)
        .get('/api/picks');

      expect(response.status).toBe(200);
      const picks = response.body.picks;
      
      // First pick should be the lock
      expect(picks[0].hierarchy).toBe('lock');
      expect(picks[0].stars).toBe(5);
      
      // Verify hierarchy order
      const hierarchyOrder = picks.map((p: any) => p.hierarchy);
      const expectedOrder = ['lock', 'featured', 'high', 'value'];
      expect(hierarchyOrder).toEqual(expectedOrder);
    });

    it('should filter picks by sport', async () => {
      const response = await request(app)
        .get('/api/picks?sport=NFL');

      expect(response.status).toBe(200);
      expect(response.body.picks).toBeDefined();
      expect(response.body.picks.length).toBeGreaterThan(0);
    });

    it('should filter picks by bet type', async () => {
      const response = await request(app)
        .get('/api/picks?betType=spread');

      expect(response.status).toBe(200);
      expect(response.body.picks).toBeDefined();
      // Should have 2 spread picks
      expect(response.body.picks.length).toBe(2);
    });

    it('should filter picks by hierarchy', async () => {
      const response = await request(app)
        .get('/api/picks?hierarchy=lock');

      expect(response.status).toBe(200);
      expect(response.body.picks).toBeDefined();
      expect(response.body.picks.length).toBe(1);
      expect(response.body.picks[0].hierarchy).toBe('lock');
    });

    it('should return lock of the week', async () => {
      const response = await request(app)
        .get('/api/picks');

      expect(response.status).toBe(200);
      expect(response.body.lockOfWeek).toBeDefined();
      expect(response.body.lockOfWeek.hierarchy).toBe('lock');
      expect(response.body.lockOfWeek.stars).toBe(5);
    });

    it('should include cache control headers', async () => {
      const response = await request(app)
        .get('/api/picks');

      expect(response.status).toBe(200);
      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).toContain('public');
    });

    it('should return ClientPick format with only essential fields', async () => {
      const response = await request(app)
        .get('/api/picks');

      expect(response.status).toBe(200);
      const pick = response.body.picks[0];
      
      // Should have client fields
      expect(pick.id).toBeDefined();
      expect(pick.matchup).toBeDefined();
      expect(pick.gameTime).toBeDefined();
      expect(pick.betType).toBeDefined();
      expect(pick.recommendation).toBeDefined();
      expect(pick.currentOdds).toBeDefined();
      expect(pick.hierarchy).toBeDefined();
      expect(pick.stars).toBeDefined();
      expect(pick.units).toBeDefined();
      expect(pick.reasoning).toBeDefined();
      
      // Should NOT have admin-only fields
      expect(pick.confidence_score).toBeUndefined();
      expect(pick.confidenceScore).toBeUndefined();
      expect(pick.risk_score).toBeUndefined();
      expect(pick.riskScore).toBeUndefined();
      expect(pick.detailed_analysis).toBeUndefined();
      expect(pick.detailedAnalysis).toBeUndefined();
      expect(pick.expected_value).toBeUndefined();
      expect(pick.expectedValue).toBeUndefined();
    });

    it('should include simplified injury summary when relevant', async () => {
      const response = await request(app)
        .get('/api/picks');

      expect(response.status).toBe(200);
      const pickWithInjury = response.body.picks.find((p: any) => p.id === testPickId);
      
      expect(pickWithInjury).toBeDefined();
      expect(pickWithInjury.injurySummary).toBeDefined();
      expect(pickWithInjury.injurySummary).toBe('Key player out');
    });

    it('should format bet types for display', async () => {
      const response = await request(app)
        .get('/api/picks');

      expect(response.status).toBe(200);
      const picks = response.body.picks;
      
      // Check that bet types are formatted
      const betTypes = picks.map((p: any) => p.betType);
      expect(betTypes).toContain('Spread');
      expect(betTypes).toContain('Money Line');
      expect(betTypes).toContain('Over/Under');
    });

    it('should use cached data on subsequent requests', async () => {
      // First request
      const response1 = await request(app)
        .get('/api/picks?sport=NFL');
      expect(response1.status).toBe(200);

      // Second request should use cache
      const response2 = await request(app)
        .get('/api/picks?sport=NFL');
      expect(response2.status).toBe(200);
      expect(response2.body).toEqual(response1.body);
    });

    it('should reject invalid sport parameter', async () => {
      const response = await request(app)
        .get('/api/picks?sport=INVALID');

      expect(response.status).toBe(400);
    });

    it('should reject invalid bet type parameter', async () => {
      const response = await request(app)
        .get('/api/picks?betType=invalid');

      expect(response.status).toBe(400);
    });

    it('should reject invalid hierarchy parameter', async () => {
      const response = await request(app)
        .get('/api/picks?hierarchy=invalid');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/picks/sports', () => {
    it('should get sports navigation data', async () => {
      const response = await request(app)
        .get('/api/picks/sports');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.sports).toBeDefined();
      expect(Array.isArray(response.body.sports)).toBe(true);
    });

    it('should include pick counts for each sport', async () => {
      const response = await request(app)
        .get('/api/picks/sports');

      expect(response.status).toBe(200);
      const sports = response.body.sports;
      
      if (sports.length > 0) {
        const sport = sports[0];
        expect(sport.name).toBeDefined();
        expect(sport.pickCount).toBeDefined();
        expect(typeof sport.pickCount).toBe('number');
      }
    });

    it('should include lock of week indicator', async () => {
      const response = await request(app)
        .get('/api/picks/sports');

      expect(response.status).toBe(200);
      const nflSport = response.body.sports.find((s: any) => s.name === 'NFL');
      
      if (nflSport) {
        expect(nflSport.lockOfWeek).toBeDefined();
      }
    });

    it('should include cache control headers', async () => {
      const response = await request(app)
        .get('/api/picks/sports');

      expect(response.status).toBe(200);
      expect(response.headers['cache-control']).toBeDefined();
    });
  });

  describe('GET /api/picks/:pickId/props', () => {
    it('should get player props for a pick', async () => {
      const response = await request(app)
        .get(`/api/picks/${testPickWithPropsId}/props`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.props).toBeDefined();
      expect(Array.isArray(response.body.props)).toBe(true);
      expect(response.body.props.length).toBe(2);
    });

    it('should return props in client format', async () => {
      const response = await request(app)
        .get(`/api/picks/${testPickWithPropsId}/props`);

      expect(response.status).toBe(200);
      const prop = response.body.props[0];
      
      // Should have client fields
      expect(prop.playerName).toBeDefined();
      expect(prop.statType).toBeDefined();
      expect(prop.line).toBeDefined();
      expect(prop.pick).toBeDefined();
      expect(prop.odds).toBeDefined();
      expect(prop.confidence).toBeDefined();
      
      // Should NOT have admin-only fields
      expect(prop.player_id).toBeUndefined();
      expect(prop.playerId).toBeUndefined();
      expect(prop.reasoning).toBeUndefined();
    });

    it('should sort props by confidence descending', async () => {
      const response = await request(app)
        .get(`/api/picks/${testPickWithPropsId}/props`);

      expect(response.status).toBe(200);
      const props = response.body.props;
      
      // First prop should have higher confidence
      expect(props[0].confidence).toBeGreaterThanOrEqual(props[1].confidence);
    });

    it('should return 404 for non-existent pick', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/api/picks/${fakeId}/props`);

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid pick ID format', async () => {
      const response = await request(app)
        .get('/api/picks/invalid-id/props');

      expect(response.status).toBe(400);
    });

    it('should include cache control headers', async () => {
      const response = await request(app)
        .get(`/api/picks/${testPickWithPropsId}/props`);

      expect(response.status).toBe(200);
      expect(response.headers['cache-control']).toBeDefined();
    });

    it('should return empty array for pick with no props', async () => {
      const response = await request(app)
        .get(`/api/picks/${testPickId}/props`);

      expect(response.status).toBe(200);
      expect(response.body.props).toBeDefined();
      expect(response.body.props.length).toBe(0);
    });
  });
});
