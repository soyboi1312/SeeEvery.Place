import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import TripDetailClient from './TripDetailClient';

interface PageProps {
  params: Promise<{ tripId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tripId } = await params;

  try {
    const supabase = await createClient();

    // Fetch basic trip info for SEO
    const { data: trip } = await supabase
      .from('itineraries')
      .select('title, description, cover_image_url, is_public')
      .eq('id', tripId)
      .single();

    if (!trip) {
      return {
        title: 'Quest Not Found | SeeEvery.Place',
        description: 'This quest could not be found.',
      };
    }

    // Only show rich metadata for public trips
    if (!trip.is_public) {
      return {
        title: `${trip.title} | SeeEvery.Place`,
        description: 'A private quest on SeeEvery.Place',
      };
    }

    return {
      title: `${trip.title} | SeeEvery.Place`,
      description: trip.description || `Check out this quest on SeeEvery.Place`,
      openGraph: {
        title: trip.title,
        description: trip.description || `Check out this quest on SeeEvery.Place`,
        type: 'website',
        images: trip.cover_image_url ? [{ url: trip.cover_image_url }] : [],
      },
      twitter: {
        card: trip.cover_image_url ? 'summary_large_image' : 'summary',
        title: trip.title,
        description: trip.description || `Check out this quest on SeeEvery.Place`,
        images: trip.cover_image_url ? [trip.cover_image_url] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Quest | SeeEvery.Place',
      description: 'View this quest on SeeEvery.Place',
    };
  }
}

export default async function TripDetailPage({ params }: PageProps) {
  const { tripId } = await params;
  return <TripDetailClient tripId={tripId} />;
}
