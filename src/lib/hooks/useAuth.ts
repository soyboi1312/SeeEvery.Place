'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Use ref to store singleton client (avoids SSR issues with useMemo)
  const clientRef = useRef<SupabaseClient | null>(null);

  // Get or create the singleton client (browser-only)
  const getClient = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = createClient();
    }
    return clientRef.current;
  }, []);

  useEffect(() => {
    const supabase = getClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [getClient]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await getClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, [getClient]);

  const signInWithApple = useCallback(async () => {
    const { error } = await getClient().auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, [getClient]);

  const signInWithEmail = useCallback(async (email: string) => {
    const { error } = await getClient().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, [getClient]);

  const signOut = useCallback(async () => {
    const { error } = await getClient().auth.signOut();
    if (error) throw error;
  }, [getClient]);

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signOut,
  };
}
