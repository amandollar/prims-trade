import { Request, Response, NextFunction } from 'express';
import { ApiError, successResponse, AuthenticatedRequest } from 'shared';
import * as userService from '../services/userService';

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await userService.getMe((req as AuthenticatedRequest).user!.userId);
    if (!profile) {
      next(ApiError.notFound('User not found'));
      return;
    }
    successResponse(res, profile, 'Success');
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await userService.updateMe((req as AuthenticatedRequest).user!.userId, req.body);
    successResponse(res, profile, 'Profile updated');
  } catch (err) {
    next(err);
  }
}
