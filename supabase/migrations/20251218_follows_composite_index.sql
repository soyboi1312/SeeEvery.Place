-- Migration: Add composite index on follows for RLS policy optimization
-- The activity_feed RLS policy performs a correlated subquery joining follows + profiles.
-- This composite index covers the exact lookup pattern: (follower_id, following_id)
-- Without this index, each row scan requires individual index lookups on both columns.
-- With this index, Postgres can satisfy the query in a single B-tree traversal.

-- Use CONCURRENTLY to avoid blocking reads/writes on the follows table
CREATE INDEX CONCURRENTLY IF NOT EXISTS follows_lookup_idx
ON public.follows(follower_id, following_id);
