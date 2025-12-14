-- ============================================
-- Consolidate Suggestions Table Policies
-- ============================================
-- Fixes multiple permissive SELECT policies on suggestions table.
-- Combines "Suggestions are viewable by everyone" and
-- "Authenticated users can view all suggestions" into one.
-- ============================================

-- Drop both existing SELECT policies
DROP POLICY IF EXISTS "Suggestions are viewable by everyone" ON public.suggestions;
DROP POLICY IF EXISTS "Authenticated users can view all suggestions" ON public.suggestions;

-- Create single consolidated SELECT policy
-- Logic:
--   - Everyone can see pending/approved/implemented suggestions
--   - Authenticated users can additionally see rejected suggestions
CREATE POLICY "Suggestions are viewable based on status and auth"
  ON public.suggestions FOR SELECT
  USING (
    status IN ('pending', 'approved', 'implemented')
    OR auth.role() = 'authenticated'
  );

COMMENT ON POLICY "Suggestions are viewable based on status and auth" ON public.suggestions
  IS 'Single consolidated SELECT policy: public statuses visible to all, rejected only to authenticated users';

-- ============================================
-- Consolidate System Banners Table Policies
-- ============================================
-- Fixes multiple permissive SELECT policies on system_banners table.
-- Combines "Active banners are viewable by everyone" and
-- "Admins can view all banners" into one.
-- ============================================

-- Drop both existing SELECT policies
DROP POLICY IF EXISTS "Active banners are viewable by everyone" ON public.system_banners;
DROP POLICY IF EXISTS "Admins can view all banners" ON public.system_banners;

-- Create single consolidated SELECT policy
-- Logic:
--   - Everyone can see active banners within their date range
--   - Admins can see all banners (including inactive/scheduled)
CREATE POLICY "Banners viewable if active or admin"
  ON public.system_banners FOR SELECT
  USING (
    (is_active = true AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now()))
    OR public.is_admin()
  );

COMMENT ON POLICY "Banners viewable if active or admin" ON public.system_banners
  IS 'Single consolidated SELECT policy: active banners visible to all, all banners visible to admins';

-- ============================================
-- Consolidate User Achievements Table Policies
-- ============================================
-- Fixes multiple permissive INSERT policies on user_achievements table.
-- Combines "Users can insert own achievements" and
-- "Users can insert their own achievements" into one.
-- ============================================

-- Drop both existing INSERT policies
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;

-- Create single consolidated INSERT policy
CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

COMMENT ON POLICY "Users can insert own achievements" ON public.user_achievements
  IS 'Single consolidated INSERT policy for achievements';
