import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

const HEADER_REQUEST_ID = 'x-request-id';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers[HEADER_REQUEST_ID] as string) ?? uuidv4();
  (req as Request & { requestId: string }).requestId = id;
  res.setHeader(HEADER_REQUEST_ID, id);
  logger.defaultMeta = { ...logger.defaultMeta, requestId: id };
  next();
}
