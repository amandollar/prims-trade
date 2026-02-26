export type Role = 'user' | 'admin';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type TradeSignalStatus = 'pending' | 'approved' | 'rejected';

export interface TradeSignal {
  id: string;
  asset: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  rationale: string;
  imageUrl?: string;
  status: TradeSignalStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTradeSignalInput {
  asset: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  rationale: string;
  imageUrl?: string;
}

export interface Comment {
  _id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  createdBy: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscussionInput {
  title: string;
  content: string;
}

export interface CreateCommentInput {
  content: string;
}
