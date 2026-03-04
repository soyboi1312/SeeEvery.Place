import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter for API routes.
 *
 * NOTE: This provides per-worker-instance rate limiting. Since Cloudflare Workers
 * are distributed across multiple instances, this is not globally accurate but
 * provides defense-in-depth. For production-grade rate limiting, configure
 * Cloudflare Rate Limiting rules at the infrastructure level.
 *
 * @see https://developers.cloudflare.com/waf/rate-limiting-rules/
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodically clean up expired entries to prevent memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  });
}

/**
 * Extract client IP from request headers.
 * Prefers Cloudflare's CF-Connecting-IP which cannot be spoofed by clients.
 */
function getIP(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  max: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Key prefix to namespace rate limits */
  prefix: string;
}

/**
 * Check rate limit for a request. Returns a 429 response if rate limited,
 * or null if the request is allowed.
 */
export function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): NextResponse | null {
  cleanup();

  const ip = getIP(request);
  const key = `${options.prefix}:${ip}`;
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= options.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    );
  }

  entry.count++;
  return null;
}
