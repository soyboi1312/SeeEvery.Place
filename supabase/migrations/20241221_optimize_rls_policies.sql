-- ============================================
-- Optimize RLS Policies for Performance
-- Replace auth.uid() with (select auth.uid()) to prevent
-- re-evaluation for each row
-- ============================================

-- ============================================
-- PROFILES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = (select auth.uid()));

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (is_public = true);

-- ============================================
-- USER_SELECTIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their own selections" ON public.user_selections;
DROP POLICY IF EXISTS "Users can insert their own selections" ON public.user_selections;
DROP POLICY IF EXISTS "Users can update their own selections" ON public.user_selections;
DROP POLICY IF EXISTS "Users can delete their own selections" ON public.user_selections;

CREATE POLICY "Users can view their own selections"
  ON public.user_selections FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own selections"
  ON public.user_selections FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own selections"
  ON public.user_selections FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own selections"
  ON public.user_selections FOR DELETE
  USING ((select auth.uid()) = user_id);

-- ============================================
-- USER_ACHIEVEMENTS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;

CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- Public achievements policy (for public profiles)
DROP POLICY IF EXISTS "Public achievements are viewable" ON public.user_achievements;
CREATE POLICY "Public achievements are viewable"
  ON public.user_achievements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_id AND p.is_public = true
    )
  );

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING ((select auth.uid()) = user_id);

-- ============================================
-- FOLLOWS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view follows" ON public.follows;
DROP POLICY IF EXISTS "Users can create follows" ON public.follows;
DROP POLICY IF EXISTS "Users can delete their own follows" ON public.follows;
DROP POLICY IF EXISTS "Anyone can see public follows" ON public.follows;

CREATE POLICY "Users can view follows"
  ON public.follows FOR SELECT
  USING (
    (select auth.uid()) = follower_id OR
    (select auth.uid()) = following_id OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE (p.id = follower_id OR p.id = following_id) AND p.is_public = true
    )
  );

CREATE POLICY "Users can create follows"
  ON public.follows FOR INSERT
  WITH CHECK ((select auth.uid()) = follower_id);

CREATE POLICY "Users can delete their own follows"
  ON public.follows FOR DELETE
  USING ((select auth.uid()) = follower_id);

-- ============================================
-- ACTIVITY_FEED TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view activity feed" ON public.activity_feed;
DROP POLICY IF EXISTS "Users can insert their own activity" ON public.activity_feed;

CREATE POLICY "Users can view activity feed"
  ON public.activity_feed FOR SELECT
  USING (
    (select auth.uid()) = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_id AND p.is_public = true
    ) OR
    EXISTS (
      SELECT 1 FROM public.follows f
      WHERE f.follower_id = (select auth.uid())
      AND f.following_id = user_id
    )
  );

CREATE POLICY "Users can insert their own activity"
  ON public.activity_feed FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================
-- VISITS TABLE (if exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'visits') THEN
    DROP POLICY IF EXISTS "Users can view their own visits" ON public.visits;
    DROP POLICY IF EXISTS "Users can insert their own visits" ON public.visits;
    DROP POLICY IF EXISTS "Users can update their own visits" ON public.visits;
    DROP POLICY IF EXISTS "Users can delete their own visits" ON public.visits;

    EXECUTE 'CREATE POLICY "Users can view their own visits" ON public.visits FOR SELECT USING ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own visits" ON public.visits FOR INSERT WITH CHECK ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own visits" ON public.visits FOR UPDATE USING ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can delete their own visits" ON public.visits FOR DELETE USING ((select auth.uid()) = user_id)';
  END IF;
END $$;

-- ============================================
-- USER_CHALLENGES TABLE (if exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_challenges') THEN
    DROP POLICY IF EXISTS "Users can view their own challenges" ON public.user_challenges;
    DROP POLICY IF EXISTS "Users can insert their own challenges" ON public.user_challenges;
    DROP POLICY IF EXISTS "Users can update their own challenges" ON public.user_challenges;
    DROP POLICY IF EXISTS "Users can delete their own challenges" ON public.user_challenges;

    EXECUTE 'CREATE POLICY "Users can view their own challenges" ON public.user_challenges FOR SELECT USING ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own challenges" ON public.user_challenges FOR INSERT WITH CHECK ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own challenges" ON public.user_challenges FOR UPDATE USING ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can delete their own challenges" ON public.user_challenges FOR DELETE USING ((select auth.uid()) = user_id)';
  END IF;
END $$;

-- ============================================
-- CUSTOM_PLACES TABLE (if exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_places') THEN
    DROP POLICY IF EXISTS "Admins can view all custom places" ON public.custom_places;
    DROP POLICY IF EXISTS "Admins can insert custom places" ON public.custom_places;
    DROP POLICY IF EXISTS "Admins can update custom places" ON public.custom_places;
    DROP POLICY IF EXISTS "Anyone can view approved custom places" ON public.custom_places;

    -- Admin check using optimized subquery
    EXECUTE 'CREATE POLICY "Admins can view all custom places" ON public.custom_places FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = (select auth.uid())))';
    EXECUTE 'CREATE POLICY "Admins can insert custom places" ON public.custom_places FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = (select auth.uid())))';
    EXECUTE 'CREATE POLICY "Admins can update custom places" ON public.custom_places FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = (select auth.uid())))';
    EXECUTE 'CREATE POLICY "Anyone can view approved custom places" ON public.custom_places FOR SELECT USING (status = ''approved'')';
  END IF;
END $$;

-- ============================================
-- USER_STREAKS TABLE (if exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_streaks') THEN
    DROP POLICY IF EXISTS "Users can view their own streaks" ON public.user_streaks;
    DROP POLICY IF EXISTS "Users can insert their own streaks" ON public.user_streaks;
    DROP POLICY IF EXISTS "Users can update their own streaks" ON public.user_streaks;

    EXECUTE 'CREATE POLICY "Users can view their own streaks" ON public.user_streaks FOR SELECT USING ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own streaks" ON public.user_streaks FOR INSERT WITH CHECK ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own streaks" ON public.user_streaks FOR UPDATE USING ((select auth.uid()) = user_id)';
  END IF;
END $$;

-- ============================================
-- USER_ACTIVITY TABLE (if exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activity') THEN
    DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
    DROP POLICY IF EXISTS "Users can insert their own activity" ON public.user_activity;
    DROP POLICY IF EXISTS "Users can update their own activity" ON public.user_activity;

    EXECUTE 'CREATE POLICY "Users can view their own activity" ON public.user_activity FOR SELECT USING ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own activity" ON public.user_activity FOR INSERT WITH CHECK ((select auth.uid()) = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own activity" ON public.user_activity FOR UPDATE USING ((select auth.uid()) = user_id)';
  END IF;
END $$;

-- ============================================
-- PLACE_STATS TABLE (if exists) - public read
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'place_stats') THEN
    DROP POLICY IF EXISTS "Anyone can view place stats" ON public.place_stats;
    EXECUTE 'CREATE POLICY "Anyone can view place stats" ON public.place_stats FOR SELECT USING (true)';
  END IF;
END $$;
