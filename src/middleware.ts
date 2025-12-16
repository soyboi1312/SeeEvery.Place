import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (search engine crawler instructions)
     * - sitemap.xml (search engine sitemap)
     * - geo/ (map data files)
     * - files/ (static assets)
     * - data/ (static JSON data)
     * - Static assets (svg, png, jpg, json, js, css, etc.)
     * - API webhooks (add webhook paths here if needed)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|api/webhooks|geo/|files/|data/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|js|css|woff|woff2)$).*)',
  ],
};
