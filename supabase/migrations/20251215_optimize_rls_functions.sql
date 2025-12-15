-- Optimize RLS function performance by marking them as STABLE
--
-- By default, Postgres treats functions as VOLATILE (re-evaluated on every row).
-- Since a user's admin status doesn't change during a single query,
-- marking these as STABLE allows the query planner to optimize RLS checks
-- by only evaluating the function once per statement instead of per row.
--
-- This significantly improves query performance on tables with RLS policies
-- that use these functions (e.g., admin-only operations on suggestions, users, etc.)

-- Mark is_admin() as STABLE
-- The admin status is determined by JWT claims which don't change during a query
ALTER FUNCTION public.is_admin() STABLE;

-- Mark is_super_admin() as STABLE for the same reason
ALTER FUNCTION public.is_super_admin() STABLE;
