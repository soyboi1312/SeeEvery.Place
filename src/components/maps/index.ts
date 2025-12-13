/**
 * Map components barrel export
 */
// Marker map components
export { default as USMarkerMap } from './USMarkerMap';
export { default as WorldMarkerMap } from './WorldMarkerMap';

// Generic map components (DRY - use with configs from mapConfigs)
export { default as RegionMap } from './RegionMap';
export { default as CategoryMarkerMap } from './CategoryMarkerMap';

// Map configurations
export * from './mapConfigs';

// Shared components and hooks
export { default as ZoomControls } from './ZoomControls';
export { default as InteractiveMapShell } from './InteractiveMapShell';
export { useMapZoom } from './useMapZoom';
export type { MapPosition } from './useMapZoom';
export type { ZoomState } from './InteractiveMapShell';
export * from './types';
