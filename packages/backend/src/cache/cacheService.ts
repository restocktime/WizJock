import { getRedisClient } from './redis';

export class CacheService {
  /**
   * Get a value from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const client = getRedisClient();
      const value = await client.get(key);
      
      if (!value) {
        return null;
      }
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in cache with optional TTL (in seconds)
   */
  static async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const client = getRedisClient();
      const serialized = JSON.stringify(value);
      
      if (ttl) {
        await client.setEx(key, ttl, serialized);
      } else {
        await client.set(key, serialized);
      }
      
      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete a value from cache
   */
  static async delete(key: string): Promise<boolean> {
    try {
      const client = getRedisClient();
      await client.del(key);
      return true;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  static async deletePattern(pattern: string): Promise<number> {
    try {
      const client = getRedisClient();
      const keys = await client.keys(pattern);
      
      if (keys.length === 0) {
        return 0;
      }
      
      await client.del(keys);
      return keys.length;
    } catch (error) {
      console.error(`Cache delete pattern error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if a key exists in cache
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const client = getRedisClient();
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  static async clear(): Promise<boolean> {
    try {
      const client = getRedisClient();
      await client.flushDb();
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Invalidate cache for published picks
   * Used when publishing or unpublishing reports
   */
  static async invalidatePicksCache(sport?: string): Promise<number> {
    try {
      if (sport) {
        // Invalidate specific sport picks
        return await this.deletePattern(`picks:${sport}:*`);
      } else {
        // Invalidate all picks
        return await this.deletePattern('picks:*');
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
      return 0;
    }
  }

  /**
   * Invalidate performance metrics cache
   */
  static async invalidatePerformanceCache(sport?: string): Promise<number> {
    try {
      if (sport) {
        return await this.deletePattern(`performance:${sport}:*`);
      } else {
        return await this.deletePattern('performance:*');
      }
    } catch (error) {
      console.error('Performance cache invalidation error:', error);
      return 0;
    }
  }
}

// Export helper functions for convenience
export const invalidatePicksCache = (sport?: string) => CacheService.invalidatePicksCache(sport);
export const invalidatePerformanceCache = (sport?: string) => CacheService.invalidatePerformanceCache(sport);
