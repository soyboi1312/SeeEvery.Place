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
import InteractiveStateList from '@/components/InteractiveStateList';

// Categories that support state-level filtering
const stateFilterableCategories: Category[] = [
  'nationalParks',
  'nationalMonuments',
  'stateParks',
  'weirdAmericana',
];

// State code to full name mapping
const stateNames: Record<string, string> = {};
usStates.forEach(s => {
  stateNames[s.code] = s.name;
});

// Get items for a category filtered by state
function getItemsByState(category: Category, stateCode: string) {
  const upperState = stateCode.toUpperCase();

  switch (category) {
    case 'nationalParks':
      return nationalParks.filter(p =>
        p.state === upperState || p.state.includes(upperState)
      );
    case 'nationalMonuments':
      return nationalMonuments.filter(m =>
        m.state === upperState || m.state.includes(upperState)
      );
    case 'stateParks':
      return stateParks.filter(p =>
        p.state === upperState || p.state.includes(upperState)
      );
    case 'weirdAmericana':
      return weirdAmericana.filter(w =>
        w.state === upperState || w.state.includes(upperState)
      );
    default:
      return [];
  }
}

// Get all unique states for a category
function getStatesForCategory(category: Category): string[] {
  const states = new Set<string>();

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
      item.state.split('/').forEach(s => states.add(s.trim()));
    } else {
      states.add(item.state);
    }
  });

  return Array.from(states).sort();
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

// State-specific descriptions
function getStateDescription(category: Category, stateName: string, count: number): string {
  const descriptions: Partial<Record<Category, string>> = {
    nationalParks: `Discover all ${count} National Parks in ${stateName}. Track your visits, build your bucket list, and explore the natural wonders of ${stateName}.`,
    nationalMonuments: `Explore ${count} National Monuments in ${stateName}. From historic landmarks to natural wonders, track your journey through ${stateName}'s protected treasures.`,
    stateParks: `${stateName} has ${count} incredible state parks waiting for you. Track your adventures and discover hidden gems across the state.`,
    weirdAmericana: `${stateName} is home to ${count} quirky roadside attractions. From giant sculptures to mystery spots, track the weird and wonderful!`,
  };
  return descriptions[category] || `Track ${count} locations in ${stateName}.`;
}

// Generate JSON-LD structured data
function generateJsonLd(category: Category, stateName: string, stateCode: string, count: number) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place';
  const label = categoryLabels[category];

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${label} in ${stateName} | See Every Place`,
    description: getStateDescription(category, stateName, count),
    url: `${baseUrl}/track/${category}/${stateCode.toLowerCase()}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'See Every Place',
      url: baseUrl,
    },
    about: {
      '@type': 'Place',
      name: stateName,
      address: {
        '@type': 'PostalAddress',
        addressRegion: stateCode,
        addressCountry: 'US',
      },
    },
  };
}

// Generate Breadcrumb JSON-LD schema for SEO
function generateBreadcrumbJsonLd(category: Category, label: string, stateName: string, stateCode: string) {
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
        name: stateName,
        item: `${baseUrl}/track/${category}/${stateCode.toLowerCase()}`,
      },
    ],
  };
}

// Generate static params for all category/state combinations
export function generateStaticParams() {
  const params: { category: string; state: string }[] = [];

  for (const category of stateFilterableCategories) {
    const states = getStatesForCategory(category);
    for (const state of states) {
      params.push({
        category,
        state: state.toLowerCase(),
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
  const stateCode = state.toUpperCase();
  const stateName = stateNames[stateCode];

  if (!stateName || !stateFilterableCategories.includes(category as Category)) {
    return { title: 'Not Found' };
  }

  const items = getItemsByState(category as Category, stateCode);
  const label = categoryLabels[category as Category];
  const description = getStateDescription(category as Category, stateName, items.length);

  return {
    title: `${label} in ${stateName} | See Every Place`,
    description,
    keywords: [
      `${label.toLowerCase()} in ${stateName}`,
      `${stateName} ${label.toLowerCase()}`,
      `${stateName} ${label.toLowerCase()} checklist`,
      `${stateName} ${label.toLowerCase()} map`,
      `visit ${stateName}`,
      'travel tracker',
      'bucket list',
    ],
    openGraph: {
      title: `${label} in ${stateName} | See Every Place`,
      description,
      type: 'website',
    },
  };
}

export default async function StateCategoryPage({ params }: Props) {
  const { category, state } = await params;
  const stateCode = state.toUpperCase();
  const stateName = stateNames[stateCode];

  // Validate category and state
  if (!stateFilterableCategories.includes(category as Category)) {
    redirect(`/track/${category}`);
  }

  if (!stateName) {
    notFound();
  }

  const items = getItemsByState(category as Category, stateCode);

  if (items.length === 0) {
    notFound();
  }

  const label = categoryLabels[category as Category];
  const icon = categoryIcons[category as Category];
  const description = getStateDescription(category as Category, stateName, items.length);
  const jsonLd = generateJsonLd(category as Category, stateName, stateCode, items.length);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(category as Category, label, stateName, stateCode);

  // Get category group and theme
  const group = getGroupForCategory(category as Category);
  const gradientClass = themeColors[group];
  const accent = accentColors[group];
  const textGradient = textGradientColors[group];

  // Get other states with this category for "Explore Other States" section
  const allStates = getStatesForCategory(category as Category);
  const otherStates = allStates
    .filter(s => s !== stateCode)
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
              <li className="text-foreground font-medium">{stateName}</li>
            </ol>
          </nav>

          <div className="text-center mb-12">
            <span className="text-6xl mb-4 block">{icon}</span>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {label} in {stateName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Interactive List - Click to mark visited or bucket list */}
          <section className="mb-12">
            <InteractiveStateList
              items={items}
              category={category as Category}
              title={`${label} in ${stateName}`}
            />
          </section>

          {/* Explore Other States */}
          {otherStates.length > 0 && (
            <section className="my-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Explore {label} in Other States
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {otherStates.map((otherState) => (
                  <Link
                    key={otherState}
                    href={`/track/${category}/${otherState.toLowerCase()}`}
                  >
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer"
                    >
                      {stateNames[otherState] || otherState}
                    </Badge>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link
                  href={`/track/${category}`}
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  View all {allStates.length} states with {label.toLowerCase()} →
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
