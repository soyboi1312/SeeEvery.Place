-- ============================================
-- Fix XP Farming via Invalid Category Names
-- ============================================
-- ISSUE: The record_activity function defaults to 10 XP if a category is not
-- found in category_xp_values. This allows users to farm XP by sending invalid
-- category names, potentially earning MORE XP than the correct category would
-- give (e.g., usCities = 5 XP, but 'usCities_typo' = 10 XP default).
--
-- FIX: If category is required (visit activity) but not found in the lookup
-- table, award 0 XP instead of 10. This prevents exploitation while still
-- recording the activity for debugging purposes.
-- ============================================

-- Update the main record_activity function (10-arg version)
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
  v_category_exists boolean;
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
      SELECT xp_value INTO v_xp_earned
      FROM public.category_xp_values
      WHERE category = p_category;

      -- SECURITY FIX: If category not found, award 0 XP (not 10)
      -- This prevents XP farming via invalid category names
      IF v_xp_earned IS NULL THEN
        v_xp_earned := 0;
        -- Log the invalid category for debugging
        RAISE NOTICE 'record_activity: Unknown category "%" - awarding 0 XP', p_category;
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

-- Update comment to document the security fix
COMMENT ON FUNCTION public.record_activity(text, text, text, text, text, text, integer, integer, uuid, text) IS
'Records user activity to the feed. XP is calculated server-side to prevent spoofing.
Invalid categories now receive 0 XP (previously defaulted to 10, enabling XP farming).
Activity types: visit, achievement, level_up, challenge_complete, started_tracking, bucket_list';
