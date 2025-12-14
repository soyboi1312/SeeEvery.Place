-- ============================================
-- Consolidate Follows Table Policies
-- ============================================
-- Fixes multiple permissive SELECT policies on follows table.
-- Combines "Users can view follows" and "Users can view own follows" into one.
-- ============================================

-- Drop both existing SELECT policies
DROP POLICY IF EXISTS "Users can view follows" ON public.follows;
DROP POLICY IF EXISTS "Users can view own follows" ON public.follows;

-- Create single consolidated SELECT policy
CREATE POLICY "Follows are viewable by participants or if public"
  ON public.follows FOR SELECT
  USING (
    (SELECT auth.uid()) = follower_id OR
    (SELECT auth.uid()) = following_id OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = follows.following_id
      AND p.is_public = true
    )
  );

COMMENT ON POLICY "Follows are viewable by participants or if public" ON public.follows
  IS 'Single consolidated SELECT policy: viewable if you are participant or following a public profile';
