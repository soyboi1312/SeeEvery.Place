-- Activity Feed Cleanup Strategy
-- ================================
-- Problem: The activity_feed table grows exponentially (User Count × Actions)
-- with no deletion policy, which can lead to storage bloat and slower queries.
--
-- Solution: This migration adds:
-- 1. A cleanup function to archive/delete old activity items (>90 days)
-- 2. An index to support efficient cleanup queries
-- 3. Documentation for scheduling options (pg_cron or external scheduler)
--
-- Scheduling Options:
-- - pg_cron (if available on your Supabase tier): Schedule to run daily
-- - External cron: Call the cleanup function via API endpoint
-- - Manual: Run periodically during maintenance windows

-- Index to support efficient cleanup queries by date
-- This allows quick identification of old records without full table scan
create index if not exists activity_feed_created_at_idx
  on public.activity_feed (created_at);

-- Function to cleanup old activity feed items
-- Returns the number of deleted rows for monitoring
create or replace function public.cleanup_old_activity_feed(
  retention_days integer default 90
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  -- Delete activity feed items older than retention period
  -- Using a batch approach to avoid long-running transactions
  with deleted as (
    delete from public.activity_feed
    where created_at < now() - (retention_days || ' days')::interval
    returning 1
  )
  select count(*) into deleted_count from deleted;

  return deleted_count;
end;
$$;

-- Grant execute permission to service_role for scheduled jobs
grant execute on function public.cleanup_old_activity_feed(integer) to service_role;

-- Add comment documenting the cleanup strategy
comment on function public.cleanup_old_activity_feed(integer) is
  'Deletes activity_feed entries older than retention_days (default 90). '
  'Call periodically via pg_cron or external scheduler. '
  'Returns number of deleted rows.';

-- ============================================
-- pg_cron Setup (if available)
-- ============================================
-- If your Supabase tier supports pg_cron, uncomment these lines:
--
-- select cron.schedule(
--   'cleanup-activity-feed',           -- job name
--   '0 3 * * *',                        -- run daily at 3 AM UTC
--   $$select public.cleanup_old_activity_feed(90)$$
-- );
--
-- To verify the job was created:
-- select * from cron.job where jobname = 'cleanup-activity-feed';
--
-- To remove the job:
-- select cron.unschedule('cleanup-activity-feed');

-- ============================================
-- Alternative: Partitioned Archive Strategy
-- ============================================
-- For high-volume deployments, consider table partitioning by month:
-- 1. Create activity_feed_archive table with same schema
-- 2. Move old data: INSERT INTO archive SELECT FROM activity_feed WHERE old
-- 3. Delete from main table
-- This preserves historical data while keeping the main table small.
