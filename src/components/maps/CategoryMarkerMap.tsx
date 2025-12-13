/**
 * CategoryMarkerMap Component
 * Generic map with markers for category-specific locations
 * Follows DRY principle by unifying USMarkerMap and WorldMarkerMap logic
 * Follows ISP by using useCategoryMarkers hook for data fetching
 */
'use client';

import { memo } from 'react';
import { Geographies, Geography } from '@vnedyalk0v/react19-simple-maps';
import { useNameGetter, getMarkerSize, useCategoryMarkers } from '@/lib/hooks/useMapData';
import { renderCategoryMarker } from '@/components/MapMarkers/registry';
import { MarkerMapProps, CategoryMarkerMapConfig } from './types';
import InteractiveMapShell from './InteractiveMapShell';
import MemoizedMarker from './MemoizedMarker';

/**
 * Static background map component - memoized to prevent re-renders on zoom/pan
 * Generic version that accepts geoUrl as prop
 */
const StaticBackground = memo(function StaticBackground({ geoUrl }: { geoUrl: string }) {
  return (
    <Geographies geography={geoUrl}>
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

export interface CategoryMarkerMapProps extends MarkerMapProps {
  config: CategoryMarkerMapConfig;
}

const CategoryMarkerMap = memo(function CategoryMarkerMap({
  category,
  selections,
  onToggle,
  subcategory,
  tooltip,
  items,
  config,
}: CategoryMarkerMapProps) {
  const {
    geoUrl,
    projection,
    projectionConfig,
    width = 800,
    height = 500,
    viewBox,
    initialCenter,
    maxZoom = 8,
    showSphere,
    showGraticule,
    filterAlbersUsa = false,
  } = config;

  // Use extracted hook for data fetching - ISP/SRP
  const markers = useCategoryMarkers(category, selections, filterAlbersUsa, subcategory);

  // Use extracted hook for name lookup - DRY principle
  const getItemName = useNameGetter(items);

  return (
    <InteractiveMapShell
      projection={projection}
      projectionConfig={projectionConfig}
      width={width}
      height={height}
      viewBox={viewBox || `0 0 ${width} ${height}`}
      initialCenter={initialCenter}
      maxZoom={maxZoom}
      showSphere={showSphere}
      showGraticule={showGraticule}
      className="w-full h-full"
    >
      {({ zoom }) => {
        const markerSize = getMarkerSize(zoom);

        return (
          <>
            <StaticBackground geoUrl={geoUrl} />
            {markers.map((marker) => {
              const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

              return (
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
                  {renderCategoryMarker(category, fillColor, markerSize, marker.sport)}
                </MemoizedMarker>
              );
            })}
          </>
        );
      }}
    </InteractiveMapShell>
  );
});

export default CategoryMarkerMap;
