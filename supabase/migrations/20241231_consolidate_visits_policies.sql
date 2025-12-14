-- ============================================
-- Consolidate Visits Table Policies
-- ============================================
-- Fixes multiple permissive DELETE policies on visits table.
-- ============================================

-- Drop both existing DELETE policies
DROP POLICY IF EXISTS "Users can delete own visits" ON public.visits;
DROP POLICY IF EXISTS "Users can delete their own visits" ON public.visits;

-- Create single consolidated DELETE policy
CREATE POLICY "Users can delete own visits"
  ON public.visits FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

COMMENT ON POLICY "Users can delete own visits" ON public.visits
  IS 'Single consolidated DELETE policy for visits';
