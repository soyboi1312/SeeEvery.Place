-- ============================================
-- Fix Admin Logs RLS Policy (Security)
-- ============================================
-- ISSUE: The INSERT policy "Service role can insert logs" uses WITH CHECK (true)
-- which allows ANY authenticated user to insert fake admin log entries.
--
-- The original intent was that only server-side code with service role key
-- would insert logs. However, service role bypasses RLS entirely, so the
-- permissive policy is unnecessary and creates a security vulnerability.
--
-- FIX: Remove the permissive INSERT policy. Service role will still work
-- because it bypasses RLS. Regular authenticated users will be blocked.
-- ============================================

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Service role can insert logs" ON public.admin_logs;

-- Verify: There should be no INSERT policy for regular users
-- Service role (used by createAdminClient) bypasses RLS entirely
-- This means only server-side admin code can insert logs

COMMENT ON TABLE public.admin_logs IS
'Immutable audit trail of admin actions.
INSERT: Only via service role (createAdminClient) - no RLS policy needed.
SELECT: Only admins can view (is_admin() check).
UPDATE/DELETE: Not allowed - immutable audit trail.';
