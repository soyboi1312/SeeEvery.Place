-- Enforce lowercase emails in admin_emails table
-- Prevents case-sensitivity issues when checking admin status in middleware
--
-- The middleware queries: .eq('email', user.email?.toLowerCase())
-- If an admin was manually inserted as 'Admin@Example.com', the check would fail.
-- This constraint ensures all emails are stored in lowercase.

-- First, normalize any existing emails to lowercase
update public.admin_emails
set email = lower(email)
where email != lower(email);

-- Add check constraint to enforce lowercase on future inserts/updates
alter table public.admin_emails
add constraint admin_emails_lowercase_check
check (email = lower(email));

-- Also update the is_admin() function comment for clarity
comment on function public.is_admin() is 'Returns true if the current authenticated user email exists in admin_emails table. Emails are compared in lowercase.';
