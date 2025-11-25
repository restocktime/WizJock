import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { connectRedis } from './cache/redis';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import clientRoutes from './routes/client';
import applicationsRoutes from './routes/applications';
import monitoringRoutes from './routes/monitoring';
import { initializeEmailService } from './services/EmailService';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

import { performanceMonitor } from './middleware/performance';
import { apiLimiter } from './middleware/rateLimiter';
import { enforceHttps, setSecurityHeaders } from './middleware/httpsRedirect';

// HTTPS enforcement (production only)
app.use(enforceHttps);
app.use(setSecurityHeaders);

// Performance monitoring middleware
app.use(performanceMonitor);

// Rate limiting middleware
app.use('/api', apiLimiter);

// Request logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.get('/', (req, res) => {
  res.json({
    message: 'Unified Sportsbook Platform API',
    version: '1.0.0',
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Client routes (public)
app.use('/api', clientRoutes);

// Applications routes (public)
app.use('/api/applications', applicationsRoutes);

// Monitoring routes (admin only, except /health)
app.use('/api/monitoring', monitoringRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handling middleware - must be last
app.use(errorHandler);

// Initialize connections and start server
const startServer = async () => {
  try {
    // Connect to Redis
    await connectRedis();
    console.log('Redis connection established');

    // Initialize Email Service
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'hello@wizjock.com';
    const adminEmail = process.env.ADMIN_EMAIL || 'team@wizjock.com';

    if (resendApiKey) {
      initializeEmailService({
        apiKey: resendApiKey,
        fromEmail,
        adminEmail,
      });
      logger.info('Email service initialized', { fromEmail, adminEmail });
    } else {
      logger.warn('Email service not initialized - RESEND_API_KEY not configured');
    }

    // Start server if not in Vercel/Serverless environment
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Backend API running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
