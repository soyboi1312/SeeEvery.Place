-- ============================================
-- Fix level calculation in search_users and sync existing data
-- ============================================

-- Update search_users to calculate level from XP instead of using stored value
CREATE OR REPLACE FUNCTION public.search_users(
  search_query text,
  page_limit integer DEFAULT 20,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  level integer,
  total_xp integer,
  follower_count integer,
  is_following boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    public.calculate_level(COALESCE(p.total_xp, 0)) as level,
    COALESCE(p.total_xp, 0) as total_xp,
    COALESCE(p.follower_count, 0) as follower_count,
    EXISTS (
      SELECT 1 FROM public.follows f
      WHERE f.follower_id = auth.uid()
      AND f.following_id = p.id
    ) as is_following
  FROM public.profiles p
  WHERE
    p.is_public = true
    AND p.username IS NOT NULL
    AND (
      p.username ILIKE '%' || search_query || '%'
      OR p.full_name ILIKE '%' || search_query || '%'
    )
  ORDER BY
    -- Exact username match first
    CASE WHEN lower(p.username) = lower(search_query) THEN 0 ELSE 1 END,
    -- Then starts with
    CASE WHEN lower(p.username) LIKE lower(search_query) || '%' THEN 0 ELSE 1 END,
    -- Then by follower count
    COALESCE(p.follower_count, 0) DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sync all existing users' level column with their actual XP
UPDATE public.profiles
SET level = public.calculate_level(COALESCE(total_xp, 0))
WHERE level IS DISTINCT FROM public.calculate_level(COALESCE(total_xp, 0));
