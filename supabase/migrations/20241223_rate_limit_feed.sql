-- ============================================
-- Rate Limit Activity Feed Per User
-- ============================================
-- Prevents feed flooding by limiting to 5 recent activities per user
-- ============================================

-- Update get_global_activity_feed to limit activities per user
DROP FUNCTION IF EXISTS public.get_global_activity_feed(integer, integer, text);

CREATE OR REPLACE FUNCTION public.get_global_activity_feed(
  page_limit integer DEFAULT 20,
  page_offset integer DEFAULT 0,
  filter_type text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  user_level integer,
  activity_type text,
  category text,
  place_id text,
  place_name text,
  achievement_id text,
  achievement_name text,
  old_level integer,
  new_level integer,
  challenge_name text,
  xp_earned integer,
  reaction_count integer,
  has_reacted boolean,
  created_at timestamp with time zone
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH ranked_activities AS (
    SELECT
      af.*,
      ROW_NUMBER() OVER (
        PARTITION BY af.user_id
        ORDER BY af.created_at DESC
      ) as user_rank
    FROM public.activity_feed af
    JOIN public.profiles p ON p.id = af.user_id
    WHERE p.is_public = true
      AND (filter_type IS NULL OR af.activity_type = filter_type)
  )
  SELECT
    ra.id,
    ra.user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level as user_level,
    ra.activity_type,
    ra.category,
    ra.place_id,
    ra.place_name,
    ra.achievement_id,
    ra.achievement_name,
    ra.old_level,
    ra.new_level,
    ra.challenge_name,
    ra.xp_earned,
    COALESCE(ra.reaction_count, 0) as reaction_count,
    EXISTS (
      SELECT 1 FROM public.activity_reactions ar
      WHERE ar.activity_id = ra.id AND ar.user_id = auth.uid()
    ) as has_reacted,
    ra.created_at
  FROM ranked_activities ra
  JOIN public.profiles p ON p.id = ra.user_id
  WHERE ra.user_rank <= 5  -- Limit to 5 most recent activities per user
  ORDER BY ra.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.get_global_activity_feed(integer, integer, text) TO anon, authenticated;

-- Update get_friends_activity_feed to limit activities per user
DROP FUNCTION IF EXISTS public.get_friends_activity_feed(integer, integer);

CREATE OR REPLACE FUNCTION public.get_friends_activity_feed(
  page_limit integer DEFAULT 20,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  user_level integer,
  activity_type text,
  category text,
  place_id text,
  place_name text,
  achievement_id text,
  achievement_name text,
  old_level integer,
  new_level integer,
  challenge_name text,
  xp_earned integer,
  reaction_count integer,
  has_reacted boolean,
  created_at timestamp with time zone
)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  WITH ranked_activities AS (
    SELECT
      af.*,
      ROW_NUMBER() OVER (
        PARTITION BY af.user_id
        ORDER BY af.created_at DESC
      ) as user_rank
    FROM public.activity_feed af
    JOIN public.profiles p ON p.id = af.user_id
    WHERE EXISTS (
      SELECT 1 FROM public.follows f
      WHERE f.follower_id = v_user_id
      AND f.following_id = af.user_id
    )
    AND p.is_public = true
  )
  SELECT
    ra.id,
    ra.user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level as user_level,
    ra.activity_type,
    ra.category,
    ra.place_id,
    ra.place_name,
    ra.achievement_id,
    ra.achievement_name,
    ra.old_level,
    ra.new_level,
    ra.challenge_name,
    ra.xp_earned,
    COALESCE(ra.reaction_count, 0) as reaction_count,
    EXISTS (
      SELECT 1 FROM public.activity_reactions ar
      WHERE ar.activity_id = ra.id AND ar.user_id = v_user_id
    ) as has_reacted,
    ra.created_at
  FROM ranked_activities ra
  JOIN public.profiles p ON p.id = ra.user_id
  WHERE ra.user_rank <= 5  -- Limit to 5 most recent activities per user
  ORDER BY ra.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.get_friends_activity_feed(integer, integer) TO authenticated;

COMMENT ON FUNCTION public.get_global_activity_feed IS 'Returns recent activities from public profiles, limited to 5 per user to prevent feed flooding';
COMMENT ON FUNCTION public.get_friends_activity_feed IS 'Returns recent activities from followed users, limited to 5 per user to prevent feed flooding';
