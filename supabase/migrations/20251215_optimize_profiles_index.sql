-- Migration: Add composite index for efficient RLS policy checks on public profiles
-- This optimizes the correlated subquery used in follows and activity_feed policies:
--   exists (select 1 from profiles where profiles.id = ... and profiles.is_public = true)
--
-- The partial index (where is_public = true) keeps the index small and focused on
-- the common query pattern, avoiding index bloat from private profiles.

create index if not exists profiles_id_is_public_idx on public.profiles (id, is_public)
  where is_public = true;
