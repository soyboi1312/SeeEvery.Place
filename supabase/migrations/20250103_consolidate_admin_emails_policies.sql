-- ============================================
-- Consolidate Admin Emails Table Policies
-- ============================================
-- Fixes multiple permissive SELECT policies on admin_emails table.
-- ============================================

-- Drop both existing SELECT policies
DROP POLICY IF EXISTS "Admins can view all admin emails" ON public.admin_emails;
DROP POLICY IF EXISTS "Authenticated users can check own admin status" ON public.admin_emails;

-- Create single consolidated SELECT policy
-- Logic:
--   - Authenticated users can check if their email is in the admin list
--   - Admins can view all admin emails
CREATE POLICY "Admin emails viewable for status check or by admin"
  ON public.admin_emails FOR SELECT
  USING (
    -- Users can check if their own email is admin
    (auth.role() = 'authenticated' AND email = auth.jwt()->>'email')
    OR public.is_admin()
  );

COMMENT ON POLICY "Admin emails viewable for status check or by admin" ON public.admin_emails
  IS 'Single consolidated SELECT policy: own email check or full admin access';
