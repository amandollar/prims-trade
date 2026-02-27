import express from 'express';
import { requestIdMiddleware, errorHandler } from 'shared';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json({ limit: '100kb' }));
app.use(requestIdMiddleware);
app.get('/', (_req, res) => res.status(200).json({ ok: true, service: 'user' }));
app.get('/ping', (_req, res) => res.status(200).json({ ok: true }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'user' }));
app.use('/api/v1/users', userRoutes);

app.use(errorHandler);

export default app;
