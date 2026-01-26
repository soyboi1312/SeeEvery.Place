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

/**
 * Sanitize user input text to prevent XSS attacks.
 * Strips HTML tags and encodes dangerous characters.
 *
 * Use this for any user-provided text that will be rendered in the UI,
 * such as descriptions, titles, notes, etc.
 *
 * @param input - The raw user input string
 * @returns Sanitized string safe for rendering
 */
export function sanitizeText(input: string | null | undefined): string | null {
  if (input === null || input === undefined) {
    return null;
  }

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Encode HTML entities to prevent injection
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove null bytes and other control characters (except newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Trim whitespace
    .trim();
}
