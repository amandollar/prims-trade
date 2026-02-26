/**
 * Cache abstraction - ready for Redis implementation.
 * Replace with Redis client (ioredis) when REDIS_ENABLED=true.
 * Kafka-ready: can later publish cache-invalidate events.
 */
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
}

interface CacheEntry {
  value: string;
  expiresAt?: number;
}

export class MemoryCacheService implements ICacheService {
  private store = new Map<string, CacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    try {
      return JSON.parse(entry.value) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, {
      value: JSON.stringify(value),
      expiresAt,
    });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}
