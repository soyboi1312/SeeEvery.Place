/**
 * src/components/MapVisualization.tsx
 */
'use client';

import { useState, useCallback, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Graticule, Marker } from 'react-simple-maps';
import { Category, UserSelections, Status } from '@/lib/types';
import {
  GEO_URL_WORLD,
  GEO_URL_USA,
  fipsToAbbr,
  countryNameToISO,
  getCategoryMarkers,
  MarkerData,
} from '@/lib/mapUtils';
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

interface MapVisualizationProps {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
}

interface TooltipState {
  content: string;
  x: number;
  y: number;
}

interface TooltipHandlers {
  onMouseEnter: (content: string, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

// Get item name by category and ID
function getItemName(category: Category, id: string): string {
  switch (category) {
    case 'nationalParks':
      return nationalParks.find(p => p.id === id)?.name || id;
    case 'stateParks':
      return stateParks.find(p => p.id === id)?.name || id;
    case 'fiveKPeaks':
      return get5000mPeaks().find(m => m.id === id)?.name || id;
    case 'fourteeners':
      return getUS14ers().find(m => m.id === id)?.name || id;
    case 'museums':
      return museums.find(m => m.id === id)?.name || id;
    case 'mlbStadiums':
      return getMlbStadiums().find((s: Stadium) => s.id === id)?.name || id;
    case 'nflStadiums':
      return getNflStadiums().find((s: Stadium) => s.id === id)?.name || id;
    case 'nbaStadiums':
      return getNbaStadiums().find((s: Stadium) => s.id === id)?.name || id;
    case 'nhlStadiums':
      return getNhlStadiums().find((s: Stadium) => s.id === id)?.name || id;
    case 'soccerStadiums':
      return getSoccerStadiums().find((s: Stadium) => s.id === id)?.name || id;
    case 'f1Tracks':
      return f1Tracks.find(t => t.id === id)?.name || id;
    case 'marathons':
      return marathons.find(m => m.id === id)?.name || id;
    case 'airports':
      return airports.find(a => a.id === id)?.name || id;
    case 'skiResorts':
      return skiResorts.find(r => r.id === id)?.name || id;
    case 'themeParks':
      return themeParks.find(p => p.id === id)?.name || id;
    case 'surfingReserves':
      return surfingReserves.find(s => s.id === id)?.name || id;
    case 'weirdAmericana':
      return weirdAmericana.find(w => w.id === id)?.name || id;
    default:
      return id;
  }
}

function WorldMap({ selections, onToggle, tooltip }: { selections: UserSelections; onToggle?: (id: string, currentStatus: Status) => void; tooltip: TooltipHandlers }) {
  // Memoize status lookup for O(1) access instead of O(n) per geography
  const statusMap = useMemo(() => {
    const map = new Map<string, Status>();
    const countrySelections = selections.countries || [];
    for (const sel of countrySelections) {
      map.set(sel.id, sel.status);
    }
    return map;
  }, [selections.countries]);

  const getStatus = useCallback((id: string): Status => {
    return statusMap.get(id) || 'unvisited';
  }, [statusMap]);

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 160, center: [0, 0] }}
      className="w-full h-full"
    >
      <ZoomableGroup>
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} id="sphere" fill="none" />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        <Geographies geography={GEO_URL_WORLD}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const id = countryNameToISO[countryName] || geo.properties["ISO_A2"] || geo.id;
              const status = id ? getStatus(id) : 'unvisited';
              const statusClass = status === 'bucketList' ? 'bucket-list' : status;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className={`region-path ${statusClass} outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", filter: "brightness(0.9)" },
                    pressed: { outline: "none" },
                  }}
                  data-tip={countryName}
                  tabIndex={0}
                  role="button"
                  aria-label={`${countryName}, ${status === 'visited' ? 'visited' : status === 'bucketList' ? 'on bucket list' : 'not visited'}`}
                  onClick={() => {
                    if (id && onToggle) {
                      onToggle(id, status);
                    }
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && id && onToggle) {
                      e.preventDefault();
                      onToggle(id, status);
                    }
                  }}
                  onMouseEnter={(e) => tooltip.onMouseEnter(countryName, e)}
                  onMouseLeave={tooltip.onMouseLeave}
                  onMouseMove={tooltip.onMouseMove}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}

function USMap({ selections, onToggle, tooltip }: { selections: UserSelections; onToggle?: (id: string, currentStatus: Status) => void; tooltip: TooltipHandlers }) {
  // Memoize status lookup for O(1) access instead of O(n) per geography
  const statusMap = useMemo(() => {
    const map = new Map<string, Status>();
    const stateSelections = selections.states || [];
    for (const sel of stateSelections) {
      map.set(sel.id, sel.status);
    }
    return map;
  }, [selections.states]);

  const getStatus = useCallback((id: string): Status => {
    return statusMap.get(id) || 'unvisited';
  }, [statusMap]);

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 1000 }}
      className="w-full h-full"
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL_USA}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const fips = geo.id as string;
              const id = fipsToAbbr[fips];
              const name = geo.properties.name;
              const status = id ? getStatus(id) : 'unvisited';
              const statusClass = status === 'bucketList' ? 'bucket-list' : status;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className={`region-path ${statusClass} outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", filter: "brightness(0.9)" },
                    pressed: { outline: "none" },
                  }}
                  data-tip={name}
                  tabIndex={0}
                  role="button"
                  aria-label={`${name}, ${status === 'visited' ? 'visited' : status === 'bucketList' ? 'on bucket list' : 'not visited'}`}
                  onClick={() => {
                    if (id && onToggle) {
                      onToggle(id, status);
                    }
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && id && onToggle) {
                      e.preventDefault();
                      onToggle(id, status);
                    }
                  }}
                  onMouseEnter={(e) => tooltip.onMouseEnter(name, e)}
                  onMouseLeave={tooltip.onMouseLeave}
                  onMouseMove={tooltip.onMouseMove}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}

// US Map with specific markers (Parks, Mountains)
function USMarkerMap({
  category,
  selections,
  onToggle,
  subcategory,
  tooltip
}: {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
  tooltip: TooltipHandlers;
}) {
  // Get markers with Albers USA filtering applied at the data layer
  const markers = getCategoryMarkers(category, selections, subcategory, true);
  const isMountains = category === 'fourteeners';
  const isParks = category === 'nationalParks' || category === 'stateParks';

  // Get the appropriate marker for the category
  const getUSMarkerIcon = (marker: MarkerData) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

    if (isMountains) {
      return <MountainMarker fillColor={fillColor} />;
    }

    if (isParks) {
      return <ParkMarker fillColor={fillColor} />;
    }

    // Default flag marker fallback
    return <FlagMarker fillColor={fillColor} />;
  };

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 1000 }}
      className="w-full h-full"
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL_USA}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="region-path unvisited outline-none focus:outline-none"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {markers.map((marker) => {
          const markerName = getItemName(category, marker.id);
          return (
            <Marker
              key={marker.id}
              coordinates={marker.coordinates}
              onClick={() => {
                if (onToggle) {
                  onToggle(marker.id, marker.status);
                }
              }}
              onMouseEnter={(e) => tooltip.onMouseEnter(markerName, e)}
              onMouseLeave={tooltip.onMouseLeave}
              onMouseMove={tooltip.onMouseMove}
            >
              <g className="cursor-pointer">
                {getUSMarkerIcon(marker)}
              </g>
            </Marker>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
}

// World Map with category-specific markers
function WorldMarkerMap({
  category,
  selections,
  onToggle,
  subcategory,
  tooltip
}: {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
  tooltip: TooltipHandlers;
}) {
  const markers = getCategoryMarkers(category, selections, subcategory);

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

    if (isMarathons) return <SneakerMarker fillColor={fillColor} />;
    if (isMountains) return <MountainMarker fillColor={fillColor} />;
    if (isF1Tracks) return <F1CarMarker fillColor={fillColor} />;
    if (isAirports) return <AirplaneMarker fillColor={fillColor} />;
    if (isMuseums) return <MuseumMarker fillColor={fillColor} />;
    if (isSkiResorts) return <SkiMarker fillColor={fillColor} />;
    if (isThemeParks) return <ThemeParkMarker fillColor={fillColor} />;
    if (isSurfing) return <SurfingMarker fillColor={fillColor} />;
    if (isWeird) return <WeirdMarker fillColor={fillColor} />;
    if (isStadiums) return <SportMarker sport={marker.sport} fillColor={fillColor} />;

    // Default fallback
    return <FlagMarker fillColor={fillColor} />;
  };

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 160, center: [0, 0] }}
      className="w-full h-full"
    >
      <ZoomableGroup>
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} id="sphere-markers" fill="none" />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        <Geographies geography={GEO_URL_WORLD}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="region-path unvisited outline-none focus:outline-none"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {markers.map((marker) => {
          const markerName = getItemName(category, marker.id);
          return (
            <Marker
              key={marker.id}
              coordinates={marker.coordinates}
              onClick={() => {
                if (onToggle) {
                  onToggle(marker.id, marker.status);
                }
              }}
              onMouseEnter={(e) => tooltip.onMouseEnter(markerName, e)}
              onMouseLeave={tooltip.onMouseLeave}
              onMouseMove={tooltip.onMouseMove}
            >
              <g className="cursor-pointer">
                {getMarkerIcon(marker)}
              </g>
            </Marker>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
}

// Check if category uses region coloring (countries/states) vs markers (other categories)
function usesRegionMap(category: Category): boolean {
  return category === 'countries' || category === 'states';
}

// Get the appropriate map component for a category
function getMapComponent(
  category: Category,
  selections: UserSelections,
  onToggle?: (id: string, currentStatus: Status) => void,
  subcategory?: string,
  tooltip?: TooltipHandlers
) {
  const handlers = tooltip || {
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseMove: () => {},
  };

  switch (category) {
    case 'countries':
      return <WorldMap key="world" selections={selections} onToggle={onToggle} tooltip={handlers} />;
    case 'states':
      return <USMap key="us" selections={selections} onToggle={onToggle} tooltip={handlers} />;
    case 'nationalParks':
      return <USMarkerMap key="us-parks" category={category} selections={selections} onToggle={onToggle} tooltip={handlers} />;
    case 'stateParks':
      return <USMarkerMap key="us-state-parks" category={category} selections={selections} onToggle={onToggle} tooltip={handlers} />;
    case 'fourteeners':
      return <USMarkerMap key="us-14ers" category={category} selections={selections} onToggle={onToggle} tooltip={handlers} />;
    default:
      return <WorldMarkerMap key="world-markers" category={category} selections={selections} onToggle={onToggle} subcategory={subcategory} tooltip={handlers} />;
  }
}

export default function MapVisualization({ category, selections, onToggle, subcategory }: MapVisualizationProps) {
  const isRegionMap = usesRegionMap(category);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Memoize individual handlers
  const onMouseEnter = useCallback((content: string, e: React.MouseEvent) => {
    setTooltip({ content, x: e.clientX, y: e.clientY });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  }, []);

  // Memoize the handlers object to prevent unnecessary re-renders of child maps
  const tooltipHandlers: TooltipHandlers = useMemo(() => ({
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  }), [onMouseEnter, onMouseLeave, onMouseMove]);

  return (
    <div className="w-full bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 shadow-inner mb-6 relative">
      <div className="aspect-[4/3] sm:aspect-[16/9] w-full max-h-[500px]">
        {getMapComponent(category, selections, onToggle, subcategory, tooltipHandlers)}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 10,
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 pb-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Bucket List</span>
        </div>
        {isRegionMap && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500"></span>
            <span>Not Visited</span>
          </div>
        )}
      </div>
    </div>
  );
}
