/**
 * src/components/MapVisualization.tsx
 */
'use client';

import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Graticule, Marker } from 'react-simple-maps';
import { Category, UserSelections, Status } from '@/lib/types';
import { getSelectionStatus } from '@/lib/storage';
import {
  GEO_URL_WORLD,
  GEO_URL_USA,
  fipsToAbbr,
  countryNameToISO,
  getCategoryMarkers,
  MarkerData,
} from '@/lib/mapUtils';

interface MapVisualizationProps {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
}

function WorldMap({ selections, onToggle }: { selections: UserSelections; onToggle?: (id: string, currentStatus: Status) => void }) {
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
              const status = id ? getSelectionStatus(selections, 'countries', id) : 'unvisited';
              const statusClass = status === 'bucketList' ? 'bucket-list' : status;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className={`region-path ${statusClass} outline-none focus:outline-none`}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", filter: "brightness(0.9)" },
                    pressed: { outline: "none" },
                  }}
                  data-tip={countryName}
                  onClick={() => {
                    if (id && onToggle) {
                      onToggle(id, status);
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}

function USMap({ selections, onToggle }: { selections: UserSelections; onToggle?: (id: string, currentStatus: Status) => void }) {
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
              const status = id ? getSelectionStatus(selections, 'states', id) : 'unvisited';
              const statusClass = status === 'bucketList' ? 'bucket-list' : status;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className={`region-path ${statusClass} outline-none focus:outline-none`}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", filter: "brightness(0.9)" },
                    pressed: { outline: "none" },
                  }}
                  data-tip={name}
                  onClick={() => {
                    if (id && onToggle) {
                      onToggle(id, status);
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}

// US territories that cannot be displayed on the Albers USA projection
const unsupportedUSTerritoriesParks = ['american-samoa', 'virgin-islands'];

// US Map with flag markers (for National Parks) or mountain markers (for 14ers)
function USMarkerMap({
  category,
  selections,
  onToggle,
  subcategory
}: {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
}) {
  // Filter out parks in territories that can't be displayed on Albers USA projection
  const markers = getCategoryMarkers(category, selections, subcategory).filter(
    marker => !unsupportedUSTerritoriesParks.includes(marker.id)
  );
  const isMountains = category === 'fourteeners';

  // Get the appropriate marker for the category
  const getUSMarkerIcon = (marker: MarkerData) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

    if (isMountains) {
      return renderMountainMarker(fillColor);
    }

    // Default flag marker for parks
    return (
      <g transform="translate(-9, -18)">
        {/* Flag pole */}
        <line x1="2" y1="3" x2="2" y2="18" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
        {/* Waving Flag */}
        <path
          d="M2 3C2 3 6 1 10 3C14 5 17 3 17 3V10C17 10 14 12 10 10C6 8 2 10 2 10V3Z"
          fill={fillColor}
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
    );
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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinates={marker.coordinates}
            onClick={() => {
              if (onToggle) {
                onToggle(marker.id, marker.status);
              }
            }}
          >
            <g className="cursor-pointer">
              {getUSMarkerIcon(marker)}
            </g>
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
}

// Sport-specific marker SVG paths for stadiums
function renderSportMarker(sport: string | undefined, fillColor: string) {
  const strokeColor = "#ffffff";
  const strokeWidth = 0.8;

  switch (sport) {
    case "Football":
      // Soccer ball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M8 4L6 6.5L7 9.5H9L10 6.5L8 4Z" fill={strokeColor} />
          <path d="M8 4V2" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M10 6.5L12 5.5" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M9 9.5L11 12" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M7 9.5L5 12" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M6 6.5L4 5.5" stroke={strokeColor} strokeWidth={0.6} />
        </g>
      );
    case "American Football":
      // American football
      return (
        <g transform="translate(-8, -8)">
          <ellipse cx="8" cy="8" rx="7" ry="4" transform="rotate(-45 8 8)" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M8 5v6" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M6 7h4" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M6 9h4" stroke={strokeColor} strokeWidth={0.6} />
        </g>
      );
    case "Baseball":
      // Baseball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M4.5 4C5.5 6 5.5 10 4.5 12" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M11.5 4C10.5 6 10.5 10 11.5 12" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M5 5.5L4 6" stroke={strokeColor} strokeWidth={0.5} />
          <path d="M5 10.5L4 10" stroke={strokeColor} strokeWidth={0.5} />
          <path d="M11 5.5L12 6" stroke={strokeColor} strokeWidth={0.5} />
          <path d="M11 10.5L12 10" stroke={strokeColor} strokeWidth={0.5} />
        </g>
      );
    case "Basketball":
      // Basketball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M2 9C4 8 6 8 8 8s4 0 6 1" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M8 2v12" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M11.5 12C10 10 10 6 11.5 4" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M4.5 12C6 10 6 6 4.5 4" stroke={strokeColor} strokeWidth={0.6} fill="none" />
        </g>
      );
    case "Cricket":
      // Cricket ball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M8 2c2 2 2 10 0 12" stroke={strokeColor} strokeWidth={0.6} strokeDasharray="1.5 1" fill="none" />
          <path d="M8 2c-2 2-2 10 0 12" stroke={strokeColor} strokeWidth={0.6} strokeDasharray="1.5 1" fill="none" />
        </g>
      );
    case "Rugby":
      // Rugby ball
      return (
        <g transform="translate(-8, -8)">
          <ellipse cx="8" cy="8" rx="8" ry="5.5" transform="rotate(-45 8 8)" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M6 10L5 11" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M11 5L10 6" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M5.5 5.5l5 5" stroke={strokeColor} strokeWidth={0.6} />
        </g>
      );
    case "Tennis":
      // Tennis ball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M2 8c0 4 3 7 6 7" stroke={strokeColor} strokeWidth={0.8} fill="none" />
          <path d="M14 8c0-4-3-7-6-7" stroke={strokeColor} strokeWidth={0.8} fill="none" />
        </g>
      );
    case "Motorsport":
      // Checkered flag
      return (
        <g transform="translate(-8, -14)">
          <line x1="2" y1="2" x2="2" y2="14" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="2" y="2" width="10" height="8" fill={fillColor} stroke={strokeColor} strokeWidth={0.6} />
          {/* Checkered pattern */}
          <rect x="2" y="2" width="2.5" height="2" fill="#ffffff" />
          <rect x="7" y="2" width="2.5" height="2" fill="#ffffff" />
          <rect x="4.5" y="4" width="2.5" height="2" fill="#ffffff" />
          <rect x="9.5" y="4" width="2.5" height="2" fill="#ffffff" />
          <rect x="2" y="6" width="2.5" height="2" fill="#ffffff" />
          <rect x="7" y="6" width="2.5" height="2" fill="#ffffff" />
          <rect x="4.5" y="8" width="2.5" height="2" fill="#ffffff" />
          <rect x="9.5" y="8" width="2.5" height="2" fill="#ffffff" />
        </g>
      );
    default:
      // Default flag marker (generic stadium)
      return (
        <g transform="translate(-6, -12)">
          <line x1="1.5" y1="2" x2="1.5" y2="12" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M1.5 2C1.5 2 4.5 0.5 7 2C9.5 3.5 12 2 12 2V7C12 7 9.5 8.5 7 7C4.5 5.5 1.5 7 1.5 7V2Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </g>
      );
  }
}

// Improved sneaker marker for marathons
function renderSneakerMarker(fillColor: string) {
  return (
    <g transform="translate(-12, -12)">
      {/* Running Shoe Body */}
      <path
        d="M3 16l1.5-6 4.5-3.5 5.5 1 4 4v4.5H3z"
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Thick Foam Sole */}
      <path
        d="M2 16h18.5c1.5 0 2.5 1 2 2.5s-2 2.5-3.5 2.5H5c-2 0-3.5-1.5-3-5z"
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Speed Stripes (White details) */}
      <path
        d="M9 16l3-4M12.5 16l3-4M16 16l3-4"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  );
}

// Mountain peak marker with summit flag for mountains/peaks
function renderMountainMarker(fillColor: string) {
  const strokeColor = "#ffffff";
  return (
    <g transform="translate(-12, -20)">
      {/* Mountain shape */}
      <path
        d="M3 20h18L12 5l-9 15z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Snow cap / ridge detail */}
      <path
        d="M7.5 12.5l2.5 2 2-2 2 2 2.5-2"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flag pole */}
      <path
        d="M12 5V1"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Flag */}
      <path
        d="M12 1l5 2-5 2"
        fill={strokeColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

// F1 car marker for Formula 1 race tracks
function renderF1CarMarker(fillColor: string) {
  const strokeColor = "#ffffff";
  return (
    <g transform="translate(-12, -15)">
      {/* Rear wing */}
      <path
        d="M2 8h4v3h-3"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rear wheel */}
      <circle cx="7" cy="15" r="3" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
      {/* Front wheel */}
      <circle cx="17" cy="15" r="3" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
      {/* Body/chassis */}
      <path
        d="M10 15h4"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Cockpit/halo */}
      <path
        d="M7 12c1-2 2-4 5-4h2c2 0 4 2 6 4"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Front wing */}
      <path
        d="M20 15h2v-2h-3"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Air intake */}
      <path
        d="M11 8l2 0"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Side detail */}
      <path
        d="M13 10h2"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  );
}

// World Map with flag markers (for UNESCO, Mountains, Museums, Stadiums)
// Marathons use shoe markers instead of flags
function WorldMarkerMap({
  category,
  selections,
  onToggle,
  subcategory
}: {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
}) {
  const markers = getCategoryMarkers(category, selections, subcategory);
  const isMarathons = category === 'marathons';
  const isMountains = category === 'fiveKPeaks' || category === 'fourteeners';
  const isF1Tracks = category === 'f1Tracks';
  const isStadiums = ['mlbStadiums', 'nflStadiums', 'nbaStadiums', 'nhlStadiums', 'soccerStadiums'].includes(category);

  // Get the appropriate marker icon based on category and sport
  const getMarkerIcon = (marker: MarkerData) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

    if (isMarathons) {
      return renderSneakerMarker(fillColor);
    }

    if (isMountains) {
      return renderMountainMarker(fillColor);
    }

    if (isF1Tracks) {
      return renderF1CarMarker(fillColor);
    }

    if (isStadiums) {
      return renderSportMarker(marker.sport, fillColor);
    }

    // Default flag marker for other categories (UNESCO, Museums)
    return (
      <g transform="translate(-6, -12)">
        <line x1="1.5" y1="2" x2="1.5" y2="12" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M1.5 2C1.5 2 4.5 0.5 7 2C9.5 3.5 12 2 12 2V7C12 7 9.5 8.5 7 7C4.5 5.5 1.5 7 1.5 7V2Z"
          fill={fillColor}
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </g>
    );
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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinates={marker.coordinates}
            onClick={() => {
              if (onToggle) {
                onToggle(marker.id, marker.status);
              }
            }}
          >
            <g className="cursor-pointer">
              {getMarkerIcon(marker)}
            </g>
          </Marker>
        ))}
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
  subcategory?: string
) {
  switch (category) {
    case 'countries':
      return <WorldMap key="world" selections={selections} onToggle={onToggle} />;
    case 'states':
      return <USMap key="us" selections={selections} onToggle={onToggle} />;
    case 'nationalParks':
      return <USMarkerMap key="us-parks" category={category} selections={selections} onToggle={onToggle} />;
    case 'stateParks':
      return <USMarkerMap key="us-state-parks" category={category} selections={selections} onToggle={onToggle} />;
    case 'fourteeners':
      return <USMarkerMap key="us-14ers" category={category} selections={selections} onToggle={onToggle} />;
    default:
      return <WorldMarkerMap key="world-markers" category={category} selections={selections} onToggle={onToggle} subcategory={subcategory} />;
  }
}

export default function MapVisualization({ category, selections, onToggle, subcategory }: MapVisualizationProps) {
  const isRegionMap = usesRegionMap(category);

  return (
    <div className="w-full bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 shadow-inner mb-6">
      <div className="aspect-[4/3] sm:aspect-[16/9] w-full max-h-[500px]">
        {getMapComponent(category, selections, onToggle, subcategory)}
      </div>

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
