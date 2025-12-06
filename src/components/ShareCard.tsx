'use client';

import { useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule, Marker } from 'react-simple-maps';
import { Category, categoryLabels, categoryIcons, UserSelections, Status } from '@/lib/types';
import { getStats, getSelectionStatus } from '@/lib/storage';
import { countries } from '@/data/countries';
import { usStates } from '@/data/usStates';
import { nationalParks } from '@/data/nationalParks';
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
import {
  GEO_URL_WORLD,
  GEO_URL_USA,
  fipsToAbbr,
  countryNameToISO,
  getCategoryMarkers,
  MarkerData,
} from '@/lib/mapUtils';
import {
  SportMarker,
  SneakerMarker,
  MountainMarker,
  F1CarMarker,
  FlagMarker,
  AirplaneMarker,
  ParkMarker,
  MuseumMarker,
  SkiMarker,
  ThemeParkMarker,
  SurfingMarker,
  WeirdMarker,
} from './MapMarkers';

// US territories that cannot be displayed on the Albers USA projection
const unsupportedUSTerritoriesParks = ['american-samoa', 'virgin-islands'];

// Static Marker Map for sharing (world map with flag markers)
function StaticMarkerMap({
  category,
  selections,
  subcategory
}: {
  category: Category;
  selections: UserSelections;
  subcategory?: string;
}) {
  const allMarkers = getCategoryMarkers(category, selections, subcategory);

  // US-only categories: National Parks, State Parks, and Fourteeners
  const isUSOnly = category === 'nationalParks' || category === 'stateParks' || category === 'fourteeners';
  const markers = isUSOnly
    ? allMarkers.filter(marker => !unsupportedUSTerritoriesParks.includes(marker.id))
    : allMarkers;

  // Get US map marker based on category
  const getUSMarkerIcon = (marker: MarkerData) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

    if (category === 'fourteeners') {
      return <MountainMarker fillColor={fillColor} size="small" />;
    }

    if (category === 'nationalParks' || category === 'stateParks') {
      return <ParkMarker fillColor={fillColor} size="small" />;
    }

    // Default flag marker for parks
    return <FlagMarker fillColor={fillColor} size="small" />;
  };

  if (isUSOnly) {
    return (
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 350 }}
        width={280}
        height={160}
        style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
      >
        <Geographies geography={GEO_URL_USA}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#cbd5e1"
                stroke="#ffffff"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {markers.map((marker) => (
          <Marker key={marker.id} coordinates={marker.coordinates}>
            {getUSMarkerIcon(marker)}
          </Marker>
        ))}
      </ComposableMap>
    );
  }

  // Check category types for appropriate markers
  const isMarathons = category === 'marathons';
  const isMountains = category === 'fiveKPeaks';
  const isF1Tracks = category === 'f1Tracks';
  const isAirports = category === 'airports';
  const isMuseums = category === 'museums';
  const isSkiResorts = category === 'skiResorts';
  const isThemeParks = category === 'themeParks';
  const isSurfing = category === 'surfingReserves';
  const isWeird = category === 'weirdAmericana';
  const isStadiums = ['mlbStadiums', 'nflStadiums', 'nbaStadiums', 'nhlStadiums', 'soccerStadiums'].includes(category);

  // Get the appropriate marker icon based on category and sport
  const getMarkerIcon = (marker: MarkerData) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

    if (isMarathons) return <SneakerMarker fillColor={fillColor} size="small" />;
    if (isMountains) return <MountainMarker fillColor={fillColor} size="small" />;
    if (isF1Tracks) return <F1CarMarker fillColor={fillColor} size="small" />;
    if (isAirports) return <AirplaneMarker fillColor={fillColor} size="small" />;
    if (isStadiums) return <SportMarker sport={marker.sport} fillColor={fillColor} size="small" />;
    if (isMuseums) return <MuseumMarker fillColor={fillColor} size="small" />;
    if (isSkiResorts) return <SkiMarker fillColor={fillColor} size="small" />;
    if (isThemeParks) return <ThemeParkMarker fillColor={fillColor} size="small" />;
    if (isSurfing) return <SurfingMarker fillColor={fillColor} size="small" />;
    if (isWeird) return <WeirdMarker fillColor={fillColor} size="small" />;

    // Default flag marker for other categories
    return <FlagMarker fillColor={fillColor} size="small" />;
  };

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 55, center: [0, 0] }}
      width={280}
      height={160}
      style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
    >
      <Sphere stroke="#ffffff" strokeWidth={0.5} id="sphere-markers" fill="#1e3a5f" />
      <Graticule stroke="#ffffff" strokeWidth={0.2} strokeOpacity={0.3} />
      <Geographies geography={GEO_URL_WORLD}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#94a3b8"
              stroke="#ffffff"
              strokeWidth={0.3}
              style={{
                default: { outline: "none" },
                hover: { outline: "none" },
                pressed: { outline: "none" },
              }}
            />
          ))
        }
      </Geographies>
      {markers.map((marker) => (
        <Marker key={marker.id} coordinates={marker.coordinates}>
          {getMarkerIcon(marker)}
        </Marker>
      ))}
    </ComposableMap>
  );
}

// Static World Map for sharing (no interactivity)
function StaticWorldMap({ selections }: { selections: UserSelections }) {
  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 55, center: [0, 0] }}
      width={280}
      height={160}
      style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
    >
      <Sphere stroke="#ffffff" strokeWidth={0.5} id="sphere-share" fill="#1e3a5f" />
      <Graticule stroke="#ffffff" strokeWidth={0.2} strokeOpacity={0.3} />
      <Geographies geography={GEO_URL_WORLD}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const countryName = geo.properties.name;
            const id = countryNameToISO[countryName] || geo.properties["ISO_A2"] || geo.id;
            const status = id ? getSelectionStatus(selections, 'countries', id) : 'unvisited';

            let fill = '#94a3b8'; // unvisited - slate gray
            if (status === 'visited') fill = '#22c55e'; // green
            if (status === 'bucketList') fill = '#f59e0b'; // amber

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fill}
                stroke="#ffffff"
                strokeWidth={0.3}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}

// Static US Map for sharing (no interactivity)
function StaticUSMap({ selections }: { selections: UserSelections }) {
  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 350 }}
      width={280}
      height={160}
      style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
    >
      <Geographies geography={GEO_URL_USA}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const fips = geo.id as string;
            const id = fipsToAbbr[fips];
            const status = id ? getSelectionStatus(selections, 'states', id) : 'unvisited';

            let fill = '#94a3b8'; // unvisited - slate gray
            if (status === 'visited') fill = '#22c55e'; // green
            if (status === 'bucketList') fill = '#f59e0b'; // amber

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fill}
                stroke="#ffffff"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
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

const gradients = [
  'from-blue-600 to-purple-700',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-purple-600',
  'from-indigo-600 to-blue-700',
];

// Check if category uses colored regions (countries/states) vs markers (other categories)
const usesRegionMap = (category: Category): boolean => {
  return category === 'countries' || category === 'states';
};

export default function ShareCard({ selections, category, subcategory, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [includeMap, setIncludeMap] = useState(true);

  const stats = getStats(selections, category, categoryTotals[category]);

  const downloadImage = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);

    try {
      // Dynamically import html-to-image
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `my-${category}-map.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyOrShare = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);

    try {
      const { toBlob } = await import('html-to-image');

      const blob = await toBlob(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      if (!blob) {
        throw new Error('Failed to generate image');
      }

      // Try Web Share API first (works well on iOS/mobile)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `my-${category}-map.png`, { type: 'image/png' });
        const shareData = { files: [file] };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fall back to clipboard API (desktop browsers)
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        alert('Image copied to clipboard!');
        return;
      }

      // If neither works, suggest download
      alert('Sharing not supported on this device. Please use Download instead.');
    } catch (error) {
      // User cancelled share dialog - not an error
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Failed to copy/share image:', error);
      alert('Failed to share. Try downloading instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  const visitedItems = selections[category]
    .filter(s => s.status === 'visited')
    .map(s => {
      switch (category) {
        case 'countries':
          return countries.find(c => c.code === s.id)?.name;
        case 'states':
          return usStates.find(st => st.code === s.id)?.name;
        case 'nationalParks':
          return nationalParks.find(p => p.id === s.id)?.name;
        case 'fiveKPeaks':
          return get5000mPeaks().find(m => m.id === s.id)?.name;
        case 'fourteeners':
          return getUS14ers().find(m => m.id === s.id)?.name;
        case 'museums':
          return museums.find(m => m.id === s.id)?.name;
        case 'mlbStadiums':
          return getMlbStadiums().find((st: Stadium) => st.id === s.id)?.name;
        case 'nflStadiums':
          return getNflStadiums().find((st: Stadium) => st.id === s.id)?.name;
        case 'nbaStadiums':
          return getNbaStadiums().find((st: Stadium) => st.id === s.id)?.name;
        case 'nhlStadiums':
          return getNhlStadiums().find((st: Stadium) => st.id === s.id)?.name;
        case 'soccerStadiums':
          return getSoccerStadiums().find((st: Stadium) => st.id === s.id)?.name;
        case 'f1Tracks':
          return f1Tracks.find(t => t.id === s.id)?.name;
        case 'marathons':
          return marathons.find(m => m.id === s.id)?.name;
        case 'airports':
          return airports.find(a => a.id === s.id)?.name;
        case 'skiResorts':
          return skiResorts.find(r => r.id === s.id)?.name;
        case 'themeParks':
          return themeParks.find(p => p.id === s.id)?.name;
        case 'surfingReserves':
          return surfingReserves.find(sr => sr.id === s.id)?.name;
        case 'weirdAmericana':
          return weirdAmericana.find(w => w.id === s.id)?.name;
        default:
          return null;
      }
    })
    .filter(Boolean);

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
          <div className="flex gap-2">
            {gradients.map((gradient, index) => (
              <button
                key={index}
                onClick={() => setSelectedGradient(index)}
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} ${
                  selectedGradient === index ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Map Toggle */}
        {(
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
          </div>
        )}

        {/* Card Preview */}
        <div className="p-4">
          <div
            ref={cardRef}
            className={`bg-gradient-to-br ${gradients[selectedGradient]} p-4 sm:p-6 rounded-2xl text-white ${includeMap ? 'min-h-[280px]' : 'aspect-square'} flex flex-col`}
          >
            {/* Icon & Title */}
            <div className={`text-center ${includeMap ? 'mb-2' : 'mb-4'}`}>
              <span className={`flex items-center justify-center ${includeMap ? 'text-3xl' : 'text-4xl sm:text-5xl'}`}>{categoryIcons[category]}</span>
              <h2 className={`font-bold mt-1 ${includeMap ? 'text-lg' : 'text-xl sm:text-2xl mt-2'}`}>{categoryLabels[category]} I&apos;ve Been To</h2>
            </div>

            {/* Big Number - compact when map is shown */}
            {includeMap ? (
              <div className="text-center mb-2">
                <span className="text-3xl font-black">{stats.visited}</span>
                <span className="text-lg opacity-90"> of {stats.total} ({stats.percentage}%)</span>
              </div>
            ) : (
              <>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl sm:text-8xl font-black">
                      {stats.visited}
                    </div>
                    <div className="text-lg sm:text-xl opacity-90">
                      of {stats.total} ({stats.percentage}%)
                    </div>
                  </div>
                </div>

                {/* Sample locations - only when map is not shown */}
                {visitedItems.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm opacity-80 mb-1">Recently visited:</p>
                    <p className="text-sm font-medium truncate">
                      {visitedItems.slice(0, 3).join(' • ')}
                      {visitedItems.length > 3 && ` +${visitedItems.length - 3} more`}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Bucket list preview */}
            {stats.bucketList > 0 && !includeMap && (
              <div className="mt-3 text-center text-sm opacity-80">
                ★ {stats.bucketList} on bucket list
              </div>
            )}

            {/* Map Snapshot */}
            {includeMap && (
              <div className="mt-4 bg-white/10 rounded-xl overflow-hidden">
                <div className="relative px-2 pt-2">
                  {usesRegionMap(category) ? (
                    category === 'countries' ? (
                      <StaticWorldMap selections={selections} />
                    ) : (
                      <StaticUSMap selections={selections} />
                    )
                  ) : (
                    <StaticMarkerMap category={category} selections={selections} subcategory={subcategory} />
                  )}
                </div>
                {/* Map Legend */}
                <div className="flex justify-center gap-4 py-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="opacity-80">Visited</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="opacity-80">Bucket List</span>
                  </div>
                </div>
              </div>
            )}

            {/* Branding */}
            <div className="mt-4 text-center text-xs opacity-60">
              SeeEvery.Place
            </div>
          </div>
        </div>

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
            onClick={copyOrShare}
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
