-- IP Address Retention Policy
-- Implements automatic deletion of IP addresses after 90 days to comply with Privacy Policy
--
-- IMPORTANT: This requires pg_cron extension to be enabled in your Supabase project.
-- Go to Database > Extensions in Supabase dashboard and enable pg_cron.

-- Enable the pg_cron extension (requires Supabase to have it available)
create extension if not exists pg_cron;

-- Create a scheduled job to nullify IP addresses from suggestions older than 90 days
-- Runs every day at 3:00 AM UTC
-- We set to NULL rather than delete the row to preserve the suggestion data
select cron.schedule(
  'nullify-old-suggestion-ips',
  '0 3 * * *',
  $$
    update public.suggestions
    set submitter_ip = null
    where created_at < (now() - interval '90 days')
    and submitter_ip is not null;
  $$
);

-- Add a comment explaining the job
comment on extension pg_cron is 'Job scheduler for PostgreSQL - used for GDPR-compliant IP retention policy';
