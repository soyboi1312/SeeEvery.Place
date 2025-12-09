/**
 * USMarkerMap Component
 * US map with markers for parks, mountains, and other US-specific locations
 */
'use client';

import { useCallback, useMemo, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from '@vnedyalk0v/react19-simple-maps';
import { GEO_URL_USA, getCategoryMarkers, MarkerData } from '@/lib/mapUtils';
import {
  MountainMarker,
  FlagMarker,
  ParkMarker,
  WeirdMarker,
  MarkerSize,
} from '@/components/MapMarkers';
import { MarkerMapProps } from './types';
import { useMapZoom } from './useMapZoom';
import ZoomControls from './ZoomControls';
import MemoizedMarker from './MemoizedMarker';

/**
 * Static background map component - memoized to prevent re-renders on zoom/pan
 * The geography doesn't change, only the markers and viewport do
 */
const StaticUSBackground = memo(function StaticUSBackground() {
  return (
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
  );
});

const USMarkerMap = memo(function USMarkerMap({
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
    initialCenter: [-97, 38] // Center on the US
  });

  // Determine marker size based on zoom level
  // Less than 2x zoom = small markers to prevent overcrowding
  const markerSize: MarkerSize = position.zoom < 2 ? 'small' : 'default';

  // Memoize markers computation
  const markers = useMemo(
    () => getCategoryMarkers(category, selections, subcategory, true),
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

  const isMountains = category === 'fourteeners';
  const isParks = category === 'nationalParks' || category === 'stateParks';
  const isWeird = category === 'weirdAmericana';

  // Get the appropriate marker for the category
  // Now accepts size prop to pass through to the underlying LogoMarker
  const getUSMarkerIcon = (marker: MarkerData, size: MarkerSize) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

    if (isMountains) {
      return <MountainMarker fillColor={fillColor} size={size} />;
    }

    if (isParks) {
      return <ParkMarker fillColor={fillColor} size={size} />;
    }

    if (isWeird) {
      return <WeirdMarker fillColor={fillColor} size={size} />;
    }

    // Default flag marker fallback
    return <FlagMarker fillColor={fillColor} size={size} />;
  };

  return (
    <div className="relative w-full h-full group">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Library uses branded Longitude/Latitude types
          center={position.coordinates as any}
          onMoveEnd={handleMoveEnd}
        >
          <StaticUSBackground />
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
              {getUSMarkerIcon(marker, markerSize)}
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

export default USMarkerMap;
