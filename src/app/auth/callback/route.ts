import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Validate redirect URL to prevent open redirect attacks
function getSafeRedirectPath(next: string | null): string {
  if (!next) return '/';

  // Must start with / and not // (protocol-relative URL)
  if (!next.startsWith('/') || next.startsWith('//')) {
    return '/';
  }

  // Block any URL with protocol
  if (next.includes(':')) {
    return '/';
  }

  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = getSafeRedirectPath(searchParams.get('next'));

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch {
      // Supabase not configured, redirect to home
      return NextResponse.redirect(origin);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
