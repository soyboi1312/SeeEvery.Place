-- ============================================
-- Social Features V2: Reactions, Bucket List, Enhanced Notifications, Profile Comparison
-- ============================================
-- This migration adds:
-- 1. Activity reactions (Kudos/Stamps) system
-- 2. Bucket list feed events
-- 3. Enhanced notification triggers (reaction received, bucket list alerts)
-- 4. Profile comparison function
-- 5. Mutual bucket list matching
-- ============================================

-- ============================================
-- 1. ACTIVITY REACTIONS TABLE
-- ============================================
-- Simple "kudos" system - one reaction per user per activity

CREATE TABLE IF NOT EXISTS public.activity_reactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id uuid REFERENCES public.activity_feed(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- One reaction per user per activity
  UNIQUE(activity_id, user_id)
);

-- Enable RLS
ALTER TABLE public.activity_reactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view reactions" ON public.activity_reactions;
DROP POLICY IF EXISTS "Users can add reactions" ON public.activity_reactions;
DROP POLICY IF EXISTS "Users can remove own reactions" ON public.activity_reactions;

-- Anyone can view reactions on public activities
CREATE POLICY "Users can view reactions"
  ON public.activity_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activity_feed af
      JOIN public.profiles p ON p.id = af.user_id
      WHERE af.id = activity_reactions.activity_id
      AND p.is_public = true
    )
  );

-- Authenticated users can add reactions
CREATE POLICY "Users can add reactions"
  ON public.activity_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own reactions
CREATE POLICY "Users can remove own reactions"
  ON public.activity_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS activity_reactions_activity_id_idx ON public.activity_reactions(activity_id);
CREATE INDEX IF NOT EXISTS activity_reactions_user_id_idx ON public.activity_reactions(user_id);
CREATE INDEX IF NOT EXISTS activity_reactions_created_at_idx ON public.activity_reactions(created_at DESC);

-- Add reaction count to activity feed for efficient display
ALTER TABLE public.activity_feed
ADD COLUMN IF NOT EXISTS reaction_count integer DEFAULT 0;

-- ============================================
-- 2. REACTION COUNT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.update_reaction_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.activity_feed
    SET reaction_count = reaction_count + 1
    WHERE id = NEW.activity_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.activity_feed
    SET reaction_count = GREATEST(0, reaction_count - 1)
    WHERE id = OLD.activity_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_reaction_insert ON public.activity_reactions;
CREATE TRIGGER on_reaction_insert
  AFTER INSERT ON public.activity_reactions
  FOR EACH ROW EXECUTE FUNCTION public.update_reaction_count();

DROP TRIGGER IF EXISTS on_reaction_delete ON public.activity_reactions;
CREATE TRIGGER on_reaction_delete
  AFTER DELETE ON public.activity_reactions
  FOR EACH ROW EXECUTE FUNCTION public.update_reaction_count();

-- ============================================
-- 3. REACTION RPC FUNCTIONS
-- ============================================

-- Toggle reaction on an activity (add if not exists, remove if exists)
CREATE OR REPLACE FUNCTION public.toggle_activity_reaction(p_activity_id uuid)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_existing_id uuid;
  v_activity_owner_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  -- Check if activity exists and is from a public profile
  SELECT af.user_id INTO v_activity_owner_id
  FROM public.activity_feed af
  JOIN public.profiles p ON p.id = af.user_id
  WHERE af.id = p_activity_id AND p.is_public = true;

  IF v_activity_owner_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Activity not found');
  END IF;

  -- Check if user already reacted
  SELECT id INTO v_existing_id
  FROM public.activity_reactions
  WHERE activity_id = p_activity_id AND user_id = v_user_id;

  IF v_existing_id IS NOT NULL THEN
    -- Remove reaction
    DELETE FROM public.activity_reactions WHERE id = v_existing_id;
    RETURN jsonb_build_object('success', true, 'action', 'removed');
  ELSE
    -- Add reaction
    INSERT INTO public.activity_reactions (activity_id, user_id)
    VALUES (p_activity_id, v_user_id);
    RETURN jsonb_build_object('success', true, 'action', 'added');
  END IF;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.toggle_activity_reaction(uuid) TO authenticated;

-- Check if current user has reacted to an activity
CREATE OR REPLACE FUNCTION public.has_reacted(p_activity_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.activity_reactions
    WHERE activity_id = p_activity_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.has_reacted(uuid) TO authenticated;

-- Get reactions for an activity with user info
CREATE OR REPLACE FUNCTION public.get_activity_reactions(
  p_activity_id uuid,
  page_limit integer DEFAULT 20,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  reacted_at timestamp with time zone
)
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
    ar.created_at as reacted_at
  FROM public.activity_reactions ar
  JOIN public.profiles p ON p.id = ar.user_id
  WHERE ar.activity_id = p_activity_id
    AND p.is_public = true
  ORDER BY ar.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.get_activity_reactions(uuid, integer, integer) TO authenticated, anon;

-- ============================================
-- 4. REACTION NOTIFICATION TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_reaction()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reactor_profile RECORD;
  activity_owner_id uuid;
  activity_info RECORD;
BEGIN
  -- Get the activity owner
  SELECT af.user_id, af.activity_type, af.place_name, af.achievement_name
  INTO activity_info
  FROM public.activity_feed af
  WHERE af.id = NEW.activity_id;

  activity_owner_id := activity_info.user_id;

  -- Don't notify if reacting to own activity
  IF activity_owner_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get reactor's profile
  SELECT username, avatar_url, full_name
  INTO reactor_profile
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Create notification
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
    activity_owner_id,
    'reaction',
    'New kudos!',
    COALESCE(reactor_profile.username, reactor_profile.full_name, 'Someone') ||
    ' gave kudos to your ' ||
    CASE activity_info.activity_type
      WHEN 'visit' THEN 'visit to ' || COALESCE(activity_info.place_name, 'a place')
      WHEN 'achievement' THEN 'achievement "' || COALESCE(activity_info.achievement_name, 'Unknown') || '"'
      WHEN 'level_up' THEN 'level up'
      ELSE 'activity'
    END,
    NEW.user_id,
    reactor_profile.username,
    reactor_profile.avatar_url,
    jsonb_build_object('activity_id', NEW.activity_id)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_new_reaction ON public.activity_reactions;
CREATE TRIGGER on_new_reaction
  AFTER INSERT ON public.activity_reactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_reaction();

-- ============================================
-- 5. BUCKET LIST FEED EVENTS
-- ============================================
-- Update record_activity to support 'bucket_list' type

DROP FUNCTION IF EXISTS public.record_activity(text, text, text, text, text, text, integer, integer, uuid, text, integer);

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
RETURNS uuid
SECURITY DEFINER
SET search_path = public
AS $$
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

  -- If this is a visit, check if any followers had this on their bucket list
  IF p_activity_type = 'visit' AND p_category IS NOT NULL AND p_place_id IS NOT NULL THEN
    PERFORM public.notify_bucket_list_visits(v_user_id, p_category, p_place_id, p_place_name);
  END IF;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.record_activity(text, text, text, text, text, text, integer, integer, uuid, text, integer) TO authenticated;

-- ============================================
-- 6. BUCKET LIST ALERT NOTIFICATION
-- ============================================
-- Notify users when someone they follow visits a place on their bucket list

CREATE OR REPLACE FUNCTION public.notify_bucket_list_visits(
  p_visitor_id uuid,
  p_category text,
  p_place_id text,
  p_place_name text
)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  follower_record RECORD;
  visitor_profile RECORD;
BEGIN
  -- Get visitor's profile
  SELECT username, avatar_url, full_name
  INTO visitor_profile
  FROM public.profiles
  WHERE id = p_visitor_id;

  -- Find followers who have this place on their bucket list
  FOR follower_record IN
    SELECT f.follower_id, us.selections
    FROM public.follows f
    JOIN public.user_selections us ON us.user_id = f.follower_id
    WHERE f.following_id = p_visitor_id
  LOOP
    -- Check if this place is on their bucket list
    IF follower_record.selections IS NOT NULL AND
       follower_record.selections->p_category IS NOT NULL THEN

      -- Check each item in the category
      IF EXISTS (
        SELECT 1 FROM jsonb_array_elements(follower_record.selections->p_category) AS item
        WHERE item->>'id' = p_place_id
        AND item->>'status' = 'bucketList'
        AND (item->>'deleted' IS NULL OR item->>'deleted' = 'false')
      ) THEN
        -- Create notification
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
          follower_record.follower_id,
          'bucket_list_alert',
          'Bucket list update!',
          COALESCE(visitor_profile.username, visitor_profile.full_name, 'Someone you follow') ||
          ' just visited ' || COALESCE(p_place_name, 'a place') || ' from your bucket list!',
          p_visitor_id,
          visitor_profile.username,
          visitor_profile.avatar_url,
          jsonb_build_object(
            'category', p_category,
            'place_id', p_place_id,
            'place_name', p_place_name
          )
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. MUTUAL BUCKET LIST FUNCTION
-- ============================================
-- Find places that both you and a friend have on your bucket lists

CREATE OR REPLACE FUNCTION public.get_mutual_bucket_list(p_friend_id uuid)
RETURNS TABLE (
  category text,
  place_id text,
  place_name text
)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_my_selections jsonb;
  v_friend_selections jsonb;
  v_category text;
  v_my_items jsonb;
  v_friend_items jsonb;
  v_my_item jsonb;
  v_friend_item jsonb;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get my selections
  SELECT us.selections INTO v_my_selections
  FROM public.user_selections us
  WHERE us.user_id = v_user_id;

  -- Get friend's selections (only if they're public)
  SELECT us.selections INTO v_friend_selections
  FROM public.user_selections us
  JOIN public.profiles p ON p.id = us.user_id
  WHERE us.user_id = p_friend_id AND p.is_public = true;

  IF v_my_selections IS NULL OR v_friend_selections IS NULL THEN
    RETURN;
  END IF;

  -- Iterate through all categories
  FOR v_category IN SELECT jsonb_object_keys(v_my_selections)
  LOOP
    v_my_items := v_my_selections->v_category;
    v_friend_items := v_friend_selections->v_category;

    IF v_my_items IS NOT NULL AND v_friend_items IS NOT NULL THEN
      -- Check each of my bucket list items
      FOR v_my_item IN SELECT * FROM jsonb_array_elements(v_my_items)
      LOOP
        IF v_my_item->>'status' = 'bucketList' AND
           (v_my_item->>'deleted' IS NULL OR v_my_item->>'deleted' = 'false') THEN
          -- Check if friend also has it on bucket list
          FOR v_friend_item IN SELECT * FROM jsonb_array_elements(v_friend_items)
          LOOP
            IF v_friend_item->>'id' = v_my_item->>'id' AND
               v_friend_item->>'status' = 'bucketList' AND
               (v_friend_item->>'deleted' IS NULL OR v_friend_item->>'deleted' = 'false') THEN
              category := v_category;
              place_id := v_my_item->>'id';
              -- place_name would need to be looked up from the data files
              place_name := v_my_item->>'id';
              RETURN NEXT;
            END IF;
          END LOOP;
        END IF;
      END LOOP;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.get_mutual_bucket_list(uuid) TO authenticated;

-- Get friends who also have a place on their bucket list
CREATE OR REPLACE FUNCTION public.get_bucket_list_friends(
  p_category text,
  p_place_id text
)
RETURNS TABLE (
  user_id uuid,
  username text,
  full_name text,
  avatar_url text
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
  SELECT
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url
  FROM public.follows f
  JOIN public.profiles p ON p.id = f.following_id
  JOIN public.user_selections us ON us.user_id = f.following_id
  WHERE f.follower_id = v_user_id
    AND p.is_public = true
    AND us.selections IS NOT NULL
    AND us.selections->p_category IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM jsonb_array_elements(us.selections->p_category) AS item
      WHERE item->>'id' = p_place_id
      AND item->>'status' = 'bucketList'
      AND (item->>'deleted' IS NULL OR item->>'deleted' = 'false')
    );
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.get_bucket_list_friends(text, text) TO authenticated;

-- ============================================
-- 8. PROFILE COMPARISON FUNCTION
-- ============================================
-- Compare two users' travel stats for Venn diagram visualization

CREATE OR REPLACE FUNCTION public.compare_profiles(p_other_user_id uuid)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_my_selections jsonb;
  v_other_selections jsonb;
  v_category text;
  v_result jsonb := '{}';
  v_category_result jsonb;
  v_my_items jsonb;
  v_other_items jsonb;
  v_my_visited text[];
  v_other_visited text[];
  v_both_visited text[];
  v_only_me text[];
  v_only_them text[];
  v_my_profile RECORD;
  v_other_profile RECORD;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get my selections
  SELECT us.selections INTO v_my_selections
  FROM public.user_selections us
  WHERE us.user_id = v_user_id;

  -- Get other user's selections (only if public)
  SELECT us.selections INTO v_other_selections
  FROM public.user_selections us
  JOIN public.profiles p ON p.id = us.user_id
  WHERE us.user_id = p_other_user_id AND p.is_public = true;

  IF v_other_selections IS NULL THEN
    RETURN jsonb_build_object('error', 'User not found or profile is private');
  END IF;

  -- Get profile info
  SELECT id, username, full_name, avatar_url, level, total_xp
  INTO v_my_profile
  FROM public.profiles WHERE id = v_user_id;

  SELECT id, username, full_name, avatar_url, level, total_xp
  INTO v_other_profile
  FROM public.profiles WHERE id = p_other_user_id;

  -- Build profiles object
  v_result := jsonb_build_object(
    'me', jsonb_build_object(
      'id', v_my_profile.id,
      'username', v_my_profile.username,
      'fullName', v_my_profile.full_name,
      'avatarUrl', v_my_profile.avatar_url,
      'level', v_my_profile.level,
      'totalXp', v_my_profile.total_xp
    ),
    'other', jsonb_build_object(
      'id', v_other_profile.id,
      'username', v_other_profile.username,
      'fullName', v_other_profile.full_name,
      'avatarUrl', v_other_profile.avatar_url,
      'level', v_other_profile.level,
      'totalXp', v_other_profile.total_xp
    ),
    'categories', '{}'::jsonb
  );

  -- Compare each category
  FOR v_category IN
    SELECT DISTINCT key FROM (
      SELECT jsonb_object_keys(COALESCE(v_my_selections, '{}'::jsonb)) AS key
      UNION
      SELECT jsonb_object_keys(COALESCE(v_other_selections, '{}'::jsonb)) AS key
    ) all_keys
  LOOP
    v_my_items := v_my_selections->v_category;
    v_other_items := v_other_selections->v_category;

    -- Get visited places for me
    SELECT ARRAY_AGG(item->>'id')
    INTO v_my_visited
    FROM jsonb_array_elements(COALESCE(v_my_items, '[]'::jsonb)) AS item
    WHERE item->>'status' = 'visited'
    AND (item->>'deleted' IS NULL OR item->>'deleted' = 'false');

    -- Get visited places for other
    SELECT ARRAY_AGG(item->>'id')
    INTO v_other_visited
    FROM jsonb_array_elements(COALESCE(v_other_items, '[]'::jsonb)) AS item
    WHERE item->>'status' = 'visited'
    AND (item->>'deleted' IS NULL OR item->>'deleted' = 'false');

    v_my_visited := COALESCE(v_my_visited, ARRAY[]::text[]);
    v_other_visited := COALESCE(v_other_visited, ARRAY[]::text[]);

    -- Calculate overlaps
    v_both_visited := ARRAY(SELECT unnest(v_my_visited) INTERSECT SELECT unnest(v_other_visited));
    v_only_me := ARRAY(SELECT unnest(v_my_visited) EXCEPT SELECT unnest(v_other_visited));
    v_only_them := ARRAY(SELECT unnest(v_other_visited) EXCEPT SELECT unnest(v_my_visited));

    v_category_result := jsonb_build_object(
      'myCount', array_length(v_my_visited, 1),
      'theirCount', array_length(v_other_visited, 1),
      'bothCount', array_length(v_both_visited, 1),
      'onlyMeCount', array_length(v_only_me, 1),
      'onlyThemCount', array_length(v_only_them, 1),
      'bothVisited', to_jsonb(v_both_visited),
      'onlyMe', to_jsonb(v_only_me),
      'onlyThem', to_jsonb(v_only_them)
    );

    v_result := jsonb_set(
      v_result,
      ARRAY['categories', v_category],
      v_category_result
    );
  END LOOP;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.compare_profiles(uuid) TO authenticated;

-- ============================================
-- 9. UPDATE ACTIVITY FEED FUNCTIONS TO INCLUDE REACTIONS
-- ============================================

-- Update get_global_activity_feed to include reaction info
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
    COALESCE(af.reaction_count, 0) as reaction_count,
    EXISTS (
      SELECT 1 FROM public.activity_reactions ar
      WHERE ar.activity_id = af.id AND ar.user_id = auth.uid()
    ) as has_reacted,
    af.created_at
  FROM public.activity_feed af
  JOIN public.profiles p ON p.id = af.user_id
  WHERE p.is_public = true
    AND (filter_type IS NULL OR af.activity_type = filter_type)
  ORDER BY af.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.get_global_activity_feed(integer, integer, text) TO anon, authenticated;

-- Update get_friends_activity_feed to include reaction info
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
    COALESCE(af.reaction_count, 0) as reaction_count,
    EXISTS (
      SELECT 1 FROM public.activity_reactions ar
      WHERE ar.activity_id = af.id AND ar.user_id = v_user_id
    ) as has_reacted,
    af.created_at
  FROM public.activity_feed af
  JOIN public.profiles p ON p.id = af.user_id
  WHERE EXISTS (
    SELECT 1 FROM public.follows f
    WHERE f.follower_id = v_user_id
    AND f.following_id = af.user_id
  )
  AND p.is_public = true
  ORDER BY af.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.get_friends_activity_feed(integer, integer) TO authenticated;

-- ============================================
-- 10. COMMENTS
-- ============================================

COMMENT ON TABLE public.activity_reactions IS 'Stores kudos/reactions on activity feed items';
COMMENT ON FUNCTION public.toggle_activity_reaction IS 'Toggle a reaction (kudos) on an activity';
COMMENT ON FUNCTION public.get_mutual_bucket_list IS 'Find places both you and a friend have on bucket lists';
COMMENT ON FUNCTION public.get_bucket_list_friends IS 'Find friends who have a specific place on their bucket list';
COMMENT ON FUNCTION public.compare_profiles IS 'Compare travel stats between two users for Venn diagram visualization';
COMMENT ON FUNCTION public.notify_bucket_list_visits IS 'Internal: Notify followers when you visit a place on their bucket list';
