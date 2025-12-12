import { NextResponse } from 'next/server';

/**
 * GET /api/version
 * Returns the current app version for service worker cache invalidation.
 *
 * When the client's cached version differs from the server's version,
 * it signals that the service worker cache should be invalidated to prevent
 * stale frontend code from interacting with a newer backend API.
 */
export async function GET() {
  // Use package.json version + build timestamp for granular versioning
  // The BUILD_ID is set at build time by Next.js, or we fall back to a timestamp
  const buildId = process.env.NEXT_BUILD_ID || process.env.BUILD_ID || 'dev';

  return NextResponse.json({
    // API version - increment this when making breaking API changes
    apiVersion: 1,
    // Build identifier for cache busting
    buildId,
    // Timestamp helps identify the exact deployment
    deployedAt: process.env.DEPLOY_TIMESTAMP || new Date().toISOString(),
  }, {
    headers: {
      // Prevent caching of version endpoint
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
