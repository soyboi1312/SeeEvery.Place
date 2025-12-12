/**
 * USMap Component
 * Interactive US map with state region coloring based on visit status
 * Uses generic RegionMap with US-specific configuration
 */
'use client';

import { memo } from 'react';
import RegionMap from './RegionMap';
import { US_REGION_CONFIG } from './mapConfigs';
import { BaseMapProps } from './types';

const USMap = memo(function USMap({ selections, onToggle, tooltip }: BaseMapProps) {
  return (
    <RegionMap
      selections={selections}
      onToggle={onToggle}
      tooltip={tooltip}
      geoUrl={US_REGION_CONFIG.geoUrl}
      projection={US_REGION_CONFIG.projection}
      projectionConfig={US_REGION_CONFIG.projectionConfig}
      width={US_REGION_CONFIG.width}
      height={US_REGION_CONFIG.height}
      viewBox={US_REGION_CONFIG.viewBox}
      initialCenter={US_REGION_CONFIG.initialCenter}
      maxZoom={US_REGION_CONFIG.maxZoom}
      getId={US_REGION_CONFIG.getId}
      getSelections={US_REGION_CONFIG.getSelections}
    />
  );
});

export default USMap;
