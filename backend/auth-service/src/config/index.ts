export const config = {
  port: parseInt(process.env.PORT || process.env.AUTH_SERVICE_PORT || '3001', 10) || 3001,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodb: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/prims-trade',
  },
} as const;
