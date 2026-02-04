/**
 * In-memory rate limiter for server-side request throttling
 * Tracks attempt counts per key (email, user ID, IP) within a sliding window
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
}

export class RateLimiter {
  private attempts: Map<string, { count: number; windowStart: number }> = new Map();

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  /**
   * Check if a request from this key is allowed
   * @param key Identifier (email, user ID, IP, etc.)
   * @returns { allowed, remaining, retryAfter (ms) }
   */
  check(key: string): RateLimitResult {
    const now = Date.now();
    const record = this.attempts.get(key);

    // No record or window expired
    if (!record || now - record.windowStart > this.windowMs) {
      return {
        allowed: true,
        remaining: this.maxRequests,
        retryAfter: 0,
      };
    }

    // Window still active
    if (record.count >= this.maxRequests) {
      const retryAfter = this.windowMs - (now - record.windowStart);
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.max(0, retryAfter),
      };
    }

    // Haven't hit limit yet
    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      retryAfter: 0,
    };
  }

  /**
   * Record an attempt for this key
   */
  record(key: string): void {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now - record.windowStart > this.windowMs) {
      // Create new window
      this.attempts.set(key, { count: 1, windowStart: now });
    } else {
      // Increment existing window
      record.count++;
    }
  }

  /**
   * Clear all stored attempts (useful for testing)
   */
  reset(): void {
    this.attempts.clear();
  }
}
