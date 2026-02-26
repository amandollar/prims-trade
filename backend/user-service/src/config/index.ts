export const config = {
  port: parseInt(process.env.USER_SERVICE_PORT ?? '3002', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodb: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/prims-trade',
  },
} as const;
