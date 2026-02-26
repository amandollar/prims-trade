import { Request, Response, NextFunction } from 'express';
import { ApiError, successResponse, AuthenticatedRequest } from 'shared';
import * as tradeSignalService from '../services/tradeSignalService';

export async function createSignal(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signal = await tradeSignalService.createSignal(
      (req as AuthenticatedRequest).user!.userId,
      req.body
    );
    successResponse(res, signal, 'Trade signal created', 201);
  } catch (err) {
    next(err);
  }
}

export async function getMySignals(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signals = await tradeSignalService.getMySignals((req as AuthenticatedRequest).user!.userId);
    successResponse(res, signals, 'Success');
  } catch (err) {
    next(err);
  }
}

export async function getApprovedSignalsPublic(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signals = await tradeSignalService.getApprovedSignalsPublic();
    successResponse(res, signals, 'Success');
  } catch (err) {
    next(err);
  }
}

export async function getAllSignalsAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signals = await tradeSignalService.getAllSignalsAdmin();
    successResponse(res, signals, 'Success');
  } catch (err) {
    next(err);
  }
}

export async function getSignalById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signal = await tradeSignalService.getSignalById(
      req.params.id,
      (req as AuthenticatedRequest).user!
    );
    successResponse(res, signal, 'Success');
  } catch (err) {
    next(err);
  }
}

export async function updateSignal(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signal = await tradeSignalService.updateSignal(
      req.params.id,
      (req as AuthenticatedRequest).user!,
      req.body
    );
    successResponse(res, signal, 'Trade signal updated');
  } catch (err) {
    next(err);
  }
}

export async function updateSignalStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signal = await tradeSignalService.updateSignalStatus(
      req.params.id,
      (req as AuthenticatedRequest).user!,
      req.body
    );
    successResponse(res, signal, 'Trade signal status updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteSignal(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await tradeSignalService.deleteSignal(req.params.id, (req as AuthenticatedRequest).user!);
    successResponse(res, { deleted: true }, 'Trade signal deleted');
  } catch (err) {
    next(err);
  }
}
