import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set default test environment variables if not provided
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL;
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-key';
