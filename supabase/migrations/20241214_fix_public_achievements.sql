-- ============================================
-- Fix: Public Profile Achievements Access
-- ============================================
-- The RLS policy for public achievements wasn't working correctly
-- for anonymous users. This creates a SECURITY DEFINER function
-- to properly return achievements for public profiles.

-- Function to get achievements for a public profile
CREATE OR REPLACE FUNCTION public.get_public_user_achievements(target_user_id uuid)
RETURNS TABLE (
  id uuid,
  achievement_id text,
  unlocked_at timestamp with time zone,
  category text
) AS $$
BEGIN
  -- Only return achievements if the user's profile is public
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = target_user_id
    AND profiles.is_public = true
  ) THEN
    RETURN QUERY
    SELECT
      ua.id,
      ua.achievement_id,
      ua.unlocked_at,
      ua.category
    FROM public.user_achievements ua
    WHERE ua.user_id = target_user_id
    ORDER BY ua.unlocked_at DESC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_user_achievements(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_user_achievements(uuid) TO authenticated;
