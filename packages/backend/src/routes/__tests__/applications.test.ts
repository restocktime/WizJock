import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import pool from '../../db/connection';
import applicationsRouter from '../applications';
import { errorHandler } from '../../middleware/errorHandler';

// Mock email service to prevent actual emails from being sent
vi.mock('../../services/EmailService', () => ({
  getEmailService: () => ({
    sendApplicationConfirmation: vi.fn().mockResolvedValue(undefined),
    sendAdminNotification: vi.fn().mockResolvedValue(undefined),
  }),
}));

// Create test app
const createTestApp = (): Express => {
  const app = express();
  app.use(express.json());
  app.use('/api/applications', applicationsRouter);
  app.use(errorHandler);
  return app;
};

describe('Applications API', () => {
  let app: Express;

  beforeAll(async () => {
    app = createTestApp();
    
    try {
      // Test database connection
      await pool.query('SELECT 1');
      
      // Ensure applications table exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS applications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          full_name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20) NOT NULL,
          betting_experience VARCHAR(20) NOT NULL CHECK (
            betting_experience IN ('beginner', 'intermediate', 'advanced', 'professional')
          ),
          sms_consent BOOLEAN NOT NULL DEFAULT false,
          status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
            status IN ('pending', 'approved', 'rejected', 'contacted')
          ),
          notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    // Clean up applications table before each test
    await pool.query('DELETE FROM applications');
  });

  afterAll(async () => {
    // Clean up and close connection
    await pool.query('DELETE FROM applications');
    await pool.end();
  });

  describe('POST /api/applications', () => {
    const validApplicationData = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      bettingExperience: 'intermediate' as const,
      smsConsent: true,
    };

    describe('Success Cases', () => {
      it('should create application with valid data', async () => {
        const response = await request(app)
          .post('/api/applications')
          .send(validApplicationData)
          .expect(201);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Application received successfully',
        });
        expect(response.body.applicationId).toBeDefined();
        expect(typeof response.body.applicationId).toBe('string');
      });

      it('should store application in database', async () => {
        const response = await request(app)
          .post('/api/applications')
          .send(validApplicationData)
          .expect(201);

        const applicationId = response.body.applicationId;

        // Verify application was stored
        const result = await pool.query(
          'SELECT * FROM applications WHERE id = $1',
          [applicationId]
        );

        expect(result.rows.length).toBe(1);
        expect(result.rows[0]).toMatchObject({
          full_name: validApplicationData.fullName,
          email: validApplicationData.email,
          phone: validApplicationData.phone,
          betting_experience: validApplicationData.bettingExperience,
          sms_consent: validApplicationData.smsConsent,
          status: 'pending',
        });
      });

      it('should accept application without SMS consent', async () => {
        const dataWithoutConsent = {
          ...validApplicationData,
          smsConsent: false,
        };

        const response = await request(app)
          .post('/api/applications')
          .send(dataWithoutConsent)
          .expect(201);

        expect(response.body.success).toBe(true);

        // Verify SMS consent is false
        const result = await pool.query(
          'SELECT sms_consent FROM applications WHERE id = $1',
          [response.body.applicationId]
        );

        expect(result.rows[0].sms_consent).toBe(false);
      });

      it('should accept all betting experience levels', async () => {
        const experienceLevels = ['beginner', 'intermediate', 'advanced', 'professional'] as const;

        for (const level of experienceLevels) {
          const data = {
            ...validApplicationData,
            email: `test-${level}@example.com`,
            bettingExperience: level,
          };

          const response = await request(app)
            .post('/api/applications')
            .send(data)
            .expect(201);

          expect(response.body.success).toBe(true);

          // Verify experience level was stored correctly
          const result = await pool.query(
            'SELECT betting_experience FROM applications WHERE id = $1',
            [response.body.applicationId]
          );

          expect(result.rows[0].betting_experience).toBe(level);
        }
      });

      it('should trim and lowercase email', async () => {
        const dataWithUntrimmedEmail = {
          ...validApplicationData,
          email: '  JOHN.DOE@EXAMPLE.COM  ',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(dataWithUntrimmedEmail)
          .expect(201);

        // Verify email was trimmed and lowercased
        const result = await pool.query(
          'SELECT email FROM applications WHERE id = $1',
          [response.body.applicationId]
        );

        expect(result.rows[0].email).toBe('john.doe@example.com');
      });
    });

    describe('Validation Errors', () => {
      it('should return 400 for missing full name', async () => {
        const invalidData = {
          ...validApplicationData,
          fullName: '',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Validation error',
        });
        expect(response.body.details).toContain('Full name must be at least 2 characters');
      });

      it('should return 400 for full name too short', async () => {
        const invalidData = {
          ...validApplicationData,
          fullName: 'A',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.details).toContain('Full name must be at least 2 characters');
      });

      it('should return 400 for full name too long', async () => {
        const invalidData = {
          ...validApplicationData,
          fullName: 'A'.repeat(101),
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.details).toContain('Full name must be less than 100 characters');
      });

      it('should return 400 for invalid email format', async () => {
        const invalidData = {
          ...validApplicationData,
          email: 'invalid-email',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.details).toContain('Please enter a valid email address');
      });

      it('should return 400 for missing email', async () => {
        const invalidData = {
          ...validApplicationData,
          email: '',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.details).toContain('Please enter a valid email address');
      });

      it('should return 400 for invalid phone format', async () => {
        const invalidData = {
          ...validApplicationData,
          phone: 'abc123xyz',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.details).toContain('Please enter a valid phone number');
      });

      it('should return 400 for missing phone', async () => {
        const invalidData = {
          ...validApplicationData,
          phone: '',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.details).toContain('Phone number is required');
      });

      it('should return 400 for invalid betting experience', async () => {
        const invalidData = {
          ...validApplicationData,
          bettingExperience: 'expert', // Invalid value
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.details).toContain('Please select a valid betting experience level');
      });

      it('should return 400 for missing betting experience', async () => {
        const invalidData = {
          ...validApplicationData,
          bettingExperience: undefined,
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.success).toBe(false);
      });

      it('should return 400 for multiple validation errors', async () => {
        const invalidData = {
          fullName: 'A',
          email: 'invalid',
          phone: 'abc',
          bettingExperience: 'invalid',
          smsConsent: false,
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.details).toBeDefined();
        expect(response.body.details.length).toBeGreaterThan(1);
      });
    });

    describe('Duplicate Email Handling', () => {
      it('should return 409 for duplicate email', async () => {
        // Create first application
        await request(app)
          .post('/api/applications')
          .send(validApplicationData)
          .expect(201);

        // Try to create second application with same email
        const response = await request(app)
          .post('/api/applications')
          .send(validApplicationData)
          .expect(409);

        expect(response.body).toMatchObject({
          success: false,
          error: 'An application with this email already exists. Please contact us if you need assistance.',
        });
      });

      it('should return 409 for duplicate email regardless of case', async () => {
        // Create first application
        await request(app)
          .post('/api/applications')
          .send(validApplicationData)
          .expect(201);

        // Try to create second application with same email in different case
        const duplicateData = {
          ...validApplicationData,
          email: validApplicationData.email.toUpperCase(),
        };

        const response = await request(app)
          .post('/api/applications')
          .send(duplicateData)
          .expect(409);

        expect(response.body.success).toBe(false);
      });
    });

    describe('Rate Limiting', () => {
      it('should allow up to 5 requests per hour', async () => {
        // Make 5 requests
        for (let i = 0; i < 5; i++) {
          const data = {
            ...validApplicationData,
            email: `test${i}@example.com`,
          };

          await request(app)
            .post('/api/applications')
            .send(data)
            .expect(201);
        }
      });

      it('should return 429 after 5 requests per hour', async () => {
        // Make 5 successful requests
        for (let i = 0; i < 5; i++) {
          const data = {
            ...validApplicationData,
            email: `test${i}@example.com`,
          };

          await request(app)
            .post('/api/applications')
            .send(data)
            .expect(201);
        }

        // 6th request should be rate limited
        const data = {
          ...validApplicationData,
          email: 'test6@example.com',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(data)
          .expect(429);

        expect(response.text).toContain('Too many applications');
      });
    });

    describe('Data Integrity', () => {
      it('should set default status to pending', async () => {
        const response = await request(app)
          .post('/api/applications')
          .send(validApplicationData)
          .expect(201);

        const result = await pool.query(
          'SELECT status FROM applications WHERE id = $1',
          [response.body.applicationId]
        );

        expect(result.rows[0].status).toBe('pending');
      });

      it('should set created_at timestamp', async () => {
        const response = await request(app)
          .post('/api/applications')
          .send(validApplicationData)
          .expect(201);

        const result = await pool.query(
          'SELECT created_at FROM applications WHERE id = $1',
          [response.body.applicationId]
        );

        expect(result.rows[0].created_at).toBeInstanceOf(Date);
      });

      it('should generate UUID for application ID', async () => {
        const response = await request(app)
          .post('/api/applications')
          .send(validApplicationData)
          .expect(201);

        const applicationId = response.body.applicationId;
        
        // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(applicationId).toMatch(uuidRegex);
      });
    });
  });

  describe('Security Tests', () => {
    describe('SQL Injection Prevention', () => {
      it('should prevent SQL injection in email field', async () => {
        const maliciousData = {
          ...validApplicationData,
          email: "test@example.com'; DROP TABLE applications; --",
        };

        // Should fail validation due to invalid email format
        const response = await request(app)
          .post('/api/applications')
          .send(maliciousData)
          .expect(400);

        expect(response.body.success).toBe(false);

        // Verify table still exists
        const tableCheck = await pool.query(
          "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications')"
        );
        expect(tableCheck.rows[0].exists).toBe(true);
      });

      it('should prevent SQL injection in fullName field', async () => {
        const maliciousData = {
          ...validApplicationData,
          fullName: "John'; DROP TABLE applications; --",
          email: 'sqltest@example.com',
        };

        // Should succeed because parameterized queries prevent injection
        const response = await request(app)
          .post('/api/applications')
          .send(maliciousData)
          .expect(201);

        expect(response.body.success).toBe(true);

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
      });
    });

    describe('XSS Prevention', () => {
      it('should handle XSS attempts in input fields', async () => {
        const xssData = {
          ...validApplicationData,
          fullName: '<script>alert("XSS")</script>',
          email: 'xss@example.com',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(xssData)
          .expect(201);

        expect(response.body.success).toBe(true);

        // Verify the script tag was stored as plain text, not executed
        const result = await pool.query(
          'SELECT full_name FROM applications WHERE id = $1',
          [response.body.applicationId]
        );
        expect(result.rows[0].full_name).toBe('<script>alert("XSS")</script>');
      });

      it('should handle HTML entities in input', async () => {
        const htmlData = {
          ...validApplicationData,
          fullName: 'John &lt;Doe&gt;',
          email: 'html@example.com',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(htmlData)
          .expect(201);

        expect(response.body.success).toBe(true);

        const result = await pool.query(
          'SELECT full_name FROM applications WHERE id = $1',
          [response.body.applicationId]
        );
        expect(result.rows[0].full_name).toBe('John &lt;Doe&gt;');
      });
    });

    describe('Input Sanitization', () => {
      it('should trim whitespace from all string inputs', async () => {
        const untrimmedData = {
          fullName: '  John Doe  ',
          email: '  TRIM@EXAMPLE.COM  ',
          phone: '  +1234567890  ',
          bettingExperience: 'intermediate' as const,
          smsConsent: false,
        };

        const response = await request(app)
          .post('/api/applications')
          .send(untrimmedData)
          .expect(201);

        const result = await pool.query(
          'SELECT full_name, email, phone FROM applications WHERE id = $1',
          [response.body.applicationId]
        );

        expect(result.rows[0].full_name).toBe('John Doe');
        expect(result.rows[0].email).toBe('trim@example.com');
        expect(result.rows[0].phone).toBe('+1234567890');
      });

      it('should normalize email to lowercase', async () => {
        const uppercaseEmailData = {
          ...validApplicationData,
          email: 'UPPERCASE@EXAMPLE.COM',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(uppercaseEmailData)
          .expect(201);

        const result = await pool.query(
          'SELECT email FROM applications WHERE id = $1',
          [response.body.applicationId]
        );

        expect(result.rows[0].email).toBe('uppercase@example.com');
      });
    });

    describe('Error Response Security', () => {
      it('should not expose sensitive error details', async () => {
        const invalidData = {
          ...validApplicationData,
          email: 'invalid',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        // Should not contain stack traces or internal details
        expect(response.body).not.toHaveProperty('stack');
        expect(response.body).not.toHaveProperty('query');
        expect(response.body).not.toHaveProperty('sql');
      });

      it('should provide user-friendly error messages', async () => {
        const invalidData = {
          ...validApplicationData,
          email: 'invalid',
        };

        const response = await request(app)
          .post('/api/applications')
          .send(invalidData)
          .expect(400);

        expect(response.body.error).toBe('Validation error');
        expect(response.body.details).toBeDefined();
        expect(Array.isArray(response.body.details)).toBe(true);
      });
    });

    describe('Request Size Limits', () => {
      it('should accept reasonable request sizes', async () => {
        const normalData = {
          ...validApplicationData,
          fullName: 'A'.repeat(100), // Max allowed length
        };

        const response = await request(app)
          .post('/api/applications')
          .send(normalData)
          .expect(201);

        expect(response.body.success).toBe(true);
      });

      it('should reject excessively long strings', async () => {
        const oversizedData = {
          ...validApplicationData,
          fullName: 'A'.repeat(101), // Over max length
        };

        const response = await request(app)
          .post('/api/applications')
          .send(oversizedData)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });
  });
});
