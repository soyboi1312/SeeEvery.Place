-- ============================================
-- Consolidate Newsletter Send Logs Table Policies
-- ============================================
-- Fixes multiple permissive SELECT policies on newsletter_send_logs table.
-- ============================================

-- Drop both existing SELECT policies
DROP POLICY IF EXISTS "Admins can view all send logs" ON public.newsletter_send_logs;
DROP POLICY IF EXISTS "Service role can manage send logs" ON public.newsletter_send_logs;

-- Create single consolidated SELECT policy
-- Logic: Admins can view send logs (service role bypasses RLS anyway)
CREATE POLICY "Send logs viewable by admin"
  ON public.newsletter_send_logs FOR SELECT
  USING (public.is_admin());

COMMENT ON POLICY "Send logs viewable by admin" ON public.newsletter_send_logs
  IS 'Single consolidated SELECT policy: admin access only (service role bypasses RLS)';
