-- Fix Activity Feed RLS Policy
--
-- The previous policy "Activity feed viewable if public or followed" only checked
-- for public profiles, but did NOT include the follower relationship check.
-- This meant users with private profiles had their activity hidden even from
-- their followers.
--
-- This migration fixes the policy to properly include:
-- 1. User's own activities (always visible to themselves)
-- 2. Activities from public profiles (visible to everyone)
-- 3. Activities from users they follow (even if the profile is private)

-- Drop the existing policy
DROP POLICY IF EXISTS "Activity feed viewable if public or followed" ON public.activity_feed;

-- Create the corrected policy with follower check
CREATE POLICY "Activity feed viewable if public or followed"
  ON public.activity_feed FOR SELECT
  USING (
    -- User can always see their own activities
    (SELECT auth.uid()) = user_id
    -- Anyone can see activities from public profiles
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = activity_feed.user_id AND p.is_public = true
    )
    -- Users can see activities from people they follow (even private profiles)
    OR EXISTS (
      SELECT 1 FROM public.follows f
      WHERE f.following_id = activity_feed.user_id
      AND f.follower_id = (SELECT auth.uid())
    )
  );

-- Update the comment to accurately describe the policy
COMMENT ON POLICY "Activity feed viewable if public or followed" ON public.activity_feed
  IS 'Users can view: own activities, public profile activities, or activities from users they follow';
