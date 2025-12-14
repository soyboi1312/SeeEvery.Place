-- ============================================
-- Notifications System
-- ============================================
-- This migration adds:
-- 1. Notifications table for user alerts
-- 2. Trigger to create notification on new follow
-- 3. Policy for users to remove their own followers
-- ============================================

-- ============================================
-- 1. NOTIFICATIONS TABLE
-- ============================================

-- Type is extensible text field - no CHECK constraint for OCP compliance
-- Currently supported: 'follow' (more types can be added without schema changes)
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_username text,
  actor_avatar_url text,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can mark their notifications as read
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Allow inserts via triggers/service role (no direct user inserts)
CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_user_unread_idx ON public.notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

-- ============================================
-- 2. FOLLOW NOTIFICATION TRIGGER
-- ============================================

-- Function to create notification when someone follows a user
CREATE OR REPLACE FUNCTION public.handle_new_follow()
RETURNS trigger AS $$
DECLARE
  follower_profile RECORD;
BEGIN
  -- Get follower's profile info
  SELECT username, avatar_url, full_name
  INTO follower_profile
  FROM public.profiles
  WHERE id = NEW.follower_id;

  -- Create notification for the followed user
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_new_follow ON public.follows;

-- Create trigger for new follows
CREATE TRIGGER on_new_follow
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_follow();

-- ============================================
-- 3. REMOVE FOLLOWER POLICY
-- ============================================
-- Allow users to remove followers (delete follows where they are the following_id)

DROP POLICY IF EXISTS "Users can remove followers" ON public.follows;

CREATE POLICY "Users can remove followers"
  ON public.follows FOR DELETE
  USING (auth.uid() = following_id);

-- ============================================
-- 4. USER SEARCH FUNCTION
-- ============================================

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

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.search_users(text, integer, integer) TO authenticated;

-- ============================================
-- 5. GET NOTIFICATIONS FUNCTION
-- ============================================

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
  WHERE
    n.user_id = auth.uid()
    AND (NOT unread_only OR n.read = false)
  ORDER BY n.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_notifications(integer, integer, boolean) TO authenticated;

-- ============================================
-- 6. GET UNREAD COUNT FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM public.notifications
    WHERE user_id = auth.uid() AND read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO authenticated;

-- ============================================
-- 7. MARK NOTIFICATIONS READ FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.mark_notifications_read(
  notification_ids uuid[] DEFAULT NULL
)
RETURNS integer AS $$
DECLARE
  updated_count integer;
BEGIN
  IF notification_ids IS NULL THEN
    -- Mark all as read
    UPDATE public.notifications
    SET read = true
    WHERE user_id = auth.uid() AND read = false;
  ELSE
    -- Mark specific ones as read
    UPDATE public.notifications
    SET read = true
    WHERE user_id = auth.uid() AND id = ANY(notification_ids) AND read = false;
  END IF;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.mark_notifications_read(uuid[]) TO authenticated;

-- ============================================
-- 8. COMMENTS
-- ============================================

COMMENT ON TABLE public.notifications IS 'User notifications for follows, achievements, and milestones';
COMMENT ON FUNCTION public.handle_new_follow IS 'Creates a notification when a user gains a new follower';
COMMENT ON FUNCTION public.search_users IS 'Search for public users by username or full name';
COMMENT ON FUNCTION public.get_notifications IS 'Get paginated notifications for the current user';
COMMENT ON FUNCTION public.get_unread_notification_count IS 'Get count of unread notifications for current user';
COMMENT ON FUNCTION public.mark_notifications_read IS 'Mark notifications as read for current user';
