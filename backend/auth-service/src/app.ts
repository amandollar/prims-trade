import express from 'express';
import { requestIdMiddleware, errorHandler } from 'shared';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json({ limit: '100kb' }));
app.use(requestIdMiddleware);

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'auth' }));
app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

export default app;
