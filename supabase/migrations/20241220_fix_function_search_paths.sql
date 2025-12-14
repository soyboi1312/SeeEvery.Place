-- ============================================
-- Fix Function Search Path Mutable warnings
-- Sets explicit search_path for all functions
-- ============================================

-- is_username_available
CREATE OR REPLACE FUNCTION public.is_username_available(check_username text)
RETURNS boolean AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE lower(username) = lower(check_username)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- calculate_level
CREATE OR REPLACE FUNCTION public.calculate_level(xp integer)
RETURNS integer AS $$
BEGIN
  RETURN GREATEST(1, floor(sqrt(xp::float / 100)) + 1)::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = '';

-- update_user_level (trigger function)
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS trigger AS $$
BEGIN
  NEW.level = public.calculate_level(NEW.total_xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- update_follow_counts (trigger function)
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET follower_count = GREATEST(0, follower_count - 1) WHERE id = OLD.following_id;
    UPDATE public.profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- handle_new_follow (trigger function for notifications)
CREATE OR REPLACE FUNCTION public.handle_new_follow()
RETURNS trigger AS $$
DECLARE
  follower_profile RECORD;
BEGIN
  SELECT username, avatar_url, full_name
  INTO follower_profile
  FROM public.profiles
  WHERE id = NEW.follower_id;

  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    actor_id,
    actor_username,
    actor_avatar_url,
    data
  ) VALUES (
    NEW.following_id,
    'follow',
    'New follower',
    COALESCE(follower_profile.username, follower_profile.full_name, 'Someone') || ' started following you',
    NEW.follower_id,
    follower_profile.username,
    follower_profile.avatar_url,
    jsonb_build_object('follow_id', NEW.id)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- follow_user
CREATE OR REPLACE FUNCTION public.follow_user(target_user_id uuid)
RETURNS boolean AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF current_user_id = target_user_id THEN
    RAISE EXCEPTION 'Cannot follow yourself';
  END IF;

  INSERT INTO public.follows (follower_id, following_id)
  VALUES (current_user_id, target_user_id)
  ON CONFLICT (follower_id, following_id) DO NOTHING;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- unfollow_user
CREATE OR REPLACE FUNCTION public.unfollow_user(target_user_id uuid)
RETURNS boolean AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM public.follows
  WHERE follower_id = current_user_id AND following_id = target_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- is_following
CREATE OR REPLACE FUNCTION public.is_following(target_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.follows
    WHERE follower_id = auth.uid() AND following_id = target_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- validate_social_handle
CREATE OR REPLACE FUNCTION public.validate_social_handle(handle text)
RETURNS boolean AS $$
BEGIN
  IF handle IS NULL OR handle = '' THEN
    RETURN true;
  END IF;
  RETURN handle ~ '^[a-zA-Z0-9_\.]+$' AND length(handle) <= 50;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = '';

-- validate_website_url
CREATE OR REPLACE FUNCTION public.validate_website_url(url text)
RETURNS boolean AS $$
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN true;
  END IF;
  RETURN url ~ '^https?://[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+(/.*)?$' AND length(url) <= 200;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = '';

-- get_unread_notification_count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM public.notifications
    WHERE user_id = auth.uid() AND read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- cleanup_old_activities
CREATE OR REPLACE FUNCTION public.cleanup_old_activities()
RETURNS void AS $$
BEGIN
  DELETE FROM public.activity_feed
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- get_user_rank
CREATE OR REPLACE FUNCTION public.get_user_rank(target_user_id uuid DEFAULT NULL)
RETURNS TABLE (
  user_id uuid,
  username text,
  total_xp integer,
  level integer,
  rank bigint
) AS $$
DECLARE
  lookup_user_id uuid;
BEGIN
  lookup_user_id := COALESCE(target_user_id, auth.uid());

  RETURN QUERY
  WITH ranked_users AS (
    SELECT
      p.id,
      p.username,
      COALESCE(p.total_xp, 0) as total_xp,
      COALESCE(p.level, 1) as level,
      RANK() OVER (ORDER BY COALESCE(p.total_xp, 0) DESC) as rank
    FROM public.profiles p
    WHERE p.is_public = true AND p.username IS NOT NULL
  )
  SELECT ru.id, ru.username, ru.total_xp, ru.level, ru.rank
  FROM ranked_users ru
  WHERE ru.id = lookup_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- search_users (updated version that calculates level from XP)
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
    CASE WHEN lower(p.username) = lower(search_query) THEN 0 ELSE 1 END,
    CASE WHEN lower(p.username) LIKE lower(search_query) || '%' THEN 0 ELSE 1 END,
    COALESCE(p.follower_count, 0) DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- mark_notifications_read
CREATE OR REPLACE FUNCTION public.mark_notifications_read(
  notification_ids uuid[] DEFAULT NULL,
  mark_all boolean DEFAULT false
)
RETURNS integer AS $$
DECLARE
  updated_count integer;
BEGIN
  IF mark_all THEN
    UPDATE public.notifications
    SET read = true
    WHERE user_id = auth.uid() AND read = false;
  ELSE
    UPDATE public.notifications
    SET read = true
    WHERE user_id = auth.uid()
      AND id = ANY(notification_ids)
      AND read = false;
  END IF;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- get_notifications
CREATE OR REPLACE FUNCTION public.get_notifications(
  page_limit integer DEFAULT 20,
  page_offset integer DEFAULT 0,
  unread_only boolean DEFAULT false
)
RETURNS TABLE (
  id uuid,
  type text,
  title text,
  message text,
  actor_id uuid,
  actor_username text,
  actor_avatar_url text,
  data jsonb,
  read boolean,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.id,
    n.type,
    n.title,
    n.message,
    n.actor_id,
    n.actor_username,
    n.actor_avatar_url,
    n.data,
    n.read,
    n.created_at
  FROM public.notifications n
  WHERE n.user_id = auth.uid()
    AND (NOT unread_only OR n.read = false)
  ORDER BY n.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- get_followers
CREATE OR REPLACE FUNCTION public.get_followers(
  target_user_id uuid,
  page_limit integer DEFAULT 20,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  level integer,
  is_following boolean,
  followed_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level,
    EXISTS (
      SELECT 1 FROM public.follows f2
      WHERE f2.follower_id = auth.uid() AND f2.following_id = p.id
    ) as is_following,
    f.created_at as followed_at
  FROM public.follows f
  JOIN public.profiles p ON p.id = f.follower_id
  WHERE f.following_id = target_user_id
    AND p.is_public = true
  ORDER BY f.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- get_following
CREATE OR REPLACE FUNCTION public.get_following(
  target_user_id uuid,
  page_limit integer DEFAULT 20,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  level integer,
  is_following boolean,
  followed_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level,
    EXISTS (
      SELECT 1 FROM public.follows f2
      WHERE f2.follower_id = auth.uid() AND f2.following_id = p.id
    ) as is_following,
    f.created_at as followed_at
  FROM public.follows f
  JOIN public.profiles p ON p.id = f.following_id
  WHERE f.follower_id = target_user_id
    AND p.is_public = true
  ORDER BY f.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- get_public_user_achievements
CREATE OR REPLACE FUNCTION public.get_public_user_achievements(target_user_id uuid)
RETURNS TABLE (
  achievement_id text,
  category text,
  unlocked_at timestamp with time zone,
  progress_snapshot jsonb
) AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = target_user_id AND is_public = true
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    ua.achievement_id,
    ua.category,
    ua.unlocked_at,
    ua.progress_snapshot
  FROM public.user_achievements ua
  WHERE ua.user_id = target_user_id
  ORDER BY ua.unlocked_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- get_user_achievement_stats
CREATE OR REPLACE FUNCTION public.get_user_achievement_stats(target_user_id uuid)
RETURNS TABLE (
  total_achievements bigint,
  bronze_count bigint,
  silver_count bigint,
  gold_count bigint,
  platinum_count bigint,
  recent_achievements jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total_achievements,
    COUNT(*) FILTER (WHERE ua.achievement_id LIKE '%_10')::bigint as bronze_count,
    COUNT(*) FILTER (WHERE ua.achievement_id LIKE '%_25')::bigint as silver_count,
    COUNT(*) FILTER (WHERE ua.achievement_id LIKE '%_50')::bigint as gold_count,
    COUNT(*) FILTER (WHERE ua.achievement_id LIKE '%_75' OR ua.achievement_id LIKE '%_100')::bigint as platinum_count,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'achievement_id', ua.achievement_id,
          'unlocked_at', ua.unlocked_at
        ) ORDER BY ua.unlocked_at DESC
      ) FILTER (WHERE ua.unlocked_at > NOW() - INTERVAL '30 days'),
      '[]'::jsonb
    ) as recent_achievements
  FROM public.user_achievements ua
  WHERE ua.user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- get_public_profile (the most complete version)
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
  location text,
  website text,
  social_twitter text,
  social_instagram text,
  social_strava text,
  follower_count integer,
  following_count integer,
  is_following boolean
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
    COALESCE(p.total_xp, 0) as total_xp,
    public.calculate_level(COALESCE(p.total_xp, 0)) as level,
    p.created_at,
    p.location,
    p.website,
    p.social_twitter,
    p.social_instagram,
    p.social_strava,
    COALESCE(p.follower_count, 0) as follower_count,
    COALESCE(p.following_count, 0) as following_count,
    EXISTS (
      SELECT 1 FROM public.follows f
      WHERE f.follower_id = auth.uid() AND f.following_id = p.id
    ) as is_following
  FROM public.profiles p
  WHERE p.username = profile_username
    AND p.is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- record_activity
CREATE OR REPLACE FUNCTION public.record_activity(
  p_activity_type text,
  p_category text DEFAULT NULL,
  p_place_id text DEFAULT NULL,
  p_place_name text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
  v_activity_id uuid;
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.activity_feed (
    user_id,
    activity_type,
    category,
    place_id,
    place_name,
    metadata
  ) VALUES (
    v_user_id,
    p_activity_type,
    p_category,
    p_place_id,
    p_place_name,
    p_metadata
  )
  RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Grant execute permissions (re-grant after recreation)
GRANT EXECUTE ON FUNCTION public.is_username_available(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_level(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.follow_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unfollow_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_following(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_followers(uuid, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_following(uuid, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_users(text, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_notifications(integer, integer, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notifications_read(uuid[], boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profile(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_user_achievements(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_achievement_stats(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_activity(text, text, text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_rank(uuid) TO anon, authenticated;
