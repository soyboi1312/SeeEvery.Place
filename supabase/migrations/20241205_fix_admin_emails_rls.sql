-- Fix circular dependency in admin_emails RLS
-- The is_admin() function needs to read admin_emails, but the SELECT policy
-- required is_admin() to be true - creating a circular dependency.

-- Drop the problematic SELECT policy
DROP POLICY IF EXISTS "Only admins can view admin_emails" ON public.admin_emails;

-- Allow authenticated users to check if their own email is in the admin list
-- This is necessary for the middleware to verify admin status
CREATE POLICY "Authenticated users can check own admin status"
  ON public.admin_emails FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND email = lower(auth.jwt() ->> 'email')
  );

-- Keep the INSERT/DELETE policies restricted to existing admins
-- (These still work because they use is_admin() which can now query the table)
