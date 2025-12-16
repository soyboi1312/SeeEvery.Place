-- ============================================
-- FIX: Complete solution for RLS recursion
-- ALL cross-table lookups use SECURITY DEFINER functions
-- ============================================

-- Drop all existing policies
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

-- Drop existing helper functions
DROP FUNCTION IF EXISTS public.can_access_itinerary(uuid);
DROP FUNCTION IF EXISTS public.can_edit_itinerary(uuid);
DROP FUNCTION IF EXISTS public.is_itinerary_collaborator(uuid);
DROP FUNCTION IF EXISTS public.is_itinerary_owner(uuid);
DROP FUNCTION IF EXISTS public.is_itinerary_public(uuid);

-- ============================================
-- HELPER FUNCTIONS (SECURITY DEFINER bypasses RLS)
-- ============================================

-- Check if current user is a collaborator on an itinerary
CREATE OR REPLACE FUNCTION public.is_itinerary_collaborator(itin_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.itinerary_collaborators
        WHERE itinerary_id = itin_id AND user_id = auth.uid()
    );
$$;

-- Check if current user owns an itinerary
CREATE OR REPLACE FUNCTION public.is_itinerary_owner(itin_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.itineraries
        WHERE id = itin_id AND owner_id = auth.uid()
    );
$$;

-- Check if an itinerary is public
CREATE OR REPLACE FUNCTION public.is_itinerary_public(itin_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.itineraries
        WHERE id = itin_id AND is_public = true
    );
$$;

-- Check if current user is an editor on an itinerary
CREATE OR REPLACE FUNCTION public.is_itinerary_editor(itin_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.itinerary_collaborators
        WHERE itinerary_id = itin_id AND user_id = auth.uid() AND role = 'editor'
    );
$$;

-- ============================================
-- ITINERARIES TABLE - No direct cross-table queries
-- ============================================

-- SELECT: Check ownership directly, use function for collaborator check
CREATE POLICY "itineraries_select" ON public.itineraries FOR SELECT USING (
    is_public = true
    OR owner_id = (SELECT auth.uid())
    OR public.is_itinerary_collaborator(id)
);

-- INSERT: Direct check only
CREATE POLICY "itineraries_insert" ON public.itineraries FOR INSERT
WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND owner_id = (SELECT auth.uid())
);

-- UPDATE: Direct check only
CREATE POLICY "itineraries_update" ON public.itineraries FOR UPDATE
USING (owner_id = (SELECT auth.uid()))
WITH CHECK (owner_id = (SELECT auth.uid()));

-- DELETE: Direct check only
CREATE POLICY "itineraries_delete" ON public.itineraries FOR DELETE
USING (owner_id = (SELECT auth.uid()));

-- ============================================
-- ITINERARY_ITEMS TABLE - Use helper functions
-- ============================================

CREATE POLICY "itinerary_items_select" ON public.itinerary_items FOR SELECT USING (
    public.is_itinerary_public(itinerary_id)
    OR public.is_itinerary_owner(itinerary_id)
    OR public.is_itinerary_collaborator(itinerary_id)
);

CREATE POLICY "itinerary_items_insert" ON public.itinerary_items FOR INSERT WITH CHECK (
    public.is_itinerary_owner(itinerary_id)
    OR public.is_itinerary_editor(itinerary_id)
);

CREATE POLICY "itinerary_items_update" ON public.itinerary_items FOR UPDATE USING (
    public.is_itinerary_owner(itinerary_id)
    OR public.is_itinerary_editor(itinerary_id)
);

CREATE POLICY "itinerary_items_delete" ON public.itinerary_items FOR DELETE USING (
    public.is_itinerary_owner(itinerary_id)
    OR public.is_itinerary_editor(itinerary_id)
);

-- ============================================
-- ITINERARY_COLLABORATORS TABLE - Use helper functions
-- ============================================

-- SELECT: Can see if you're the collaborator, own the itinerary, or it's public
CREATE POLICY "itinerary_collaborators_select" ON public.itinerary_collaborators FOR SELECT USING (
    user_id = (SELECT auth.uid())
    OR public.is_itinerary_owner(itinerary_id)
    OR public.is_itinerary_public(itinerary_id)
);

-- INSERT: Only owners can add collaborators
CREATE POLICY "itinerary_collaborators_insert" ON public.itinerary_collaborators FOR INSERT WITH CHECK (
    public.is_itinerary_owner(itinerary_id)
);

-- UPDATE: Only owners can update
CREATE POLICY "itinerary_collaborators_update" ON public.itinerary_collaborators FOR UPDATE USING (
    public.is_itinerary_owner(itinerary_id)
);

-- DELETE: Owners can remove anyone, users can remove themselves
CREATE POLICY "itinerary_collaborators_delete" ON public.itinerary_collaborators FOR DELETE USING (
    user_id = (SELECT auth.uid())
    OR public.is_itinerary_owner(itinerary_id)
);
