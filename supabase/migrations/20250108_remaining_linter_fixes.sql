-- ============================================
-- Remaining Linter Fixes
-- ============================================
-- Fixes:
-- 1. mark_notifications_read(uuid[]) - missing search_path (old overload)
-- 2. suggestion_votes RLS policies - auth.uid() not wrapped in SELECT
-- 3. admin_emails RLS policy - auth.role() and auth.jwt() not wrapped
-- ============================================

-- ============================================
-- 1. FIX mark_notifications_read FUNCTION
-- ============================================
-- Drop BOTH overloads and recreate with proper search_path

DROP FUNCTION IF EXISTS public.mark_notifications_read(uuid[]);
DROP FUNCTION IF EXISTS public.mark_notifications_read(uuid[], boolean);

-- Create single unified version with search_path
CREATE OR REPLACE FUNCTION public.mark_notifications_read(
  notification_ids uuid[] DEFAULT NULL,
  mark_all boolean DEFAULT false
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  IF mark_all OR notification_ids IS NULL THEN
    UPDATE public.notifications
    SET read = true
    WHERE user_id = auth.uid() AND read = false;
  ELSE
    UPDATE public.notifications
    SET read = true
    WHERE user_id = auth.uid()
      AND id = ANY(notification_ids)
      AND read = false;
  END IF;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_notifications_read(uuid[], boolean) TO authenticated;

-- ============================================
-- 2. FIX suggestion_votes RLS POLICIES
-- ============================================
-- These policies use auth.uid() without SELECT wrapper

DROP POLICY IF EXISTS "Authenticated users can vote" ON public.suggestion_votes;
DROP POLICY IF EXISTS "Authenticated users can unvote" ON public.suggestion_votes;

-- Recreate with optimized (SELECT auth.uid()) pattern
-- Use ::text casts for type safety
CREATE POLICY "Authenticated users can vote"
  ON public.suggestion_votes FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = voter_id::text);

CREATE POLICY "Authenticated users can unvote"
  ON public.suggestion_votes FOR DELETE
  USING ((SELECT auth.uid())::text = voter_id::text);

-- ============================================
-- 3. FIX admin_emails RLS POLICY
-- ============================================
-- The policy uses auth.jwt() without SELECT wrapper

DROP POLICY IF EXISTS "Admin emails viewable for status check or admin" ON public.admin_emails;
DROP POLICY IF EXISTS "Admin emails viewable for status check or by admin" ON public.admin_emails;

-- Recreate with optimized pattern
CREATE POLICY "Admin emails viewable for status check or by admin"
  ON public.admin_emails FOR SELECT
  USING (
    -- Users can check if their own email is admin (using SELECT wrappers)
    ((SELECT auth.uid()) IS NOT NULL AND email = (SELECT auth.jwt()->>'email'))
    OR public.is_admin()
  );

COMMENT ON POLICY "Admin emails viewable for status check or by admin" ON public.admin_emails
  IS 'Optimized: uses SELECT wrappers for auth functions';

-- ============================================
-- 4. ADD MISSING FOREIGN KEY INDEXES
-- ============================================
-- These were flagged as unindexed foreign keys

CREATE INDEX IF NOT EXISTS idx_custom_places_source_suggestion_id
  ON public.custom_places(source_suggestion_id);

CREATE INDEX IF NOT EXISTS idx_notifications_actor_id
  ON public.notifications(actor_id);
