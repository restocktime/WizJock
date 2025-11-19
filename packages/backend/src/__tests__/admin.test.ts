import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from '../middleware/logger';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler';
import adminRoutes from '../routes/admin';
import authRoutes from '../routes/auth';
import pool from '../db/connection';
import { generateAccessToken } from '../utils/jwt';

// Create test app
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

let authToken: string;
let testReportId: string;
let testPickId: string;
let testInjuryId: string;
let testIntelligenceId: string;
let testPlayerPropId: string;

beforeAll(async () => {
  // Generate auth token for testing
  authToken = generateAccessToken({
    userId: 'test-user-id',
    email: 'admin@test.com',
    role: 'admin',
  });
});

afterAll(async () => {
  // Clean up test data
  if (testReportId) {
    await pool.query('DELETE FROM reports WHERE id = $1', [testReportId]);
  }
  await pool.end();
});

describe('Admin API Endpoints', () => {
  describe('POST /api/admin/reports/generate', () => {
    it('should generate a new report', async () => {
      const response = await request(app)
        .post('/api/admin/reports/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sport: 'NFL' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.reportId).toBeDefined();
      expect(response.body.report).toBeDefined();
      expect(response.body.report.sport).toBe('NFL');

      testReportId = response.body.reportId;
    });

    it('should reject invalid sport', async () => {
      const response = await request(app)
        .post('/api/admin/reports/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sport: 'INVALID' });

      expect(response.status).toBe(400);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .post('/api/admin/reports/generate')
        .send({ sport: 'NFL' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/admin/reports', () => {
    it('should get all reports', async () => {
      const response = await request(app)
        .get('/api/admin/reports')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.reports).toBeDefined();
      expect(Array.isArray(response.body.reports)).toBe(true);
    });

    it('should filter reports by sport', async () => {
      const response = await request(app)
        .get('/api/admin/reports?sport=NFL')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/admin/reports/:reportId', () => {
    it('should get detailed report view', async () => {
      if (!testReportId) {
        // Create a test report first
        const createResponse = await request(app)
          .post('/api/admin/reports/generate')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ sport: 'NBA' });
        testReportId = createResponse.body.reportId;
      }

      const response = await request(app)
        .get(`/api/admin/reports/${testReportId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.report).toBeDefined();
      expect(response.body.report.picks).toBeDefined();
      expect(response.body.report.injuries).toBeDefined();
      expect(response.body.report.intelligenceUpdates).toBeDefined();
    });

    it('should return 404 for non-existent report', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/api/admin/reports/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/admin/injuries', () => {
    it('should create a new injury update', async () => {
      if (!testReportId) {
        const createResponse = await request(app)
          .post('/api/admin/reports/generate')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ sport: 'NFL' });
        testReportId = createResponse.body.reportId;
      }

      const response = await request(app)
        .post('/api/admin/injuries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          reportId: testReportId,
          playerId: 'player-123',
          playerName: 'Test Player',
          team: 'Test Team',
          status: 'out',
          injuryType: 'hamstring',
          impact: 'critical',
          details: 'Out for the game',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.injury).toBeDefined();
      expect(response.body.injury.player_name).toBe('Test Player');

      testInjuryId = response.body.injury.id;
    });
  });

  describe('GET /api/admin/injuries', () => {
    it('should get all injuries', async () => {
      const response = await request(app)
        .get('/api/admin/injuries')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.injuries).toBeDefined();
    });
  });

  describe('POST /api/admin/intelligence', () => {
    it('should create intelligence update with automatic credibility rating', async () => {
      if (!testReportId) {
        const createResponse = await request(app)
          .post('/api/admin/reports/generate')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ sport: 'UFC' });
        testReportId = createResponse.body.reportId;
      }

      const response = await request(app)
        .post('/api/admin/intelligence')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          reportId: testReportId,
          entityId: 'fighter-456',
          entityName: 'Test Fighter',
          updateType: 'training',
          content: 'Fighter looking sharp in training',
          source: 'Official UFC',
          sourceType: 'official',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.intelligence).toBeDefined();
      expect(response.body.intelligence.credibility_rating).toBe(95); // Official source

      testIntelligenceId = response.body.intelligence.id;
    });
  });

  describe('GET /api/admin/intelligence', () => {
    it('should get intelligence updates with credibility filtering', async () => {
      const response = await request(app)
        .get('/api/admin/intelligence?minCredibility=80')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.updates).toBeDefined();
    });
  });

  describe('PATCH /api/admin/picks/:pickId', () => {
    it('should update pick hierarchy and units', async () => {
      // First, get a pick from the test report
      if (!testReportId) {
        const createResponse = await request(app)
          .post('/api/admin/reports/generate')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ sport: 'NBA' });
        testReportId = createResponse.body.reportId;
      }

      const reportResponse = await request(app)
        .get(`/api/admin/reports/${testReportId}`)
        .set('Authorization', `Bearer ${authToken}`);

      if (reportResponse.body.report.picks.length > 0) {
        testPickId = reportResponse.body.report.picks[0].id;

        const response = await request(app)
          .patch(`/api/admin/picks/${testPickId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            hierarchy: 'lock',
            units: 5,
            reasoning: 'Updated reasoning',
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.pick.hierarchy).toBe('lock');
        expect(response.body.pick.units).toBe(5);
      }
    });
  });

  describe('POST /api/admin/picks/:pickId/outcome', () => {
    it('should set pick outcome', async () => {
      if (testPickId) {
        const response = await request(app)
          .post(`/api/admin/picks/${testPickId}/outcome`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ outcome: 'win' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.pick.outcome).toBe('win');
      }
    });
  });

  describe('GET /api/admin/performance', () => {
    it('should get performance metrics', async () => {
      const response = await request(app)
        .get('/api/admin/performance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.overall).toBeDefined();
      expect(response.body.bySport).toBeDefined();
      expect(response.body.byBetType).toBeDefined();
      expect(response.body.byHierarchy).toBeDefined();
    });

    it('should filter performance by sport', async () => {
      const response = await request(app)
        .get('/api/admin/performance?sport=NFL')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/admin/reports/:reportId/publish', () => {
    it('should publish a report', async () => {
      if (!testReportId) {
        const createResponse = await request(app)
          .post('/api/admin/reports/generate')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ sport: 'NCAA' });
        testReportId = createResponse.body.reportId;
      }

      const response = await request(app)
        .post(`/api/admin/reports/${testReportId}/publish`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.publishedAt).toBeDefined();
    });
  });

  describe('DELETE /api/admin/reports/:reportId/unpublish', () => {
    it('should unpublish a report', async () => {
      if (testReportId) {
        const response = await request(app)
          .delete(`/api/admin/reports/${testReportId}/unpublish`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });
  });
});
