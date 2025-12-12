/**
 * USMarkerMap Component
 * US map with markers for parks, mountains, and other US-specific locations
 * Uses generic CategoryMarkerMap with US-specific configuration
 */
'use client';

import { memo } from 'react';
import CategoryMarkerMap from './CategoryMarkerMap';
import { US_MARKER_CONFIG } from './mapConfigs';
import { MarkerMapProps } from './types';

const USMarkerMap = memo(function USMarkerMap(props: MarkerMapProps) {
  return <CategoryMarkerMap {...props} config={US_MARKER_CONFIG} />;
});

export default USMarkerMap;
