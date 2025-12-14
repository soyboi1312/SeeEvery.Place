-- ============================================
-- Comprehensive RLS Policy Cleanup
-- ============================================
-- Fixes ALL remaining:
-- 1. auth.uid() not wrapped in SELECT (auth_rls_initplan)
-- 2. Multiple permissive policies on same table/action
-- ============================================

-- ============================================
-- PROFILES TABLE
-- ============================================
DROP POLICY IF EXISTS "Profiles are viewable by owner" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Profiles viewable by owner or if public"
  ON public.profiles FOR SELECT
  USING (
    (SELECT auth.uid()) = id
    OR is_public = true
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id);

-- ============================================
-- USER_SELECTIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view own selections" ON public.user_selections;
DROP POLICY IF EXISTS "Users can view their own selections" ON public.user_selections;
DROP POLICY IF EXISTS "Users can update own selections" ON public.user_selections;
DROP POLICY IF EXISTS "Users can update their own selections" ON public.user_selections;
DROP POLICY IF EXISTS "Users can delete own selections" ON public.user_selections;
DROP POLICY IF EXISTS "Users can delete their own selections" ON public.user_selections;

CREATE POLICY "Users can view own selections"
  ON public.user_selections FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own selections"
  ON public.user_selections FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own selections"
  ON public.user_selections FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- VISITS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view own visits" ON public.visits;
DROP POLICY IF EXISTS "Users can view their own visits" ON public.visits;
DROP POLICY IF EXISTS "Users can insert own visits" ON public.visits;
DROP POLICY IF EXISTS "Users can insert their own visits" ON public.visits;
DROP POLICY IF EXISTS "Users can update own visits" ON public.visits;
DROP POLICY IF EXISTS "Users can update their own visits" ON public.visits;

CREATE POLICY "Users can view own visits"
  ON public.visits FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own visits"
  ON public.visits FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own visits"
  ON public.visits FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- USER_CHALLENGES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view own challenge progress" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can view their own challenges" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can update own challenge progress" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can update their own challenges" ON public.user_challenges;

CREATE POLICY "Users can view own challenges"
  ON public.user_challenges FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own challenges"
  ON public.user_challenges FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- USER_ACHIEVEMENTS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Public achievements are viewable" ON public.user_achievements;

CREATE POLICY "Achievements viewable by owner or if public profile"
  ON public.user_achievements FOR SELECT
  USING (
    (SELECT auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_achievements.user_id AND p.is_public = true
    )
  );

-- ============================================
-- USER_ACTIVITY TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can update own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can update their own activity" ON public.user_activity;

CREATE POLICY "Users can view own activity"
  ON public.user_activity FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own activity"
  ON public.user_activity FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- ACTIVITY_FEED TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view activity feed" ON public.activity_feed;
DROP POLICY IF EXISTS "Users can view relevant activities" ON public.activity_feed;
DROP POLICY IF EXISTS "Users can create own activities" ON public.activity_feed;
DROP POLICY IF EXISTS "Users can insert their own activity" ON public.activity_feed;

CREATE POLICY "Activity feed viewable if public or followed"
  ON public.activity_feed FOR SELECT
  USING (
    (SELECT auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = activity_feed.user_id AND p.is_public = true
    )
  );

CREATE POLICY "Users can insert own activities"
  ON public.activity_feed FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ============================================
-- FOLLOWS TABLE (DELETE policies)
-- ============================================
DROP POLICY IF EXISTS "Users can delete their own follows" ON public.follows;
DROP POLICY IF EXISTS "Users can remove followers" ON public.follows;
DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;

-- Single DELETE policy: can unfollow (as follower) OR remove follower (as following)
CREATE POLICY "Users can manage own follows"
  ON public.follows FOR DELETE
  USING (
    (SELECT auth.uid()) = follower_id
    OR (SELECT auth.uid()) = following_id
  );

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- SUGGESTION_VOTES TABLE
-- ============================================
DROP POLICY IF EXISTS "Anyone can unvote" ON public.suggestion_votes;
DROP POLICY IF EXISTS "Authenticated users can insert own votes" ON public.suggestion_votes;
DROP POLICY IF EXISTS "Authenticated users can delete own votes" ON public.suggestion_votes;

CREATE POLICY "Authenticated users can vote"
  ON public.suggestion_votes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND (SELECT auth.uid())::text = voter_id
  );

CREATE POLICY "Authenticated users can unvote"
  ON public.suggestion_votes FOR DELETE
  USING (
    auth.role() = 'authenticated'
    AND (SELECT auth.uid())::text = voter_id
  );

-- ============================================
-- SUGGESTIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Suggestions are viewable based on status and auth" ON public.suggestions;

CREATE POLICY "Suggestions viewable based on status and auth"
  ON public.suggestions FOR SELECT
  USING (
    status IN ('pending', 'approved', 'implemented')
    OR (SELECT auth.role()) = 'authenticated'
  );

-- ============================================
-- CHALLENGES TABLE
-- ============================================
DROP POLICY IF EXISTS "Active challenges are publicly readable" ON public.challenges;
DROP POLICY IF EXISTS "Admins can manage challenges" ON public.challenges;

CREATE POLICY "Challenges viewable if active or admin"
  ON public.challenges FOR SELECT
  USING (
    is_active = true
    OR public.is_admin()
  );

-- ============================================
-- NEWSLETTER_SUBSCRIBERS TABLE
-- ============================================
DROP POLICY IF EXISTS "Admins can insert subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Service role can insert subscribers" ON public.newsletter_subscribers;

-- Only admins can insert (service role bypasses RLS anyway)
CREATE POLICY "Admins can insert subscribers"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (public.is_admin());

-- ============================================
-- ADMIN_EMAILS TABLE
-- ============================================
DROP POLICY IF EXISTS "Admin emails viewable for status check or by admin" ON public.admin_emails;

CREATE POLICY "Admin emails viewable for status check or admin"
  ON public.admin_emails FOR SELECT
  USING (
    (auth.role() = 'authenticated' AND email = (SELECT auth.jwt()->>'email'))
    OR public.is_admin()
  );

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON POLICY "Profiles viewable by owner or if public" ON public.profiles
  IS 'Consolidated: own profile or public profiles';
COMMENT ON POLICY "Activity feed viewable if public or followed" ON public.activity_feed
  IS 'Consolidated: own activities or public profile activities';
COMMENT ON POLICY "Users can manage own follows" ON public.follows
  IS 'Consolidated: unfollow or remove follower';
COMMENT ON POLICY "Achievements viewable by owner or if public profile" ON public.user_achievements
  IS 'Consolidated: own achievements or public profile achievements';
