import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Admin emails can be configured via environment variable (comma-separated)
function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!adminEmails) return [];
  return adminEmails.split(',').map(email => email.trim().toLowerCase());
}

function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Skip Supabase session handling if environment variables are not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Protect admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  if (isAdminRoute) {
    // No user = not authenticated, redirect to home
    if (!user) {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('error', 'auth_required');
      return NextResponse.redirect(redirectUrl);
    }

    // User is not an admin, redirect to home
    if (!isAdminEmail(user.email)) {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
