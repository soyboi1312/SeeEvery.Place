import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // OPTIMIZATION: Check for auth cookies before doing anything expensive
  // Supabase cookies typically start with 'sb-'
  const hasAuthCookie = request.cookies.getAll().some(cookie => cookie.name.startsWith('sb-'));

  // If there's no auth cookie, and the user isn't trying to access a protected admin route,
  // we can skip the entire Supabase initialization and network call.
  // This saves CPU time for the majority of traffic (anonymous public visitors).
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  if (!hasAuthCookie && !isAdminRoute) {
    return NextResponse.next({
      request,
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

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

  // Protect admin routes (isAdminRoute already computed above)
  if (isAdminRoute) {
    // No user = not authenticated, redirect to home
    if (!user) {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('error', 'auth_required');
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user is admin by querying the database (single source of truth)
    // Note: This adds latency to admin page loads. For high-traffic admin panels,
    // consider storing admin role in JWT claims (app_metadata.role) for sync validation.
    // For low-traffic admin panels (1-2 users), this approach is acceptable.
    const { data: adminRecord } = await supabase
      .from('admin_emails')
      .select('id')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminRecord) {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
