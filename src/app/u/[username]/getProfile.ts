import { cache } from 'react';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export interface UnlockedAchievement {
  id: string;
  achievement_id: string;
  unlocked_at: string;
  category: string | null;
}

export interface PublicProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_public: boolean;
  total_xp: number;
  level: number;
  created_at: string;
  // Social links
  website_url: string | null;
  instagram_handle: string | null;
  twitter_handle: string | null;
  // Home base
  home_city: string | null;
  home_state: string | null;
  home_country: string | null;
  show_home_base: boolean;
  // Privacy settings
  privacy_settings: {
    hide_categories?: string[];
    hide_bucket_list?: boolean;
  } | null;
  // Achievements (included from get_public_profile function)
  achievements: UnlockedAchievement[] | null;
  // Social stats
  follower_count?: number;
  following_count?: number;
  is_following?: boolean;
}

/**
 * Cached function to fetch a public profile.
 * React's cache() deduplicates calls with the same username within a single request,
 * preventing multiple RPC calls from generateMetadata and the page component.
 */
export const getPublicProfile = cache(async (username: string): Promise<PublicProfile | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc('get_public_profile', { profile_username: username })
    .single();

  if (error || !data) {
    return null;
  }

  return data as PublicProfile;
});

/**
 * Cached function to fetch user selections for a public profile.
 * Uses admin client to bypass RLS since we've already verified the profile is public.
 */
export const getPublicSelections = cache(async (userId: string): Promise<Record<string, unknown>> => {
  const adminClient = createAdminClient();

  const { data } = await adminClient
    .from('user_selections')
    .select('selections')
    .eq('user_id', userId)
    .single();

  return data?.selections || {};
});
