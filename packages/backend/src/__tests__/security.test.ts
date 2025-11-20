import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pool from '../db/connection';
import applicationsRoutes from '../routes/applications';
import { errorHandler } from '../middleware/errorHandler';
import { apiLimiter } from '../middleware/rateLimiter';

// Create test app
const createTestApp = () => {
  const app = express();
  
  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  }));
  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Routes
  app.use('/api/applications', applicationsRoutes);
  
  // Error handler
  app.use(errorHandler);
  
  return app;
};

describe('Security Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Input Validation', () => {
    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: 'John Doe',
          email: 'invalid-email',
          phone: '+1234567890',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation error');
    });

    it('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: 'John Doe',
          // Missing email, phone, bettingExperience
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject fullName that is too short', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: 'J',
          email: 'john@example.com',
          phone: '+1234567890',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject fullName that is too long', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: 'A'.repeat(101),
          email: 'john@example.com',
          phone: '+1234567890',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid bettingExperience value', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          bettingExperience: 'invalid-level',
          smsConsent: false,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should trim and sanitize input strings', async () => {
      // Clean up any existing test data
      await pool.query('DELETE FROM applications WHERE email = $1', ['trim@example.com']);

      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: '  John Doe  ',
          email: '  TRIM@EXAMPLE.COM  ',
          phone: '  +1234567890  ',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });

      expect(response.status).toBe(201);
      
      // Verify data was trimmed and normalized
      const result = await pool.query(
        'SELECT full_name, email FROM applications WHERE id = $1',
        [response.body.applicationId]
      );
      
      expect(result.rows[0].full_name).toBe('John Doe');
      expect(result.rows[0].email).toBe('trim@example.com');

      // Clean up
      await pool.query('DELETE FROM applications WHERE id = $1', [response.body.applicationId]);
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in email field', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: 'John Doe',
          email: "test@example.com'; DROP TABLE applications; --",
          phone: '+1234567890',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });

      // Should fail validation due to invalid email format
      expect(response.status).toBe(400);
      
      // Verify table still exists
      const tableCheck = await pool.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications')"
      );
      expect(tableCheck.rows[0].exists).toBe(true);
    });

    it('should prevent SQL injection in fullName field', async () => {
      // Clean up any existing test data
      await pool.query('DELETE FROM applications WHERE email = $1', ['sqltest@example.com']);

      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: "John'; DROP TABLE applications; --",
          email: 'sqltest@example.com',
          phone: '+1234567890',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });

      // Should succeed because parameterized queries prevent injection
      expect(response.status).toBe(201);
      
      // Verify table still exists
      const tableCheck = await pool.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications')"
      );
      expect(tableCheck.rows[0].exists).toBe(true);

      // Verify the malicious string was stored as data, not executed
      const result = await pool.query(
        'SELECT full_name FROM applications WHERE id = $1',
        [response.body.applicationId]
      );
      expect(result.rows[0].full_name).toBe("John'; DROP TABLE applications; --");

      // Clean up
      await pool.query('DELETE FROM applications WHERE id = $1', [response.body.applicationId]);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limit on application endpoint', async () => {
      const testEmail = `ratelimit${Date.now()}@example.com`;
      
      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post('/api/applications')
          .send({
            fullName: 'Rate Test',
            email: `${i}${testEmail}`,
            phone: '+1234567890',
            bettingExperience: 'intermediate',
            smsConsent: false,
          });
        
        expect(response.status).toBe(201);
      }

      // 6th request should be rate limited
      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: 'Rate Test',
          email: `6${testEmail}`,
          phone: '+1234567890',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });

      expect(response.status).toBe(429);
      expect(response.text).toContain('Too many applications');

      // Clean up
      for (let i = 0; i < 5; i++) {
        await pool.query('DELETE FROM applications WHERE email = $1', [`${i}${testEmail}`]);
      }
    }, 30000); // Increase timeout for this test
  });

  describe('CORS Configuration', () => {
    it('should include CORS headers in response', async () => {
      const response = await request(app)
        .options('/api/applications')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'POST');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from helmet', async () => {
      const response = await request(app)
        .get('/api/applications');

      // Helmet adds various security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });
  });

  describe('Data Sanitization', () => {
    it('should handle XSS attempts in input fields', async () => {
      // Clean up any existing test data
      await pool.query('DELETE FROM applications WHERE email = $1', ['xss@example.com']);

      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: '<script>alert("XSS")</script>',
          email: 'xss@example.com',
          phone: '+1234567890',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });

      expect(response.status).toBe(201);
      
      // Verify the script tag was stored as plain text, not executed
      const result = await pool.query(
        'SELECT full_name FROM applications WHERE id = $1',
        [response.body.applicationId]
      );
      expect(result.rows[0].full_name).toBe('<script>alert("XSS")</script>');

      // Clean up
      await pool.query('DELETE FROM applications WHERE id = $1', [response.body.applicationId]);
    });
  });

  describe('Error Handling', () => {
    it('should not expose sensitive error details', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          fullName: 'John Doe',
          email: 'invalid',
          phone: '+1234567890',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });

      expect(response.status).toBe(400);
      expect(response.body).not.toHaveProperty('stack');
      expect(response.body).not.toHaveProperty('query');
    });
  });
});
