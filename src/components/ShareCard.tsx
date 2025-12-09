/**
 * ShareCard Component
 * Modal for generating and sharing travel stats images
 */
'use client';

import { useRef, useState, useMemo } from 'react';
import { Category, UserSelections } from '@/lib/types';
import { getStats } from '@/lib/storage';
import { countries } from '@/data/countries';
import { usStates } from '@/data/usStates';
import { nationalParks } from '@/data/nationalParks';
import { nationalMonuments } from '@/data/nationalMonuments';
import { stateParks } from '@/data/stateParks';
import { get5000mPeaks, getUS14ers } from '@/data/mountains';
import { museums } from '@/data/museums';
import { getMlbStadiums, getNflStadiums, getNbaStadiums, getNhlStadiums, getSoccerStadiums, type Stadium } from '@/data/stadiums';
import { f1Tracks } from '@/data/f1Tracks';
import { marathons } from '@/data/marathons';
import { airports } from '@/data/airports';
import { skiResorts } from '@/data/skiResorts';
import { themeParks } from '@/data/themeParks';
import { surfingReserves } from '@/data/surfingReserves';
import { weirdAmericana } from '@/data/weirdAmericana';
import { useShareImage } from '@/lib/hooks/useShareImage';
import { ShareableMapDesign, gradients, usesRegionMap, detectMilestones, type Milestone } from './share';
import type { MarkerSize } from './MapMarkers';

// Share caption suggestions based on category and stats
function getShareSuggestions(category: Category, stats: { visited: number; percentage: number }, milestones: Milestone[]): string[] {
  const suggestions: string[] = [];

  // Base suggestion with category
  const categoryName = {
    countries: 'countries',
    states: 'US states & territories',
    nationalParks: 'national parks',
    nationalMonuments: 'national monuments',
    stateParks: 'state parks',
    fiveKPeaks: '5000m+ peaks',
    fourteeners: '14ers',
    museums: 'world museums',
    mlbStadiums: 'MLB stadiums',
    nflStadiums: 'NFL stadiums',
    nbaStadiums: 'NBA arenas',
    nhlStadiums: 'NHL arenas',
    soccerStadiums: 'soccer stadiums',
    f1Tracks: 'F1 tracks',
    marathons: 'marathon majors',
    airports: 'major airports',
    skiResorts: 'ski resorts',
    themeParks: 'theme parks',
    surfingReserves: 'surfing reserves',
    weirdAmericana: 'quirky roadside attractions',
  }[category];

  suggestions.push(`I've visited ${stats.visited} ${categoryName}! Track yours at seeevery.place`);

  // Milestone-based suggestions
  if (stats.percentage === 100) {
    suggestions.push(`100% complete! I've visited every ${categoryName.replace(/s$/, '')} - challenge accepted and conquered!`);
  } else if (stats.percentage >= 50) {
    suggestions.push(`${stats.percentage}% of the way to visiting all ${categoryName}! Who's joining me?`);
  }

  // Category-specific hashtag suggestions
  const hashtags: Record<string, string[]> = {
    countries: ['#travel #wanderlust #worldtravel'],
    states: ['#roadtrip #usatravel #exploreamerica'],
    nationalParks: ['#nationalparks #findyourpark #nps @nationalparkservice'],
    nationalMonuments: ['#nationalmonument #americanhistory #ustravel'],
    stateParks: ['#stateparks #hiking #nature'],
    fiveKPeaks: ['#mountaineering #climbing #mountains'],
    fourteeners: ['#14ers #colorado #hiking'],
    museums: ['#museums #art #culture'],
    mlbStadiums: ['#mlb #baseball #stadiumtour'],
    nflStadiums: ['#nfl #football #stadiumhopper'],
    nbaStadiums: ['#nba #basketball #arenas'],
    nhlStadiums: ['#nhl #hockey #arenas'],
    soccerStadiums: ['#soccer #football #stadiums'],
    f1Tracks: ['#f1 #formula1 #racing'],
    marathons: ['#marathon #running #worldmajors'],
    airports: ['#aviation #travel #airports'],
    skiResorts: ['#skiing #snowboarding #ski'],
    themeParks: ['#themeparks #rollercoasters #disney'],
    surfingReserves: ['#surfing #waves #surf'],
    weirdAmericana: ['#roadsideamerica #quirky #americana'],
  };

  if (hashtags[category]) {
    suggestions.push(`${stats.visited} ${categoryName} and counting! ${hashtags[category][0]}`);
  }

  return suggestions;
}

// =====================
// O(1) Lookup Maps for fast name lookups
// =====================
type NamedItem = { id?: string; code?: string; name: string };

function createNameMap<T extends NamedItem>(items: T[], keyField: 'id' | 'code' = 'id'): Map<string, string> {
  return new Map(items.map(item => [item[keyField] as string, item.name]));
}

// Static data maps (created once at module load)
const countriesNameMap = createNameMap(countries, 'code');
const usStatesNameMap = createNameMap(usStates, 'code');
const nationalParksNameMap = createNameMap(nationalParks);
const nationalMonumentsNameMap = createNameMap(nationalMonuments);
const stateParksNameMap = createNameMap(stateParks);
const museumsNameMap = createNameMap(museums);
const f1TracksNameMap = createNameMap(f1Tracks);
const marathonsNameMap = createNameMap(marathons);
const airportsNameMap = createNameMap(airports);
const skiResortsNameMap = createNameMap(skiResorts);
const themeParksNameMap = createNameMap(themeParks);
const surfingReservesNameMap = createNameMap(surfingReserves);
const weirdAmericanaNameMap = createNameMap(weirdAmericana);

// Lazy-initialized maps for function-generated data
let fiveKPeaksNameMap: Map<string, string> | null = null;
let fourteenersNameMap: Map<string, string> | null = null;
let mlbStadiumsNameMap: Map<string, string> | null = null;
let nflStadiumsNameMap: Map<string, string> | null = null;
let nbaStadiumsNameMap: Map<string, string> | null = null;
let nhlStadiumsNameMap: Map<string, string> | null = null;
let soccerStadiumsNameMap: Map<string, string> | null = null;

function getFiveKPeaksNameMap(): Map<string, string> {
  if (!fiveKPeaksNameMap) fiveKPeaksNameMap = createNameMap(get5000mPeaks());
  return fiveKPeaksNameMap;
}

function getFourteenersNameMap(): Map<string, string> {
  if (!fourteenersNameMap) fourteenersNameMap = createNameMap(getUS14ers());
  return fourteenersNameMap;
}

function getMlbStadiumsNameMap(): Map<string, string> {
  if (!mlbStadiumsNameMap) mlbStadiumsNameMap = createNameMap(getMlbStadiums());
  return mlbStadiumsNameMap;
}

function getNflStadiumsNameMap(): Map<string, string> {
  if (!nflStadiumsNameMap) nflStadiumsNameMap = createNameMap(getNflStadiums());
  return nflStadiumsNameMap;
}

function getNbaStadiumsNameMap(): Map<string, string> {
  if (!nbaStadiumsNameMap) nbaStadiumsNameMap = createNameMap(getNbaStadiums());
  return nbaStadiumsNameMap;
}

function getNhlStadiumsNameMap(): Map<string, string> {
  if (!nhlStadiumsNameMap) nhlStadiumsNameMap = createNameMap(getNhlStadiums());
  return nhlStadiumsNameMap;
}

function getSoccerStadiumsNameMap(): Map<string, string> {
  if (!soccerStadiumsNameMap) soccerStadiumsNameMap = createNameMap(getSoccerStadiums());
  return soccerStadiumsNameMap;
}

interface ShareCardProps {
  selections: UserSelections;
  category: Category;
  subcategory?: string;
  onClose: () => void;
}

const categoryTotals: Record<Category, number> = {
  countries: countries.length,
  states: usStates.length,
  nationalParks: nationalParks.length,
  nationalMonuments: nationalMonuments.length,
  stateParks: stateParks.length,
  fiveKPeaks: get5000mPeaks().length,
  fourteeners: getUS14ers().length,
  museums: museums.length,
  mlbStadiums: getMlbStadiums().length,
  nflStadiums: getNflStadiums().length,
  nbaStadiums: getNbaStadiums().length,
  nhlStadiums: getNhlStadiums().length,
  soccerStadiums: getSoccerStadiums().length,
  f1Tracks: f1Tracks.length,
  marathons: marathons.length,
  airports: airports.length,
  skiResorts: skiResorts.length,
  themeParks: themeParks.length,
  surfingReserves: surfingReserves.length,
  weirdAmericana: weirdAmericana.length,
};

// Get visited item names for a category - O(1) Map lookups
function getVisitedItemNames(selections: UserSelections, category: Category): string[] {
  // Get the appropriate name map for this category
  let nameMap: Map<string, string>;

  switch (category) {
    case 'countries':
      nameMap = countriesNameMap;
      break;
    case 'states':
      nameMap = usStatesNameMap;
      break;
    case 'nationalParks':
      nameMap = nationalParksNameMap;
      break;
    case 'nationalMonuments':
      nameMap = nationalMonumentsNameMap;
      break;
    case 'stateParks':
      nameMap = stateParksNameMap;
      break;
    case 'fiveKPeaks':
      nameMap = getFiveKPeaksNameMap();
      break;
    case 'fourteeners':
      nameMap = getFourteenersNameMap();
      break;
    case 'museums':
      nameMap = museumsNameMap;
      break;
    case 'mlbStadiums':
      nameMap = getMlbStadiumsNameMap();
      break;
    case 'nflStadiums':
      nameMap = getNflStadiumsNameMap();
      break;
    case 'nbaStadiums':
      nameMap = getNbaStadiumsNameMap();
      break;
    case 'nhlStadiums':
      nameMap = getNhlStadiumsNameMap();
      break;
    case 'soccerStadiums':
      nameMap = getSoccerStadiumsNameMap();
      break;
    case 'f1Tracks':
      nameMap = f1TracksNameMap;
      break;
    case 'marathons':
      nameMap = marathonsNameMap;
      break;
    case 'airports':
      nameMap = airportsNameMap;
      break;
    case 'skiResorts':
      nameMap = skiResortsNameMap;
      break;
    case 'themeParks':
      nameMap = themeParksNameMap;
      break;
    case 'surfingReserves':
      nameMap = surfingReservesNameMap;
      break;
    case 'weirdAmericana':
      nameMap = weirdAmericanaNameMap;
      break;
    default:
      return [];
  }

  return selections[category]
    .filter(s => s.status === 'visited')
    .map(s => nameMap.get(s.id))
    .filter((name): name is string => name !== undefined);
}

export default function ShareCard({ selections, category, subcategory, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [includeMap, setIncludeMap] = useState(true);
  const [iconSize, setIconSize] = useState<MarkerSize>('small');

  const { isDownloading, downloadImage, shareOrCopyImage } = useShareImage({
    cardRef,
    category,
  });

  const stats = useMemo(
    () => getStats(selections, category, categoryTotals[category]),
    [selections, category]
  );

  const visitedItems = useMemo(
    () => getVisitedItemNames(selections, category),
    [selections, category]
  );

  // Detect milestones based on current progress
  const milestones = useMemo(
    () => detectMilestones(stats.visited, stats.total, stats.percentage, category),
    [stats.visited, stats.total, stats.percentage, category]
  );

  // Get share caption suggestions
  const shareSuggestions = useMemo(
    () => getShareSuggestions(category, stats, milestones),
    [category, stats, milestones]
  );

  // Copy suggestion to clipboard
  const copySuggestion = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share Your Map</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Color Picker */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Choose a style:</p>
          <div className="flex flex-wrap gap-2">
            {gradients.map((gradient, index) => {
              const styleName = index < 5 ? 'Vibrant' : index < 8 ? 'Midnight' : index < 11 ? 'Metallic' : 'Nature';
              return (
                <button
                  key={index}
                  onClick={() => setSelectedGradient(index)}
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} transition-transform hover:scale-105 ${
                    selectedGradient === index ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''
                  }`}
                  title={styleName}
                  aria-label={`Select ${styleName} style ${index + 1}${selectedGradient === index ? ' (selected)' : ''}`}
                  aria-pressed={selectedGradient === index}
                />
              );
            })}
          </div>
        </div>

        {/* Map Toggle */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-600 dark:text-gray-300">Include map snapshot</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={includeMap}
                onChange={(e) => setIncludeMap(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${includeMap ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform absolute top-0.5 ${includeMap ? 'translate-x-5.5 right-0.5' : 'left-0.5'}`} />
              </div>
            </div>
          </label>

          {/* Icon Size Toggle - only show for marker-based maps when map is included */}
          {includeMap && !usesRegionMap(category) && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Icon size</span>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setIconSize('small')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    iconSize === 'small'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Small
                </button>
                <button
                  onClick={() => setIconSize('default')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    iconSize === 'default'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Large
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card Preview */}
        <div className="p-4">
          <ShareableMapDesign
            ref={cardRef}
            selections={selections}
            category={category}
            subcategory={subcategory}
            stats={stats}
            visitedItems={visitedItems}
            selectedGradient={selectedGradient}
            includeMap={includeMap}
            iconSize={iconSize}
            milestones={milestones}
          />
        </div>

        {/* Share Caption Suggestions */}
        {shareSuggestions.length > 0 && (
          <div className="px-4 pb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Caption ideas (tap to copy)
            </p>
            <div className="space-y-2">
              {shareSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => copySuggestion(suggestion)}
                  className="w-full text-left p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <span className="line-clamp-2">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={downloadImage}
            disabled={isDownloading}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </>
            )}
          </button>
          <button
            onClick={shareOrCopyImage}
            disabled={isDownloading}
            className="py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>

        <div className="p-4 pt-0 text-center text-sm text-gray-500 dark:text-gray-400">
          Tip: Right-click items to quickly set visited or bucket list
        </div>
      </div>
    </div>
  );
}
