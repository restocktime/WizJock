import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const SLOW_REQUEST_THRESHOLD = 1000; // 1 second

export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const timeInMs = (diff[0] * 1e9 + diff[1]) / 1e6;

        if (timeInMs > SLOW_REQUEST_THRESHOLD) {
            logger.warn(`SLOW REQUEST: ${req.method} ${req.originalUrl} took ${timeInMs.toFixed(2)}ms`);
        }
    });

    next();
};
