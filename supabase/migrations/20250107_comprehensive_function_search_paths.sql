-- ============================================
-- Comprehensive Function Search Path Fix
-- ============================================
-- Fixes ALL functions to use SET search_path = public
-- This addresses the function_search_path_mutable linter warning
-- ============================================

-- ============================================
-- DROP FUNCTIONS WITH PARAMETER NAME CONFLICTS
-- ============================================
-- Some functions have different parameter names in existing definitions
-- so we must drop them first before recreating

DROP FUNCTION IF EXISTS public.is_username_available(text);
DROP FUNCTION IF EXISTS public.get_followers(uuid, integer, integer);
DROP FUNCTION IF EXISTS public.get_following(uuid, integer, integer);
DROP FUNCTION IF EXISTS public.get_public_profile(text);
DROP FUNCTION IF EXISTS public.search_users(text, integer, integer);
DROP FUNCTION IF EXISTS public.get_notifications(integer, integer, boolean);
DROP FUNCTION IF EXISTS public.mark_notifications_read(uuid[], boolean);
DROP FUNCTION IF EXISTS public.get_xp_leaderboard(text, integer, integer);
DROP FUNCTION IF EXISTS public.get_friends_leaderboard(text);
DROP FUNCTION IF EXISTS public.get_category_leaderboard(text, integer, integer);
DROP FUNCTION IF EXISTS public.get_category_stats(text);
DROP FUNCTION IF EXISTS public.check_challenge_progress(uuid, text, text, timestamp with time zone);
DROP FUNCTION IF EXISTS public.record_user_activity(text);
DROP FUNCTION IF EXISTS public.get_user_status(uuid);
DROP FUNCTION IF EXISTS public.is_user_suspended(uuid);
DROP FUNCTION IF EXISTS public.get_public_user_achievements(uuid);
DROP FUNCTION IF EXISTS public.get_user_achievement_stats(uuid);

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- handle_updated_at (trigger function)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- handle_new_user (trigger function for auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- is_username_available
CREATE OR REPLACE FUNCTION public.is_username_available(username_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE LOWER(username) = LOWER(username_to_check)
  );
END;
$$;

-- validate_social_handle
CREATE OR REPLACE FUNCTION public.validate_social_handle(handle text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF handle IS NULL OR handle = '' THEN
    RETURN true;
  END IF;
  RETURN handle ~ '^[a-zA-Z0-9_\.]+$' AND length(handle) <= 50;
END;
$$;

-- validate_website_url
CREATE OR REPLACE FUNCTION public.validate_website_url(url text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN true;
  END IF;
  RETURN url ~ '^https?://' AND length(url) <= 200;
END;
$$;

-- ============================================
-- ADMIN FUNCTIONS
-- ============================================

-- is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_emails
    WHERE email = (SELECT auth.jwt()->>'email')
  );
END;
$$;

-- is_super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_emails
    WHERE email = (SELECT auth.jwt()->>'email')
    AND role = 'super_admin'
  );
END;
$$;

-- ============================================
-- USER STATUS FUNCTIONS
-- ============================================

-- is_user_suspended
CREATE OR REPLACE FUNCTION public.is_user_suspended(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_status
    WHERE id = check_user_id
    AND status IN ('suspended', 'banned')
  );
END;
$$;

-- get_user_status
CREATE OR REPLACE FUNCTION public.get_user_status(p_user_id uuid)
RETURNS TABLE (
  status text,
  suspended_at timestamp with time zone,
  suspended_by text,
  suspend_reason text,
  suspended_until timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    us.status,
    us.suspended_at,
    us.suspended_by,
    us.suspend_reason,
    us.suspended_until
  FROM public.user_status us
  WHERE us.id = p_user_id;
END;
$$;

-- ============================================
-- LEVEL & XP FUNCTIONS
-- ============================================

-- calculate_level
CREATE OR REPLACE FUNCTION public.calculate_level(xp integer)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF xp < 100 THEN RETURN 1;
  ELSIF xp < 250 THEN RETURN 2;
  ELSIF xp < 500 THEN RETURN 3;
  ELSIF xp < 1000 THEN RETURN 4;
  ELSIF xp < 2000 THEN RETURN 5;
  ELSIF xp < 4000 THEN RETURN 6;
  ELSIF xp < 7500 THEN RETURN 7;
  ELSIF xp < 12500 THEN RETURN 8;
  ELSIF xp < 20000 THEN RETURN 9;
  ELSE RETURN 10;
  END IF;
END;
$$;

-- update_user_level (trigger function)
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.level := public.calculate_level(COALESCE(NEW.total_xp, 0));
  RETURN NEW;
END;
$$;

-- ============================================
-- SUGGESTION VOTE FUNCTIONS
-- ============================================

-- handle_vote_insert
CREATE OR REPLACE FUNCTION public.handle_vote_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.suggestions
  SET vote_count = vote_count + 1, updated_at = now()
  WHERE id = NEW.suggestion_id;
  RETURN NEW;
END;
$$;

-- handle_vote_delete
CREATE OR REPLACE FUNCTION public.handle_vote_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.suggestions
  SET vote_count = vote_count - 1, updated_at = now()
  WHERE id = OLD.suggestion_id;
  RETURN OLD;
END;
$$;

-- ============================================
-- FOLLOW FUNCTIONS
-- ============================================

-- update_follow_counts (trigger function)
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;
    UPDATE public.profiles
    SET follower_count = follower_count + 1
    WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles
    SET following_count = GREATEST(0, following_count - 1)
    WHERE id = OLD.follower_id;
    UPDATE public.profiles
    SET follower_count = GREATEST(0, follower_count - 1)
    WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
END;
$$;

-- handle_new_follow (trigger for notifications)
CREATE OR REPLACE FUNCTION public.handle_new_follow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- is_following
CREATE OR REPLACE FUNCTION public.is_following(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.follows
    WHERE follower_id = auth.uid() AND following_id = target_user_id
  );
END;
$$;

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
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

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
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- ============================================
-- NOTIFICATION FUNCTIONS
-- ============================================

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
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- get_unread_notification_count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM public.notifications
    WHERE user_id = auth.uid() AND read = false
  );
END;
$$;

-- mark_notifications_read
CREATE OR REPLACE FUNCTION public.mark_notifications_read(
  notification_ids uuid[] DEFAULT NULL,
  mark_all boolean DEFAULT false
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- ============================================
-- PROFILE FUNCTIONS
-- ============================================

-- get_public_profile
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
$$;

-- search_users
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
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- get_public_user_achievements
CREATE OR REPLACE FUNCTION public.get_public_user_achievements(target_user_id uuid)
RETURNS TABLE (
  achievement_id text,
  category text,
  unlocked_at timestamp with time zone,
  progress_snapshot jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- get_user_achievement_stats
CREATE OR REPLACE FUNCTION public.get_user_achievement_stats(target_user_id uuid)
RETURNS TABLE (
  total_achievements bigint,
  bronze_count bigint,
  silver_count bigint,
  gold_count bigint,
  platinum_count bigint,
  recent_achievements jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- ============================================
-- LEADERBOARD FUNCTIONS
-- ============================================

-- get_xp_leaderboard
CREATE OR REPLACE FUNCTION public.get_xp_leaderboard(
  time_period text DEFAULT 'all_time',
  page_limit integer DEFAULT 50,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  rank bigint,
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  level integer,
  total_xp integer,
  follower_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF time_period = 'all_time' THEN
    RETURN QUERY
    SELECT
      ROW_NUMBER() OVER (ORDER BY p.total_xp DESC, p.created_at ASC) as rank,
      p.id as user_id,
      p.username,
      p.full_name,
      p.avatar_url,
      p.level,
      p.total_xp,
      p.follower_count
    FROM public.profiles p
    WHERE p.is_public = true
      AND p.username IS NOT NULL
      AND p.total_xp > 0
    ORDER BY p.total_xp DESC, p.created_at ASC
    LIMIT page_limit OFFSET page_offset;
  ELSIF time_period = 'monthly' THEN
    RETURN QUERY
    SELECT
      ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(af.xp_earned), 0) DESC, p.created_at ASC) as rank,
      p.id as user_id,
      p.username,
      p.full_name,
      p.avatar_url,
      p.level,
      COALESCE(SUM(af.xp_earned), 0)::integer as total_xp,
      p.follower_count
    FROM public.profiles p
    LEFT JOIN public.activity_feed af ON af.user_id = p.id
      AND af.created_at >= date_trunc('month', CURRENT_DATE)
      AND af.xp_earned IS NOT NULL
    WHERE p.is_public = true
      AND p.username IS NOT NULL
    GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.level, p.follower_count, p.created_at
    HAVING COALESCE(SUM(af.xp_earned), 0) > 0
    ORDER BY COALESCE(SUM(af.xp_earned), 0) DESC, p.created_at ASC
    LIMIT page_limit OFFSET page_offset;
  ELSIF time_period = 'weekly' THEN
    RETURN QUERY
    SELECT
      ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(af.xp_earned), 0) DESC, p.created_at ASC) as rank,
      p.id as user_id,
      p.username,
      p.full_name,
      p.avatar_url,
      p.level,
      COALESCE(SUM(af.xp_earned), 0)::integer as total_xp,
      p.follower_count
    FROM public.profiles p
    LEFT JOIN public.activity_feed af ON af.user_id = p.id
      AND af.created_at >= date_trunc('week', CURRENT_DATE)
      AND af.xp_earned IS NOT NULL
    WHERE p.is_public = true
      AND p.username IS NOT NULL
    GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.level, p.follower_count, p.created_at
    HAVING COALESCE(SUM(af.xp_earned), 0) > 0
    ORDER BY COALESCE(SUM(af.xp_earned), 0) DESC, p.created_at ASC
    LIMIT page_limit OFFSET page_offset;
  ELSE
    RAISE EXCEPTION 'Invalid time_period. Use: all_time, monthly, weekly';
  END IF;
END;
$$;

-- get_friends_leaderboard
CREATE OR REPLACE FUNCTION public.get_friends_leaderboard(
  time_period text DEFAULT 'all_time'
)
RETURNS TABLE (
  rank bigint,
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  level integer,
  total_xp integer
)
LANGUAGE plpgsql
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

  IF time_period = 'all_time' THEN
    RETURN QUERY
    WITH friends_and_self AS (
      SELECT v_user_id as friend_id
      UNION
      SELECT following_id as friend_id
      FROM public.follows
      WHERE follower_id = v_user_id
    )
    SELECT
      ROW_NUMBER() OVER (ORDER BY p.total_xp DESC, p.created_at ASC) as rank,
      p.id as user_id,
      p.username,
      p.full_name,
      p.avatar_url,
      p.level,
      p.total_xp
    FROM friends_and_self fas
    JOIN public.profiles p ON p.id = fas.friend_id
    WHERE p.username IS NOT NULL
    ORDER BY p.total_xp DESC, p.created_at ASC;
  ELSIF time_period = 'monthly' THEN
    RETURN QUERY
    WITH friends_and_self AS (
      SELECT v_user_id as friend_id
      UNION
      SELECT following_id as friend_id
      FROM public.follows
      WHERE follower_id = v_user_id
    )
    SELECT
      ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(af.xp_earned), 0) DESC, p.created_at ASC) as rank,
      p.id as user_id,
      p.username,
      p.full_name,
      p.avatar_url,
      p.level,
      COALESCE(SUM(af.xp_earned), 0)::integer as total_xp
    FROM friends_and_self fas
    JOIN public.profiles p ON p.id = fas.friend_id
    LEFT JOIN public.activity_feed af ON af.user_id = p.id
      AND af.created_at >= date_trunc('month', CURRENT_DATE)
      AND af.xp_earned IS NOT NULL
    WHERE p.username IS NOT NULL
    GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.level, p.created_at
    ORDER BY COALESCE(SUM(af.xp_earned), 0) DESC, p.created_at ASC;
  ELSIF time_period = 'weekly' THEN
    RETURN QUERY
    WITH friends_and_self AS (
      SELECT v_user_id as friend_id
      UNION
      SELECT following_id as friend_id
      FROM public.follows
      WHERE follower_id = v_user_id
    )
    SELECT
      ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(af.xp_earned), 0) DESC, p.created_at ASC) as rank,
      p.id as user_id,
      p.username,
      p.full_name,
      p.avatar_url,
      p.level,
      COALESCE(SUM(af.xp_earned), 0)::integer as total_xp
    FROM friends_and_self fas
    JOIN public.profiles p ON p.id = fas.friend_id
    LEFT JOIN public.activity_feed af ON af.user_id = p.id
      AND af.created_at >= date_trunc('week', CURRENT_DATE)
      AND af.xp_earned IS NOT NULL
    WHERE p.username IS NOT NULL
    GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.level, p.created_at
    ORDER BY COALESCE(SUM(af.xp_earned), 0) DESC, p.created_at ASC;
  ELSE
    RAISE EXCEPTION 'Invalid time_period. Use: all_time, monthly, weekly';
  END IF;
END;
$$;

-- get_category_leaderboard
CREATE OR REPLACE FUNCTION public.get_category_leaderboard(
  p_category text,
  page_limit integer DEFAULT 50,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  rank bigint,
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  level integer,
  visit_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC, MIN(v.created_at) ASC) as rank,
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level,
    COUNT(*) as visit_count
  FROM public.visits v
  JOIN public.profiles p ON p.id = v.user_id
  WHERE v.category = p_category
    AND v.status = 'visited'
    AND p.is_public = true
    AND p.username IS NOT NULL
  GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.level
  ORDER BY COUNT(*) DESC, MIN(v.created_at) ASC
  LIMIT page_limit OFFSET page_offset;
END;
$$;

-- ============================================
-- STATS FUNCTIONS
-- ============================================

-- update_place_stats (trigger function)
CREATE OR REPLACE FUNCTION public.update_place_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.category_place_stats (category, place_id, visit_count, bucket_list_count)
    VALUES (
      NEW.category,
      NEW.place_id,
      CASE WHEN NEW.status = 'visited' THEN 1 ELSE 0 END,
      CASE WHEN NEW.status = 'bucketList' THEN 1 ELSE 0 END
    )
    ON CONFLICT (category, place_id) DO UPDATE SET
      visit_count = category_place_stats.visit_count + CASE WHEN NEW.status = 'visited' THEN 1 ELSE 0 END,
      bucket_list_count = category_place_stats.bucket_list_count + CASE WHEN NEW.status = 'bucketList' THEN 1 ELSE 0 END,
      last_updated = now();
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.category_place_stats SET
      visit_count = visit_count - CASE WHEN OLD.status = 'visited' THEN 1 ELSE 0 END,
      bucket_list_count = bucket_list_count - CASE WHEN OLD.status = 'bucketList' THEN 1 ELSE 0 END,
      last_updated = now()
    WHERE category = OLD.category AND place_id = OLD.place_id;
    INSERT INTO public.category_place_stats (category, place_id, visit_count, bucket_list_count)
    VALUES (
      NEW.category,
      NEW.place_id,
      CASE WHEN NEW.status = 'visited' THEN 1 ELSE 0 END,
      CASE WHEN NEW.status = 'bucketList' THEN 1 ELSE 0 END
    )
    ON CONFLICT (category, place_id) DO UPDATE SET
      visit_count = category_place_stats.visit_count + CASE WHEN NEW.status = 'visited' THEN 1 ELSE 0 END,
      bucket_list_count = category_place_stats.bucket_list_count + CASE WHEN NEW.status = 'bucketList' THEN 1 ELSE 0 END,
      last_updated = now();
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.category_place_stats SET
      visit_count = visit_count - CASE WHEN OLD.status = 'visited' THEN 1 ELSE 0 END,
      bucket_list_count = bucket_list_count - CASE WHEN OLD.status = 'bucketList' THEN 1 ELSE 0 END,
      last_updated = now()
    WHERE category = OLD.category AND place_id = OLD.place_id;
    RETURN OLD;
  END IF;
END;
$$;

-- get_category_stats
CREATE OR REPLACE FUNCTION public.get_category_stats(p_category text)
RETURNS TABLE (
  place_id text,
  visit_count integer,
  bucket_list_count integer,
  visit_percentage numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_users integer;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO total_users FROM public.visits;

  IF total_users = 0 THEN
    total_users := 1;
  END IF;

  RETURN QUERY
  SELECT
    s.place_id,
    s.visit_count,
    s.bucket_list_count,
    ROUND((s.visit_count::numeric / total_users) * 100, 1) as visit_percentage
  FROM public.category_place_stats s
  WHERE s.category = p_category
  ORDER BY s.visit_count DESC;
END;
$$;

-- ============================================
-- CHALLENGE FUNCTIONS
-- ============================================

-- get_active_challenges
CREATE OR REPLACE FUNCTION public.get_active_challenges()
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  challenge_type text,
  category text,
  required_count integer,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  badge_icon text,
  badge_name text,
  xp_reward integer,
  days_remaining integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.description,
    c.challenge_type,
    c.category,
    c.required_count,
    c.start_date,
    c.end_date,
    c.badge_icon,
    c.badge_name,
    c.xp_reward,
    CASE
      WHEN c.end_date IS NULL THEN NULL
      ELSE EXTRACT(DAY FROM (c.end_date - now()))::integer
    END as days_remaining
  FROM public.challenges c
  WHERE c.is_active = true
    AND c.is_secret = false
    AND c.start_date <= now()
    AND (c.end_date IS NULL OR c.end_date > now())
  ORDER BY c.end_date ASC NULLS LAST;
END;
$$;

-- check_challenge_progress
CREATE OR REPLACE FUNCTION public.check_challenge_progress(p_user_id uuid, p_category text, p_place_id text, p_visited_at timestamp with time zone)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_challenge RECORD;
  v_year integer;
  v_current_count integer;
BEGIN
  v_year := EXTRACT(YEAR FROM p_visited_at);

  FOR v_challenge IN
    SELECT * FROM public.challenges c
    WHERE c.is_active = true
      AND c.start_date <= p_visited_at
      AND (c.end_date IS NULL OR c.end_date > p_visited_at)
      AND (c.category IS NULL OR c.category = p_category)
      AND (c.target_place_ids IS NULL OR p_place_id = ANY(c.target_place_ids))
  LOOP
    IF v_challenge.challenge_type = 'recurring_yearly' THEN
      IF v_challenge.start_month IS NOT NULL AND v_challenge.end_month IS NOT NULL THEN
        IF v_challenge.start_month <= v_challenge.end_month THEN
          IF EXTRACT(MONTH FROM p_visited_at) < v_challenge.start_month OR
             EXTRACT(MONTH FROM p_visited_at) > v_challenge.end_month THEN
            CONTINUE;
          END IF;
        ELSE
          IF EXTRACT(MONTH FROM p_visited_at) < v_challenge.start_month AND
             EXTRACT(MONTH FROM p_visited_at) > v_challenge.end_month THEN
            CONTINUE;
          END IF;
        END IF;
      END IF;
    ELSE
      v_year := NULL;
    END IF;

    INSERT INTO public.user_challenges (user_id, challenge_id, challenge_year, current_count)
    VALUES (p_user_id, v_challenge.id, v_year, 1)
    ON CONFLICT (user_id, challenge_id, challenge_year) DO UPDATE SET
      current_count = user_challenges.current_count + 1,
      completed_at = CASE
        WHEN user_challenges.current_count + 1 >= v_challenge.required_count AND user_challenges.completed_at IS NULL
        THEN now()
        ELSE user_challenges.completed_at
      END,
      updated_at = now();
  END LOOP;
END;
$$;

-- ============================================
-- STREAK FUNCTIONS
-- ============================================

-- record_user_activity
CREATE OR REPLACE FUNCTION public.record_user_activity(p_activity_type text DEFAULT 'login')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_today date;
  v_yesterday date;
  v_current_streak integer;
  v_longest_streak integer;
  v_last_date date;
  v_result jsonb;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  v_today := CURRENT_DATE;
  v_yesterday := v_today - interval '1 day';

  INSERT INTO public.user_activity (user_id, activity_date, logged_in, made_selection)
  VALUES (
    v_user_id,
    v_today,
    p_activity_type = 'login',
    p_activity_type = 'selection'
  )
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    logged_in = user_activity.logged_in OR (p_activity_type = 'login'),
    made_selection = user_activity.made_selection OR (p_activity_type = 'selection'),
    updated_at = now();

  SELECT current_login_streak, longest_login_streak, last_login_date
  INTO v_current_streak, v_longest_streak, v_last_date
  FROM public.user_streaks
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (user_id, current_login_streak, longest_login_streak, last_login_date)
    VALUES (v_user_id, 1, 1, v_today);
    v_current_streak := 1;
    v_longest_streak := 1;
  ELSIF v_last_date = v_today THEN
    NULL;
  ELSIF v_last_date = v_yesterday THEN
    v_current_streak := v_current_streak + 1;
    IF v_current_streak > v_longest_streak THEN
      v_longest_streak := v_current_streak;
    END IF;
    UPDATE public.user_streaks SET
      current_login_streak = v_current_streak,
      longest_login_streak = v_longest_streak,
      last_login_date = v_today,
      updated_at = now()
    WHERE user_id = v_user_id;
  ELSE
    v_current_streak := 1;
    UPDATE public.user_streaks SET
      current_login_streak = 1,
      last_login_date = v_today,
      updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'current_streak', v_current_streak,
    'longest_streak', v_longest_streak,
    'last_date', v_last_date
  );
END;
$$;

-- get_user_streaks
CREATE OR REPLACE FUNCTION public.get_user_streaks()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_result jsonb;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  SELECT jsonb_build_object(
    'current_login_streak', COALESCE(current_login_streak, 0),
    'longest_login_streak', COALESCE(longest_login_streak, 0),
    'last_login_date', last_login_date,
    'current_season_streak', COALESCE(current_season_streak, 0),
    'longest_season_streak', COALESCE(longest_season_streak, 0),
    'monthly_visits', COALESCE(monthly_visits, '{}'::jsonb)
  ) INTO v_result
  FROM public.user_streaks
  WHERE user_id = v_user_id;

  IF v_result IS NULL THEN
    RETURN jsonb_build_object(
      'current_login_streak', 0,
      'longest_login_streak', 0,
      'last_login_date', null,
      'current_season_streak', 0,
      'longest_season_streak', 0,
      'monthly_visits', '{}'::jsonb
    );
  END IF;

  RETURN v_result;
END;
$$;

-- ============================================
-- SYNC FUNCTIONS
-- ============================================

-- sync_visits_from_jsonb
CREATE OR REPLACE FUNCTION public.sync_visits_from_jsonb()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user RECORD;
  v_category text;
  v_item RECORD;
  v_count integer := 0;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can run this function';
  END IF;

  FOR v_user IN SELECT user_id, selections FROM public.user_selections LOOP
    FOR v_category IN SELECT jsonb_object_keys(v_user.selections) LOOP
      FOR v_item IN
        SELECT
          elem->>'id' as id,
          elem->>'status' as status,
          to_timestamp((elem->>'updatedAt')::bigint / 1000) as updated_at
        FROM jsonb_array_elements(v_user.selections->v_category) elem
        WHERE elem->>'deleted' IS NULL OR (elem->>'deleted')::boolean = false
      LOOP
        IF v_item.status IN ('visited', 'bucketList') THEN
          INSERT INTO public.visits (user_id, category, place_id, status, visited_at)
          VALUES (
            v_user.user_id,
            v_category,
            v_item.id,
            v_item.status,
            COALESCE(v_item.updated_at, now())
          )
          ON CONFLICT (user_id, category, place_id) DO UPDATE SET
            status = EXCLUDED.status,
            visited_at = COALESCE(EXCLUDED.visited_at, visits.visited_at),
            updated_at = now();
          v_count := v_count + 1;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;

  RETURN v_count;
END;
$$;

-- cleanup_old_activities
CREATE OR REPLACE FUNCTION public.cleanup_old_activities()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can run this function';
  END IF;

  DELETE FROM public.activity_feed
  WHERE created_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant execute permissions on all functions
GRANT EXECUTE ON FUNCTION public.is_username_available(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_level(integer) TO anon, authenticated;
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
GRANT EXECUTE ON FUNCTION public.get_xp_leaderboard(text, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_friends_leaderboard(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_category_leaderboard(text, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_category_stats(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_challenges() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_user_activity(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_streaks() TO authenticated;
GRANT EXECUTE ON FUNCTION public.sync_visits_from_jsonb() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_activities() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_suspended(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_status(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_social_handle(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_website_url(text) TO anon, authenticated;
