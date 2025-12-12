/**
 * WorldMap Component
 * Interactive world map with country region coloring based on visit status
 * Uses generic RegionMap with world-specific configuration
 */
'use client';

import { memo } from 'react';
import RegionMap from './RegionMap';
import { WORLD_REGION_CONFIG } from './mapConfigs';
import { BaseMapProps } from './types';

const WorldMap = memo(function WorldMap({ selections, onToggle, tooltip }: BaseMapProps) {
  return (
    <RegionMap
      selections={selections}
      onToggle={onToggle}
      tooltip={tooltip}
      geoUrl={WORLD_REGION_CONFIG.geoUrl}
      projection={WORLD_REGION_CONFIG.projection}
      projectionConfig={WORLD_REGION_CONFIG.projectionConfig}
      width={WORLD_REGION_CONFIG.width}
      height={WORLD_REGION_CONFIG.height}
      viewBox={WORLD_REGION_CONFIG.viewBox}
      initialCenter={WORLD_REGION_CONFIG.initialCenter}
      maxZoom={WORLD_REGION_CONFIG.maxZoom}
      showSphere={WORLD_REGION_CONFIG.showSphere}
      showGraticule={WORLD_REGION_CONFIG.showGraticule}
      getId={WORLD_REGION_CONFIG.getId}
      getSelections={WORLD_REGION_CONFIG.getSelections}
    />
  );
});

export default WorldMap;
