/**
 * WorldMarkerMap Component
 * World map with category-specific markers for global locations
 */
'use client';

import { useCallback, useMemo, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Graticule } from '@vnedyalk0v/react19-simple-maps';
import { GEO_URL_WORLD, getCategoryMarkers, MarkerData } from '@/lib/mapUtils';
import {
  SportMarker,
  SneakerMarker,
  MountainMarker,
  F1CarMarker,
  FlagMarker,
  AirplaneMarker,
  MuseumMarker,
  SkiMarker,
  ThemeParkMarker,
  SurfingMarker,
  WeirdMarker,
  MarkerSize,
} from '@/components/MapMarkers';
import { MarkerMapProps } from './types';
import { useMapZoom } from './useMapZoom';
import ZoomControls from './ZoomControls';
import MemoizedMarker from './MemoizedMarker';

// Type helper for center coordinates (library uses branded types)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CENTER_ORIGIN: any = [0, 0];

/**
 * Static background map component - memoized to prevent re-renders on zoom/pan
 * Includes sphere, graticule, and geography - none of which change during interaction
 */
const StaticWorldBackground = memo(function StaticWorldBackground() {
  return (
    <>
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
    </>
  );
});

const WorldMarkerMap = memo(function WorldMarkerMap({
  category,
  selections,
  onToggle,
  subcategory,
  tooltip,
  items
}: MarkerMapProps) {
  const {
    position,
    handleZoomIn,
    handleZoomOut,
    handleMoveEnd,
    canZoomIn,
    canZoomOut,
  } = useMapZoom({
    maxZoom: 8,
    initialCenter: [0, 0] // Center on equator
  });

  // Determine marker size based on zoom level
  // Less than 2x zoom = small markers to prevent overcrowding
  const markerSize: MarkerSize = position.zoom < 2 ? 'small' : 'default';

  // Memoize markers computation
  const markers = useMemo(
    () => getCategoryMarkers(category, selections, subcategory),
    [category, selections, subcategory]
  );

  // Memoize name lookup map for O(1) access
  const nameMap = useMemo(() => {
    const map = new Map<string, string>();
    if (items) {
      for (const item of items) {
        map.set(item.id, item.name);
      }
    }
    return map;
  }, [items]);

  const getItemName = useCallback((id: string) => nameMap.get(id) || id, [nameMap]);

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
  // Now passes size prop to all markers
  const getMarkerIcon = (marker: MarkerData, size: MarkerSize) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

    if (isMarathons) return <SneakerMarker fillColor={fillColor} size={size} />;
    if (isMountains) return <MountainMarker fillColor={fillColor} size={size} />;
    if (isF1Tracks) return <F1CarMarker fillColor={fillColor} size={size} />;
    if (isAirports) return <AirplaneMarker fillColor={fillColor} size={size} />;
    if (isMuseums) return <MuseumMarker fillColor={fillColor} size={size} />;
    if (isSkiResorts) return <SkiMarker fillColor={fillColor} size={size} />;
    if (isThemeParks) return <ThemeParkMarker fillColor={fillColor} size={size} />;
    if (isSurfing) return <SurfingMarker fillColor={fillColor} size={size} />;
    if (isWeird) return <WeirdMarker fillColor={fillColor} size={size} />;
    if (isStadiums) return <SportMarker sport={marker.sport} fillColor={fillColor} size={size} />;

    // Default fallback
    return <FlagMarker fillColor={fillColor} size={size} />;
  };

  return (
    <div className="relative w-full h-full group">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 160, center: CENTER_ORIGIN }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as any}
          onMoveEnd={handleMoveEnd}
        >
          <StaticWorldBackground />
          {markers.map((marker) => (
          <MemoizedMarker
            key={marker.id}
            id={marker.id}
            coordinates={marker.coordinates}
            status={marker.status}
            name={getItemName(marker.id)}
            size={markerSize}
            onToggle={onToggle}
            onMouseEnter={tooltip.onMouseEnter}
            onMouseLeave={tooltip.onMouseLeave}
            onMouseMove={tooltip.onMouseMove}
          >
            {getMarkerIcon(marker, markerSize)}
          </MemoizedMarker>
        ))}
        </ZoomableGroup>
      </ComposableMap>
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
      />
    </div>
  );
});

export default WorldMarkerMap;
