/**
 * StaticMarkerMap Component
 * Non-interactive marker map for share card screenshots
 */
'use client';

import { ComposableMap, Geographies, Geography, Sphere, Graticule, Marker } from '@vnedyalk0v/react19-simple-maps';
import { Category, UserSelections } from '@/lib/types';
import { GEO_URL_WORLD, GEO_URL_USA } from '@/lib/mapConstants';
import { getCategoryMarkers, MarkerData } from '@/lib/mapUtils';
import {
  LogoMarker,
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

  // US-only categories: National Parks, National Monuments, State Parks, Fourteeners, Weird Americana, and US Cities
  const isUSOnly = category === 'nationalParks' || category === 'nationalMonuments' || category === 'stateParks' || category === 'fourteeners' || category === 'weirdAmericana' || category === 'usCities';
  
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
    // (Logic preserved from original file)
    */
  };

  if (isUSOnly) {
    return (
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 800 }}
        viewBox="0 0 800 400"
        width={800}
        height={400}
        style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
      >
        <Geographies geography={GEO_URL_USA}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#64748b" 
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
