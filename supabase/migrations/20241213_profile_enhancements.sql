-- ============================================
-- Profile Enhancements: Social Links, Privacy, Home Base, Preferences
-- ============================================

-- Add social media links
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS instagram_handle text,
ADD COLUMN IF NOT EXISTS twitter_handle text;

-- Add granular privacy settings (which categories to hide from public profile)
-- Example: { "hide_categories": ["cities", "airports"], "hide_bucket_list": true }
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS privacy_settings jsonb DEFAULT '{}'::jsonb;

-- Add home base location
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS home_city text,
ADD COLUMN IF NOT EXISTS home_state text,
ADD COLUMN IF NOT EXISTS home_country text,
ADD COLUMN IF NOT EXISTS show_home_base boolean DEFAULT false;

-- Add user preferences
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS default_map_view text DEFAULT 'world' CHECK (default_map_view IN ('world', 'usa'));

-- ============================================
-- Update get_public_profile function to include new fields
-- Must drop first because return type is changing
-- ============================================
DROP FUNCTION IF EXISTS public.get_public_profile(text);

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
  created_at timestamp with time zone,
  website_url text,
  instagram_handle text,
  twitter_handle text,
  home_city text,
  home_state text,
  home_country text,
  show_home_base boolean,
  privacy_settings jsonb
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
    p.created_at,
    p.website_url,
    p.instagram_handle,
    p.twitter_handle,
    p.home_city,
    p.home_state,
    p.home_country,
    p.show_home_base,
    p.privacy_settings
  FROM public.profiles p
  WHERE lower(p.username) = lower(profile_username)
  AND p.is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Validate social media handles format
-- ============================================
CREATE OR REPLACE FUNCTION public.validate_social_handle(handle text)
RETURNS boolean AS $$
BEGIN
  -- Handles should be alphanumeric with underscores, 1-30 chars
  -- Or empty/null
  IF handle IS NULL OR handle = '' THEN
    RETURN true;
  END IF;

  -- Remove @ prefix if present
  handle = ltrim(handle, '@');

  RETURN handle ~ '^[a-zA-Z0-9_]{1,30}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- Validate website URL format
-- ============================================
CREATE OR REPLACE FUNCTION public.validate_website_url(url text)
RETURNS boolean AS $$
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN true;
  END IF;

  -- Basic URL validation - starts with http(s)://
  RETURN url ~ '^https?://[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+';
END;
$$ LANGUAGE plpgsql IMMUTABLE;
