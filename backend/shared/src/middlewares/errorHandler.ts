import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { logger } from '../config/logger';
import { errorResponse } from '../utils/response';

function normalizeError(err: Error): { message: string; statusCode: number } {
  if (err instanceof ApiError) {
    return { message: err.message, statusCode: err.statusCode };
  }

  const mongoErr = err as Error & { code?: number; keyValue?: Record<string, unknown> };
  if (mongoErr.code === 11000) {
    return { message: 'Resource already exists (duplicate key)', statusCode: 409 };
  }

  if (err.name === 'ValidationError') {
    return { message: err.message || 'Validation failed', statusCode: 400 };
  }

  if (err.name === 'CastError') {
    return { message: 'Invalid ID or data format', statusCode: 400 };
  }

  return {
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    statusCode: 500,
  };
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response | void {
  if (res.headersSent) return;

  const requestId = (req as Request & { requestId?: string }).requestId;
  const { message, statusCode } = normalizeError(err);

  if (statusCode >= 500) {
    logger.error({ message: err.message, stack: err.stack, requestId });
  } else {
    logger.warn({ message: err.message, statusCode, requestId });
  }

  return errorResponse(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'production' && statusCode === 500 ? undefined : err.stack
  );
}
