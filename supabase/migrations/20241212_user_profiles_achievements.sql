-- ============================================
-- User Profiles Enhancement & Achievements System
-- ============================================

-- Add new columns to profiles table for public profiles feature
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS total_xp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS level integer DEFAULT 1;

-- Create index for username lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS profiles_username_lower_idx ON public.profiles(lower(username));

-- ============================================
-- Achievements System
-- ============================================

-- User achievements table to track unlocked achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id text NOT NULL,
  unlocked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  category text, -- which category triggered this achievement (null for global achievements)
  progress_snapshot jsonb, -- snapshot of stats when achievement was unlocked
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can view their own achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own achievements (when unlocked client-side)
CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public profiles can have their achievements viewed by anyone
CREATE POLICY "Public achievements are viewable"
  ON public.user_achievements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_achievements.user_id
      AND profiles.is_public = true
    )
  );

-- Index for faster user achievement lookups
CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS user_achievements_achievement_id_idx ON public.user_achievements(achievement_id);

-- ============================================
-- Profile RLS Updates for Public Profiles
-- ============================================

-- Allow anyone to view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (is_public = true);

-- ============================================
-- Function to check username availability
-- ============================================
CREATE OR REPLACE FUNCTION public.is_username_available(check_username text)
RETURNS boolean AS $$
BEGIN
  -- Username must be at least 3 characters
  IF length(check_username) < 3 THEN
    RETURN false;
  END IF;

  -- Username must be alphanumeric with underscores only
  IF check_username !~ '^[a-zA-Z0-9_]+$' THEN
    RETURN false;
  END IF;

  -- Check if username is already taken (case-insensitive)
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE lower(username) = lower(check_username)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Function to get public profile by username
-- ============================================
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_username text)
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  is_public boolean,
  total_xp integer,
  level integer,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.is_public,
    p.total_xp,
    p.level,
    p.created_at
  FROM public.profiles p
  WHERE lower(p.username) = lower(profile_username)
  AND p.is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Function to calculate user level from XP
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_level(xp integer)
RETURNS integer AS $$
BEGIN
  -- Level formula: Level = floor(sqrt(xp / 100)) + 1
  -- Level 1: 0-99 XP
  -- Level 2: 100-399 XP
  -- Level 3: 400-899 XP
  -- Level 4: 900-1599 XP
  -- etc.
  RETURN GREATEST(1, floor(sqrt(xp::float / 100)) + 1)::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- Trigger to update level when XP changes
-- ============================================
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS trigger AS $$
BEGIN
  NEW.level = public.calculate_level(NEW.total_xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_xp_change ON public.profiles;
CREATE TRIGGER on_xp_change
  BEFORE UPDATE OF total_xp ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_user_level();

-- ============================================
-- Function to get user stats for achievements
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_achievement_stats(target_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  user_selections jsonb;
  result jsonb;
BEGIN
  -- Get user's selections
  SELECT selections INTO user_selections
  FROM public.user_selections
  WHERE user_id = target_user_id;

  IF user_selections IS NULL THEN
    RETURN '{}'::jsonb;
  END IF;

  result = '{}'::jsonb;

  -- Calculate visited counts for each category
  -- This is a simplified version - full calculation happens client-side
  RETURN user_selections;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
