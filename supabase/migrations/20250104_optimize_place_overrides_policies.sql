-- ============================================
-- Optimize Place Overrides Table Policies
-- ============================================
-- Fixes auth.uid() re-evaluation issue by using public.is_admin() function
-- which is already optimized and more readable.
-- ============================================

-- Drop and recreate all policies with optimized version
DROP POLICY IF EXISTS "Admin users can view place overrides" ON public.place_overrides;
DROP POLICY IF EXISTS "Admin users can insert place overrides" ON public.place_overrides;
DROP POLICY IF EXISTS "Admin users can update place overrides" ON public.place_overrides;
DROP POLICY IF EXISTS "Admin users can delete place overrides" ON public.place_overrides;

-- Use public.is_admin() which is already optimized
CREATE POLICY "Admin users can view place overrides"
  ON public.place_overrides FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin users can insert place overrides"
  ON public.place_overrides FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin users can update place overrides"
  ON public.place_overrides FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin users can delete place overrides"
  ON public.place_overrides FOR DELETE
  USING (public.is_admin());

COMMENT ON POLICY "Admin users can view place overrides" ON public.place_overrides
  IS 'Optimized: uses is_admin() function';
