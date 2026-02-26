export const config = {
  port: parseInt(process.env.PORT || process.env.TRADE_SIGNAL_SERVICE_PORT || '3003', 10) || 3003,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodb: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/prims-trade',
  },
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS ?? '300', 10),
  },
} as const;
