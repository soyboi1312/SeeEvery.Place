-- Security Fixes Migration
-- Addresses multiple vulnerabilities identified in security review
-- Date: 2026-03-04

-- ============================================
-- CRITICAL: Fix newsletter_send_logs RLS policy
-- ============================================
-- The "Service role can manage send logs" policy uses FOR ALL WITH CHECK (true),
-- allowing ANY user to read/write/delete send log records.
-- Service role bypasses RLS, so no explicit policy is needed.

DROP POLICY IF EXISTS "Service role can manage send logs" ON public.newsletter_send_logs;


-- ============================================
-- HIGH: Remove user_achievements direct INSERT policy
-- ============================================
-- Users can insert arbitrary achievement records for themselves,
-- bypassing server-side validation. Achievements should only be
-- created by SECURITY DEFINER functions or service_role.

DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;


-- ============================================
-- HIGH: Remove user_challenges direct INSERT/UPDATE policies
-- ============================================
-- Users can insert completed challenge records or manipulate
-- current_count/completed_at. Let check_challenge_progress() handle mutations.

DROP POLICY IF EXISTS "Users can insert own challenge progress" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can update own challenge progress" ON public.user_challenges;


-- ============================================
-- HIGH: Remove user_streaks direct INSERT/UPDATE policies
-- ============================================
-- Users can manipulate login streaks directly.
-- Only allow mutations through SECURITY DEFINER functions.

DROP POLICY IF EXISTS "Users can insert own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update own streaks" ON public.user_streaks;


-- ============================================
-- HIGH: Remove user_activity direct INSERT/UPDATE policies
-- ============================================
-- Users can manipulate activity records directly.
-- Only allow mutations through record_user_activity() SECURITY DEFINER function.

DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can update own activity" ON public.user_activity;


-- ============================================
-- MEDIUM: Fix search_users LIKE wildcard injection
-- ============================================
-- Escape LIKE wildcards (%, _) in search input to prevent pattern manipulation.
-- Must drop first because we're replacing the function with the same signature.

DROP FUNCTION IF EXISTS public.search_users(text, integer, integer);

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
DECLARE
  sanitized_query text;
BEGIN
  -- Escape LIKE wildcards to prevent pattern injection
  sanitized_query := replace(replace(replace(search_query, '\', '\\'), '%', '\%'), '_', '\_');

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
  WHERE p.is_public = true
    AND p.username IS NOT NULL
    AND (
      p.username ILIKE '%' || sanitized_query || '%'
      OR p.full_name ILIKE '%' || sanitized_query || '%'
    )
  ORDER BY
    CASE WHEN p.username ILIKE sanitized_query THEN 0
         WHEN p.username ILIKE sanitized_query || '%' THEN 1
         ELSE 2
    END,
    p.username
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;

-- Re-grant execute permission after dropping/recreating
GRANT EXECUTE ON FUNCTION public.search_users(text, integer, integer) TO authenticated;


-- ============================================
-- MEDIUM: Add authorization check to get_user_status
-- ============================================
-- Any authenticated user could check if any other user is suspended.
-- Now restricted to own status or admin access.
-- Must drop first because we cannot change return type of existing function.

-- Use CASCADE to handle any dependent objects, and drop all overloads
DO $$ BEGIN
  DROP FUNCTION IF EXISTS public.get_user_status(uuid) CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE FUNCTION public.get_user_status(p_user_id uuid)
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
  -- Only allow users to check their own status or admins to check anyone
  IF auth.uid() != p_user_id AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized to view this user status';
  END IF;

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

-- Re-grant execute permission after dropping/recreating
GRANT EXECUTE ON FUNCTION public.get_user_status(uuid) TO authenticated;


-- ============================================
-- LOW: Add SET search_path to vote trigger functions
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_vote_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.suggestions
  SET vote_count = vote_count + 1, updated_at = now()
  WHERE id = new.suggestion_id;
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_vote_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.suggestions
  SET vote_count = vote_count - 1, updated_at = now()
  WHERE id = old.suggestion_id;
  RETURN old;
END;
$$;


-- ============================================
-- LOW: Add SET search_path to handle_updated_at
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;


-- ============================================
-- LOW: Validate handle_new_user OAuth data
-- ============================================
-- Add length constraints and URL validation for OAuth-provided data.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_full_name text;
  v_avatar_url text;
BEGIN
  -- Extract and validate full_name (max 100 chars, strip HTML tags)
  v_full_name := left(new.raw_user_meta_data->>'full_name', 100);
  IF v_full_name IS NOT NULL THEN
    v_full_name := regexp_replace(v_full_name, '<[^>]*>', '', 'g');
  END IF;

  -- Extract and validate avatar_url (must be https://, max 500 chars)
  v_avatar_url := new.raw_user_meta_data->>'avatar_url';
  IF v_avatar_url IS NOT NULL THEN
    v_avatar_url := left(v_avatar_url, 500);
    IF v_avatar_url !~ '^https://' THEN
      v_avatar_url := NULL;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    v_full_name,
    v_avatar_url
  );
  RETURN new;
END;
$$;
