export const config = {
  port: parseInt(process.env.GATEWAY_PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  authServiceUrl: process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001',
  userServiceUrl: process.env.USER_SERVICE_URL ?? 'http://localhost:3002',
  tradeSignalServiceUrl: process.env.TRADE_SIGNAL_SERVICE_URL ?? 'http://localhost:3003',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
    authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX ?? '5', 10),
  },
} as const;
