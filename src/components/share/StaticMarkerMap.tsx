/**
 * StaticMarkerMap Component
 * Non-interactive marker map for share card screenshots
 */
'use client';

import { ComposableMap, Geographies, Geography, Sphere, Graticule, Marker } from '@vnedyalk0v/react19-simple-maps';
import { Category, UserSelections } from '@/lib/types';
import { GEO_URL_WORLD, GEO_URL_USA, getCategoryMarkers, MarkerData } from '@/lib/mapUtils';
import {
  LogoMarker, // New import
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
  MarkerSize,
} from '@/components/MapMarkers';

// Type helper for center coordinates (library uses branded types)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CENTER_ORIGIN: any = [0, 0]; // Centered on equator for balanced globe view

// US territories that cannot be displayed on the Albers USA projection
const unsupportedUSTerritoriesParks = ['american-samoa', 'virgin-islands'];

interface StaticMarkerMapProps {
  category: Category;
  selections: UserSelections;
  subcategory?: string;
  iconSize?: MarkerSize;
}

export default function StaticMarkerMap({
  category,
  selections,
  subcategory,
  iconSize = 'small'
}: StaticMarkerMapProps) {
  const allMarkers = getCategoryMarkers(category, selections, subcategory);

  // US-only categories: National Parks, National Monuments, State Parks, Fourteeners, and Weird Americana
  const isUSOnly = category === 'nationalParks' || category === 'nationalMonuments' || category === 'stateParks' || category === 'fourteeners' || category === 'weirdAmericana';
  const markers = isUSOnly
    ? allMarkers.filter(marker => !unsupportedUSTerritoriesParks.includes(marker.id))
    : allMarkers;

  // Get Marker Icon
  // NOTE: Currently set to always use LogoMarker.
  // Uncomment the logic below to restore category-specific icons (Premium feature).
  const getMarkerIcon = (marker: MarkerData) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';
    return <LogoMarker fillColor={fillColor} size={iconSize} />;

    /* // --- Premium / Custom Marker Logic (Preserved) ---
    
    // US Map Logic
    if (isUSOnly) {
      if (category === 'fourteeners') {
        return <MountainMarker fillColor={fillColor} size={iconSize} />;
      }
      if (category === 'nationalParks' || category === 'stateParks') {
        return <ParkMarker fillColor={fillColor} size={iconSize} />;
      }
      if (category === 'weirdAmericana') {
        return <WeirdMarker fillColor={fillColor} size={iconSize} />;
      }
      return <FlagMarker fillColor={fillColor} size={iconSize} />;
    }

    // World Map Logic
    const isMarathons = category === 'marathons';
    const isMountains = category === 'fiveKPeaks';
    const isF1Tracks = category === 'f1Tracks';
    const isAirports = category === 'airports';
    const isMuseums = category === 'museums';
    const isSkiResorts = category === 'skiResorts';
    const isThemeParks = category === 'themeParks';
    const isSurfing = category === 'surfingReserves';
    const isStadiums = ['mlbStadiums', 'nflStadiums', 'nbaStadiums', 'nhlStadiums', 'soccerStadiums'].includes(category);

    if (isMarathons) return <SneakerMarker fillColor={fillColor} size={iconSize} />;
    if (isMountains) return <MountainMarker fillColor={fillColor} size={iconSize} />;
    if (isF1Tracks) return <F1CarMarker fillColor={fillColor} size={iconSize} />;
    if (isAirports) return <AirplaneMarker fillColor={fillColor} size={iconSize} />;
    if (isStadiums) return <SportMarker sport={marker.sport} fillColor={fillColor} size={iconSize} />;
    if (isMuseums) return <MuseumMarker fillColor={fillColor} size={iconSize} />;
    if (isSkiResorts) return <SkiMarker fillColor={fillColor} size={iconSize} />;
    if (isThemeParks) return <ThemeParkMarker fillColor={fillColor} size={iconSize} />;
    if (isSurfing) return <SurfingMarker fillColor={fillColor} size={iconSize} />;

    return <FlagMarker fillColor={fillColor} size={iconSize} />;
    */
  };

  if (isUSOnly) {
    return (
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        viewBox="0 40 800 530"
        width={800}
        height={530}
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Marker key={marker.id} coordinates={marker.coordinates as any}>
            {getMarkerIcon(marker)}
          </Marker>
        ))}
      </ComposableMap>
    );
  }

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 140, center: CENTER_ORIGIN }}
      viewBox="0 0 800 400"
      width={800}
      height={400}
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Marker key={marker.id} coordinates={marker.coordinates as any}>
          {getMarkerIcon(marker)}
        </Marker>
      ))}
    </ComposableMap>
  );
}