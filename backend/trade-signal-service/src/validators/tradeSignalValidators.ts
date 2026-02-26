import { z } from 'zod';

const assetSchema = z.string().min(1, 'Asset is required').max(20).trim().toUpperCase();
const timeframeSchema = z.string().min(1, 'Timeframe is required').max(50).trim();
const rationaleSchema = z.string().min(1, 'Rationale is required').max(5000).trim();

const imageUrlSchema = z
  .union([z.string().url('Invalid image URL').max(2048), z.literal('')])
  .optional()
  .transform((v) => (v === '' ? undefined : v));

export const createTradeSignalSchema = z.object({
  asset: assetSchema,
  entryPrice: z.number().finite().positive('Entry price must be positive'),
  stopLoss: z.number().finite(),
  takeProfit: z.number().finite(),
  timeframe: timeframeSchema,
  rationale: rationaleSchema,
  imageUrl: imageUrlSchema,
});

export const updateTradeSignalSchema = z.object({
  asset: z.string().min(1).max(20).trim().toUpperCase().optional(),
  entryPrice: z.number().finite().positive().optional(),
  stopLoss: z.number().finite().optional(),
  takeProfit: z.number().finite().optional(),
  timeframe: z.string().min(1).max(50).trim().optional(),
  rationale: z.string().min(1).max(5000).trim().optional(),
  imageUrl: imageUrlSchema,
});

export const updateTradeSignalStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

export const tradeSignalIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid trade signal ID'),
});

export type CreateTradeSignalInput = z.infer<typeof createTradeSignalSchema>;
export type UpdateTradeSignalInput = z.infer<typeof updateTradeSignalSchema>;
export type UpdateTradeSignalStatusInput = z.infer<typeof updateTradeSignalStatusSchema>;
