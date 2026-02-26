import mongoose from 'mongoose';
import { logger } from 'shared';
import { config } from './config';
import app from './app';

async function bootstrap(): Promise<void> {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('Trade signal service connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err });
    process.exit(1);
  }

  app.listen(config.port, () => {
    logger.info(`Trade signal service listening on port ${config.port}`);
  });
}

bootstrap();
