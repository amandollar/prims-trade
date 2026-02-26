import { Response } from 'express';
import { ApiResponse } from '../types';

export function successResponse<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(body);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: unknown
): Response {
  const body: ApiResponse<never> = {
    success: false,
    message,
    error: error ?? undefined,
  };
  return res.status(statusCode).json(body);
}
