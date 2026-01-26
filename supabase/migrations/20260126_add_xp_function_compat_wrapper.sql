-- ============================================
-- Backward-Compatible Wrapper for record_activity
-- ============================================
-- This migration adds a wrapper function that accepts the OLD 11-argument
-- signature (with p_xp_earned) and simply ignores the XP parameter,
-- forwarding to the new secure 10-argument function.
--
-- This allows a safe transition period where:
-- 1. Old frontend code calling with 11 args still works
-- 2. New frontend code calling with 10 args also works
-- 3. XP is always calculated server-side (spoofing is prevented)
--
-- After all clients are updated, this wrapper can be removed.
-- ============================================

-- Create backward-compatible wrapper that accepts the old signature
-- The p_xp_earned parameter is accepted but IGNORED
CREATE OR REPLACE FUNCTION public.record_activity(
  p_activity_type text,
  p_category text,
  p_place_id text,
  p_place_name text,
  p_achievement_id text,
  p_achievement_name text,
  p_old_level integer,
  p_new_level integer,
  p_challenge_id uuid,
  p_challenge_name text,
  p_xp_earned integer  -- DEPRECATED: This parameter is ignored for security
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log a warning if someone is still passing XP (helps track outdated clients)
  IF p_xp_earned IS NOT NULL AND p_xp_earned != 0 THEN
    RAISE NOTICE 'record_activity: p_xp_earned parameter is deprecated and ignored. XP is calculated server-side.';
  END IF;

  -- Forward to the new secure function (without p_xp_earned)
  RETURN public.record_activity(
    p_activity_type,
    p_category,
    p_place_id,
    p_place_name,
    p_achievement_id,
    p_achievement_name,
    p_old_level,
    p_new_level,
    p_challenge_id,
    p_challenge_name
  );
END;
$$ LANGUAGE plpgsql;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.record_activity(text, text, text, text, text, text, integer, integer, uuid, text, integer) TO authenticated;

-- Add comment explaining this is a compatibility wrapper
COMMENT ON FUNCTION public.record_activity(text, text, text, text, text, text, integer, integer, uuid, text, integer) IS
'[DEPRECATED] Backward-compatible wrapper for old clients. The p_xp_earned parameter is ignored.
Use the 10-argument version instead. This wrapper will be removed in a future release.';
