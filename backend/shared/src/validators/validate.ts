import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../errors/ApiError';
import { errorResponse } from '../utils/response';

function formatZodErrors(err: ZodError): unknown {
  return err.errors.map((e) => ({
    path: e.path.join('.'),
    message: e.message,
  }));
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.body ?? {}) as T;
      req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        errorResponse(res, 'Validation failed', 400, formatZodErrors(err));
        return;
      }
      next(ApiError.badRequest('Invalid request body'));
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.query) as T;
      req.query = parsed as typeof req.query;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        errorResponse(res, 'Validation failed', 400, formatZodErrors(err));
        return;
      }
      next(ApiError.badRequest('Invalid query parameters'));
    }
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.params) as T;
      req.params = parsed as typeof req.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        errorResponse(res, 'Validation failed', 400, formatZodErrors(err));
        return;
      }
      next(ApiError.badRequest('Invalid path parameters'));
    }
  };
}
