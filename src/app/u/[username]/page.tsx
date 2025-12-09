import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PublicProfileClient from './PublicProfileClient';

interface PageProps {
  params: Promise<{ username: string }>;
}

interface PublicProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_public: boolean;
  total_xp: number;
  level: number;
  created_at: string;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .rpc('get_public_profile', { profile_username: username })
    .single();

  const profile = data as PublicProfile | null;

  if (!profile) {
    return {
      title: 'Profile Not Found | SeeEvery.Place',
    };
  }

  const displayName = profile.full_name || username;

  return {
    title: `${displayName}'s Travel Map | SeeEvery.Place`,
    description: profile.bio || `Check out ${displayName}'s travel adventures on SeeEvery.Place - the free travel tracker.`,
    openGraph: {
      title: `${displayName}'s Travel Map`,
      description: profile.bio || `Check out ${displayName}'s travel adventures on SeeEvery.Place.`,
      type: 'profile',
      url: `https://seeevery.place/u/${username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName}'s Travel Map`,
      description: profile.bio || `Check out ${displayName}'s travel adventures on SeeEvery.Place.`,
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Get the public profile
  const { data, error } = await supabase
    .rpc('get_public_profile', { profile_username: username })
    .single();

  const profile = data as PublicProfile | null;

  if (error || !profile) {
    notFound();
  }

  // Get the user's selections
  const { data: selectionsData } = await supabase
    .from('user_selections')
    .select('selections')
    .eq('user_id', profile.id)
    .single();

  // Get the user's achievements
  const { data: achievements } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', profile.id)
    .order('unlocked_at', { ascending: false });

  return (
    <PublicProfileClient
      profile={profile}
      selections={selectionsData?.selections || {}}
      achievements={achievements || []}
      username={username}
    />
  );
}
