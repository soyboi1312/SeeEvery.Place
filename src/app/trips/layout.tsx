import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Quests | SeeEvery.Place',
  description: 'Create custom quests and track your conquests. Plan trips, share with friends, and conquer places together.',
  openGraph: {
    title: 'My Quests | SeeEvery.Place',
    description: 'Create custom quests and track your conquests. Plan trips, share with friends, and conquer places together.',
    type: 'website',
  },
};

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
