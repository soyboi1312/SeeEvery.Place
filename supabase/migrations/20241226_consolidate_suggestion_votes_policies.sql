-- ============================================
-- Consolidate Suggestion Votes Table Policies
-- ============================================
-- Fixes multiple permissive INSERT/DELETE policies on suggestion_votes table.
-- ============================================

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Anyone can vote" ON public.suggestion_votes;
DROP POLICY IF EXISTS "Authenticated users can vote" ON public.suggestion_votes;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own vote" ON public.suggestion_votes;

-- Create single consolidated INSERT policy
CREATE POLICY "Authenticated users can insert own votes"
  ON public.suggestion_votes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND (SELECT auth.uid())::text = voter_id
  );

-- Drop all existing DELETE policies
DROP POLICY IF EXISTS "Users can unvote their own votes" ON public.suggestion_votes;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own vote" ON public.suggestion_votes;

-- Create single consolidated DELETE policy
CREATE POLICY "Authenticated users can delete own votes"
  ON public.suggestion_votes FOR DELETE
  USING (
    auth.role() = 'authenticated'
    AND (SELECT auth.uid())::text = voter_id
  );

COMMENT ON POLICY "Authenticated users can insert own votes" ON public.suggestion_votes
  IS 'Single consolidated INSERT policy for voting';
COMMENT ON POLICY "Authenticated users can delete own votes" ON public.suggestion_votes
  IS 'Single consolidated DELETE policy for unvoting';
