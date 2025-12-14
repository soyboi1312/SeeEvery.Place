-- ============================================
-- Consolidate Follows Table INSERT Policies
-- ============================================
-- Fixes multiple permissive INSERT policies on follows table.
-- ============================================

-- Drop both existing INSERT policies
DROP POLICY IF EXISTS "Users can create follows" ON public.follows;
DROP POLICY IF EXISTS "Users can follow others" ON public.follows;

-- Create single consolidated INSERT policy
CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = follower_id);

COMMENT ON POLICY "Users can follow others" ON public.follows
  IS 'Single consolidated INSERT policy for follows';
