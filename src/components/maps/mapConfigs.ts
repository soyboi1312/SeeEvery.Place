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
// Base Configurations (DRY - shared geography settings)
// =====================

const BASE_US_CONFIG = {
  geoUrl: GEO_URL_USA,
  projection: 'geoAlbersUsa',
  projectionConfig: { scale: 800 },
  viewBox: '0 0 800 400',
  width: 800,
  height: 400,
  initialCenter: [-97, 38] as [number, number],
  maxZoom: 8,
};

const BASE_WORLD_CONFIG = {
  geoUrl: GEO_URL_WORLD,
  projection: 'geoEqualEarth',
  projectionConfig: { scale: 140, center: [0, 0] },
  width: 800,
  height: 400,
  viewBox: '0 0 800 400',
  initialCenter: [0, 0] as [number, number],
  maxZoom: 8,
  showSphere: true,
  showGraticule: true,
};

// =====================
// Region Map Configurations (extends base configs)
// =====================

export const US_REGION_CONFIG: RegionMapConfig = {
  ...BASE_US_CONFIG,
  getId: getUSStateId,
  getSelections: getStateSelections,
};

export const WORLD_REGION_CONFIG: RegionMapConfig = {
  ...BASE_WORLD_CONFIG,
  getId: getCountryId,
  getSelections: getCountrySelections,
};

// =====================
// Category Marker Map Configurations (extends base configs)
// =====================

export const US_MARKER_CONFIG: CategoryMarkerMapConfig = {
  ...BASE_US_CONFIG,
  filterAlbersUsa: true,
};

export const WORLD_MARKER_CONFIG: CategoryMarkerMapConfig = {
  ...BASE_WORLD_CONFIG,
  filterAlbersUsa: false,
};
