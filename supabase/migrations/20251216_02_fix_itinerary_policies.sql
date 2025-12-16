-- ============================================
-- FIX: Clean up duplicate policies and optimize RLS
-- ============================================

-- Drop ALL existing policies on itinerary tables to start fresh
DO $$
DECLARE
    pol_record RECORD;
BEGIN
    -- Drop all policies on itineraries
    FOR pol_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'itineraries' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.itineraries', pol_record.policyname);
    END LOOP;

    -- Drop all policies on itinerary_items
    FOR pol_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'itinerary_items' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.itinerary_items', pol_record.policyname);
    END LOOP;

    -- Drop all policies on itinerary_collaborators
    FOR pol_record IN
        SELECT policyname FROM pg_policies WHERE tablename = 'itinerary_collaborators' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.itinerary_collaborators', pol_record.policyname);
    END LOOP;
END $$;

-- ============================================
-- ITINERARIES TABLE - Optimized RLS Policies
-- ============================================

-- SELECT: Users can view their own itineraries, public ones, or those they collaborate on
CREATE POLICY "itineraries_select" ON public.itineraries FOR SELECT USING (
    is_public = true
    OR owner_id = (SELECT auth.uid())
    OR id IN (
        SELECT itinerary_id FROM public.itinerary_collaborators
        WHERE user_id = (SELECT auth.uid())
    )
);

-- INSERT: Authenticated users can create itineraries
CREATE POLICY "itineraries_insert" ON public.itineraries FOR INSERT
WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND owner_id = (SELECT auth.uid()));

-- UPDATE: Only owners can update their itineraries
CREATE POLICY "itineraries_update" ON public.itineraries FOR UPDATE USING (
    owner_id = (SELECT auth.uid())
) WITH CHECK (owner_id = (SELECT auth.uid()));

-- DELETE: Only owners can delete their itineraries
CREATE POLICY "itineraries_delete" ON public.itineraries FOR DELETE USING (
    owner_id = (SELECT auth.uid())
);

-- ============================================
-- ITINERARY_ITEMS TABLE - Optimized RLS Policies
-- ============================================

-- SELECT: Users can view items if they can view the parent itinerary
CREATE POLICY "itinerary_items_select" ON public.itinerary_items FOR SELECT USING (
    itinerary_id IN (
        SELECT id FROM public.itineraries
        WHERE is_public = true
        OR owner_id = (SELECT auth.uid())
        OR id IN (
            SELECT itinerary_id FROM public.itinerary_collaborators
            WHERE user_id = (SELECT auth.uid())
        )
    )
);

-- INSERT: Owners and editors can add items
CREATE POLICY "itinerary_items_insert" ON public.itinerary_items FOR INSERT WITH CHECK (
    itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
    OR itinerary_id IN (
        SELECT itinerary_id FROM public.itinerary_collaborators
        WHERE user_id = (SELECT auth.uid()) AND role = 'editor'
    )
);

-- UPDATE: Owners and editors can update items
CREATE POLICY "itinerary_items_update" ON public.itinerary_items FOR UPDATE USING (
    itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
    OR itinerary_id IN (
        SELECT itinerary_id FROM public.itinerary_collaborators
        WHERE user_id = (SELECT auth.uid()) AND role = 'editor'
    )
);

-- DELETE: Owners and editors can delete items
CREATE POLICY "itinerary_items_delete" ON public.itinerary_items FOR DELETE USING (
    itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
    OR itinerary_id IN (
        SELECT itinerary_id FROM public.itinerary_collaborators
        WHERE user_id = (SELECT auth.uid()) AND role = 'editor'
    )
);

-- ============================================
-- ITINERARY_COLLABORATORS TABLE - Optimized RLS Policies
-- ============================================

-- SELECT: Users can view collaborators if they have access to the itinerary
CREATE POLICY "itinerary_collaborators_select" ON public.itinerary_collaborators FOR SELECT USING (
    itinerary_id IN (
        SELECT id FROM public.itineraries
        WHERE is_public = true
        OR owner_id = (SELECT auth.uid())
        OR id IN (
            SELECT itinerary_id FROM public.itinerary_collaborators
            WHERE user_id = (SELECT auth.uid())
        )
    )
);

-- INSERT: Only owners can add collaborators
CREATE POLICY "itinerary_collaborators_insert" ON public.itinerary_collaborators FOR INSERT WITH CHECK (
    itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
);

-- UPDATE: Only owners can update collaborator roles
CREATE POLICY "itinerary_collaborators_update" ON public.itinerary_collaborators FOR UPDATE USING (
    itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
);

-- DELETE: Owners can remove anyone, collaborators can remove themselves
CREATE POLICY "itinerary_collaborators_delete" ON public.itinerary_collaborators FOR DELETE USING (
    itinerary_id IN (
        SELECT id FROM public.itineraries WHERE owner_id = (SELECT auth.uid())
    )
    OR user_id = (SELECT auth.uid())
);

-- ============================================
-- FIX: Update trigger functions with proper search_path
-- ============================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_itinerary_updated_at ON public.itineraries;
DROP TRIGGER IF EXISTS update_itinerary_on_item_insert ON public.itinerary_items;
DROP TRIGGER IF EXISTS update_itinerary_on_item_update ON public.itinerary_items;
DROP TRIGGER IF EXISTS update_itinerary_on_item_delete ON public.itinerary_items;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.update_itinerary_updated_at();
DROP FUNCTION IF EXISTS public.update_itinerary_on_item_change();

-- Recreate with proper search_path
CREATE OR REPLACE FUNCTION public.update_itinerary_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_itinerary_on_item_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    itin_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN
        itin_id := OLD.itinerary_id;
    ELSE
        itin_id := NEW.itinerary_id;
    END IF;

    UPDATE public.itineraries
    SET updated_at = NOW()
    WHERE id = itin_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_itinerary_updated_at
    BEFORE UPDATE ON public.itineraries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_itinerary_updated_at();

CREATE TRIGGER update_itinerary_on_item_insert
    AFTER INSERT ON public.itinerary_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_itinerary_on_item_change();

CREATE TRIGGER update_itinerary_on_item_update
    AFTER UPDATE ON public.itinerary_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_itinerary_on_item_change();

CREATE TRIGGER update_itinerary_on_item_delete
    AFTER DELETE ON public.itinerary_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_itinerary_on_item_change();
