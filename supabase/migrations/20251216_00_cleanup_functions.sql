-- ============================================
-- CLEANUP: Drop existing itinerary functions
-- Run this BEFORE the main itineraries migration
-- ============================================

-- Drop all itinerary-related functions if they exist
DROP FUNCTION IF EXISTS public.get_user_itineraries(integer, integer);
DROP FUNCTION IF EXISTS public.get_itinerary_details(uuid);
DROP FUNCTION IF EXISTS public.get_itinerary_items(uuid);
DROP FUNCTION IF EXISTS public.get_itinerary_collaborators(uuid);
DROP FUNCTION IF EXISTS public.get_user_public_itineraries(uuid, integer, integer);

-- Also drop trigger functions if they exist
DROP FUNCTION IF EXISTS public.handle_itinerary_invite();
DROP FUNCTION IF EXISTS public.update_itinerary_timestamp();
DROP FUNCTION IF EXISTS public.update_itinerary_on_item_change();

-- Drop triggers if they exist (they'll be recreated)
DROP TRIGGER IF EXISTS on_itinerary_invite ON public.itinerary_collaborators;
DROP TRIGGER IF EXISTS update_itinerary_updated_at ON public.itineraries;
DROP TRIGGER IF EXISTS update_itinerary_on_item_insert ON public.itinerary_items;
DROP TRIGGER IF EXISTS update_itinerary_on_item_update ON public.itinerary_items;
DROP TRIGGER IF EXISTS update_itinerary_on_item_delete ON public.itinerary_items;
