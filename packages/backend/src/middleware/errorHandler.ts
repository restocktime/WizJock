import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const sendErrorDev = (err: AppError, res: Response) => {
  logger.error(`DEV ERROR: ${err.message}`, { stack: err.stack });
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.warn(`OPERATIONAL ERROR: ${err.message}`);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak details
    logger.error(`PROGRAMMING ERROR: ${err.message}`, { error: err });
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (!(error instanceof AppError)) {
      error.isOperational = error.isOperational || false;
    }

    sendErrorProd(error, res);
  }
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};
