-- ============================================
-- Normalized Visits Table & Challenges System
-- ============================================
-- This migration adds:
-- 1. Normalized visits table for efficient social/analytics queries
-- 2. Time-bound challenges system
-- 3. User activity tracking for streaks
-- ============================================

-- ============================================
-- 1. NORMALIZED VISITS TABLE
-- ============================================
-- This denormalizes the JSONB blob for efficient queries like:
-- "Find all friends who visited Paris" or "X% of users visited this"

CREATE TABLE IF NOT EXISTS public.visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  place_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('visited', 'bucketList')),
  visited_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Prevent duplicate entries
  UNIQUE(user_id, category, place_id)
);

-- Enable RLS
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Users can view their own visits
CREATE POLICY "Users can view own visits"
  ON public.visits FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own visits
CREATE POLICY "Users can insert own visits"
  ON public.visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own visits
CREATE POLICY "Users can update own visits"
  ON public.visits FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own visits
CREATE POLICY "Users can delete own visits"
  ON public.visits FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS visits_user_id_idx ON public.visits(user_id);
CREATE INDEX IF NOT EXISTS visits_category_idx ON public.visits(category);
CREATE INDEX IF NOT EXISTS visits_place_id_idx ON public.visits(place_id);
CREATE INDEX IF NOT EXISTS visits_category_place_idx ON public.visits(category, place_id);
CREATE INDEX IF NOT EXISTS visits_status_idx ON public.visits(status);
CREATE INDEX IF NOT EXISTS visits_visited_at_idx ON public.visits(visited_at);
-- Composite index for time-bound queries (challenges)
CREATE INDEX IF NOT EXISTS visits_category_status_visited_at_idx
  ON public.visits(category, status, visited_at);

-- Trigger for updated_at
CREATE TRIGGER on_visits_update
  BEFORE UPDATE ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 2. AGGREGATE STATS TABLE (Materialized for Performance)
-- ============================================
-- Pre-computed stats for category pages: "X% of users have visited this"

CREATE TABLE IF NOT EXISTS public.category_place_stats (
  category text NOT NULL,
  place_id text NOT NULL,
  visit_count integer DEFAULT 0,
  bucket_list_count integer DEFAULT 0,
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (category, place_id)
);

-- Enable RLS - public read access
ALTER TABLE public.category_place_stats ENABLE ROW LEVEL SECURITY;

-- Anyone can read stats (public data)
CREATE POLICY "Stats are publicly readable"
  ON public.category_place_stats FOR SELECT
  USING (true);

-- Function to update stats when visits change
CREATE OR REPLACE FUNCTION public.update_place_stats()
RETURNS TRIGGER AS $$
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
    -- Decrement old status
    UPDATE public.category_place_stats SET
      visit_count = visit_count - CASE WHEN OLD.status = 'visited' THEN 1 ELSE 0 END,
      bucket_list_count = bucket_list_count - CASE WHEN OLD.status = 'bucketList' THEN 1 ELSE 0 END,
      last_updated = now()
    WHERE category = OLD.category AND place_id = OLD.place_id;
    -- Increment new status
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for stats updates
CREATE TRIGGER on_visit_stats_insert
  AFTER INSERT ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.update_place_stats();

CREATE TRIGGER on_visit_stats_update
  AFTER UPDATE ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.update_place_stats();

CREATE TRIGGER on_visit_stats_delete
  AFTER DELETE ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.update_place_stats();

-- ============================================
-- 3. TIME-BOUND CHALLENGES SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  -- Challenge type: 'seasonal', 'limited', 'recurring_yearly'
  challenge_type text NOT NULL CHECK (challenge_type IN ('seasonal', 'limited', 'recurring_yearly')),
  -- Which categories/places count towards this challenge
  category text, -- null means any category
  -- Specific place IDs that count (null means any in category)
  target_place_ids text[], -- null means any place in category
  -- How many places need to be visited
  required_count integer NOT NULL DEFAULT 1,
  -- Time bounds (null end_date means ongoing)
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  -- Recurring challenges: month range (1-12)
  start_month integer CHECK (start_month >= 1 AND start_month <= 12),
  end_month integer CHECK (end_month >= 1 AND end_month <= 12),
  -- Reward
  badge_icon text NOT NULL DEFAULT '🏆',
  badge_name text NOT NULL,
  xp_reward integer NOT NULL DEFAULT 100,
  -- Metadata
  is_active boolean DEFAULT true,
  is_secret boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Anyone can view active, non-secret challenges
CREATE POLICY "Active challenges are publicly readable"
  ON public.challenges FOR SELECT
  USING (is_active = true AND is_secret = false);

-- Admins can manage challenges
CREATE POLICY "Admins can manage challenges"
  ON public.challenges FOR ALL
  USING (public.is_admin());

-- Trigger for updated_at
CREATE TRIGGER on_challenges_update
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- User challenge progress tracking
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  -- Progress tracking
  current_count integer DEFAULT 0,
  completed_at timestamp with time zone,
  -- For recurring challenges, track which year
  challenge_year integer,
  -- Metadata
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Unique per user per challenge (and year for recurring)
  UNIQUE(user_id, challenge_id, challenge_year)
);

-- Enable RLS
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- Users can view their own challenge progress
CREATE POLICY "Users can view own challenge progress"
  ON public.user_challenges FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own challenge progress"
  ON public.user_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own challenge progress"
  ON public.user_challenges FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS user_challenges_user_id_idx ON public.user_challenges(user_id);
CREATE INDEX IF NOT EXISTS user_challenges_challenge_id_idx ON public.user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS user_challenges_completed_idx ON public.user_challenges(completed_at) WHERE completed_at IS NOT NULL;

-- Trigger for updated_at
CREATE TRIGGER on_user_challenges_update
  BEFORE UPDATE ON public.user_challenges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 4. USER ACTIVITY TRACKING (FOR STREAKS)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_date date NOT NULL,
  -- Activity types
  logged_in boolean DEFAULT false,
  made_selection boolean DEFAULT false,
  -- Metadata
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- One record per user per day
  UNIQUE(user_id, activity_date)
);

-- Enable RLS
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity
CREATE POLICY "Users can view own activity"
  ON public.user_activity FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity"
  ON public.user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own activity
CREATE POLICY "Users can update own activity"
  ON public.user_activity FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS user_activity_user_id_idx ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS user_activity_date_idx ON public.user_activity(activity_date);
CREATE INDEX IF NOT EXISTS user_activity_user_date_idx ON public.user_activity(user_id, activity_date DESC);

-- Trigger for updated_at
CREATE TRIGGER on_user_activity_update
  BEFORE UPDATE ON public.user_activity
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- User streak stats (cached for performance)
CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  -- Login streaks
  current_login_streak integer DEFAULT 0,
  longest_login_streak integer DEFAULT 0,
  last_login_date date,
  -- Season streaks (visited at least one place per month)
  current_season_streak integer DEFAULT 0, -- months in a row
  longest_season_streak integer DEFAULT 0,
  last_visit_month date, -- first of month
  -- Monthly visit counts for the current year
  monthly_visits jsonb DEFAULT '{}',
  -- Metadata
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Users can view their own streaks
CREATE POLICY "Users can view own streaks"
  ON public.user_streaks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own streaks
CREATE POLICY "Users can insert own streaks"
  ON public.user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own streaks
CREATE POLICY "Users can update own streaks"
  ON public.user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. RPC FUNCTIONS FOR STATS AND STREAKS
-- ============================================

-- Function to get category stats for public display
CREATE OR REPLACE FUNCTION public.get_category_stats(p_category text)
RETURNS TABLE (
  place_id text,
  visit_count integer,
  bucket_list_count integer,
  visit_percentage numeric
) AS $$
DECLARE
  total_users integer;
BEGIN
  -- Get total users with any visits (for percentage calculation)
  SELECT COUNT(DISTINCT user_id) INTO total_users FROM public.visits;

  IF total_users = 0 THEN
    total_users := 1; -- Avoid division by zero
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to all (public stats)
GRANT EXECUTE ON FUNCTION public.get_category_stats(text) TO anon, authenticated;

-- Function to get active challenges
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
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to all
GRANT EXECUTE ON FUNCTION public.get_active_challenges() TO anon, authenticated;

-- Function to record user login and update streaks
CREATE OR REPLACE FUNCTION public.record_user_activity(p_activity_type text DEFAULT 'login')
RETURNS jsonb AS $$
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

  -- Record activity for today
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

  -- Update streak stats
  SELECT current_login_streak, longest_login_streak, last_login_date
  INTO v_current_streak, v_longest_streak, v_last_date
  FROM public.user_streaks
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    -- First time user
    INSERT INTO public.user_streaks (user_id, current_login_streak, longest_login_streak, last_login_date)
    VALUES (v_user_id, 1, 1, v_today);
    v_current_streak := 1;
    v_longest_streak := 1;
  ELSIF v_last_date = v_today THEN
    -- Already logged in today, no change
    NULL;
  ELSIF v_last_date = v_yesterday THEN
    -- Continuing streak
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
    -- Streak broken, start new
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.record_user_activity(text) TO authenticated;

-- Function to get user streaks
CREATE OR REPLACE FUNCTION public.get_user_streaks()
RETURNS jsonb AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_streaks() TO authenticated;

-- Function to check and update challenge progress
CREATE OR REPLACE FUNCTION public.check_challenge_progress(p_user_id uuid, p_category text, p_place_id text, p_visited_at timestamp with time zone)
RETURNS void AS $$
DECLARE
  v_challenge RECORD;
  v_year integer;
  v_current_count integer;
BEGIN
  -- Get the year from visited_at
  v_year := EXTRACT(YEAR FROM p_visited_at);

  -- Check each active challenge
  FOR v_challenge IN
    SELECT * FROM public.challenges c
    WHERE c.is_active = true
      AND c.start_date <= p_visited_at
      AND (c.end_date IS NULL OR c.end_date > p_visited_at)
      AND (c.category IS NULL OR c.category = p_category)
      AND (c.target_place_ids IS NULL OR p_place_id = ANY(c.target_place_ids))
  LOOP
    -- For recurring challenges, use the year
    IF v_challenge.challenge_type = 'recurring_yearly' THEN
      -- Check if visited_at is within the recurring month range
      IF v_challenge.start_month IS NOT NULL AND v_challenge.end_month IS NOT NULL THEN
        IF v_challenge.start_month <= v_challenge.end_month THEN
          -- Normal range (e.g., June to August)
          IF EXTRACT(MONTH FROM p_visited_at) < v_challenge.start_month OR
             EXTRACT(MONTH FROM p_visited_at) > v_challenge.end_month THEN
            CONTINUE;
          END IF;
        ELSE
          -- Wrapping range (e.g., November to February)
          IF EXTRACT(MONTH FROM p_visited_at) < v_challenge.start_month AND
             EXTRACT(MONTH FROM p_visited_at) > v_challenge.end_month THEN
            CONTINUE;
          END IF;
        END IF;
      END IF;
    ELSE
      v_year := NULL; -- Non-recurring challenges don't use year
    END IF;

    -- Update or insert progress
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. SEED DATA: INITIAL CHALLENGES
-- ============================================

-- Insert some initial time-bound challenges
INSERT INTO public.challenges (name, description, challenge_type, category, required_count, start_date, end_date, start_month, end_month, badge_icon, badge_name, xp_reward)
VALUES
  -- Summer of Parks (recurring yearly, June-August)
  ('Summer of Parks', 'Visit 3 State Parks between June and August', 'recurring_yearly', 'stateParks', 3, '2024-06-01', NULL, 6, 8, '🌲', 'Summer Explorer', 200),
  -- Summer National Parks
  ('National Park Summer', 'Visit 2 National Parks during summer', 'recurring_yearly', 'nationalParks', 2, '2024-06-01', NULL, 6, 8, '🏞️', 'Park Ranger Summer', 300),
  -- Winter Skiing Challenge
  ('Powder Season', 'Hit 3 ski resorts during winter', 'recurring_yearly', 'skiResorts', 3, '2024-12-01', NULL, 12, 3, '⛷️', 'Powder Hound', 250),
  -- Baseball Season Challenge
  ('Baseball Season Tour', 'Visit 5 MLB stadiums during the season (April-October)', 'recurring_yearly', 'mlbStadiums', 5, '2024-04-01', NULL, 4, 10, '⚾', 'Diamond Chaser', 300),
  -- Fall Foliage Challenge
  ('Fall Colors', 'Visit 2 State Parks during fall foliage season', 'recurring_yearly', 'stateParks', 2, '2024-09-01', NULL, 9, 11, '🍂', 'Leaf Peeper', 150),
  -- Year-round Explorer
  ('Four Seasons Explorer', 'Visit places in all four seasons (any category)', 'recurring_yearly', NULL, 12, '2024-01-01', NULL, NULL, NULL, '🌍', 'Year-Round Explorer', 500)
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. SYNC FUNCTION: Populate visits from JSONB
-- ============================================
-- Run this to backfill the visits table from existing user_selections

CREATE OR REPLACE FUNCTION public.sync_visits_from_jsonb()
RETURNS integer AS $$
DECLARE
  v_user RECORD;
  v_category text;
  v_item RECORD;
  v_count integer := 0;
BEGIN
  -- Only allow admins to run this
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can run this function';
  END IF;

  FOR v_user IN SELECT user_id, selections FROM public.user_selections LOOP
    -- Iterate through each category
    FOR v_category IN SELECT jsonb_object_keys(v_user.selections) LOOP
      -- Iterate through items in category
      FOR v_item IN
        SELECT
          elem->>'id' as id,
          elem->>'status' as status,
          to_timestamp((elem->>'updatedAt')::bigint / 1000) as updated_at
        FROM jsonb_array_elements(v_user.selections->v_category) elem
        WHERE elem->>'deleted' IS NULL OR (elem->>'deleted')::boolean = false
      LOOP
        -- Only sync visited and bucketList items
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (function checks admin internally)
GRANT EXECUTE ON FUNCTION public.sync_visits_from_jsonb() TO authenticated;

COMMENT ON FUNCTION public.sync_visits_from_jsonb() IS
'Backfills the normalized visits table from the JSONB user_selections blob.
Run this after migration to populate historical data. Admin only.';
