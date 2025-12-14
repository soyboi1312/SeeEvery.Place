-- ============================================
-- Fix Function Search Paths
-- ============================================
-- Adds SET search_path = public to all functions that are missing it
-- This prevents search_path injection attacks
-- ============================================

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

-- update_user_level
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

-- update_follow_counts
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

-- handle_updated_at
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

-- handle_new_user
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

-- handle_new_follow
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

-- is_admin (recreate with search_path)
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

-- Note: Some complex functions like leaderboards, activity feeds, etc.
-- were already fixed in 20241220_fix_function_search_paths.sql
-- Only adding the ones that were missed or newly created
