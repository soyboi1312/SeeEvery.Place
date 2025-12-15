-- ============================================
-- Collaborative Itineraries Feature
-- ============================================
-- This migration adds:
-- 1. Itineraries table for trip containers
-- 2. Itinerary items table for places in trips
-- 3. Itinerary collaborators table for shared editing
-- 4. RLS policies for secure access
-- 5. RPC functions for itinerary operations
-- ============================================

-- ============================================
-- 1. CREATE ALL TABLES FIRST (no RLS policies yet)
-- ============================================

-- Itineraries table
CREATE TABLE IF NOT EXISTS public.itineraries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  cover_image_url text,
  start_date date,
  end_date date,
  is_public boolean DEFAULT false,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'in_progress', 'completed')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Itinerary collaborators table (must exist before policies that reference it)
CREATE TABLE IF NOT EXISTS public.itinerary_collaborators (
  itinerary_id uuid REFERENCES public.itineraries(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'viewer' CHECK (role IN ('editor', 'viewer')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (itinerary_id, user_id)
);

-- Itinerary items table
CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id uuid REFERENCES public.itineraries(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL, -- matches CATEGORY_SCHEMA keys
  place_id text NOT NULL, -- matches the IDs in data files
  place_name text NOT NULL, -- Denormalized for display
  notes text,
  day_number integer, -- Optional: which day of the trip
  sort_order integer DEFAULT 0,
  added_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Prevent duplicate places in same itinerary
  UNIQUE(itinerary_id, category, place_id)
);

-- ============================================
-- 2. ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. RLS POLICIES FOR ITINERARIES
-- ============================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "View itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "Create itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "Update itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "Delete itineraries" ON public.itineraries;

-- View Policy: Owners, Collaborators, or Public
CREATE POLICY "View itineraries"
  ON public.itineraries FOR SELECT
  USING (
    auth.uid() = owner_id OR
    is_public = true OR
    EXISTS (
      SELECT 1 FROM public.itinerary_collaborators
      WHERE itinerary_id = id AND user_id = auth.uid()
    )
  );

-- Create Policy: Authenticated users can create
CREATE POLICY "Create itineraries"
  ON public.itineraries FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Update Policy: Owners or Editors
CREATE POLICY "Update itineraries"
  ON public.itineraries FOR UPDATE
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.itinerary_collaborators
      WHERE itinerary_id = id AND user_id = auth.uid() AND role = 'editor'
    )
  );

-- Delete Policy: Only owners
CREATE POLICY "Delete itineraries"
  ON public.itineraries FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- 4. RLS POLICIES FOR ITINERARY COLLABORATORS
-- ============================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "View collaborators" ON public.itinerary_collaborators;
DROP POLICY IF EXISTS "Add collaborators" ON public.itinerary_collaborators;
DROP POLICY IF EXISTS "Update collaborators" ON public.itinerary_collaborators;
DROP POLICY IF EXISTS "Remove collaborators" ON public.itinerary_collaborators;

-- View Policy: Can view if owner, a collaborator, or itinerary is public
CREATE POLICY "View collaborators"
  ON public.itinerary_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries i
      WHERE i.id = itinerary_id AND (
        i.owner_id = auth.uid() OR
        i.is_public = true OR
        user_id = auth.uid()
      )
    )
  );

-- Add Policy: Only owners can add collaborators
CREATE POLICY "Add collaborators"
  ON public.itinerary_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.itineraries i
      WHERE i.id = itinerary_id AND i.owner_id = auth.uid()
    )
  );

-- Update Policy: Only owners can update roles
CREATE POLICY "Update collaborators"
  ON public.itinerary_collaborators FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries i
      WHERE i.id = itinerary_id AND i.owner_id = auth.uid()
    )
  );

-- Remove Policy: Owners can remove anyone, users can remove themselves
CREATE POLICY "Remove collaborators"
  ON public.itinerary_collaborators FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.itineraries i
      WHERE i.id = itinerary_id AND i.owner_id = auth.uid()
    )
  );

-- ============================================
-- 5. RLS POLICIES FOR ITINERARY ITEMS
-- ============================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "View itinerary items" ON public.itinerary_items;
DROP POLICY IF EXISTS "Create itinerary items" ON public.itinerary_items;
DROP POLICY IF EXISTS "Update itinerary items" ON public.itinerary_items;
DROP POLICY IF EXISTS "Delete itinerary items" ON public.itinerary_items;

-- View Policy: Can view items if can view the itinerary
CREATE POLICY "View itinerary items"
  ON public.itinerary_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries i
      WHERE i.id = itinerary_id AND (
        i.owner_id = auth.uid() OR
        i.is_public = true OR
        EXISTS (
          SELECT 1 FROM public.itinerary_collaborators
          WHERE itinerary_id = i.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Create Policy: Owners and Editors can add items
CREATE POLICY "Create itinerary items"
  ON public.itinerary_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.itineraries i
      WHERE i.id = itinerary_id AND (
        i.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.itinerary_collaborators
          WHERE itinerary_id = i.id AND user_id = auth.uid() AND role = 'editor'
        )
      )
    )
  );

-- Update Policy: Owners and Editors can update items
CREATE POLICY "Update itinerary items"
  ON public.itinerary_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries i
      WHERE i.id = itinerary_id AND (
        i.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.itinerary_collaborators
          WHERE itinerary_id = i.id AND user_id = auth.uid() AND role = 'editor'
        )
      )
    )
  );

-- Delete Policy: Owners and Editors can remove items
CREATE POLICY "Delete itinerary items"
  ON public.itinerary_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries i
      WHERE i.id = itinerary_id AND (
        i.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.itinerary_collaborators
          WHERE itinerary_id = i.id AND user_id = auth.uid() AND role = 'editor'
        )
      )
    )
  );

-- ============================================
-- 6. INDEXES FOR EFFICIENT QUERIES
-- ============================================

-- Itineraries indexes
CREATE INDEX IF NOT EXISTS itineraries_owner_id_idx ON public.itineraries(owner_id);
CREATE INDEX IF NOT EXISTS itineraries_is_public_idx ON public.itineraries(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS itineraries_start_date_idx ON public.itineraries(start_date);
CREATE INDEX IF NOT EXISTS itineraries_created_at_idx ON public.itineraries(created_at DESC);

-- Itinerary items indexes
CREATE INDEX IF NOT EXISTS itinerary_items_itinerary_id_idx ON public.itinerary_items(itinerary_id);
CREATE INDEX IF NOT EXISTS itinerary_items_category_idx ON public.itinerary_items(category);
CREATE INDEX IF NOT EXISTS itinerary_items_sort_order_idx ON public.itinerary_items(itinerary_id, day_number, sort_order);

-- Itinerary collaborators indexes
CREATE INDEX IF NOT EXISTS itinerary_collaborators_user_id_idx ON public.itinerary_collaborators(user_id);
CREATE INDEX IF NOT EXISTS itinerary_collaborators_itinerary_id_idx ON public.itinerary_collaborators(itinerary_id);

-- ============================================
-- 7. RPC FUNCTIONS FOR ITINERARY OPERATIONS
-- ============================================

-- Function to get itineraries for a user (owned + collaborating)
CREATE OR REPLACE FUNCTION public.get_user_itineraries(
  target_user_id uuid DEFAULT NULL,
  include_collaborating boolean DEFAULT true,
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
  cover_image_url text,
  start_date date,
  end_date date,
  is_public boolean,
  status text,
  item_count bigint,
  collaborator_count bigint,
  is_owner boolean,
  user_role text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := COALESCE(target_user_id, auth.uid());

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not specified';
  END IF;

  RETURN QUERY
  SELECT DISTINCT
    i.id,
    i.owner_id,
    p.username as owner_username,
    p.avatar_url as owner_avatar_url,
    i.title,
    i.description,
    i.cover_image_url,
    i.start_date,
    i.end_date,
    i.is_public,
    i.status,
    (SELECT COUNT(*) FROM public.itinerary_items ii WHERE ii.itinerary_id = i.id) as item_count,
    (SELECT COUNT(*) FROM public.itinerary_collaborators ic WHERE ic.itinerary_id = i.id) as collaborator_count,
    (i.owner_id = v_user_id) as is_owner,
    CASE
      WHEN i.owner_id = v_user_id THEN 'owner'
      ELSE COALESCE(c.role, 'viewer')
    END as user_role,
    i.created_at,
    i.updated_at
  FROM public.itineraries i
  JOIN public.profiles p ON p.id = i.owner_id
  LEFT JOIN public.itinerary_collaborators c ON c.itinerary_id = i.id AND c.user_id = v_user_id
  WHERE (
    -- Owned itineraries
    i.owner_id = v_user_id
    OR
    -- Collaborating itineraries (if requested and viewing own itineraries)
    (include_collaborating AND target_user_id IS NULL AND EXISTS (
      SELECT 1 FROM public.itinerary_collaborators ic
      WHERE ic.itinerary_id = i.id AND ic.user_id = auth.uid()
    ))
    OR
    -- Public itineraries when viewing other users
    (target_user_id IS NOT NULL AND target_user_id != auth.uid() AND i.is_public = true AND i.owner_id = target_user_id)
  )
  ORDER BY i.updated_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_user_itineraries(uuid, boolean, integer, integer) TO authenticated;

-- Function to get a single itinerary with details
CREATE OR REPLACE FUNCTION public.get_itinerary_details(p_itinerary_id uuid)
RETURNS TABLE (
  id uuid,
  owner_id uuid,
  owner_username text,
  owner_full_name text,
  owner_avatar_url text,
  title text,
  description text,
  cover_image_url text,
  start_date date,
  end_date date,
  is_public boolean,
  status text,
  is_owner boolean,
  user_role text,
  can_edit boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  RETURN QUERY
  SELECT
    i.id,
    i.owner_id,
    p.username as owner_username,
    p.full_name as owner_full_name,
    p.avatar_url as owner_avatar_url,
    i.title,
    i.description,
    i.cover_image_url,
    i.start_date,
    i.end_date,
    i.is_public,
    i.status,
    (i.owner_id = v_user_id) as is_owner,
    CASE
      WHEN i.owner_id = v_user_id THEN 'owner'
      ELSE COALESCE(c.role, 'viewer')
    END as user_role,
    (i.owner_id = v_user_id OR COALESCE(c.role, '') = 'editor') as can_edit,
    i.created_at,
    i.updated_at
  FROM public.itineraries i
  JOIN public.profiles p ON p.id = i.owner_id
  LEFT JOIN public.itinerary_collaborators c ON c.itinerary_id = i.id AND c.user_id = v_user_id
  WHERE i.id = p_itinerary_id
    AND (
      i.owner_id = v_user_id OR
      i.is_public = true OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators ic
        WHERE ic.itinerary_id = i.id AND ic.user_id = v_user_id
      )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_itinerary_details(uuid) TO authenticated, anon;

-- Function to get itinerary items grouped by day
CREATE OR REPLACE FUNCTION public.get_itinerary_items(p_itinerary_id uuid)
RETURNS TABLE (
  id uuid,
  category text,
  place_id text,
  place_name text,
  notes text,
  day_number integer,
  sort_order integer,
  added_by uuid,
  added_by_username text,
  created_at timestamp with time zone
) AS $$
BEGIN
  -- Check access
  IF NOT EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = p_itinerary_id
    AND (
      i.owner_id = auth.uid() OR
      i.is_public = true OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators ic
        WHERE ic.itinerary_id = i.id AND ic.user_id = auth.uid()
      )
    )
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    ii.id,
    ii.category,
    ii.place_id,
    ii.place_name,
    ii.notes,
    ii.day_number,
    ii.sort_order,
    ii.added_by,
    p.username as added_by_username,
    ii.created_at
  FROM public.itinerary_items ii
  LEFT JOIN public.profiles p ON p.id = ii.added_by
  WHERE ii.itinerary_id = p_itinerary_id
  ORDER BY ii.day_number NULLS LAST, ii.sort_order, ii.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_itinerary_items(uuid) TO authenticated, anon;

-- Function to get itinerary collaborators
CREATE OR REPLACE FUNCTION public.get_itinerary_collaborators(p_itinerary_id uuid)
RETURNS TABLE (
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  role text,
  created_at timestamp with time zone,
  is_owner boolean
) AS $$
BEGIN
  RETURN QUERY
  -- Include owner
  SELECT
    i.owner_id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    'owner'::text as role,
    i.created_at,
    true as is_owner
  FROM public.itineraries i
  JOIN public.profiles p ON p.id = i.owner_id
  WHERE i.id = p_itinerary_id
    AND (
      i.owner_id = auth.uid() OR
      i.is_public = true OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators ic
        WHERE ic.itinerary_id = i.id AND ic.user_id = auth.uid()
      )
    )

  UNION ALL

  -- Include collaborators
  SELECT
    ic.user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    ic.role,
    ic.created_at,
    false as is_owner
  FROM public.itinerary_collaborators ic
  JOIN public.profiles p ON p.id = ic.user_id
  JOIN public.itineraries i ON i.id = ic.itinerary_id
  WHERE ic.itinerary_id = p_itinerary_id
    AND (
      i.owner_id = auth.uid() OR
      i.is_public = true OR
      ic.user_id = auth.uid()
    )
  ORDER BY is_owner DESC, created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_itinerary_collaborators(uuid) TO authenticated, anon;

-- Function to add item to itinerary
CREATE OR REPLACE FUNCTION public.add_itinerary_item(
  p_itinerary_id uuid,
  p_category text,
  p_place_id text,
  p_place_name text,
  p_notes text DEFAULT NULL,
  p_day_number integer DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_item_id uuid;
  v_sort_order integer;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  -- Check edit permission
  IF NOT EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = p_itinerary_id
    AND (
      i.owner_id = v_user_id OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators ic
        WHERE ic.itinerary_id = i.id AND ic.user_id = v_user_id AND ic.role = 'editor'
      )
    )
  ) THEN
    RETURN jsonb_build_object('error', 'Permission denied');
  END IF;

  -- Get next sort order
  SELECT COALESCE(MAX(sort_order), 0) + 1 INTO v_sort_order
  FROM public.itinerary_items
  WHERE itinerary_id = p_itinerary_id
    AND (day_number = p_day_number OR (day_number IS NULL AND p_day_number IS NULL));

  -- Insert item
  INSERT INTO public.itinerary_items (
    itinerary_id, category, place_id, place_name, notes, day_number, sort_order, added_by
  ) VALUES (
    p_itinerary_id, p_category, p_place_id, p_place_name, p_notes, p_day_number, v_sort_order, v_user_id
  )
  ON CONFLICT (itinerary_id, category, place_id) DO UPDATE
  SET notes = COALESCE(EXCLUDED.notes, itinerary_items.notes),
      day_number = COALESCE(EXCLUDED.day_number, itinerary_items.day_number)
  RETURNING id INTO v_item_id;

  -- Update itinerary updated_at
  UPDATE public.itineraries SET updated_at = NOW() WHERE id = p_itinerary_id;

  RETURN jsonb_build_object('success', true, 'item_id', v_item_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.add_itinerary_item(uuid, text, text, text, text, integer) TO authenticated;

-- Function to remove item from itinerary
CREATE OR REPLACE FUNCTION public.remove_itinerary_item(p_item_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_itinerary_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  -- Get itinerary ID
  SELECT itinerary_id INTO v_itinerary_id FROM public.itinerary_items WHERE id = p_item_id;

  IF v_itinerary_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Item not found');
  END IF;

  -- Check permission
  IF NOT EXISTS (
    SELECT 1 FROM public.itineraries i
    WHERE i.id = v_itinerary_id
    AND (
      i.owner_id = v_user_id OR
      EXISTS (
        SELECT 1 FROM public.itinerary_collaborators ic
        WHERE ic.itinerary_id = i.id AND ic.user_id = v_user_id AND ic.role = 'editor'
      )
    )
  ) THEN
    RETURN jsonb_build_object('error', 'Permission denied');
  END IF;

  DELETE FROM public.itinerary_items WHERE id = p_item_id;

  -- Update itinerary updated_at
  UPDATE public.itineraries SET updated_at = NOW() WHERE id = v_itinerary_id;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.remove_itinerary_item(uuid) TO authenticated;

-- Function to invite collaborator
CREATE OR REPLACE FUNCTION public.invite_itinerary_collaborator(
  p_itinerary_id uuid,
  p_user_id uuid,
  p_role text DEFAULT 'editor'
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_itinerary_owner uuid;
  v_itinerary_title text;
  v_inviter_username text;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  -- Get itinerary info
  SELECT owner_id, title INTO v_itinerary_owner, v_itinerary_title
  FROM public.itineraries WHERE id = p_itinerary_id;

  IF v_itinerary_owner IS NULL THEN
    RETURN jsonb_build_object('error', 'Itinerary not found');
  END IF;

  IF v_itinerary_owner != v_user_id THEN
    RETURN jsonb_build_object('error', 'Only owners can invite collaborators');
  END IF;

  IF p_user_id = v_user_id THEN
    RETURN jsonb_build_object('error', 'Cannot invite yourself');
  END IF;

  -- Get inviter username
  SELECT username INTO v_inviter_username FROM public.profiles WHERE id = v_user_id;

  -- Add collaborator
  INSERT INTO public.itinerary_collaborators (itinerary_id, user_id, role, invited_by)
  VALUES (p_itinerary_id, p_user_id, p_role, v_user_id)
  ON CONFLICT (itinerary_id, user_id) DO UPDATE SET role = EXCLUDED.role;

  -- Send notification (only if notifications table exists)
  BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, actor_id, actor_username, data)
    VALUES (
      p_user_id,
      'trip_invite',
      'Trip Invitation',
      v_inviter_username || ' invited you to collaborate on "' || v_itinerary_title || '"',
      v_user_id,
      v_inviter_username,
      jsonb_build_object('itinerary_id', p_itinerary_id, 'role', p_role)
    );
  EXCEPTION WHEN undefined_table THEN
    -- notifications table doesn't exist, skip
    NULL;
  END;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.invite_itinerary_collaborator(uuid, uuid, text) TO authenticated;

-- Function to remove collaborator
CREATE OR REPLACE FUNCTION public.remove_itinerary_collaborator(
  p_itinerary_id uuid,
  p_user_id uuid
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  -- Check permission (owner can remove anyone, users can remove themselves)
  IF NOT (
    p_user_id = v_user_id OR
    EXISTS (
      SELECT 1 FROM public.itineraries i
      WHERE i.id = p_itinerary_id AND i.owner_id = v_user_id
    )
  ) THEN
    RETURN jsonb_build_object('error', 'Permission denied');
  END IF;

  DELETE FROM public.itinerary_collaborators
  WHERE itinerary_id = p_itinerary_id AND user_id = p_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.remove_itinerary_collaborator(uuid, uuid) TO authenticated;

-- Function to get public itineraries for discovery
CREATE OR REPLACE FUNCTION public.get_public_itineraries(
  page_limit integer DEFAULT 20,
  page_offset integer DEFAULT 0,
  filter_status text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  owner_id uuid,
  owner_username text,
  owner_avatar_url text,
  title text,
  description text,
  cover_image_url text,
  start_date date,
  end_date date,
  status text,
  item_count bigint,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.owner_id,
    p.username as owner_username,
    p.avatar_url as owner_avatar_url,
    i.title,
    i.description,
    i.cover_image_url,
    i.start_date,
    i.end_date,
    i.status,
    (SELECT COUNT(*) FROM public.itinerary_items ii WHERE ii.itinerary_id = i.id) as item_count,
    i.created_at
  FROM public.itineraries i
  JOIN public.profiles p ON p.id = i.owner_id
  WHERE i.is_public = true
    AND p.is_public = true
    AND (filter_status IS NULL OR i.status = filter_status)
  ORDER BY i.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_public_itineraries(integer, integer, text) TO authenticated, anon;

-- ============================================
-- 8. TRIGGER FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.update_itinerary_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_itinerary_updated_at ON public.itineraries;
CREATE TRIGGER update_itinerary_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW EXECUTE FUNCTION public.update_itinerary_updated_at();

-- ============================================
-- 9. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.itineraries IS 'Trip containers for collaborative trip planning';
COMMENT ON TABLE public.itinerary_items IS 'Places/items within a trip itinerary';
COMMENT ON TABLE public.itinerary_collaborators IS 'Users who can view/edit an itinerary';
COMMENT ON FUNCTION public.get_user_itineraries IS 'Get itineraries owned by or shared with a user';
COMMENT ON FUNCTION public.get_itinerary_details IS 'Get detailed information about a single itinerary';
COMMENT ON FUNCTION public.get_itinerary_items IS 'Get all items in an itinerary';
COMMENT ON FUNCTION public.add_itinerary_item IS 'Add a place to an itinerary';
COMMENT ON FUNCTION public.invite_itinerary_collaborator IS 'Invite a user to collaborate on an itinerary';
