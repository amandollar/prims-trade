import mongoose from 'mongoose';
import { logger } from 'shared';
import { config } from './config';
import app from './app';

async function bootstrap(): Promise<void> {
  if (config.nodeEnv === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'default-secret-change-me')) {
    logger.error('JWT_SECRET must be set to a secure value in production');
    process.exit(1);
  }

  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('Auth service connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err });
    process.exit(1);
  }

  app.listen(config.port, () => {
    logger.info(`Auth service listening on port ${config.port}`);
  });
}

bootstrap();
