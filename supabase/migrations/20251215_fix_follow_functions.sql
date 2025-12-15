-- ============================================
-- Fix Follow Functions
-- ============================================
-- This migration:
-- 1. Fixes follow_user and unfollow_user to return jsonb with proper error handling
-- 2. Updates get_followers to return is_following consistently
-- 3. Ensures proper search_path for all follow-related functions
-- ============================================

-- Drop and recreate follow_user with jsonb return type
DROP FUNCTION IF EXISTS public.follow_user(uuid);

CREATE OR REPLACE FUNCTION public.follow_user(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  -- Insert follow (ignore if already following)
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (v_user_id, target_user_id)
  ON CONFLICT (follower_id, following_id) DO NOTHING;

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.follow_user(uuid) TO authenticated;

-- Drop and recreate unfollow_user with jsonb return type
DROP FUNCTION IF EXISTS public.unfollow_user(uuid);

CREATE OR REPLACE FUNCTION public.unfollow_user(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

GRANT EXECUTE ON FUNCTION public.unfollow_user(uuid) TO authenticated;

-- Update get_followers to return is_following field (consistent naming)
DROP FUNCTION IF EXISTS public.get_followers(uuid, integer, integer);

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
  total_xp integer,
  followed_at timestamp with time zone,
  is_following boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_user uuid;
BEGIN
  v_current_user := auth.uid();

  RETURN QUERY
  SELECT
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level,
    COALESCE(p.total_xp, 0) as total_xp,
    f.created_at as followed_at,
    CASE
      WHEN v_current_user IS NULL THEN false
      ELSE EXISTS (
        SELECT 1 FROM public.follows f2
        WHERE f2.follower_id = v_current_user AND f2.following_id = p.id
      )
    END as is_following
  FROM public.follows f
  JOIN public.profiles p ON p.id = f.follower_id
  WHERE f.following_id = target_user_id
    AND p.is_public = true
  ORDER BY f.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_followers(uuid, integer, integer) TO anon, authenticated;

-- Update get_following similarly
DROP FUNCTION IF EXISTS public.get_following(uuid, integer, integer);

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
  total_xp integer,
  followed_at timestamp with time zone,
  is_following boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_user uuid;
BEGIN
  v_current_user := auth.uid();

  RETURN QUERY
  SELECT
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.level,
    COALESCE(p.total_xp, 0) as total_xp,
    f.created_at as followed_at,
    CASE
      WHEN v_current_user IS NULL THEN false
      ELSE EXISTS (
        SELECT 1 FROM public.follows f2
        WHERE f2.follower_id = v_current_user AND f2.following_id = p.id
      )
    END as is_following
  FROM public.follows f
  JOIN public.profiles p ON p.id = f.following_id
  WHERE f.follower_id = target_user_id
    AND p.is_public = true
  ORDER BY f.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_following(uuid, integer, integer) TO anon, authenticated;

-- Update is_following function
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

GRANT EXECUTE ON FUNCTION public.is_following(uuid) TO authenticated;
