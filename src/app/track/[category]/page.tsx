import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Category, categoryLabels, categoryIcons } from '@/lib/types';
import Link from 'next/link';

const categories: Category[] = [
  'countries',
  'states',
  'nationalParks',
  'stateParks',
  'unesco',
  'mountains',
  'museums',
  'stadiums',
  'marathons',
];

const categoryDescriptions: Record<Category, string> = {
  countries: 'Track all 197 countries around the world. Mark countries as visited or add them to your bucket list.',
  states: 'Track all 50 US states plus Washington DC. Perfect for road trippers and domestic travelers.',
  nationalParks: 'Track US Parks - National Parks. From Yellowstone to Yosemite, never lose track of your park adventures.',
  stateParks: 'Track US Parks - State Parks. Discover hidden gems and scenic wonders across all 50 states.',
  unesco: 'Track UNESCO World Heritage Sites. Discover and check off the most culturally significant places on Earth.',
  mountains: 'Track famous peaks including 5000m+ mountains and US 14ers. For mountaineers and hiking enthusiasts tracking their summit achievements.',
  museums: 'Track world-class museums you have visited. From the Louvre to the Met, keep a record of your cultural experiences.',
  stadiums: 'Track professional sports stadiums and arenas. MLB, NFL, NBA, NHL, MLS and iconic venues worldwide.',
  marathons: 'Track the World Marathon Majors. Boston, London, Berlin, Chicago, New York, and Tokyo.',
};

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = categoryLabels[category as Category] || category;
  const description = categoryDescriptions[category as Category] || `Track ${label} you have visited.`;

  return {
    title: `Track ${label} Visited | Free Interactive Map | See Every Place`,
    description: `${description} Create beautiful shareable maps and bucket lists for free.`,
    openGraph: {
      title: `Track ${label} Visited | See Every Place`,
      description: description,
      type: 'website',
    },
  };
}

export default async function CategoryLandingPage({ params }: Props) {
  const { category } = await params;

  if (!categories.includes(category as Category)) {
    redirect('/');
  }

  const label = categoryLabels[category as Category];
  const icon = categoryIcons[category as Category];
  const description = categoryDescriptions[category as Category];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none">
                See Every Place
              </h1>
              <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <Link
            href={`/?category=${category}`}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
          >
            Start Tracking
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <span className="text-6xl mb-4 block">{icon}</span>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Track {label} You&apos;ve Visited
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">🗺️</div>
            <h3 className="font-bold text-gray-800 mb-2">Interactive Map</h3>
            <p className="text-gray-600 text-sm">
              Visual map showing your visited {label.toLowerCase()} in green
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-bold text-gray-800 mb-2">Bucket List</h3>
            <p className="text-gray-600 text-sm">
              Mark {label.toLowerCase()} you want to visit next
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">📤</div>
            <h3 className="font-bold text-gray-800 mb-2">Share Stats</h3>
            <p className="text-gray-600 text-sm">
              Create beautiful shareable graphics
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href={`/?category=${category}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            Start Tracking {label}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-4 text-gray-500 text-sm">
            Free to use, no account required
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Also Track
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories
              .filter((c) => c !== category)
              .slice(0, 4)
              .map((c) => (
                <Link
                  key={c}
                  href={`/track/${c}`}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center"
                >
                  <span className="text-2xl block mb-2">{categoryIcons[c]}</span>
                  <span className="text-sm font-medium text-gray-700">{categoryLabels[c]}</span>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>See Every Place - Free Travel Tracking App</p>
        </div>
      </footer>
    </div>
  );
}
