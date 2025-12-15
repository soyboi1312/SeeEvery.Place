import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TripDetailClient from './TripDetailClient';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ tripId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { tripId } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc('get_itinerary_details', {
    p_itinerary_id: tripId,
  });

  const itinerary = data?.[0];

  if (!itinerary) {
    return { title: 'Trip Not Found | SeeEvery.Place' };
  }

  return {
    title: `${itinerary.title} | SeeEvery.Place`,
    description: itinerary.description || `Trip planned by @${itinerary.owner_username}`,
    openGraph: {
      title: itinerary.title,
      description: itinerary.description || `Trip planned by @${itinerary.owner_username}`,
      type: 'article',
    },
  };
}

async function TripDetailLoader({ tripId }: { tripId: string }) {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch itinerary details
  const { data: itineraryData, error: itineraryError } = await supabase.rpc(
    'get_itinerary_details',
    { p_itinerary_id: tripId }
  );

  if (itineraryError || !itineraryData || itineraryData.length === 0) {
    notFound();
  }

  const itinerary = itineraryData[0];

  // Fetch items
  const { data: itemsData } = await supabase.rpc('get_itinerary_items', {
    p_itinerary_id: tripId,
  });

  // Fetch collaborators
  const { data: collaboratorsData } = await supabase.rpc('get_itinerary_collaborators', {
    p_itinerary_id: tripId,
  });

  return (
    <TripDetailClient
      itinerary={itinerary}
      initialItems={itemsData || []}
      initialCollaborators={collaboratorsData || []}
      currentUserId={user?.id}
    />
  );
}

export default async function TripPage({ params }: PageProps) {
  const { tripId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      }
    >
      <TripDetailLoader tripId={tripId} />
    </Suspense>
  );
}
