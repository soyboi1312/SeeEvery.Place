-- ============================================
-- FIX: Allow users to view their own profile + fix column name mismatches
-- ============================================
-- Issues fixed:
-- 1. get_public_profile() only returned profiles where is_public = true,
--    preventing users from viewing their own private profile
-- 2. Column names were changed in 20250107 migration breaking the frontend:
--    - website → should be website_url
--    - social_twitter → should be twitter_handle
--    - social_instagram → should be instagram_handle
--    - Missing: home_city, home_state, home_country, show_home_base, privacy_settings, achievements
-- 3. Case-sensitive username matching could fail with mixed-case usernames
-- ============================================

DROP FUNCTION IF EXISTS public.get_public_profile(text);

CREATE OR REPLACE FUNCTION public.get_public_profile(profile_username text)
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  is_public boolean,
  total_xp integer,
  level integer,
  created_at timestamp with time zone,
  -- Social links (using frontend-expected names)
  website_url text,
  instagram_handle text,
  twitter_handle text,
  -- Home base
  home_city text,
  home_state text,
  home_country text,
  show_home_base boolean,
  -- Privacy settings
  privacy_settings jsonb,
  -- Social counts
  follower_count integer,
  following_count integer,
  is_following boolean,
  -- Achievements (aggregated from user_achievements table)
  achievements jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.is_public,
    COALESCE(p.total_xp, 0) as total_xp,
    public.calculate_level(COALESCE(p.total_xp, 0)) as level,
    p.created_at,
    -- Map to frontend-expected column names
    p.website_url,
    p.instagram_handle,
    p.twitter_handle,
    p.home_city,
    p.home_state,
    p.home_country,
    COALESCE(p.show_home_base, false) as show_home_base,
    p.privacy_settings,
    COALESCE(p.follower_count, 0) as follower_count,
    COALESCE(p.following_count, 0) as following_count,
    EXISTS (
      SELECT 1 FROM public.follows f
      WHERE f.follower_id = auth.uid() AND f.following_id = p.id
    ) as is_following,
    -- Aggregate achievements as JSON array
    (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', ua.id,
          'achievement_id', ua.achievement_id,
          'unlocked_at', ua.unlocked_at,
          'category', ua.category
        )
        ORDER BY ua.unlocked_at DESC
      ), '[]'::jsonb)
      FROM public.user_achievements ua
      WHERE ua.user_id = p.id
    ) as achievements
  FROM public.profiles p
  WHERE LOWER(p.username) = LOWER(profile_username)
    AND (
      p.is_public = true           -- Profile is public, anyone can view
      OR p.id = auth.uid()         -- User is viewing their own profile
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(text) TO anon, authenticated;

COMMENT ON FUNCTION public.get_public_profile(text) IS
  'Returns profile data for public profiles or the user''s own profile. Includes achievements, social links, and privacy settings.';
