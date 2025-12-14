-- ============================================
-- Consolidate User Activity Table Policies
-- ============================================
-- Fixes multiple permissive INSERT policies on user_activity table.
-- ============================================

-- Drop both existing INSERT policies
DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can insert their own activity" ON public.user_activity;

-- Create single consolidated INSERT policy
CREATE POLICY "Users can insert own activity"
  ON public.user_activity FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

COMMENT ON POLICY "Users can insert own activity" ON public.user_activity
  IS 'Single consolidated INSERT policy for user activity';
