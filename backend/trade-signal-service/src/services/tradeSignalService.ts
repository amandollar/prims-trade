import mongoose from 'mongoose';
import { ApiError } from 'shared';
import { TradeSignal } from '../models/TradeSignal';
import { getCache, CACHE_KEYS } from './cacheService';
import { config } from '../config';
import type {
  CreateTradeSignalInput,
  UpdateTradeSignalInput,
  UpdateTradeSignalStatusInput,
} from '../validators/tradeSignalValidators';
import type { JwtPayload } from 'shared';

const cache = getCache();
const CACHE_TTL = config.redis.ttlSeconds;

export interface TradeSignalResponse {
  id: string;
  asset: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  rationale: string;
  imageUrl?: string;
  status: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

function toResponse(doc: mongoose.Document & { toObject(): Record<string, unknown> }): TradeSignalResponse {
  const o = doc.toObject();
  return {
    id: (o._id as mongoose.Types.ObjectId).toString(),
    asset: o.asset as string,
    entryPrice: o.entryPrice as number,
    stopLoss: o.stopLoss as number,
    takeProfit: o.takeProfit as number,
    timeframe: o.timeframe as string,
    rationale: o.rationale as string,
    imageUrl: o.imageUrl as string | undefined,
    status: o.status as string,
    createdBy: (o.createdBy as mongoose.Types.ObjectId).toString(),
    createdAt: o.createdAt as Date,
    updatedAt: o.updatedAt as Date,
  };
}

function toResponseFromLean(t: Record<string, unknown>): TradeSignalResponse {
  return {
    id: (t._id as mongoose.Types.ObjectId).toString(),
    asset: t.asset as string,
    entryPrice: t.entryPrice as number,
    stopLoss: t.stopLoss as number,
    takeProfit: t.takeProfit as number,
    timeframe: t.timeframe as string,
    rationale: t.rationale as string,
    imageUrl: t.imageUrl as string | undefined,
    status: t.status as string,
    createdBy: (t.createdBy as mongoose.Types.ObjectId).toString(),
    createdAt: t.createdAt as Date,
    updatedAt: t.updatedAt as Date,
  };
}

export async function createSignal(userId: string, input: CreateTradeSignalInput): Promise<TradeSignalResponse> {
  const signal = await TradeSignal.create({
    ...input,
    status: 'pending',
    createdBy: new mongoose.Types.ObjectId(userId),
  });
  return toResponse(signal);
}

export async function getSignalById(signalId: string, user: JwtPayload): Promise<TradeSignalResponse> {
  const cached = await cache.get<TradeSignalResponse>(CACHE_KEYS.signal(signalId));
  if (cached) return cached;

  const signal = await TradeSignal.findById(signalId);
  if (!signal) throw ApiError.notFound('Trade signal not found');
  if (user.role !== 'admin' && signal.createdBy.toString() !== user.userId) {
    throw ApiError.forbidden('Access denied');
  }
  const result = toResponse(signal);
  await cache.set(CACHE_KEYS.signal(signalId), result, CACHE_TTL);
  return result;
}

export async function getMySignals(userId: string): Promise<TradeSignalResponse[]> {
  const cacheKey = CACHE_KEYS.signalList(userId);
  const cached = await cache.get<TradeSignalResponse[]>(cacheKey);
  if (cached) return cached;

  const signals = await TradeSignal.find({ createdBy: userId }).sort({ createdAt: -1 }).lean();
  const result = signals.map(toResponseFromLean);
  await cache.set(cacheKey, result, CACHE_TTL);
  return result;
}

export async function getAllSignalsAdmin(): Promise<TradeSignalResponse[]> {
  const cached = await cache.get<TradeSignalResponse[]>(CACHE_KEYS.signalListAdmin());
  if (cached) return cached;

  const signals = await TradeSignal.find().sort({ createdAt: -1 }).lean();
  const result = signals.map(toResponseFromLean);
  await cache.set(CACHE_KEYS.signalListAdmin(), result, CACHE_TTL);
  return result;
}

export async function getApprovedSignalsPublic(): Promise<TradeSignalResponse[]> {
  const cached = await cache.get<TradeSignalResponse[]>(CACHE_KEYS.signalListPublic());
  if (cached) return cached;

  const signals = await TradeSignal.find({ status: 'approved' }).sort({ createdAt: -1 }).lean();
  const result = signals.map(toResponseFromLean);
  await cache.set(CACHE_KEYS.signalListPublic(), result, CACHE_TTL);
  return result;
}

export async function updateSignal(
  signalId: string,
  user: JwtPayload,
  input: UpdateTradeSignalInput
): Promise<TradeSignalResponse> {
  const signal = await TradeSignal.findById(signalId);
  if (!signal) throw ApiError.notFound('Trade signal not found');
  if (signal.createdBy.toString() !== user.userId) {
    throw ApiError.forbidden('Access denied');
  }
  if (input.asset !== undefined) signal.asset = input.asset;
  if (input.entryPrice !== undefined) signal.entryPrice = input.entryPrice;
  if (input.stopLoss !== undefined) signal.stopLoss = input.stopLoss;
  if (input.takeProfit !== undefined) signal.takeProfit = input.takeProfit;
  if (input.timeframe !== undefined) signal.timeframe = input.timeframe;
  if (input.rationale !== undefined) signal.rationale = input.rationale;
  if (input.imageUrl !== undefined) signal.imageUrl = input.imageUrl || undefined;
  await signal.save();

  await cache.del(CACHE_KEYS.signal(signalId));
  await cache.del(CACHE_KEYS.signalList(user.userId));
  await cache.del(CACHE_KEYS.signalListPublic());

  return toResponse(signal);
}

export async function updateSignalStatus(
  signalId: string,
  user: JwtPayload,
  input: UpdateTradeSignalStatusInput
): Promise<TradeSignalResponse> {
  if (user.role !== 'admin') throw ApiError.forbidden('Only admin can approve or reject signals');

  const signal = await TradeSignal.findById(signalId);
  if (!signal) throw ApiError.notFound('Trade signal not found');

  signal.status = input.status;
  await signal.save();

  await cache.del(CACHE_KEYS.signal(signalId));
  await cache.del(CACHE_KEYS.signalList(signal.createdBy.toString()));
  await cache.del(CACHE_KEYS.signalListAdmin());
  await cache.del(CACHE_KEYS.signalListPublic());

  return toResponse(signal);
}

export async function deleteSignal(signalId: string, user: JwtPayload): Promise<void> {
  const signal = await TradeSignal.findById(signalId);
  if (!signal) throw ApiError.notFound('Trade signal not found');
  if (user.role !== 'admin' && signal.createdBy.toString() !== user.userId) {
    throw ApiError.forbidden('Access denied');
  }
  await TradeSignal.findByIdAndDelete(signalId);
  await cache.del(CACHE_KEYS.signal(signalId));
  await cache.del(CACHE_KEYS.signalList(signal.createdBy.toString()));
  await cache.del(CACHE_KEYS.signalListAdmin());
  await cache.del(CACHE_KEYS.signalListPublic());
}
