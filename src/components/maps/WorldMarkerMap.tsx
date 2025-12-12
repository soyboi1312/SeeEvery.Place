/**
 * WorldMarkerMap Component
 * World map with category-specific markers for global locations
 * Uses generic CategoryMarkerMap with world-specific configuration
 */
'use client';

import { memo } from 'react';
import CategoryMarkerMap from './CategoryMarkerMap';
import { WORLD_MARKER_CONFIG } from './mapConfigs';
import { MarkerMapProps } from './types';

const WorldMarkerMap = memo(function WorldMarkerMap(props: MarkerMapProps) {
  return <CategoryMarkerMap {...props} config={WORLD_MARKER_CONFIG} />;
});

export default WorldMarkerMap;
