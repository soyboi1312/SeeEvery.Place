import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicProfileClient from './PublicProfileClient';
import { getPublicProfile, getPublicSelections } from './getProfile';

interface PageProps {
  params: Promise<{ username: string }>;
}

// Enable ISR - revalidate every 60 seconds to reduce database calls
// This dramatically reduces Cloudflare Worker CPU usage
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;

  // Use cached function - deduplicates with page component call
  const profile = await getPublicProfile(username);

  if (!profile) {
    return {
      title: 'Profile Not Found | SeeEvery.Place',
    };
  }

  const displayName = profile.full_name || username;

  const profileUrl = `https://seeevery.place/u/${username}`;

  return {
    title: `${displayName}'s Travel Map | SeeEvery.Place`,
    description: profile.bio || `Check out ${displayName}'s travel adventures on SeeEvery.Place - the free travel tracker.`,
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title: `${displayName}'s Travel Map`,
      description: profile.bio || `Check out ${displayName}'s travel adventures on SeeEvery.Place.`,
      type: 'profile',
      url: profileUrl,
      images: [{ url: '/files/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName}'s Travel Map`,
      description: profile.bio || `Check out ${displayName}'s travel adventures on SeeEvery.Place.`,
      images: ['/files/og-image.png'],
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;

  // Use cached function - deduplicates with generateMetadata call
  const profile = await getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  // Get the user's selections using cached admin query
  // This is safe because we've already verified the profile is public
  const selections = await getPublicSelections(profile.id);

  // Achievements are now included in the profile from get_public_profile function
  const achievements = profile.achievements || [];

  return (
    <PublicProfileClient
      profile={profile}
      selections={selections}
      achievements={achievements}
      username={username}
    />
  );
}
