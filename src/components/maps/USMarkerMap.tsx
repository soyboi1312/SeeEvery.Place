/**
 * USMarkerMap Component
 * US map with markers for parks, mountains, and other US-specific locations
 */
'use client';

import { memo, useState, useEffect } from 'react';
import { Geographies, Geography } from '@vnedyalk0v/react19-simple-maps';
import { GEO_URL_USA } from '@/lib/mapConstants';
import { MarkerData, getMarkersFromData } from '@/lib/markerUtils';
import { loadCategoryData } from '@/lib/categoryUtils';
import { useNameGetter, getMarkerSize } from '@/lib/hooks/useMapData';
import { renderCategoryMarker } from '@/components/MapMarkers/registry';
import { MarkerMapProps } from './types';
import InteractiveMapShell from './InteractiveMapShell';
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
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // Use extracted hook for name lookup - DRY principle
  const getItemName = useNameGetter(items);

  // Asynchronously load data and generate markers
  useEffect(() => {
    let isMounted = true;

    const loadMarkers = async () => {
      // Re-use the existing async data loader (code-split)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await loadCategoryData(category) as any[];

      if (isMounted) {
        const generatedMarkers = getMarkersFromData(
          category,
          data,
          selections,
          true, // filterAlbersUsa
          subcategory
        );
        setMarkers(generatedMarkers);
      }
    };

    loadMarkers();

    return () => { isMounted = false; };
  }, [category, selections, subcategory]);

  return (
    <InteractiveMapShell
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 1000 }}
      initialCenter={[-97, 38]}
      maxZoom={8}
      className="w-full h-full"
    >
      {({ zoom }) => {
        const markerSize = getMarkerSize(zoom);

        return (
          <>
            <StaticUSBackground />
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

export default USMarkerMap;
