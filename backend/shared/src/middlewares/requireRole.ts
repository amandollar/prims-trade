import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { Role } from '../types';
import { AuthenticatedRequest } from './requireAuth';

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      next(ApiError.unauthorized('Authentication required'));
      return;
    }
    if (!allowedRoles.includes(authReq.user.role)) {
      next(ApiError.forbidden('Insufficient permissions'));
      return;
    }
    next();
  };
}
