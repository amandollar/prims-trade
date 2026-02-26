import { logger } from 'shared';
import { config } from './config';
import app from './app';

app.listen(config.port, () => {
  logger.info(`API Gateway listening on port ${config.port}`);
});
