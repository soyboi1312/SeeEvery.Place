-- ============================================
-- Optimize RLS Policies: Wrap auth.uid() in subqueries
-- ============================================
-- Fixes performance issue where auth.uid() is re-evaluated for each row.
-- Wrapping in (SELECT auth.uid()) causes it to be evaluated once and cached.
-- See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
-- ============================================

-- ============================================
-- PROFILES TABLE
-- ============================================

DROP POLICY IF EXISTS "Profiles are viewable by owner" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles FOR SELECT
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id);

-- ============================================
-- USER_SELECTIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own selections" ON public.user_selections;
CREATE POLICY "Users can view own selections"
  ON public.user_selections FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own selections" ON public.user_selections;
CREATE POLICY "Users can insert own selections"
  ON public.user_selections FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own selections" ON public.user_selections;
CREATE POLICY "Users can update own selections"
  ON public.user_selections FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own selections" ON public.user_selections;
CREATE POLICY "Users can delete own selections"
  ON public.user_selections FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- FOLLOWS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own follows" ON public.follows;
CREATE POLICY "Users can view own follows"
  ON public.follows FOR SELECT
  USING (
    (SELECT auth.uid()) = follower_id OR
    (SELECT auth.uid()) = following_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = follows.following_id
      AND profiles.is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE
  USING ((SELECT auth.uid()) = follower_id);

DROP POLICY IF EXISTS "Users can remove followers" ON public.follows;
CREATE POLICY "Users can remove followers"
  ON public.follows FOR DELETE
  USING ((SELECT auth.uid()) = following_id);

-- ============================================
-- ACTIVITY_FEED TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view relevant activities" ON public.activity_feed;
CREATE POLICY "Users can view relevant activities"
  ON public.activity_feed FOR SELECT
  USING (
    (SELECT auth.uid()) = user_id OR
    EXISTS (
      SELECT 1 FROM public.follows f
      JOIN public.profiles p ON p.id = activity_feed.user_id
      WHERE f.follower_id = (SELECT auth.uid())
      AND f.following_id = activity_feed.user_id
      AND p.is_public = true
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = activity_feed.user_id
      AND profiles.is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can create own activities" ON public.activity_feed;
CREATE POLICY "Users can create own activities"
  ON public.activity_feed FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ============================================
-- ACTIVITY_REACTIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can add reactions" ON public.activity_reactions;
CREATE POLICY "Users can add reactions"
  ON public.activity_reactions FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can remove own reactions" ON public.activity_reactions;
CREATE POLICY "Users can remove own reactions"
  ON public.activity_reactions FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- SUGGESTION_VOTES TABLE (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suggestion_votes') THEN
    DROP POLICY IF EXISTS "Allow authenticated users to insert their own vote" ON public.suggestion_votes;
    CREATE POLICY "Allow authenticated users to insert their own vote"
      ON public.suggestion_votes FOR INSERT
      WITH CHECK (
        auth.role() = 'authenticated'
        AND (SELECT auth.uid())::text = voter_id
      );

    DROP POLICY IF EXISTS "Allow authenticated users to delete their own vote" ON public.suggestion_votes;
    CREATE POLICY "Allow authenticated users to delete their own vote"
      ON public.suggestion_votes FOR DELETE
      USING (
        auth.role() = 'authenticated'
        AND (SELECT auth.uid())::text = voter_id
      );
  END IF;
END $$;

COMMENT ON POLICY "Profiles are viewable by owner" ON public.profiles IS 'Optimized: auth.uid() wrapped in SELECT for single evaluation';
