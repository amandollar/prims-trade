import { config } from '../config';
import { MemoryCacheService, ICacheService } from 'shared';

let cacheInstance: ICacheService | null = null;

export function getCache(): ICacheService {
  if (!cacheInstance) {
    cacheInstance = new MemoryCacheService();
  }
  return cacheInstance;
}

export const CACHE_KEYS = {
  signal: (id: string) => `trade-signal:${id}`,
  signalList: (userId: string) => `trade-signals:user:${userId}`,
  signalListAdmin: () => 'trade-signals:admin:all',
  signalListPublic: () => 'trade-signals:public:approved',
} as const;
