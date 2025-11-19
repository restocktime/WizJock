import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import pool from '../db/connection';
import { comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Login endpoint
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const result = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

// Refresh token endpoint
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { refreshToken } = refreshSchema.parse(req.body);

    // Verify refresh token
    const payload = verifyToken(refreshToken);

    // Verify user still exists
    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [payload.userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 401);
    }

    const user = result.rows[0];

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
});

export default router;
