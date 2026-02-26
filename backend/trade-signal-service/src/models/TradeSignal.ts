import mongoose from 'mongoose';

export type TradeSignalStatus = 'pending' | 'approved' | 'rejected';

export interface ITradeSignal {
  _id: mongoose.Types.ObjectId;
  asset: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  rationale: string;
  imageUrl?: string;
  status: TradeSignalStatus;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tradeSignalSchema = new mongoose.Schema<ITradeSignal>(
  {
    asset: { type: String, required: true, trim: true, uppercase: true },
    entryPrice: { type: Number, required: true },
    stopLoss: { type: Number, required: true },
    takeProfit: { type: Number, required: true },
    timeframe: { type: String, required: true, trim: true },
    rationale: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true, default: undefined },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

tradeSignalSchema.index({ createdBy: 1 });
tradeSignalSchema.index({ status: 1 });
tradeSignalSchema.index({ status: 1, createdAt: -1 });
tradeSignalSchema.index({ asset: 1, status: 1 });

export const TradeSignal = mongoose.model<ITradeSignal>('TradeSignal', tradeSignalSchema);
