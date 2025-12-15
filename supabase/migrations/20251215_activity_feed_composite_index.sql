-- Migration: Add composite index for efficient activity feed queries
-- This index covers both the filter (activity_type) and sort (created_at DESC)
-- Allows Postgres to scan directly in correct order without memory sort
-- Critical for scalability as the activity_feed table grows

create index concurrently if not exists activity_feed_type_time_idx
on public.activity_feed(activity_type, created_at desc);
