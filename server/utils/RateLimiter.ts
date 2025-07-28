import { Server } from 'socket.io';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  strategy: 'fixed' | 'sliding' | 'token-bucket';
  keyGenerator?: (identifier: string) => string;
  onLimitReached?: (identifier: string, attempts: number) => void;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
}

export interface RateLimitInfo {
  identifier: string;
  totalHits: number;
  totalHitsInWindow: number;
  remaining: number;
  resetTime: Date;
  isBlocked: boolean;
}

export class RateLimiter {
  private stores: Map<string, Map<string, any>> = new Map();
  private config: RateLimitConfig;
  private io?: Server;

  constructor(config: RateLimitConfig, io?: Server) {
    this.config = {
      windowMs: 60000, // 1 minute default
      maxRequests: 100,
      strategy: 'sliding',
      keyGenerator: (id) => id,
      skipFailedRequests: false,
      skipSuccessfulRequests: false,
      ...config
    };
    this.io = io;
  }

  async checkLimit(identifier: string, cost: number = 1): Promise<RateLimitInfo> {
    const key = this.config.keyGenerator!(identifier);
    const now = Date.now();

    switch (this.config.strategy) {
      case 'fixed':
        return this.fixedWindowCheck(key, now, cost);
      case 'sliding':
        return this.slidingWindowCheck(key, now, cost);
      case 'token-bucket':
        return this.tokenBucketCheck(key, now, cost);
      default:
        return this.slidingWindowCheck(key, now, cost);
    }
  }

  private fixedWindowCheck(key: string, now: number, cost: number): RateLimitInfo {
    if (!this.stores.has('fixed')) {
      this.stores.set('fixed', new Map());
    }
    
    const store = this.stores.get('fixed')!;
    const windowStart = Math.floor(now / this.config.windowMs) * this.config.windowMs;
    const windowKey = `${key}:${windowStart}`;
    
    const currentData = store.get(windowKey) || { count: 0, resetTime: windowStart + this.config.windowMs };
    
    const remaining = Math.max(0, this.config.maxRequests - currentData.count);
    const isBlocked = currentData.count >= this.config.maxRequests;
    
    if (!isBlocked) {
      currentData.count += cost;
      store.set(windowKey, currentData);
    }

    // Cleanup old windows
    this.cleanupOldEntries(store, now, 'fixed');

    return {
      identifier: key,
      totalHits: currentData.count,
      totalHitsInWindow: currentData.count,
      remaining,
      resetTime: new Date(currentData.resetTime),
      isBlocked
    };
  }

  private slidingWindowCheck(key: string, now: number, cost: number): RateLimitInfo {
    if (!this.stores.has('sliding')) {
      this.stores.set('sliding', new Map());
    }
    
    const store = this.stores.get('sliding')!;
    const requests = store.get(key) || [];
    
    // Remove requests outside the window
    const windowStart = now - this.config.windowMs;
    const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);
    
    const totalHitsInWindow = validRequests.length;
    const remaining = Math.max(0, this.config.maxRequests - totalHitsInWindow);
    const isBlocked = totalHitsInWindow >= this.config.maxRequests;
    
    if (!isBlocked) {
      // Add current request timestamps based on cost
      for (let i = 0; i < cost; i++) {
        validRequests.push(now + i); // Slight offset for multiple costs
      }
      store.set(key, validRequests);
    }

    // Cleanup old entries periodically
    this.cleanupOldEntries(store, now, 'sliding');

    return {
      identifier: key,
      totalHits: validRequests.length,
      totalHitsInWindow,
      remaining,
      resetTime: new Date(now + this.config.windowMs),
      isBlocked
    };
  }

  private tokenBucketCheck(key: string, now: number, cost: number): RateLimitInfo {
    if (!this.stores.has('token-bucket')) {
      this.stores.set('token-bucket', new Map());
    }
    
    const store = this.stores.get('token-bucket')!;
    const bucketData = store.get(key) || {
      tokens: this.config.maxRequests,
      lastRefill: now,
      totalRequests: 0
    };
    
    // Calculate tokens to add based on time passed
    const timePassed = now - bucketData.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.config.windowMs) * this.config.maxRequests;
    
    if (tokensToAdd > 0) {
      bucketData.tokens = Math.min(this.config.maxRequests, bucketData.tokens + tokensToAdd);
      bucketData.lastRefill = now;
    }
    
    const isBlocked = bucketData.tokens < cost;
    const remaining = bucketData.tokens;
    
    if (!isBlocked) {
      bucketData.tokens -= cost;
      bucketData.totalRequests += cost;
    }
    
    store.set(key, bucketData);

    return {
      identifier: key,
      totalHits: bucketData.totalRequests,
      totalHitsInWindow: this.config.maxRequests - bucketData.tokens,
      remaining,
      resetTime: new Date(bucketData.lastRefill + this.config.windowMs),
      isBlocked
    };
  }

  private cleanupOldEntries(store: Map<string, any>, now: number, strategy: string): void {
    // Only cleanup every 5 minutes to avoid performance impact
    if (now % (5 * 60 * 1000) < 1000) {
      const cutoff = now - this.config.windowMs * 2; // Keep extra window for safety
      
      if (strategy === 'fixed') {
        for (const [key, data] of store.entries()) {
          if (data.resetTime < cutoff) {
            store.delete(key);
          }
        }
      } else if (strategy === 'sliding') {
        for (const [key, requests] of store.entries()) {
          const validRequests = requests.filter((timestamp: number) => timestamp > cutoff);
          if (validRequests.length === 0) {
            store.delete(key);
          } else {
            store.set(key, validRequests);
          }
        }
      }
    }
  }

  // Monitoring and analytics methods
  getStats(): any {
    const stats = {
      strategy: this.config.strategy,
      windowMs: this.config.windowMs,
      maxRequests: this.config.maxRequests,
      stores: {} as any
    };

    for (const [strategyName, store] of this.stores.entries()) {
      stats.stores[strategyName] = {
        totalKeys: store.size,
        activeKeys: this.getActiveKeysCount(store, strategyName)
      };
    }

    return stats;
  }

  private getActiveKeysCount(store: Map<string, any>, strategy: string): number {
    const now = Date.now();
    const cutoff = now - this.config.windowMs;
    let activeCount = 0;

    for (const [key, data] of store.entries()) {
      if (strategy === 'fixed') {
        if (data.resetTime > now) activeCount++;
      } else if (strategy === 'sliding') {
        const activeRequests = data.filter((timestamp: number) => timestamp > cutoff);
        if (activeRequests.length > 0) activeCount++;
      } else if (strategy === 'token-bucket') {
        if (data.lastRefill > cutoff) activeCount++;
      }
    }

    return activeCount;
  }

  // Get rate limit info without consuming tokens
  getInfo(identifier: string): RateLimitInfo | null {
    const key = this.config.keyGenerator!(identifier);
    const now = Date.now();

    // Return info without modifying counters
    switch (this.config.strategy) {
      case 'fixed': {
        const store = this.stores.get('fixed');
        if (!store) return null;
        
        const windowStart = Math.floor(now / this.config.windowMs) * this.config.windowMs;
        const windowKey = `${key}:${windowStart}`;
        const data = store.get(windowKey);
        
        if (!data) return null;
        
        return {
          identifier: key,
          totalHits: data.count,
          totalHitsInWindow: data.count,
          remaining: Math.max(0, this.config.maxRequests - data.count),
          resetTime: new Date(data.resetTime),
          isBlocked: data.count >= this.config.maxRequests
        };
      }
      
      case 'sliding': {
        const store = this.stores.get('sliding');
        if (!store) return null;
        
        const requests = store.get(key);
        if (!requests) return null;
        
        const windowStart = now - this.config.windowMs;
        const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);
        
        return {
          identifier: key,
          totalHits: validRequests.length,
          totalHitsInWindow: validRequests.length,
          remaining: Math.max(0, this.config.maxRequests - validRequests.length),
          resetTime: new Date(now + this.config.windowMs),
          isBlocked: validRequests.length >= this.config.maxRequests
        };
      }
      
      case 'token-bucket': {
        const store = this.stores.get('token-bucket');
        if (!store) return null;
        
        const data = store.get(key);
        if (!data) return null;
        
        return {
          identifier: key,
          totalHits: data.totalRequests,
          totalHitsInWindow: this.config.maxRequests - data.tokens,
          remaining: data.tokens,
          resetTime: new Date(data.lastRefill + this.config.windowMs),
          isBlocked: data.tokens <= 0
        };
      }
      
      default:
        return null;
    }
  }

  // Reset rate limit for a specific identifier
  reset(identifier: string): void {
    const key = this.config.keyGenerator!(identifier);
    
    for (const store of this.stores.values()) {
      store.delete(key);
    }
  }

  // Emit metrics via WebSocket
  emitMetrics(): void {
    if (!this.io) return;

    const stats = this.getStats();
    const metrics = {
      timestamp: new Date(),
      rateLimiter: stats,
      blockedRequests: this.getBlockedRequestsCount(),
      topBlockedIPs: this.getTopBlockedIdentifiers()
    };

    this.io.emit('rate-limiter:metrics', metrics);
  }

  private getBlockedRequestsCount(): number {
    // This would track blocked requests in a real implementation
    return 0; // Mock for now
  }

  private getTopBlockedIdentifiers(): any[] {
    // This would track most frequently blocked identifiers
    return []; // Mock for now
  }
}

// Rate limiter factory for different use cases
export class RateLimiterFactory {
  static createAPILimiter(io?: Server): RateLimiter {
    return new RateLimiter({
      windowMs: 60000, // 1 minute
      maxRequests: 100,
      strategy: 'sliding',
      keyGenerator: (identifier) => `api:${identifier}`
    }, io);
  }

  static createAuthLimiter(io?: Server): RateLimiter {
    return new RateLimiter({
      windowMs: 900000, // 15 minutes
      maxRequests: 5,
      strategy: 'fixed',
      keyGenerator: (identifier) => `auth:${identifier}`
    }, io);
  }

  static createAgentLimiter(io?: Server): RateLimiter {
    return new RateLimiter({
      windowMs: 60000, // 1 minute
      maxRequests: 1000, // Much higher limit for agents
      strategy: 'token-bucket',
      keyGenerator: (identifier) => `agent:${identifier}`
    }, io);
  }

  static createExternalAPILimiter(apiName: string, maxRequests: number, windowMs: number, io?: Server): RateLimiter {
    return new RateLimiter({
      windowMs,
      maxRequests,
      strategy: 'sliding',
      keyGenerator: (identifier) => `external:${apiName}:${identifier}`
    }, io);
  }
}