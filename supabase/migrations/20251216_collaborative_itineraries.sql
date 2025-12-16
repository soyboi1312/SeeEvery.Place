-- ============================================
-- Collaborative Itineraries (Trips) Feature
-- ============================================
-- This migration adds:
-- 1. Itineraries table for trip containers
-- 2. Itinerary items table for places in trips
-- 3. Itinerary collaborators table for sharing
-- 4. RLS policies for security
-- 5. Helper functions for CRUD operations
-- 6. Notification trigger for trip invites
-- ============================================

-- ============================================
-- 1. ITINERARIES TABLE (Trip Containers)
-- ============================================

CREATE TABLE IF NOT EXISTS public.itineraries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  start_date date,
  end_date date,
  is_public boolean DEFAULT false,
  cover_image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS itineraries_owner_id_idx ON public.itineraries(owner_id);
CREATE INDEX IF NOT EXISTS itineraries_is_public_idx ON public.itineraries(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS itineraries_created_at_idx ON public.itineraries(created_at DESC);

-- ============================================
-- 2. ITINERARY ITEMS TABLE (Places in Trips)
-- ============================================

CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id uuid REFERENCES public.itineraries(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,  -- matches CATEGORY_SCHEMA keys
  place_id text NOT NULL,  -- matches IDs in data files
  place_name text NOT NULL,  -- denormalized for performance
  notes text,
  sort_order integer DEFAULT 0,
  day_number integer,  -- optional: which day of the trip
  added_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS itinerary_items_itinerary_id_idx ON public.itinerary_items(itinerary_id);
CREATE INDEX IF NOT EXISTS itinerary_items_sort_order_idx ON public.itinerary_items(itinerary_id, sort_order);
CREATE INDEX IF NOT EXISTS itinerary_items_category_place_idx ON public.itinerary_items(category, place_id);

-- ============================================
-- 3. ITINERARY COLLABORATORS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.itinerary_collaborators (
  itinerary_id uuid REFERENCES public.itineraries(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'editor' CHECK (role IN ('editor', 'viewer')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (itinerary_id, user_id)
);

-- Enable RLS
ALTER TABLE public.itinerary_collaborators ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS itinerary_collaborators_user_id_idx ON public.itinerary_collaborators(user_id);

-- ============================================
-- 4. RLS POLICIES - Itineraries
-- ============================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "View itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "Insert itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "Update itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "Delete itineraries" ON public.itineraries;

-- View: Owners, Collaborators, or Public
CREATE POLICY "View itineraries" ON public.itineraries FOR SELECT
USING (
  auth.uid() = owner_id OR
  is_public = true OR
  EXISTS (
    SELECT 1 FROM public.itinerary_collaborators
    WHERE itinerary_id = id AND user_id = auth.uid()
  )
);

-- Insert: Authenticated users can create itineraries
CREATE POLICY "Insert itineraries" ON public.itineraries FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Update: Owners or Editors
CREATE POLICY "Update itineraries" ON public.itineraries FOR UPDATE
USING (
  auth.uid() = owner_id OR
  EXISTS (
    SELECT 1 FROM public.itinerary_collaborators
    WHERE itinerary_id = id AND user_id = auth.uid() AND role = 'editor'
  )
);

-- Delete: Owners only
CREATE POLICY "Delete itineraries" ON public.itineraries FOR DELETE
USING (auth.uid() = owner_id);

-- ============================================
-- 5. RLS POLICIES - Itinerary Items
-- ============================================

DROP POLICY IF EXISTS "View itinerary items" ON public.itinerary_items;
DROP POLICY IF EXISTS "Insert itinerary items" ON public.itinerary_items;
DROP POLICY IF EXISTS "Update itinerary items" ON public.itinerary_items;
DROP POLICY IF EXISTS "Delete itinerary items" ON public.itinerary_items;

-- View: Same as parent itinerary access
CREATE POLICY "View itinerary items" ON public.itinerary_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_id AND (
      i.owner_id = auth.uid() OR
      i.is_public = true OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators c
        WHERE c.itinerary_id = i.id AND c.user_id = auth.uid()
      )
    )
  )
);

-- Insert: Owners or Editors
CREATE POLICY "Insert itinerary items" ON public.itinerary_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_id AND (
      i.owner_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators c
        WHERE c.itinerary_id = i.id AND c.user_id = auth.uid() AND c.role = 'editor'
      )
    )
  )
);

-- Update: Owners or Editors
CREATE POLICY "Update itinerary items" ON public.itinerary_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_id AND (
      i.owner_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators c
        WHERE c.itinerary_id = i.id AND c.user_id = auth.uid() AND c.role = 'editor'
      )
    )
  )
);

-- Delete: Owners or Editors
CREATE POLICY "Delete itinerary items" ON public.itinerary_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_id AND (
      i.owner_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators c
        WHERE c.itinerary_id = i.id AND c.user_id = auth.uid() AND c.role = 'editor'
      )
    )
  )
);

-- ============================================
-- 6. RLS POLICIES - Itinerary Collaborators
-- ============================================

DROP POLICY IF EXISTS "View itinerary collaborators" ON public.itinerary_collaborators;
DROP POLICY IF EXISTS "Insert itinerary collaborators" ON public.itinerary_collaborators;
DROP POLICY IF EXISTS "Update itinerary collaborators" ON public.itinerary_collaborators;
DROP POLICY IF EXISTS "Delete itinerary collaborators" ON public.itinerary_collaborators;

-- View: Anyone who can see the itinerary
CREATE POLICY "View itinerary collaborators" ON public.itinerary_collaborators FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_id AND (
      i.owner_id = auth.uid() OR
      i.is_public = true OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators c
        WHERE c.itinerary_id = i.id AND c.user_id = auth.uid()
      )
    )
  )
);

-- Insert: Only itinerary owners can add collaborators
CREATE POLICY "Insert itinerary collaborators" ON public.itinerary_collaborators FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_id AND i.owner_id = auth.uid()
  )
);

-- Update: Only itinerary owners can change roles
CREATE POLICY "Update itinerary collaborators" ON public.itinerary_collaborators FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_id AND i.owner_id = auth.uid()
  )
);

-- Delete: Owners can remove collaborators, collaborators can remove themselves
CREATE POLICY "Delete itinerary collaborators" ON public.itinerary_collaborators FOR DELETE
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_id AND i.owner_id = auth.uid()
  )
);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to get user's itineraries (owned + collaborating)
CREATE OR REPLACE FUNCTION public.get_user_itineraries(
  page_limit integer DEFAULT 20,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  owner_id uuid,
  owner_username text,
  owner_avatar_url text,
  title text,
  description text,
  start_date date,
  end_date date,
  is_public boolean,
  cover_image_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  item_count bigint,
  collaborator_count bigint,
  user_role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.owner_id,
    p.username as owner_username,
    p.avatar_url as owner_avatar_url,
    i.title,
    i.description,
    i.start_date,
    i.end_date,
    i.is_public,
    i.cover_image_url,
    i.created_at,
    i.updated_at,
    (SELECT COUNT(*) FROM public.itinerary_items ii WHERE ii.itinerary_id = i.id) as item_count,
    (SELECT COUNT(*) FROM public.itinerary_collaborators ic WHERE ic.itinerary_id = i.id) as collaborator_count,
    CASE
      WHEN i.owner_id = auth.uid() THEN 'owner'
      ELSE COALESCE((SELECT role FROM public.itinerary_collaborators c WHERE c.itinerary_id = i.id AND c.user_id = auth.uid()), 'viewer')
    END as user_role
  FROM public.itineraries i
  LEFT JOIN public.profiles p ON p.id = i.owner_id
  WHERE
    i.owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.itinerary_collaborators c
      WHERE c.itinerary_id = i.id AND c.user_id = auth.uid()
    )
  ORDER BY i.updated_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_itineraries(integer, integer) TO authenticated;

-- Function to get a single itinerary with full details
CREATE OR REPLACE FUNCTION public.get_itinerary_details(
  itinerary_uuid uuid
)
RETURNS TABLE (
  id uuid,
  owner_id uuid,
  owner_username text,
  owner_avatar_url text,
  title text,
  description text,
  start_date date,
  end_date date,
  is_public boolean,
  cover_image_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  user_role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.owner_id,
    p.username as owner_username,
    p.avatar_url as owner_avatar_url,
    i.title,
    i.description,
    i.start_date,
    i.end_date,
    i.is_public,
    i.cover_image_url,
    i.created_at,
    i.updated_at,
    CASE
      WHEN i.owner_id = auth.uid() THEN 'owner'
      WHEN EXISTS (SELECT 1 FROM public.itinerary_collaborators c WHERE c.itinerary_id = i.id AND c.user_id = auth.uid() AND c.role = 'editor') THEN 'editor'
      WHEN EXISTS (SELECT 1 FROM public.itinerary_collaborators c WHERE c.itinerary_id = i.id AND c.user_id = auth.uid()) THEN 'viewer'
      WHEN i.is_public THEN 'public'
      ELSE NULL
    END as user_role
  FROM public.itineraries i
  LEFT JOIN public.profiles p ON p.id = i.owner_id
  WHERE
    i.id = itinerary_uuid AND (
      i.owner_id = auth.uid() OR
      i.is_public = true OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators c
        WHERE c.itinerary_id = i.id AND c.user_id = auth.uid()
      )
    );
END;
$$;

-- Grant execute to authenticated and anon users (public itineraries)
GRANT EXECUTE ON FUNCTION public.get_itinerary_details(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_itinerary_details(uuid) TO anon;

-- Function to get itinerary items with metadata
CREATE OR REPLACE FUNCTION public.get_itinerary_items(
  itinerary_uuid uuid
)
RETURNS TABLE (
  id uuid,
  itinerary_id uuid,
  category text,
  place_id text,
  place_name text,
  notes text,
  sort_order integer,
  day_number integer,
  added_by uuid,
  added_by_username text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First check access to the itinerary
  IF NOT EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_uuid AND (
      i.owner_id = auth.uid() OR
      i.is_public = true OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators c
        WHERE c.itinerary_id = i.id AND c.user_id = auth.uid()
      )
    )
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    ii.id,
    ii.itinerary_id,
    ii.category,
    ii.place_id,
    ii.place_name,
    ii.notes,
    ii.sort_order,
    ii.day_number,
    ii.added_by,
    p.username as added_by_username,
    ii.created_at
  FROM public.itinerary_items ii
  LEFT JOIN public.profiles p ON p.id = ii.added_by
  WHERE ii.itinerary_id = itinerary_uuid
  ORDER BY ii.day_number NULLS LAST, ii.sort_order;
END;
$$;

-- Grant execute to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_itinerary_items(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_itinerary_items(uuid) TO anon;

-- Function to get collaborators for an itinerary
CREATE OR REPLACE FUNCTION public.get_itinerary_collaborators(
  itinerary_uuid uuid
)
RETURNS TABLE (
  user_id uuid,
  username text,
  avatar_url text,
  full_name text,
  role text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First check access to the itinerary
  IF NOT EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = itinerary_uuid AND (
      i.owner_id = auth.uid() OR
      i.is_public = true OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators c
        WHERE c.itinerary_id = i.id AND c.user_id = auth.uid()
      )
    )
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    c.user_id,
    p.username,
    p.avatar_url,
    p.full_name,
    c.role,
    c.created_at
  FROM public.itinerary_collaborators c
  JOIN public.profiles p ON p.id = c.user_id
  WHERE c.itinerary_id = itinerary_uuid
  ORDER BY c.created_at;
END;
$$;

-- Grant execute to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_itinerary_collaborators(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_itinerary_collaborators(uuid) TO anon;

-- Function to get public itineraries for a user profile
CREATE OR REPLACE FUNCTION public.get_user_public_itineraries(
  target_user_id uuid,
  page_limit integer DEFAULT 10,
  page_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  start_date date,
  end_date date,
  cover_image_url text,
  created_at timestamp with time zone,
  item_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.title,
    i.description,
    i.start_date,
    i.end_date,
    i.cover_image_url,
    i.created_at,
    (SELECT COUNT(*) FROM public.itinerary_items ii WHERE ii.itinerary_id = i.id) as item_count
  FROM public.itineraries i
  WHERE
    i.owner_id = target_user_id AND
    i.is_public = true
  ORDER BY i.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;

-- Grant execute to everyone (public profiles)
GRANT EXECUTE ON FUNCTION public.get_user_public_itineraries(uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_public_itineraries(uuid, integer, integer) TO anon;

-- ============================================
-- 8. NOTIFICATION TRIGGER FOR TRIP INVITES
-- ============================================

-- Function to create notification when someone is invited to collaborate
CREATE OR REPLACE FUNCTION public.handle_itinerary_invite()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inviter_profile RECORD;
  itinerary_record RECORD;
BEGIN
  -- Get inviter's profile info (the itinerary owner)
  SELECT username, avatar_url, full_name
  INTO inviter_profile
  FROM public.profiles
  WHERE id = (SELECT owner_id FROM public.itineraries WHERE id = NEW.itinerary_id);

  -- Get itinerary info
  SELECT title INTO itinerary_record
  FROM public.itineraries
  WHERE id = NEW.itinerary_id;

  -- Create notification for the invited user
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    actor_id,
    actor_username,
    actor_avatar_url,
    data
  ) VALUES (
    NEW.user_id,
    'trip_invite',
    'Trip Invitation',
    COALESCE(inviter_profile.username, inviter_profile.full_name, 'Someone') ||
      ' invited you to collaborate on "' || itinerary_record.title || '"',
    (SELECT owner_id FROM public.itineraries WHERE id = NEW.itinerary_id),
    inviter_profile.username,
    inviter_profile.avatar_url,
    jsonb_build_object(
      'itinerary_id', NEW.itinerary_id,
      'role', NEW.role
    )
  );

  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_itinerary_invite ON public.itinerary_collaborators;

-- Create trigger for new collaborator invites
CREATE TRIGGER on_itinerary_invite
  AFTER INSERT ON public.itinerary_collaborators
  FOR EACH ROW EXECUTE FUNCTION public.handle_itinerary_invite();

-- ============================================
-- 9. UPDATE TIMESTAMP TRIGGER
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_itinerary_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Trigger on itineraries table
DROP TRIGGER IF EXISTS update_itinerary_updated_at ON public.itineraries;
CREATE TRIGGER update_itinerary_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW EXECUTE FUNCTION public.update_itinerary_timestamp();

-- Trigger to update parent itinerary when items change
CREATE OR REPLACE FUNCTION public.update_itinerary_on_item_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.itineraries SET updated_at = timezone('utc'::text, now())
    WHERE id = OLD.itinerary_id;
    RETURN OLD;
  ELSE
    UPDATE public.itineraries SET updated_at = timezone('utc'::text, now())
    WHERE id = NEW.itinerary_id;
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS update_itinerary_on_item_insert ON public.itinerary_items;
DROP TRIGGER IF EXISTS update_itinerary_on_item_update ON public.itinerary_items;
DROP TRIGGER IF EXISTS update_itinerary_on_item_delete ON public.itinerary_items;

CREATE TRIGGER update_itinerary_on_item_insert
  AFTER INSERT ON public.itinerary_items
  FOR EACH ROW EXECUTE FUNCTION public.update_itinerary_on_item_change();

CREATE TRIGGER update_itinerary_on_item_update
  AFTER UPDATE ON public.itinerary_items
  FOR EACH ROW EXECUTE FUNCTION public.update_itinerary_on_item_change();

CREATE TRIGGER update_itinerary_on_item_delete
  AFTER DELETE ON public.itinerary_items
  FOR EACH ROW EXECUTE FUNCTION public.update_itinerary_on_item_change();

-- ============================================
-- 10. COMMENTS
-- ============================================

COMMENT ON TABLE public.itineraries IS 'Trip/itinerary containers with dates and settings';
COMMENT ON TABLE public.itinerary_items IS 'Individual places within an itinerary';
COMMENT ON TABLE public.itinerary_collaborators IS 'Users who can view or edit an itinerary';
COMMENT ON FUNCTION public.get_user_itineraries IS 'Get all itineraries for the current user (owned + collaborating)';
COMMENT ON FUNCTION public.get_itinerary_details IS 'Get full details of a single itinerary';
COMMENT ON FUNCTION public.get_itinerary_items IS 'Get all items in an itinerary with metadata';
COMMENT ON FUNCTION public.get_itinerary_collaborators IS 'Get all collaborators for an itinerary';
COMMENT ON FUNCTION public.get_user_public_itineraries IS 'Get public itineraries for a user profile page';
COMMENT ON FUNCTION public.handle_itinerary_invite IS 'Creates a notification when a user is invited to collaborate on an itinerary';
