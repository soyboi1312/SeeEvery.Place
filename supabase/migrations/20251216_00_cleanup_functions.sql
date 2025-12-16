-- ============================================
-- CLEANUP: Drop existing itinerary functions
-- Run this BEFORE the main itineraries migration
-- ============================================

-- Drop triggers first (before functions they depend on)
DROP TRIGGER IF EXISTS on_itinerary_invite ON public.itinerary_collaborators;
DROP TRIGGER IF EXISTS update_itinerary_updated_at ON public.itineraries;
DROP TRIGGER IF EXISTS update_itinerary_on_item_insert ON public.itinerary_items;
DROP TRIGGER IF EXISTS update_itinerary_on_item_update ON public.itinerary_items;
DROP TRIGGER IF EXISTS update_itinerary_on_item_delete ON public.itinerary_items;

-- Drop ALL versions of itinerary functions using DO block
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Find and drop all functions matching our itinerary function names
    FOR func_record IN
        SELECT n.nspname as schema_name,
               p.proname as function_name,
               pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN (
            'get_user_itineraries',
            'get_itinerary_details',
            'get_itinerary_items',
            'get_itinerary_collaborators',
            'get_user_public_itineraries',
            'handle_itinerary_invite',
            'update_itinerary_timestamp',
            'update_itinerary_on_item_change'
        )
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE',
            func_record.schema_name,
            func_record.function_name,
            func_record.args);
    END LOOP;
END $$;
