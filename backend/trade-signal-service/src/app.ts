import express from 'express';
import { requestIdMiddleware, errorHandler } from 'shared';
import tradeSignalRoutes from './routes/tradeSignalRoutes';
import discussionRoutes from './routes/discussionRoutes';

const app = express();

app.use(express.json({ limit: '100kb' }));
app.use(requestIdMiddleware);
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'trade-signal' }));
app.use('/api/v1/trade-signals', tradeSignalRoutes);
app.use('/api/v1/discussions', discussionRoutes);

app.use(errorHandler);

export default app;
