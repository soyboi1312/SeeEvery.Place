-- ============================================
-- Update get_public_profile to include achievements data
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
  website_url text,
  instagram_handle text,
  twitter_handle text,
  home_city text,
  home_state text,
  home_country text,
  show_home_base boolean,
  privacy_settings jsonb,
  achievements jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.is_public,
    p.total_xp,
    p.level,
    p.created_at,
    p.website_url,
    p.instagram_handle,
    p.twitter_handle,
    p.home_city,
    p.home_state,
    p.home_country,
    p.show_home_base,
    p.privacy_settings,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', ua.id,
          'achievement_id', ua.achievement_id,
          'unlocked_at', ua.unlocked_at,
          'category', ua.category
        ) ORDER BY ua.unlocked_at DESC
      )
      FROM public.user_achievements ua
      WHERE ua.user_id = p.id),
      '[]'::jsonb
    ) as achievements
  FROM public.profiles p
  WHERE lower(p.username) = lower(profile_username)
  AND p.is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
