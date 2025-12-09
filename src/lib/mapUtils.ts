/**
 * Shared map utilities, coordinate data, and helper functions
 * Used by MapVisualization.tsx and ShareCard.tsx
 */

import { Category, UserSelections, Status } from '@/lib/types';
import { nationalParks, NationalPark } from '@/data/nationalParks';
import { nationalMonuments, NationalMonument } from '@/data/nationalMonuments';
import { stateParks, StatePark } from '@/data/stateParks';
import { get5000mPeaks, getUS14ers, Mountain } from '@/data/mountains';
import { museums, Museum } from '@/data/museums';
import { getMlbStadiums, getNflStadiums, getNbaStadiums, getNhlStadiums, getSoccerStadiums, Stadium } from '@/data/stadiums';
import { f1Tracks, F1Track } from '@/data/f1Tracks';
import { marathons, Marathon } from '@/data/marathons';
import { airports, Airport } from '@/data/airports';
import { skiResorts, SkiResort } from '@/data/skiResorts';
import { themeParks, ThemePark } from '@/data/themeParks';
import { surfingReserves, SurfingReserve } from '@/data/surfingReserves';
import { weirdAmericana, WeirdAmericana } from '@/data/weirdAmericana';
import { usTerritories, USTerritory } from '@/data/usTerritories';
import { usCities, USCity } from '@/data/usCities';
import { worldCities, WorldCity } from '@/data/worldCities';

// =====================
// O(1) Lookup Maps - Created once at module load for fast coordinate lookups
// =====================
type CoordItem = { id: string; lat: number; lng: number; type?: string };

function createLookupMap<T extends CoordItem>(items: T[]): Map<string, T> {
  return new Map(items.map(item => [item.id, item]));
}

// Static data maps (created once)
const nationalParksMap = createLookupMap(nationalParks);
const nationalMonumentsMap = createLookupMap(nationalMonuments);
const stateParksMap = createLookupMap(stateParks);
const museumsMap = createLookupMap(museums);
const f1TracksMap = createLookupMap(f1Tracks);
const marathonsMap = createLookupMap(marathons);
const airportsMap = createLookupMap(airports);
const skiResortsMap = createLookupMap(skiResorts);
const themeParksMap = createLookupMap(themeParks);
const surfingReservesMap = createLookupMap(surfingReserves);
const weirdAmericanaMap = createLookupMap(weirdAmericana);
const usCitiesMap = createLookupMap(usCities);
const worldCitiesMap = createLookupMap(worldCities);

// Territories use 'code' as ID, so we need a custom map
type TerritoryCoordItem = { id: string; lat: number; lng: number; name: string };
const territoriesMap = new Map<string, TerritoryCoordItem>(
  usTerritories.map(t => [t.code, { id: t.code, lat: t.lat, lng: t.lng, name: t.name }])
);

// Lazy-initialized maps for function-generated data
let fiveKPeaksMap: Map<string, Mountain> | null = null;
let fourteenersMap: Map<string, Mountain> | null = null;
let mlbStadiumsMap: Map<string, Stadium> | null = null;
let nflStadiumsMap: Map<string, Stadium> | null = null;
let nbaStadiumsMap: Map<string, Stadium> | null = null;
let nhlStadiumsMap: Map<string, Stadium> | null = null;
let soccerStadiumsMap: Map<string, Stadium> | null = null;

function getFiveKPeaksMap(): Map<string, Mountain> {
  if (!fiveKPeaksMap) fiveKPeaksMap = createLookupMap(get5000mPeaks());
  return fiveKPeaksMap;
}

function getFourteenersMap(): Map<string, Mountain> {
  if (!fourteenersMap) fourteenersMap = createLookupMap(getUS14ers());
  return fourteenersMap;
}

function getMlbStadiumsMap(): Map<string, Stadium> {
  if (!mlbStadiumsMap) mlbStadiumsMap = createLookupMap(getMlbStadiums());
  return mlbStadiumsMap;
}

function getNflStadiumsMap(): Map<string, Stadium> {
  if (!nflStadiumsMap) nflStadiumsMap = createLookupMap(getNflStadiums());
  return nflStadiumsMap;
}

function getNbaStadiumsMap(): Map<string, Stadium> {
  if (!nbaStadiumsMap) nbaStadiumsMap = createLookupMap(getNbaStadiums());
  return nbaStadiumsMap;
}

function getNhlStadiumsMap(): Map<string, Stadium> {
  if (!nhlStadiumsMap) nhlStadiumsMap = createLookupMap(getNhlStadiums());
  return nhlStadiumsMap;
}

function getSoccerStadiumsMap(): Map<string, Stadium> {
  if (!soccerStadiumsMap) soccerStadiumsMap = createLookupMap(getSoccerStadiums());
  return soccerStadiumsMap;
}

// Helper to get the raw lookup map for a category (used internally)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLookupMapForCategory(category: Category): Map<string, any> | null {
  switch (category) {
    case 'nationalParks': return nationalParksMap;
    case 'nationalMonuments': return nationalMonumentsMap;
    case 'stateParks': return stateParksMap;
    case 'fiveKPeaks': return getFiveKPeaksMap();
    case 'fourteeners': return getFourteenersMap();
    case 'museums': return museumsMap;
    case 'mlbStadiums': return getMlbStadiumsMap();
    case 'nflStadiums': return getNflStadiumsMap();
    case 'nbaStadiums': return getNbaStadiumsMap();
    case 'nhlStadiums': return getNhlStadiumsMap();
    case 'soccerStadiums': return getSoccerStadiumsMap();
    case 'f1Tracks': return f1TracksMap;
    case 'marathons': return marathonsMap;
    case 'airports': return airportsMap;
    case 'skiResorts': return skiResortsMap;
    case 'themeParks': return themeParksMap;
    case 'surfingReserves': return surfingReservesMap;
    case 'weirdAmericana': return weirdAmericanaMap;
    case 'territories': return territoriesMap;
    case 'usCities': return usCitiesMap;
    case 'worldCities': return worldCitiesMap;
    default: return null;
  }
}

// Map Data URLs - must be absolute for react-simple-maps URL parsing
export const GEO_URL_WORLD = "https://seeevery.place/geo/countries-110m.json";
export const GEO_URL_USA = "https://seeevery.place/geo/states-10m.json";

// Mapping FIPS codes (from US topojson) to Postal Codes
export const fipsToAbbr: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT", "10": "DE",
  "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
  "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM",
  "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY"
};

// Comprehensive country name to ISO mapping for world-atlas format
export const countryNameToISO: Record<string, string> = {
  // Africa
  "Algeria": "DZ", "Angola": "AO", "Benin": "BJ", "Botswana": "BW", "Burkina Faso": "BF",
  "Burundi": "BI", "Cabo Verde": "CV", "Cape Verde": "CV", "Cameroon": "CM",
  "Central African Rep.": "CF", "Central African Republic": "CF", "Chad": "TD", "Comoros": "KM",
  "Congo": "CG", "Republic of the Congo": "CG", "Republic of Congo": "CG",
  "Dem. Rep. Congo": "CD", "Democratic Republic of the Congo": "CD", "DR Congo": "CD",
  "Djibouti": "DJ", "Egypt": "EG", "Eq. Guinea": "GQ", "Equatorial Guinea": "GQ",
  "Eritrea": "ER", "Eswatini": "SZ", "Swaziland": "SZ", "Ethiopia": "ET", "Gabon": "GA",
  "Gambia": "GM", "The Gambia": "GM", "Ghana": "GH", "Guinea": "GN", "Guinea-Bissau": "GW",
  "Ivory Coast": "CI", "Côte d'Ivoire": "CI", "Kenya": "KE", "Lesotho": "LS", "Liberia": "LR",
  "Libya": "LY", "Madagascar": "MG", "Malawi": "MW", "Mali": "ML", "Mauritania": "MR",
  "Mauritius": "MU", "Morocco": "MA", "Mozambique": "MZ", "Namibia": "NA", "Niger": "NE",
  "Nigeria": "NG", "Rwanda": "RW", "Sao Tome and Principe": "ST", "São Tomé and Príncipe": "ST",
  "Senegal": "SN", "Seychelles": "SC", "Sierra Leone": "SL", "Somalia": "SO", "Somaliland": "SO",
  "South Africa": "ZA", "S. Sudan": "SS", "South Sudan": "SS", "Sudan": "SD",
  "Tanzania": "TZ", "United Republic of Tanzania": "TZ", "Togo": "TG", "Tunisia": "TN",
  "Uganda": "UG", "Zambia": "ZM", "Zimbabwe": "ZW", "W. Sahara": "EH", "Western Sahara": "EH",

  // Asia
  "Afghanistan": "AF", "Armenia": "AM", "Azerbaijan": "AZ", "Bahrain": "BH", "Bangladesh": "BD",
  "Bhutan": "BT", "Brunei": "BN", "Brunei Darussalam": "BN", "Cambodia": "KH", "China": "CN",
  "Cyprus": "CY", "N. Cyprus": "CY", "Georgia": "GE", "India": "IN", "Indonesia": "ID",
  "Iran": "IR", "Iraq": "IQ", "Israel": "IL", "Japan": "JP", "Jordan": "JO", "Kazakhstan": "KZ",
  "Kuwait": "KW", "Kyrgyzstan": "KG", "Laos": "LA", "Lao PDR": "LA", "Lebanon": "LB",
  "Malaysia": "MY", "Maldives": "MV", "Mongolia": "MN", "Myanmar": "MM", "Burma": "MM",
  "Nepal": "NP", "North Korea": "KP", "Dem. Rep. Korea": "KP", "Oman": "OM", "Pakistan": "PK",
  "Palestine": "PS", "Palestinian Territories": "PS", "Philippines": "PH", "Qatar": "QA",
  "Saudi Arabia": "SA", "Singapore": "SG", "South Korea": "KR", "Korea": "KR", "Sri Lanka": "LK",
  "Syria": "SY", "Syrian Arab Republic": "SY", "Taiwan": "TW", "Tajikistan": "TJ",
  "Thailand": "TH", "Timor-Leste": "TL", "East Timor": "TL", "Turkey": "TR", "Türkiye": "TR",
  "Turkmenistan": "TM", "United Arab Emirates": "AE", "Uzbekistan": "UZ", "Vietnam": "VN",
  "Viet Nam": "VN", "Yemen": "YE",

  // Europe
  "Albania": "AL", "Andorra": "AD", "Austria": "AT", "Belarus": "BY", "Belgium": "BE",
  "Bosnia and Herz.": "BA", "Bosnia and Herzegovina": "BA", "Bulgaria": "BG", "Croatia": "HR",
  "Czech Rep.": "CZ", "Czech Republic": "CZ", "Czechia": "CZ", "Denmark": "DK", "Estonia": "EE",
  "Finland": "FI", "France": "FR", "Germany": "DE", "Greece": "GR", "Hungary": "HU",
  "Iceland": "IS", "Ireland": "IE", "Italy": "IT", "Kosovo": "XK", "Latvia": "LV",
  "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU", "Malta": "MT", "Moldova": "MD",
  "Monaco": "MC", "Montenegro": "ME", "Netherlands": "NL", "North Macedonia": "MK",
  "Macedonia": "MK", "Norway": "NO", "Poland": "PL", "Portugal": "PT", "Romania": "RO",
  "Russia": "RU", "Russian Federation": "RU", "San Marino": "SM", "Serbia": "RS",
  "Slovakia": "SK", "Slovenia": "SI", "Spain": "ES", "Sweden": "SE", "Switzerland": "CH",
  "Ukraine": "UA", "United Kingdom": "GB", "Vatican": "VA", "Vatican City": "VA",

  // North America
  "Antigua and Barbuda": "AG", "Bahamas": "BS", "The Bahamas": "BS", "Barbados": "BB",
  "Belize": "BZ", "Canada": "CA", "Costa Rica": "CR", "Cuba": "CU", "Dominica": "DM",
  "Dominican Rep.": "DO", "Dominican Republic": "DO", "El Salvador": "SV", "Grenada": "GD",
  "Guatemala": "GT", "Haiti": "HT", "Honduras": "HN", "Jamaica": "JM", "Mexico": "MX",
  "Nicaragua": "NI", "Panama": "PA", "Saint Kitts and Nevis": "KN", "St. Kitts and Nevis": "KN",
  "Saint Lucia": "LC", "St. Lucia": "LC", "Saint Vincent and the Grenadines": "VC",
  "St. Vin. and Gren.": "VC", "Trinidad and Tobago": "TT", "United States": "US",
  "United States of America": "US",

  // South America
  "Argentina": "AR", "Bolivia": "BO", "Brazil": "BR", "Chile": "CL", "Colombia": "CO",
  "Ecuador": "EC", "Guyana": "GY", "Paraguay": "PY", "Peru": "PE", "Suriname": "SR",
  "Uruguay": "UY", "Venezuela": "VE", "Falkland Is.": "FK", "Falkland Islands": "FK",
  "Fr. S. Antarctic Lands": "TF",

  // Oceania
  "Australia": "AU", "Fiji": "FJ", "Kiribati": "KI", "Marshall Islands": "MH", "Micronesia": "FM",
  "Nauru": "NR", "New Zealand": "NZ", "Palau": "PW", "Papua New Guinea": "PG", "Samoa": "WS",
  "Solomon Is.": "SB", "Solomon Islands": "SB", "Tonga": "TO", "Tuvalu": "TV", "Vanuatu": "VU",
  "New Caledonia": "NC",

  // Other territories
  "Greenland": "GL", "Puerto Rico": "PR", "Fr. Polynesia": "PF", "French Polynesia": "PF",
};

// Country centroid coordinates [longitude, latitude]
export const countryCoordinates: Record<string, [number, number]> = {
  "IN": [78.9629, 20.5937], "CN": [104.1954, 35.8617], "NP": [84.124, 28.3949],
  "PK": [69.3451, 30.3753], "FR": [2.2137, 46.2276], "US": [-95.7129, 37.0902],
  "GB": [-3.436, 55.3781], "DE": [10.4515, 51.1657], "IT": [12.5674, 41.8719],
  "ES": [-3.7492, 40.4637], "NL": [5.2913, 52.1326], "AT": [14.5501, 47.5162],
  "RU": [105.3188, 61.524], "JP": [138.2529, 36.2048], "AU": [133.7751, -25.2744],
  "BR": [-51.9253, -14.235], "AR": [-63.6167, -38.4161], "MX": [-102.5528, 23.6345],
  "CA": [-106.3468, 56.1304], "EG": [30.8025, 26.8206], "ZA": [22.9375, -30.5595],
  "KE": [37.9062, -0.0236], "TZ": [34.8888, -6.369], "MA": [-7.0926, 31.7917],
  "TR": [35.2433, 38.9637], "GR": [21.8243, 39.0742], "AE": [53.8478, 23.4241],
  "TH": [100.9925, 15.87], "VN": [108.2772, 14.0583], "ID": [113.9213, -0.7893],
  "MY": [101.9758, 4.2105], "SG": [103.8198, 1.3521], "PH": [121.774, 12.8797],
  "KR": [127.7669, 35.9078], "PE": [-75.0152, -9.19], "CL": [-71.543, -35.6751],
  "CO": [-74.2973, 4.5709], "EC": [-78.1834, -1.8312], "JO": [36.2384, 30.5852],
  "IL": [34.8516, 31.0461], "QA": [51.1839, 25.3548], "SA": [45.0792, 23.8859],
  "PT": [-8.2245, 39.3999], "BE": [4.4699, 50.5039], "CH": [8.2275, 46.8182],
  "SE": [18.6435, 60.1282], "NO": [8.4689, 60.472], "DK": [9.5018, 56.2639],
  "FI": [25.7482, 61.9241], "PL": [19.1451, 51.9194], "CZ": [15.473, 49.8175],
  "HU": [19.5033, 47.1625], "IE": [-8.2439, 53.4129], "NZ": [174.886, -40.9006],
  "HR": [15.2, 45.1], "VA": [12.4534, 41.9029], "MC": [7.4246, 43.7384],
  "LI": [9.5554, 47.166], "SM": [12.4578, 43.9424], "MT": [14.3754, 35.9375],
  "TN": [9.5375, 33.8869], "LB": [35.8623, 33.8547], "CU": [-77.7812, 21.5218],
  "JM": [-77.2975, 18.1096], "HT": [-72.2852, 18.9712], "DO": [-70.1627, 18.7357],
  "KH": [104.991, 12.5657], "MM": [95.956, 21.9162], "LA": [102.4955, 19.8563],
  "UZ": [64.5853, 41.3775], "KZ": [66.9237, 48.0196], "MN": [103.8467, 46.8625],
  "ET": [40.4897, 9.145], "UG": [32.2903, 1.3733], "RW": [29.8739, -1.9403],
  "SN": [-14.4524, 14.4974], "GH": [-1.0232, 7.9465], "NG": [8.6753, 9.082],
  "BD": [90.3563, 23.685], "LK": [80.7718, 7.8731], "BT": [90.4336, 27.5142],
  "AF": [67.71, 33.9391], "IR": [53.688, 32.4279], "IQ": [43.6793, 33.2232],
};

// US State centroid coordinates [longitude, latitude]
export const stateCoordinates: Record<string, [number, number]> = {
  "AL": [-86.9023, 32.3182], "AK": [-153.4937, 64.2008], "AZ": [-111.0937, 34.0489],
  "AR": [-92.3731, 35.2010], "CA": [-119.4179, 36.7783], "CO": [-105.3111, 39.0598],
  "CT": [-72.7554, 41.6032], "DE": [-75.5277, 38.9108], "FL": [-81.5158, 27.6648],
  "GA": [-82.9001, 32.1656], "HI": [-155.5828, 19.8968], "ID": [-114.7420, 44.0682],
  "IL": [-89.3985, 40.6331], "IN": [-86.1349, 40.2672], "IA": [-93.0977, 41.8780],
  "KS": [-98.4842, 39.0119], "KY": [-84.2700, 37.8393], "LA": [-91.9623, 30.9843],
  "ME": [-69.4455, 45.2538], "MD": [-76.6413, 39.0458], "MA": [-71.3824, 42.4072],
  "MI": [-85.6024, 44.3148], "MN": [-94.6859, 46.7296], "MS": [-89.3985, 32.3547],
  "MO": [-91.8318, 37.9643], "MT": [-110.3626, 46.8797], "NE": [-99.9018, 41.4925],
  "NV": [-116.4194, 38.8026], "NH": [-71.5724, 43.1939], "NJ": [-74.4057, 40.0583],
  "NM": [-105.8701, 34.5199], "NY": [-74.2179, 43.2994], "NC": [-79.0193, 35.7596],
  "ND": [-101.0020, 47.5515], "OH": [-82.9071, 40.4173], "OK": [-97.0929, 35.0078],
  "OR": [-120.5542, 43.8041], "PA": [-77.1945, 41.2033], "RI": [-71.4774, 41.5801],
  "SC": [-81.1637, 33.8361], "SD": [-99.9018, 43.9695], "TN": [-86.5804, 35.5175],
  "TX": [-99.9018, 31.9686], "UT": [-111.0937, 39.3210], "VT": [-72.5778, 44.5588],
  "VA": [-78.6569, 37.4316], "WA": [-120.7401, 47.7511], "WV": [-80.4549, 38.5976],
  "WI": [-89.6165, 43.7844], "WY": [-107.2903, 43.0759], "DC": [-77.0369, 38.9072],
};

// City coordinates for museums, stadiums, airports [longitude, latitude]
export const cityCoordinates: Record<string, [number, number]> = {
  "Paris": [2.3522, 48.8566], "London": [-0.1276, 51.5074], "New York": [-74.006, 40.7128],
  "Los Angeles": [-118.2437, 34.0522], "Chicago": [-87.6298, 41.8781],
  "Washington": [-77.0369, 38.9072], "San Francisco": [-122.4194, 37.7749],
  "Boston": [-71.0589, 42.3601], "Philadelphia": [-75.1652, 39.9526],
  "Houston": [-95.3698, 29.7604], "Dallas": [-96.797, 32.7767],
  "Amsterdam": [4.9041, 52.3676], "Berlin": [13.405, 52.52], "Madrid": [-3.7038, 40.4168],
  "Barcelona": [2.1734, 41.3851], "Rome": [12.4964, 41.9028], "Florence": [11.2558, 43.7696],
  "Vienna": [16.3738, 48.2082], "Moscow": [37.6173, 55.7558],
  "St. Petersburg": [30.3351, 59.9343], "Munich": [11.582, 48.1351],
  "Tokyo": [139.6917, 35.6895], "Osaka": [135.5023, 34.6937], "Beijing": [116.4074, 39.9042],
  "Shanghai": [121.4737, 31.2304], "Hong Kong": [114.1694, 22.3193],
  "Singapore": [103.8198, 1.3521], "Dubai": [55.2708, 25.2048], "Abu Dhabi": [54.3773, 24.4539],
  "Sydney": [151.2093, -33.8688], "Melbourne": [144.9631, -37.8136],
  "Cairo": [31.2357, 30.0444], "Cape Town": [18.4241, -33.9249],
  "Atlanta": [-84.388, 33.749], "Denver": [-104.9903, 39.7392],
  "Seattle": [-122.3321, 47.6062], "Miami": [-80.1918, 25.7617],
  "Detroit": [-83.0458, 42.3314], "Phoenix": [-112.074, 33.4484],
  "Minneapolis": [-93.265, 44.9778], "Cleveland": [-81.6944, 41.4993],
  "Pittsburgh": [-79.9959, 40.4406], "Cincinnati": [-84.512, 39.1031],
  "St. Louis": [-90.1994, 38.627], "Kansas City": [-94.5786, 39.0997],
};

// Marker type with optional sport field for stadiums and parkType for parks
export interface MarkerData {
  coordinates: [number, number];
  status: Status;
  id: string;
  sport?: string;
  parkType?: string;
}

// Stadium category to sport type mapping
export const stadiumCategoryToSport: Record<string, string> = {
  'mlbStadiums': 'Baseball',
  'nflStadiums': 'American Football',
  'nbaStadiums': 'Basketball',
  'nhlStadiums': 'Hockey',
  'soccerStadiums': 'Football',
};

// Country name to ISO code mapping - module-level constant to avoid GC churn
const countryCodeMap: Record<string, string> = {
  "France": "FR", "USA": "US", "United States": "US", "UK": "GB", "United Kingdom": "GB",
  "Germany": "DE", "Italy": "IT", "Spain": "ES", "Netherlands": "NL", "Austria": "AT",
  "Russia": "RU", "Japan": "JP", "Australia": "AU", "Brazil": "BR", "Argentina": "AR",
  "Mexico": "MX", "Canada": "CA", "Egypt": "EG", "South Africa": "ZA", "India": "IN",
  "China": "CN", "Thailand": "TH", "UAE": "AE", "Qatar": "QA", "Saudi Arabia": "SA",
  "Turkey": "TR", "Greece": "GR", "Portugal": "PT", "Belgium": "BE", "Switzerland": "CH",
  "Sweden": "SE", "Norway": "NO", "Denmark": "DK", "Finland": "FI", "Poland": "PL",
  "Czech Republic": "CZ", "Hungary": "HU", "Ireland": "IE", "New Zealand": "NZ",
  "Singapore": "SG", "Malaysia": "MY", "Indonesia": "ID", "South Korea": "KR",
  "Taiwan": "TW", "Colombia": "CO", "Peru": "PE", "Chile": "CL", "Ecuador": "EC",
  "England": "GB", "Scotland": "GB", "Wales": "GB", "Monaco": "MC",
  "Hong Kong": "HK", "Bahrain": "BH", "Azerbaijan": "AZ",
};

// Helper to get country code from country name
export function getCountryCode(countryName: string): string {
  return countryCodeMap[countryName] || "";
}

// Get coordinates for an item based on category - O(1) Map lookups
// Reuses getLookupMapForCategory to avoid duplicating switch statement
export function getItemCoordinates(category: Category, itemId: string): [number, number] | null {
  const lookupMap = getLookupMapForCategory(category);
  const item = lookupMap?.get(itemId);

  if (item?.lat && item?.lng) {
    return [item.lng, item.lat];
  }
  return null;
}

// US territories that cannot be displayed on the Albers USA projection
// These are filtered out at the data layer to avoid hardcoding IDs in the UI
export const UNSUPPORTED_ALBERS_USA_IDS = new Set([
  'american-samoa',
  'virgin-islands',
]);

// Get markers for a category
// Options:
//   - subcategory: filter by subcategory (for national parks)
//   - filterAlbersUsa: filter out markers that can't be displayed on Albers USA projection
export function getCategoryMarkers(
  category: Category,
  selections: UserSelections,
  subcategory?: string,
  filterAlbersUsa = false
): MarkerData[] {
  const markers: MarkerData[] = [];
  const categorySelections = selections[category] || [];

  // Hoist map lookup out of loop - resolve once, use many times
  const lookupMap = getLookupMapForCategory(category);
  if (!lookupMap) return markers;

  // Pre-compute sport type for stadium categories
  const sportType = stadiumCategoryToSport[category];

  for (const selection of categorySelections) {
    // Filter out unsupported Albers USA territories if requested
    if (filterAlbersUsa && UNSUPPORTED_ALBERS_USA_IDS.has(selection.id)) {
      continue;
    }

    // Direct O(1) lookup from the hoisted map
    const item = lookupMap.get(selection.id);
    if (!item?.lat || !item?.lng) continue;

    const marker: MarkerData = {
      coordinates: [item.lng, item.lat],
      status: selection.status,
      id: selection.id,
    };

    // Add sport data for stadium categories
    if (sportType) {
      marker.sport = sportType;
    }

    // Add park type for national parks
    if (category === 'nationalParks' && item.type) {
      marker.parkType = item.type;
      // Filter by subcategory if specified
      if (subcategory && subcategory !== 'All' && item.type !== subcategory) {
        continue;
      }
    }

    markers.push(marker);
  }

  return markers;
}

