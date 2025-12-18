import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { Category, categoryLabels, categoryIcons, getGroupForCategory, CategoryGroup } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { nationalParks } from '@/data/nationalParks';
import { nationalMonuments } from '@/data/nationalMonuments';
import { stateParks } from '@/data/stateParks';
import { weirdAmericana } from '@/data/weirdAmericana';
import { usStates } from '@/data/usStates';
import { worldCities } from '@/data/worldCities';
import { countries } from '@/data/countries';
import StatePageClient from './StatePageClient';

// Categories that support state/country-level filtering
const stateFilterableCategories: Category[] = [
  // US categories (filter by state)
  'nationalParks',
  'nationalMonuments',
  'stateParks',
  'weirdAmericana',
  // World categories (filter by country)
  'worldCities',
];

// World categories that use country codes instead of state codes
const WORLD_CATEGORIES = new Set<Category>(['worldCities']);

// Helper to check if a category uses country-based filtering
function isWorldCategory(category: Category): boolean {
  return WORLD_CATEGORIES.has(category);
}

// State code to full name mapping
const stateNames: Record<string, string> = {};
usStates.forEach(s => {
  stateNames[s.code] = s.name;
});

// Country code to full name mapping
const countryNames: Record<string, string> = {};
countries.forEach(c => {
  countryNames[c.code] = c.name;
});

// Get items for a category filtered by state or country
function getItemsByRegion(category: Category, regionCode: string) {
  const upperCode = regionCode.toUpperCase();

  switch (category) {
    // US categories - filter by state
    case 'nationalParks':
      return nationalParks.filter(p =>
        p.state === upperCode || p.state.includes(upperCode)
      );
    case 'nationalMonuments':
      return nationalMonuments.filter(m =>
        m.state === upperCode || m.state.includes(upperCode)
      );
    case 'stateParks':
      return stateParks.filter(p =>
        p.state === upperCode || p.state.includes(upperCode)
      );
    case 'weirdAmericana':
      return weirdAmericana.filter(w =>
        w.state === upperCode || w.state.includes(upperCode)
      );
    // World categories - filter by country code
    case 'worldCities':
      return worldCities.filter(c => c.countryCode === upperCode);
    default:
      return [];
  }
}

// Get all unique states/countries for a category
function getRegionsForCategory(category: Category): string[] {
  const regions = new Set<string>();

  // Handle world categories - return country codes
  if (isWorldCategory(category)) {
    switch (category) {
      case 'worldCities':
        worldCities.forEach(c => regions.add(c.countryCode));
        break;
    }
    return Array.from(regions).sort();
  }

  // Handle US categories - return state codes
  let items: { state: string }[] = [];
  switch (category) {
    case 'nationalParks':
      items = nationalParks;
      break;
    case 'nationalMonuments':
      items = nationalMonuments;
      break;
    case 'stateParks':
      items = stateParks;
      break;
    case 'weirdAmericana':
      items = weirdAmericana;
      break;
  }

  items.forEach(item => {
    // Handle multi-state items like "WY/MT/ID"
    if (item.state.includes('/')) {
      item.state.split('/').forEach(s => regions.add(s.trim()));
    } else {
      regions.add(item.state);
    }
  });

  return Array.from(regions).sort();
}

// Theme colors by category group
const themeColors: Record<CategoryGroup, string> = {
  nature: 'from-emerald-50 to-stone-100 dark:from-emerald-950 dark:to-stone-900',
  sports: 'from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900',
  culture: 'from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-900',
  destinations: 'from-sky-50 to-white dark:from-slate-900 dark:to-slate-800',
};

// Accent colors for buttons and highlights by group
const accentColors: Record<CategoryGroup, { bg: string; hover: string; challenge: string }> = {
  nature: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', challenge: 'bg-emerald-800' },
  sports: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', challenge: 'bg-indigo-800' },
  culture: { bg: 'bg-amber-600', hover: 'hover:bg-amber-700', challenge: 'bg-amber-800' },
  destinations: { bg: 'bg-primary-700', hover: 'hover:bg-primary-800', challenge: 'bg-primary-900' },
};

// Text gradient colors for hero titles (vibrant and visible in light/dark)
const textGradientColors: Record<CategoryGroup, string> = {
  nature: 'from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-400',
  sports: 'from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-400',
  culture: 'from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-400',
  destinations: 'from-primary to-slate-600 dark:from-primary dark:to-slate-400',
};

// Region-specific descriptions (for states and countries)
function getRegionDescription(category: Category, regionName: string, count: number, isCountry: boolean): string {
  if (isCountry) {
    const descriptions: Partial<Record<Category, string>> = {
      worldCities: `Explore ${count} major cities in ${regionName}. Track your visits to the world's greatest urban destinations.`,
    };
    return descriptions[category] || `Track ${count} locations in ${regionName}.`;
  }

  const descriptions: Partial<Record<Category, string>> = {
    nationalParks: `Discover all ${count} National Parks in ${regionName}. Track your visits, build your bucket list, and explore the natural wonders of ${regionName}.`,
    nationalMonuments: `Explore ${count} National Monuments in ${regionName}. From historic landmarks to natural wonders, track your journey through ${regionName}'s protected treasures.`,
    stateParks: `${regionName} has ${count} incredible state parks waiting for you. Track your adventures and discover hidden gems across the state.`,
    weirdAmericana: `${regionName} is home to ${count} quirky roadside attractions. From giant sculptures to mystery spots, track the weird and wonderful!`,
  };
  return descriptions[category] || `Track ${count} locations in ${regionName}.`;
}

// Generate JSON-LD structured data
function generateJsonLd(category: Category, regionName: string, regionCode: string, count: number, isCountry: boolean) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place';
  const label = categoryLabels[category];

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${label} in ${regionName} | See Every Place`,
    description: getRegionDescription(category, regionName, count, isCountry),
    url: `${baseUrl}/track/${category}/${regionCode.toLowerCase()}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'See Every Place',
      url: baseUrl,
    },
    about: {
      '@type': 'Place',
      name: regionName,
      address: isCountry
        ? { '@type': 'PostalAddress', addressCountry: regionCode }
        : { '@type': 'PostalAddress', addressRegion: regionCode, addressCountry: 'US' },
    },
  };
}

// Generate Breadcrumb JSON-LD schema for SEO
function generateBreadcrumbJsonLd(category: Category, label: string, regionName: string, regionCode: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: `${baseUrl}/track/${category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: regionName,
        item: `${baseUrl}/track/${category}/${regionCode.toLowerCase()}`,
      },
    ],
  };
}

// Generate static params for all category/state/country combinations
export function generateStaticParams() {
  const params: { category: string; state: string }[] = [];

  for (const category of stateFilterableCategories) {
    const regions = getRegionsForCategory(category);
    for (const region of regions) {
      params.push({
        category,
        state: region.toLowerCase(),
      });
    }
  }

  return params;
}

type Props = {
  params: Promise<{ category: string; state: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, state } = await params;
  const regionCode = state.toUpperCase();
  const isCountry = isWorldCategory(category as Category);

  // Get region name from appropriate lookup
  const regionName = isCountry ? countryNames[regionCode] : stateNames[regionCode];

  if (!regionName || !stateFilterableCategories.includes(category as Category)) {
    return { title: 'Not Found' };
  }

  const items = getItemsByRegion(category as Category, regionCode);
  const label = categoryLabels[category as Category];
  const description = getRegionDescription(category as Category, regionName, items.length, isCountry);

  return {
    title: `${label} in ${regionName} | See Every Place`,
    description,
    keywords: [
      `${label.toLowerCase()} in ${regionName}`,
      `${regionName} ${label.toLowerCase()}`,
      `${regionName} ${label.toLowerCase()} checklist`,
      `${regionName} ${label.toLowerCase()} map`,
      `visit ${regionName}`,
      'travel tracker',
      'bucket list',
    ],
    openGraph: {
      title: `${label} in ${regionName} | See Every Place`,
      description,
      type: 'website',
    },
  };
}

export default async function StateCategoryPage({ params }: Props) {
  const { category, state } = await params;
  const regionCode = state.toUpperCase();
  const isCountry = isWorldCategory(category as Category);

  // Get region name from appropriate lookup
  const regionName = isCountry ? countryNames[regionCode] : stateNames[regionCode];

  // Validate category and region
  if (!stateFilterableCategories.includes(category as Category)) {
    redirect(`/track/${category}`);
  }

  if (!regionName) {
    notFound();
  }

  const items = getItemsByRegion(category as Category, regionCode);

  if (items.length === 0) {
    notFound();
  }

  const label = categoryLabels[category as Category];
  const icon = categoryIcons[category as Category];
  const description = getRegionDescription(category as Category, regionName, items.length, isCountry);
  const jsonLd = generateJsonLd(category as Category, regionName, regionCode, items.length, isCountry);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(category as Category, label, regionName, regionCode);

  // Get category group and theme
  const group = getGroupForCategory(category as Category);
  const gradientClass = themeColors[group];
  const accent = accentColors[group];
  const textGradient = textGradientColors[group];

  // Get other regions with this category for "Explore Other Regions" section
  const allRegions = getRegionsForCategory(category as Category);
  const otherRegions = allRegions
    .filter(r => r !== regionCode)
    .slice(0, 8);

  return (
    <>
      <Script
        id={`json-ld-${category}-${state}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb JSON-LD Schema for SEO */}
      <Script
        id={`breadcrumb-json-ld-${category}-${state}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className={`min-h-screen bg-gradient-to-b ${gradientClass}`}>
        <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
                <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground leading-none">
                  SeeEvery<span className="text-primary">.</span>Place<span className="text-[10px] align-super text-muted-foreground">™</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
                  Free Travel Tracker
                </span>
              </div>
            </Link>
            <Button asChild size="sm">
              <Link href={`/?category=${category}`}>
                Start Tracking
              </Link>
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Visual Breadcrumb Navigation */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <li className="text-muted-foreground/60">/</li>
              <li>
                <Link href={`/track/${category}`} className="hover:text-foreground transition-colors">
                  {label}
                </Link>
              </li>
              <li className="text-muted-foreground/60">/</li>
              <li className="text-foreground font-medium">{regionName}</li>
            </ol>
          </nav>

          <div className="text-center mb-12">
            <span className="text-6xl mb-4 block">{icon}</span>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {label} in {regionName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Interactive Map & List - Click markers or list items to toggle status */}
          <section className="mb-12">
            <StatePageClient
              items={items}
              category={category as Category}
              title={`${label} in ${regionName}`}
              regionCode={regionCode}
              isCountry={isCountry}
            />
          </section>

          {/* Explore Other Regions */}
          {otherRegions.length > 0 && (
            <section className="my-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Explore {label} in Other {isCountry ? 'Countries' : 'States'}
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {otherRegions.map((otherRegion) => (
                  <Link
                    key={otherRegion}
                    href={`/track/${category}/${otherRegion.toLowerCase()}`}
                  >
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer"
                    >
                      {isCountry ? (countryNames[otherRegion] || otherRegion) : (stateNames[otherRegion] || otherRegion)}
                    </Badge>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link
                  href={`/track/${category}`}
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  View all {allRegions.length} {isCountry ? 'countries' : 'states'} with {label.toLowerCase()} →
                </Link>
              </div>
            </section>
          )}

          {/* Back to main category */}
          <section className="mt-16 text-center">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link href={`/track/${category}`}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to All {label}
              </Link>
            </Button>
          </section>
        </main>

        <footer className="border-t border-border bg-muted/50">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <div className="flex justify-center gap-4 mb-2">
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <span>•</span>
              <Link href="/suggest" className="hover:text-foreground transition-colors">Suggest</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
            <p>See Every Place - Free Travel Tracker</p>
          </div>
        </footer>
      </div>
    </>
  );
}
