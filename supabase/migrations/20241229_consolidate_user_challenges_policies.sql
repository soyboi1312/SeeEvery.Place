-- ============================================
-- Consolidate User Challenges Table Policies
-- ============================================
-- Fixes multiple permissive INSERT policies on user_challenges table.
-- ============================================

-- Drop both existing INSERT policies
DROP POLICY IF EXISTS "Users can insert own challenge progress" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can insert their own challenges" ON public.user_challenges;

-- Create single consolidated INSERT policy
CREATE POLICY "Users can insert own challenges"
  ON public.user_challenges FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

COMMENT ON POLICY "Users can insert own challenges" ON public.user_challenges
  IS 'Single consolidated INSERT policy for user challenges';

-- ============================================
-- Consolidate User Selections Table Policies
-- ============================================
-- Fixes multiple permissive INSERT policies on user_selections table.
-- ============================================

-- Drop both existing INSERT policies (keep the one we created in 20241224)
DROP POLICY IF EXISTS "Users can insert their own selections" ON public.user_selections;
-- Note: "Users can insert own selections" was already created in 20241224_optimize_auth_uid_rls.sql
-- so we just need to drop the duplicate

COMMENT ON POLICY "Users can insert own selections" ON public.user_selections
  IS 'Single consolidated INSERT policy for user selections';
