import { NextRequest } from 'next/server';

/**
 * Safely extract the client IP address from a request.
 *
 * Priority order:
 * 1. CF-Connecting-IP (Cloudflare - most reliable when behind CF)
 * 2. X-Real-IP (common reverse proxy header)
 * 3. First IP in X-Forwarded-For chain (standard proxy header)
 * 4. 'unknown' as fallback
 *
 * Note: We prefer CF-Connecting-IP since we deploy to Cloudflare Workers.
 * Cloudflare sets this header and it cannot be spoofed by clients.
 */
export function getClientIP(request: NextRequest): string {
  // Cloudflare's connecting IP header - most reliable when behind CF
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  // X-Real-IP - set by some reverse proxies
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // X-Forwarded-For - standard proxy header, take first IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIP = forwardedFor.split(',')[0];
    if (firstIP) {
      return firstIP.trim();
    }
  }

  return 'unknown';
}
