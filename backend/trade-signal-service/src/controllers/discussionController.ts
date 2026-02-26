import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, successResponse } from 'shared';
import * as discussionService from '../services/discussionService';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const discussions = await discussionService.getAll();
    successResponse(res, discussions);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const discussion = await discussionService.getById(req.params.id);
    successResponse(res, discussion);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const discussion = await discussionService.create(req.body, (req as AuthenticatedRequest).user!.userId);
    successResponse(res, discussion, 'Discussion created', 201);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const discussion = await discussionService.update(
      req.params.id,
      req.body,
      authReq.user!.userId,
      authReq.user!.role === 'admin'
    );
    successResponse(res, discussion, 'Discussion updated');
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    await discussionService.remove(req.params.id, authReq.user!.userId, authReq.user!.role === 'admin');
    successResponse(res, { deleted: true }, 'Discussion deleted');
  } catch (err) {
    next(err);
  }
}

export async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    const discussion = await discussionService.addComment(
      req.params.id,
      req.body,
      (req as AuthenticatedRequest).user!.userId
    );
    successResponse(res, discussion, 'Comment added', 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const discussion = await discussionService.deleteComment(
      req.params.id,
      req.params.commentId,
      authReq.user!.userId,
      authReq.user!.role === 'admin'
    );
    successResponse(res, discussion, 'Comment deleted');
  } catch (err) {
    next(err);
  }
}
