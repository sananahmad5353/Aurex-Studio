/**
 * In-memory rate limiter for API routes.
 * Tracks requests per IP and blocks exceeding the limit.
 * Uses a sliding window approach for accurate throttling.
 */

interface RateLimitEntry {
  timestamps: number[];
  blocked: boolean;
  blockedUntil: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
const ENTRY_TTL = 15 * 60 * 1000; // 15 minutes

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now - entry.timestamps[entry.timestamps.length - 1] > ENTRY_TTL) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Block duration in milliseconds after exceeding limit (default: same as window) */
  blockDurationMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Check if a request should be rate limited.
 * @param identifier - Unique identifier (usually IP address or IP + endpoint)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  cleanup();

  const now = Date.now();
  const blockDuration = config.blockDurationMs || config.windowMs;
  const windowStart = now - config.windowMs;

  let entry = store.get(identifier);

  // Check if currently blocked
  if (entry && entry.blocked && now < entry.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  // Reset block if expired
  if (entry && entry.blocked && now >= entry.blockedUntil) {
    entry.blocked = false;
    entry.timestamps = [];
  }

  // Create new entry if needed
  if (!entry) {
    entry = { timestamps: [], blocked: false, blockedUntil: 0 };
    store.set(identifier, entry);
  }

  // Filter out timestamps outside the current window
  entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);

  // Check if limit exceeded
  if (entry.timestamps.length >= config.maxRequests) {
    entry.blocked = true;
    entry.blockedUntil = now + blockDuration;
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter: Math.ceil(blockDuration / 1000),
    };
  }

  // Add current request timestamp
  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetAt: windowStart + config.windowMs,
  };
}

// Pre-configured rate limits for different endpoints
export const RATE_LIMITS = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }, // 5 attempts per 15 min, block 30 min
  contact: { maxRequests: 3, windowMs: 60 * 1000 }, // 3 per minute
  generalApi: { maxRequests: 60, windowMs: 60 * 1000 }, // 60 per minute
  publicApi: { maxRequests: 120, windowMs: 60 * 1000 }, // 120 per minute
  changePassword: { maxRequests: 3, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  twoFactor: { maxRequests: 10, windowMs: 60 * 1000, blockDurationMs: 15 * 60 * 1000 },
} as const;

/**
 * Get client IP from request headers (supports proxies)
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}