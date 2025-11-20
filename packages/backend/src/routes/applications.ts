import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import pool from '../db/connection';
import { AppError } from '../utils/AppError';
import { getEmailService } from '../services/EmailService';
import { logger } from '../utils/logger';
import monitoringService from '../services/MonitoringService';
import type { CreateApplicationRequest, CreateApplicationResponse } from '@sportsbook/shared-types';

const router = Router();

// Rate limiter: 5 requests per hour per IP
const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many applications from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation schema
const applicationSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
    .trim(),
  bettingExperience: z.enum(['beginner', 'intermediate', 'advanced', 'professional'], {
    errorMap: () => ({ message: 'Please select a valid betting experience level' }),
  }),
  smsConsent: z.boolean(),
});

// POST /api/applications - Create new application
router.post(
  '/',
  applicationLimiter,
  async (req: Request, res: Response<CreateApplicationResponse>, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = applicationSchema.parse(req.body) as CreateApplicationRequest;

      // Check if email already exists
      const existingApplication = await pool.query(
        'SELECT id FROM applications WHERE email = $1',
        [validatedData.email]
      );

      if (existingApplication.rows.length > 0) {
        throw new AppError(
          'An application with this email already exists. Please contact us if you need assistance.',
          409
        );
      }

      // Insert application into database
      const result = await pool.query(
        `INSERT INTO applications 
         (full_name, email, phone, betting_experience, sms_consent, status) 
         VALUES ($1, $2, $3, $4, $5, 'pending') 
         RETURNING id`,
        [
          validatedData.fullName,
          validatedData.email,
          validatedData.phone,
          validatedData.bettingExperience,
          validatedData.smsConsent,
        ]
      );

      const applicationId = result.rows[0].id;

      // Track application submission
      monitoringService.recordApplicationSubmitted(applicationId);

      // Prepare application data for emails
      const application = {
        id: applicationId,
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        bettingExperience: validatedData.bettingExperience,
        smsConsent: validatedData.smsConsent,
        createdAt: new Date(),
      };

      // Send emails asynchronously (don't block response)
      // Emails are sent with retry logic and comprehensive error logging
      setImmediate(async () => {
        try {
          const emailService = getEmailService();
          
          // Send confirmation email to applicant
          await emailService.sendApplicationConfirmation(application);
          
          // Send notification email to admin
          await emailService.sendAdminNotification(application);
          
          logger.info('Application emails sent successfully', {
            applicationId,
            // Note: email address not logged to protect PII
          });
        } catch (error) {
          // Email service handles retries and logging internally
          // This catch is just for safety - errors won't block the application submission
          logger.error('Error in email sending process', {
            applicationId,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      res.status(201).json({
        success: true,
        message: 'Application received successfully',
        applicationId,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: 'Validation error',
          details,
        });
      }
      next(error);
    }
  }
);

export default router;
