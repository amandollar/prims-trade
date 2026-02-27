import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { requestIdMiddleware, errorHandler } from 'shared';
import { config } from './config';
import { authProxy, userProxy, tradeSignalProxy, discussionProxy } from './middlewares/proxy';
import uploadRoutes from './routes/uploadRoutes';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(requestIdMiddleware);

const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit.authMax,
  message: { success: false, message: 'Too many auth attempts' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (_req, res) => res.status(200).json({ ok: true, service: 'gateway' }));
app.get('/ping', (_req, res) => res.status(200).json({ ok: true }));
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    data: {
      status: 'healthy',
      gateway: 'up',
      timestamp: new Date().toISOString(),
    },
  });
});

// Proxies mounted at root so they receive full path (no Express path stripping). Context option filters which path to proxy.
app.use((req, res, next) => {
  if (req.path.startsWith('/api/v1/auth')) return authLimiter(req, res, next);
  next();
});
app.use(authProxy);
app.use(userProxy);
app.use('/api/v1/upload', uploadRoutes);
app.use(tradeSignalProxy);
app.use(discussionProxy);

setupSwagger(app, '/api-docs');

app.use(errorHandler);

export default app;
