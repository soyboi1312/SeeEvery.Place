/**
 * Map Configuration Presets
 * Centralized configuration for US and World map variants
 * Following DRY and OCP principles - extend by adding configs, not modifying components
 */
import { GEO_URL_USA, GEO_URL_WORLD, fipsToAbbr, countryNameToISO } from '@/lib/mapConstants';
import { UserSelections } from '@/lib/types';
import { IdExtractor, SelectionGetter, CategoryMarkerMapConfig, RegionMapConfig } from './types';

// =====================
// ID Extractors (Strategy Pattern)
// =====================

/**
 * Extract state ID from US geography using FIPS code mapping
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUSStateId: IdExtractor = (geo: any): string => {
  const fips = String(geo.id).padStart(2, '0');
  return fipsToAbbr[fips] || '';
};

/**
 * Extract country ID from world geography using ISO code mapping
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCountryId: IdExtractor = (geo: any): string => {
  const countryName = geo.properties.name;
  return countryNameToISO[countryName] || geo.properties["ISO_A2"] || String(geo.id);
};

// =====================
// Selection Getters (Strategy Pattern)
// =====================

export const getStateSelections: SelectionGetter = (selections: UserSelections) => selections.states;
export const getCountrySelections: SelectionGetter = (selections: UserSelections) => selections.countries;

// =====================
// Region Map Configurations
// =====================

export const US_REGION_CONFIG: RegionMapConfig = {
  geoUrl: GEO_URL_USA,
  projection: 'geoAlbersUsa',
  projectionConfig: { scale: 1000 },
  width: 800,
  height: 500,
  viewBox: '0 0 800 500',
  initialCenter: [-97, 38],
  maxZoom: 8,
  getId: getUSStateId,
  getSelections: getStateSelections,
};

export const WORLD_REGION_CONFIG: RegionMapConfig = {
  geoUrl: GEO_URL_WORLD,
  projection: 'geoEqualEarth',
  projectionConfig: { scale: 140, center: [0, 0] },
  width: 800,
  height: 400,
  viewBox: '0 0 800 400',
  initialCenter: [0, 0],
  maxZoom: 8,
  showSphere: true,
  showGraticule: true,
  getId: getCountryId,
  getSelections: getCountrySelections,
};

// =====================
// Category Marker Map Configurations
// =====================

export const US_MARKER_CONFIG: CategoryMarkerMapConfig = {
  geoUrl: GEO_URL_USA,
  projection: 'geoAlbersUsa',
  projectionConfig: { scale: 1000 },
  initialCenter: [-97, 38],
  maxZoom: 8,
  filterAlbersUsa: true,
};

export const WORLD_MARKER_CONFIG: CategoryMarkerMapConfig = {
  geoUrl: GEO_URL_WORLD,
  projection: 'geoEqualEarth',
  projectionConfig: { scale: 140, center: [0, 0] },
  width: 800,
  height: 400,
  viewBox: '0 0 800 400',
  initialCenter: [0, 0],
  maxZoom: 8,
  showSphere: true,
  showGraticule: true,
  filterAlbersUsa: false,
};
