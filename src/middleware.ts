import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect HTTP to HTTPS in production
  // Check x-forwarded-proto header (set by reverse proxies/CDNs like Cloudflare)
  const proto = request.headers.get('x-forwarded-proto');
  if (proto === 'http') {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, 301);
  }

  // Skip auth middleware for static assets - let Next.js serve them directly
  // This ensures geo data, images, and other static files are served without 503 errors
  if (
    pathname.startsWith('/geo/') ||
    pathname.startsWith('/files/') ||
    pathname.startsWith('/data/') ||
    pathname.startsWith('/_next/') ||
    pathname.endsWith('.json') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.webmanifest')
  ) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - robots.txt (search engine crawler instructions)
     * - sitemap.xml (search engine sitemap)
     * - geo/ (map data files)
     * - files/ (static assets)
     * - data/ (static JSON data)
     * - Static assets (svg, png, jpg, json, js, css, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|geo/|files/|data/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|js|css|woff|woff2|webmanifest)$).*)',
  ],
};
