-- ============================================
-- Consolidate User Status Table Policies
-- ============================================
-- Fixes multiple permissive SELECT policies on user_status table.
-- ============================================

-- Drop both existing SELECT policies
DROP POLICY IF EXISTS "Admins can view all user statuses" ON public.user_status;
DROP POLICY IF EXISTS "Users can view own status" ON public.user_status;

-- Create single consolidated SELECT policy
-- Logic:
--   - Users can view their own status
--   - Admins can view all statuses
CREATE POLICY "User status viewable by owner or admin"
  ON public.user_status FOR SELECT
  USING (
    (SELECT auth.uid()) = id
    OR public.is_admin()
  );

COMMENT ON POLICY "User status viewable by owner or admin" ON public.user_status
  IS 'Single consolidated SELECT policy: own status or admin access';

-- ============================================
-- Consolidate User Streaks Table Policies
-- ============================================
-- Fixes multiple permissive SELECT policies on user_streaks table.
-- ============================================

-- Drop both existing SELECT policies
DROP POLICY IF EXISTS "Users can view own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can view their own streaks" ON public.user_streaks;

-- Create single consolidated SELECT policy
CREATE POLICY "Users can view own streaks"
  ON public.user_streaks FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

COMMENT ON POLICY "Users can view own streaks" ON public.user_streaks
  IS 'Single consolidated SELECT policy for user streaks';

-- Also optimize INSERT and UPDATE policies for user_streaks
DROP POLICY IF EXISTS "Users can insert own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can insert their own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON public.user_streaks;

CREATE POLICY "Users can insert own streaks"
  ON public.user_streaks FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own streaks"
  ON public.user_streaks FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);
