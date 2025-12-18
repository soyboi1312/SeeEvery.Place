-- ============================================
-- Fix XP Spoofing Vulnerability in record_activity
-- ============================================
-- ISSUE: The record_activity function accepted xp_earned as a parameter from
-- clients, allowing malicious users to spoof arbitrary XP values (e.g., 999999)
-- and instantly level up their accounts.
--
-- FIX: Remove the p_xp_earned parameter and calculate XP server-side based on
-- the activity type and category. XP values are determined by:
-- - 'visit': Looked up from category_xp_values based on the category
-- - 'challenge_complete': Looked up from the challenges table
-- - 'achievement': Fixed 50 XP bonus
-- - 'level_up', 'started_tracking', 'bucket_list': 0 XP (informational only)
-- ============================================

-- Create a lookup table for category XP values
-- This mirrors the CATEGORY_SCHEMA in src/lib/types.ts
CREATE TABLE IF NOT EXISTS public.category_xp_values (
  category text PRIMARY KEY,
  xp_value integer NOT NULL DEFAULT 10
);

-- Insert XP values (matching CATEGORY_SCHEMA in frontend)
INSERT INTO public.category_xp_values (category, xp_value) VALUES
  ('countries', 25),
  ('worldCities', 10),
  ('states', 15),
  ('territories', 20),
  ('usCities', 5),
  ('nationalParks', 30),
  ('nationalMonuments', 25),
  ('stateParks', 15),
  ('fiveKPeaks', 50),
  ('fourteeners', 40),
  ('museums', 15),
  ('mlbStadiums', 20),
  ('nflStadiums', 20),
  ('nbaStadiums', 20),
  ('nhlStadiums', 20),
  ('soccerStadiums', 25),
  ('euroFootballStadiums', 20),
  ('rugbyStadiums', 25),
  ('cricketStadiums', 25),
  ('f1Tracks', 35),
  ('marathons', 100),
  ('airports', 5),
  ('skiResorts', 25),
  ('themeParks', 20),
  ('surfingReserves', 30),
  ('weirdAmericana', 15)
ON CONFLICT (category) DO UPDATE SET xp_value = EXCLUDED.xp_value;

-- Make the table publicly readable (values are not sensitive)
ALTER TABLE public.category_xp_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Category XP values are publicly readable" ON public.category_xp_values;
CREATE POLICY "Category XP values are publicly readable"
  ON public.category_xp_values FOR SELECT
  USING (true);

-- Drop the old function signature that accepts p_xp_earned
DROP FUNCTION IF EXISTS public.record_activity(text, text, text, text, text, text, integer, integer, uuid, text, integer);

-- Create the new secure version that calculates XP server-side
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
  p_challenge_name text DEFAULT NULL
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_activity_id uuid;
  v_is_public boolean;
  v_xp_earned integer := 0;
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

  -- Calculate XP server-side based on activity type
  CASE p_activity_type
    WHEN 'visit' THEN
      -- Look up XP from category_xp_values table
      SELECT COALESCE(xp_value, 10) INTO v_xp_earned
      FROM public.category_xp_values
      WHERE category = p_category;
      -- Default to 10 if category not found
      IF v_xp_earned IS NULL THEN
        v_xp_earned := 10;
      END IF;

    WHEN 'challenge_complete' THEN
      -- Look up XP reward from challenges table
      IF p_challenge_id IS NOT NULL THEN
        SELECT COALESCE(xp_reward, 0) INTO v_xp_earned
        FROM public.challenges
        WHERE id = p_challenge_id;
      END IF;
      IF v_xp_earned IS NULL THEN
        v_xp_earned := 0;
      END IF;

    WHEN 'achievement' THEN
      -- Fixed XP bonus for achievements
      v_xp_earned := 50;

    ELSE
      -- level_up, started_tracking, bucket_list: no XP (informational)
      v_xp_earned := 0;
  END CASE;

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
    v_xp_earned
  )
  RETURNING id INTO v_activity_id;

  -- If this is a visit, check if any followers had this on their bucket list
  IF p_activity_type = 'visit' AND p_category IS NOT NULL AND p_place_id IS NOT NULL THEN
    PERFORM public.notify_bucket_list_visits(v_user_id, p_category, p_place_id, p_place_name);
  END IF;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute to authenticated users (same as before, but new signature without p_xp_earned)
GRANT EXECUTE ON FUNCTION public.record_activity(text, text, text, text, text, text, integer, integer, uuid, text) TO authenticated;

-- Add comment explaining the security fix
COMMENT ON FUNCTION public.record_activity(text, text, text, text, text, text, integer, integer, uuid, text) IS
'Records user activity to the feed. XP is calculated server-side to prevent spoofing.
Activity types: visit, achievement, level_up, challenge_complete, started_tracking, bucket_list';
