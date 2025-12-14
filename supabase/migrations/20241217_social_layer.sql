-- ============================================
-- Social Layer: Follows, Activity Feed, Leaderboards
-- ============================================
-- This migration adds:
-- 1. Follows table for user-to-user following
-- 2. Activity feed functions for friends/global discovery
-- 3. Leaderboard functions for competition
-- ============================================

-- ============================================
-- 1. FOLLOWS TABLE
-- ============================================
-- Simple follow system: follower_id follows following_id

CREATE TABLE IF NOT EXISTS public.follows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Prevent self-follows and duplicate follows
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own follows" ON public.follows;
DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;

-- Users can view follows where they are involved or for public profiles
CREATE POLICY "Users can view own follows"
  ON public.follows FOR SELECT
  USING (
    auth.uid() = follower_id OR
    auth.uid() = following_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = follows.following_id
      AND profiles.is_public = true
    )
  );

-- Users can only insert their own follows
CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can only delete their own follows (unfollow)
CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS follows_follower_id_idx ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS follows_following_id_idx ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS follows_created_at_idx ON public.follows(created_at DESC);

-- ============================================
-- 2. FOLLOW COUNTS (Cached for Performance)
-- ============================================
-- Add columns to profiles for cached follower/following counts

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS follower_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count integer DEFAULT 0;

-- Trigger function to update follower/following counts
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment following count for follower
    UPDATE public.profiles
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;
    -- Increment follower count for following
    UPDATE public.profiles
    SET follower_count = follower_count + 1
    WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement following count for follower
    UPDATE public.profiles
    SET following_count = GREATEST(0, following_count - 1)
    WHERE id = OLD.follower_id;
    -- Decrement follower count for following
    UPDATE public.profiles
    SET follower_count = GREATEST(0, follower_count - 1)
    WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for follow counts
DROP TRIGGER IF EXISTS on_follow_insert ON public.follows;
CREATE TRIGGER on_follow_insert
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_follow_counts();

DROP TRIGGER IF EXISTS on_follow_delete ON public.follows;
CREATE TRIGGER on_follow_delete
  AFTER DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_follow_counts();

-- ============================================
-- 3. FOLLOW RPC FUNCTIONS
-- ============================================

-- Function to follow a user
CREATE OR REPLACE FUNCTION public.follow_user(target_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_target_public boolean;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  IF v_user_id = target_user_id THEN
    RETURN jsonb_build_object('error', 'Cannot follow yourself');
  END IF;

  -- Check if target user exists and is public
  SELECT is_public INTO v_target_public
  FROM public.profiles
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'User not found');
  END IF;

  IF NOT v_target_public THEN
    RETURN jsonb_build_object('error', 'Cannot follow private profiles');
  END IF;

  -- Insert follow
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (v_user_id, target_user_id)
  ON CONFLICT (follower_id, following_id) DO NOTHING;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.follow_user(uuid) TO authenticated;

-- Function to unfollow a user
CREATE OR REPLACE FUNCTION public.unfollow_user(target_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  DELETE FROM public.follows
  WHERE follower_id = v_user_id AND following_id = target_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.unfollow_user(uuid) TO authenticated;

-- Function to check if current user follows a target
CREATE OR REPLACE FUNCTION public.is_following(target_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.follows
    WHERE follower_id = auth.uid()
    AND following_id = target_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_following(uuid) TO authenticated;

-- Function to get followers list
CREATE OR REPLACE FUNCTION public.get_followers(target_user_id uuid, page_limit integer DEFAULT 20, page_offset integer DEFAULT 0)
RETURNS TABLE (
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  level integer,
  total_xp integer,
  followed_at timestamp with time zone,
  is_following_back boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level,
    p.total_xp,
    f.created_at as followed_at,
    EXISTS (
      SELECT 1 FROM public.follows f2
      WHERE f2.follower_id = target_user_id
      AND f2.following_id = p.id
    ) as is_following_back
  FROM public.follows f
  JOIN public.profiles p ON p.id = f.follower_id
  WHERE f.following_id = target_user_id
    AND p.is_public = true
  ORDER BY f.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_followers(uuid, integer, integer) TO authenticated, anon;

-- Function to get following list
CREATE OR REPLACE FUNCTION public.get_following(target_user_id uuid, page_limit integer DEFAULT 20, page_offset integer DEFAULT 0)
RETURNS TABLE (
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  level integer,
  total_xp integer,
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
    p.total_xp,
    f.created_at as followed_at
  FROM public.follows f
  JOIN public.profiles p ON p.id = f.following_id
  WHERE f.follower_id = target_user_id
    AND p.is_public = true
  ORDER BY f.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_following(uuid, integer, integer) TO authenticated, anon;

-- ============================================
-- 4. ACTIVITY FEED SYSTEM
-- ============================================

-- Activity types that generate feed events
CREATE TYPE activity_type AS ENUM (
  'visit',           -- User visited a place
  'achievement',     -- User unlocked an achievement
  'level_up',        -- User reached a new level
  'challenge_complete', -- User completed a challenge
  'started_tracking' -- User started tracking a new category
);

-- Activity feed table for storing events
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  -- Flexible metadata for different activity types
  category text,
  place_id text,
  place_name text,
  achievement_id text,
  achievement_name text,
  old_level integer,
  new_level integer,
  challenge_id uuid,
  challenge_name text,
  xp_earned integer,
  -- Timestamps
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view relevant activities" ON public.activity_feed;
DROP POLICY IF EXISTS "Users can create own activities" ON public.activity_feed;

-- Users can view activities from people they follow or public profiles
CREATE POLICY "Users can view relevant activities"
  ON public.activity_feed FOR SELECT
  USING (
    -- Own activities
    auth.uid() = user_id OR
    -- Activities from followed users
    EXISTS (
      SELECT 1 FROM public.follows f
      JOIN public.profiles p ON p.id = activity_feed.user_id
      WHERE f.follower_id = auth.uid()
      AND f.following_id = activity_feed.user_id
      AND p.is_public = true
    ) OR
    -- Activities from any public profile (for global feed)
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = activity_feed.user_id
      AND profiles.is_public = true
    )
  );

-- Users can insert their own activities
CREATE POLICY "Users can create own activities"
  ON public.activity_feed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for feed queries
CREATE INDEX IF NOT EXISTS activity_feed_user_id_idx ON public.activity_feed(user_id);
CREATE INDEX IF NOT EXISTS activity_feed_created_at_idx ON public.activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS activity_feed_type_idx ON public.activity_feed(activity_type);
CREATE INDEX IF NOT EXISTS activity_feed_user_created_idx ON public.activity_feed(user_id, created_at DESC);

-- Function to get friends activity feed
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
  created_at timestamp with time zone
) AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT
    af.id,
    af.user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level as user_level,
    af.activity_type,
    af.category,
    af.place_id,
    af.place_name,
    af.achievement_id,
    af.achievement_name,
    af.old_level,
    af.new_level,
    af.challenge_name,
    af.xp_earned,
    af.created_at
  FROM public.activity_feed af
  JOIN public.profiles p ON p.id = af.user_id
  WHERE (
    -- Activities from followed users
    EXISTS (
      SELECT 1 FROM public.follows f
      WHERE f.follower_id = v_user_id
      AND f.following_id = af.user_id
    )
  )
  AND p.is_public = true
  ORDER BY af.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_friends_activity_feed(integer, integer) TO authenticated;

-- Function to get global discovery feed (recent activities from any public profile)
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
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    af.id,
    af.user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level as user_level,
    af.activity_type,
    af.category,
    af.place_id,
    af.place_name,
    af.achievement_id,
    af.achievement_name,
    af.old_level,
    af.new_level,
    af.challenge_name,
    af.xp_earned,
    af.created_at
  FROM public.activity_feed af
  JOIN public.profiles p ON p.id = af.user_id
  WHERE p.is_public = true
    AND (filter_type IS NULL OR af.activity_type = filter_type)
  ORDER BY af.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_global_activity_feed(integer, integer, text) TO anon, authenticated;

-- Function to record an activity
CREATE OR REPLACE FUNCTION public.record_activity(
  p_activity_type text,
  p_category text DEFAULT NULL,
  p_place_id text DEFAULT NULL,
  p_place_name text DEFAULT NULL,
  p_achievement_id text DEFAULT NULL,
  p_achievement_name text DEFAULT NULL,
  p_old_level integer DEFAULT NULL,
  p_new_level integer DEFAULT NULL,
  p_challenge_id uuid DEFAULT NULL,
  p_challenge_name text DEFAULT NULL,
  p_xp_earned integer DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_user_id uuid;
  v_activity_id uuid;
  v_is_public boolean;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Only record activities for public profiles
  SELECT is_public INTO v_is_public
  FROM public.profiles
  WHERE id = v_user_id;

  IF NOT v_is_public THEN
    -- Still return a uuid but don't create an activity
    RETURN gen_random_uuid();
  END IF;

  INSERT INTO public.activity_feed (
    user_id,
    activity_type,
    category,
    place_id,
    place_name,
    achievement_id,
    achievement_name,
    old_level,
    new_level,
    challenge_id,
    challenge_name,
    xp_earned
  )
  VALUES (
    v_user_id,
    p_activity_type,
    p_category,
    p_place_id,
    p_place_name,
    p_achievement_id,
    p_achievement_name,
    p_old_level,
    p_new_level,
    p_challenge_id,
    p_challenge_name,
    p_xp_earned
  )
  RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.record_activity(text, text, text, text, text, text, integer, integer, uuid, text, integer) TO authenticated;

-- ============================================
-- 5. LEADERBOARD SYSTEM
-- ============================================

-- Function to get global XP leaderboard
CREATE OR REPLACE FUNCTION public.get_xp_leaderboard(
  time_period text DEFAULT 'all_time', -- 'all_time', 'monthly', 'weekly'
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
) AS $$
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
    -- Monthly: XP earned from activities this month
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
    -- Weekly: XP earned from activities this week
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_xp_leaderboard(text, integer, integer) TO anon, authenticated;

-- Function to get friends leaderboard
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
) AS $$
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
      -- Include self
      SELECT v_user_id as friend_id
      UNION
      -- Include all followed users
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_friends_leaderboard(text) TO authenticated;

-- Function to get user's rank on global leaderboard
CREATE OR REPLACE FUNCTION public.get_user_rank(target_user_id uuid DEFAULT NULL)
RETURNS TABLE (
  global_rank bigint,
  total_players bigint,
  percentile numeric
) AS $$
DECLARE
  v_user_id uuid;
  v_total_xp integer;
  v_rank bigint;
  v_total bigint;
BEGIN
  v_user_id := COALESCE(target_user_id, auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not specified';
  END IF;

  -- Get user's XP
  SELECT p.total_xp INTO v_total_xp
  FROM public.profiles p
  WHERE p.id = v_user_id;

  -- Get total public profiles with XP
  SELECT COUNT(*) INTO v_total
  FROM public.profiles
  WHERE is_public = true
    AND username IS NOT NULL
    AND total_xp > 0;

  -- Get user's rank
  SELECT COUNT(*) + 1 INTO v_rank
  FROM public.profiles
  WHERE is_public = true
    AND username IS NOT NULL
    AND total_xp > COALESCE(v_total_xp, 0);

  RETURN QUERY
  SELECT
    v_rank as global_rank,
    v_total as total_players,
    CASE
      WHEN v_total > 0 THEN ROUND(((v_total - v_rank + 1)::numeric / v_total) * 100, 1)
      ELSE 100.0
    END as percentile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_user_rank(uuid) TO anon, authenticated;

-- Function to get category-specific leaderboard
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
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_category_leaderboard(text, integer, integer) TO anon, authenticated;

-- ============================================
-- 6. UPDATE get_public_profile TO INCLUDE SOCIAL DATA
-- ============================================

-- Drop and recreate to add new columns
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
  follower_count integer,
  following_count integer,
  created_at timestamp with time zone,
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
    p.total_xp,
    p.level,
    p.follower_count,
    p.following_count,
    p.created_at,
    CASE
      WHEN auth.uid() IS NOT NULL THEN
        EXISTS (
          SELECT 1 FROM public.follows f
          WHERE f.follower_id = auth.uid()
          AND f.following_id = p.id
        )
      ELSE false
    END as is_following
  FROM public.profiles p
  WHERE lower(p.username) = lower(profile_username)
  AND p.is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_public_profile(text) TO anon, authenticated;

-- ============================================
-- 7. CLEANUP OLD ACTIVITIES (Optional scheduled job)
-- ============================================

-- Function to cleanup old activity feed entries (keep last 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_activities()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Only admins can run this
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can run this function';
  END IF;

  DELETE FROM public.activity_feed
  WHERE created_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.cleanup_old_activities() TO authenticated;

-- ============================================
-- 8. INDEX FOR PUBLIC PROFILE SEARCHES
-- ============================================

-- Index for searching public profiles by username
CREATE INDEX IF NOT EXISTS profiles_public_username_idx
  ON public.profiles(lower(username))
  WHERE is_public = true AND username IS NOT NULL;

-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS profiles_public_xp_idx
  ON public.profiles(total_xp DESC)
  WHERE is_public = true AND username IS NOT NULL AND total_xp > 0;

COMMENT ON TABLE public.follows IS 'Stores user follow relationships for the social layer';
COMMENT ON TABLE public.activity_feed IS 'Stores activity events for friends and global discovery feeds';
COMMENT ON FUNCTION public.get_friends_activity_feed IS 'Returns recent activities from users the current user follows';
COMMENT ON FUNCTION public.get_global_activity_feed IS 'Returns recent activities from all public profiles for discovery';
COMMENT ON FUNCTION public.get_xp_leaderboard IS 'Returns global XP leaderboard with time period filtering';
COMMENT ON FUNCTION public.get_friends_leaderboard IS 'Returns leaderboard of friends (followed users) and self';
