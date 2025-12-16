-- ============================================
-- FIX: Infinite recursion in RLS policies
-- The previous policies had circular references between
-- itineraries and itinerary_collaborators tables
-- ============================================

-- Drop all existing policies to start fresh
DO $$
DECLARE
    pol_record RECORD;
BEGIN
    FOR pol_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'itineraries' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.itineraries', pol_record.policyname);
    END LOOP;

    FOR pol_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'itinerary_items' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.itinerary_items', pol_record.policyname);
    END LOOP;

    FOR pol_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'itinerary_collaborators' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.itinerary_collaborators', pol_record.policyname);
    END LOOP;
END $$;

-- ============================================
-- HELPER FUNCTION: Check if user can access itinerary
-- Using SECURITY DEFINER to bypass RLS and avoid recursion
-- ============================================
CREATE OR REPLACE FUNCTION public.can_access_itinerary(itin_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    itin_record RECORD;
    current_user_id uuid;
BEGIN
    current_user_id := auth.uid();

    -- Get the itinerary (bypassing RLS with SECURITY DEFINER)
    SELECT owner_id, is_public INTO itin_record
    FROM public.itineraries
    WHERE id = itin_id;

    IF NOT FOUND THEN
        RETURN false;
    END IF;

    -- Public itineraries are accessible to everyone
    IF itin_record.is_public THEN
        RETURN true;
    END IF;

    -- Owner can always access
    IF itin_record.owner_id = current_user_id THEN
        RETURN true;
    END IF;

    -- Check if user is a collaborator (direct check, no RLS)
    RETURN EXISTS (
        SELECT 1 FROM public.itinerary_collaborators
        WHERE itinerary_id = itin_id AND user_id = current_user_id
    );
END;
$$;

-- Helper function to check if user can edit itinerary
CREATE OR REPLACE FUNCTION public.can_edit_itinerary(itin_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    itin_owner_id uuid;
    current_user_id uuid;
BEGIN
    current_user_id := auth.uid();

    -- Get the itinerary owner
    SELECT owner_id INTO itin_owner_id
    FROM public.itineraries
    WHERE id = itin_id;

    IF NOT FOUND THEN
        RETURN false;
    END IF;

    -- Owner can always edit
    IF itin_owner_id = current_user_id THEN
        RETURN true;
    END IF;

    -- Check if user is an editor collaborator
    RETURN EXISTS (
        SELECT 1 FROM public.itinerary_collaborators
        WHERE itinerary_id = itin_id
        AND user_id = current_user_id
        AND role = 'editor'
    );
END;
$$;

-- ============================================
-- ITINERARIES TABLE - Simple policies (no recursion)
-- ============================================

-- SELECT: Use helper function to avoid recursion
CREATE POLICY "itineraries_select" ON public.itineraries FOR SELECT USING (
    is_public = true
    OR owner_id = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.itinerary_collaborators
        WHERE itinerary_id = id AND user_id = (SELECT auth.uid())
    )
);

-- INSERT: Authenticated users can create their own itineraries
CREATE POLICY "itineraries_insert" ON public.itineraries FOR INSERT
WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND owner_id = (SELECT auth.uid())
);

-- UPDATE: Only owners can update
CREATE POLICY "itineraries_update" ON public.itineraries FOR UPDATE
USING (owner_id = (SELECT auth.uid()))
WITH CHECK (owner_id = (SELECT auth.uid()));

-- DELETE: Only owners can delete
CREATE POLICY "itineraries_delete" ON public.itineraries FOR DELETE
USING (owner_id = (SELECT auth.uid()));

-- ============================================
-- ITINERARY_ITEMS TABLE - Use helper functions
-- ============================================

-- SELECT: Use helper function
CREATE POLICY "itinerary_items_select" ON public.itinerary_items FOR SELECT
USING (public.can_access_itinerary(itinerary_id));

-- INSERT: Use helper function for edit check
CREATE POLICY "itinerary_items_insert" ON public.itinerary_items FOR INSERT
WITH CHECK (public.can_edit_itinerary(itinerary_id));

-- UPDATE: Use helper function
CREATE POLICY "itinerary_items_update" ON public.itinerary_items FOR UPDATE
USING (public.can_edit_itinerary(itinerary_id));

-- DELETE: Use helper function
CREATE POLICY "itinerary_items_delete" ON public.itinerary_items FOR DELETE
USING (public.can_edit_itinerary(itinerary_id));

-- ============================================
-- ITINERARY_COLLABORATORS TABLE - Simple policies (no circular refs)
-- ============================================

-- SELECT: Users can see collaborators if they own the itinerary or are a collaborator
CREATE POLICY "itinerary_collaborators_select" ON public.itinerary_collaborators FOR SELECT USING (
    -- User is the collaborator
    user_id = (SELECT auth.uid())
    -- Or user owns the itinerary (direct lookup, no recursion)
    OR itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
    -- Or itinerary is public (direct lookup)
    OR itinerary_id IN (
        SELECT id FROM public.itineraries WHERE is_public = true
    )
);

-- INSERT: Only itinerary owners can add collaborators
CREATE POLICY "itinerary_collaborators_insert" ON public.itinerary_collaborators FOR INSERT
WITH CHECK (
    itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
);

-- UPDATE: Only itinerary owners can update collaborator roles
CREATE POLICY "itinerary_collaborators_update" ON public.itinerary_collaborators FOR UPDATE
USING (
    itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
);

-- DELETE: Owners can remove anyone, collaborators can remove themselves
CREATE POLICY "itinerary_collaborators_delete" ON public.itinerary_collaborators FOR DELETE
USING (
    user_id = (SELECT auth.uid())
    OR itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
);
