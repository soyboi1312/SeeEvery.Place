/**
 * src/components/MapVisualization.tsx
 */
'use client';

import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Graticule, Marker } from 'react-simple-maps';
import { Category, UserSelections, Status } from '@/lib/types';
import { getSelectionStatus } from '@/lib/storage';
import { nationalParks } from '@/data/nationalParks';
import { stateParks } from '@/data/stateParks';
import { unescoSites } from '@/data/unescoSites';
import { get5000mPeaks, getUS14ers } from '@/data/mountains';
import { museums } from '@/data/museums';
import { getMlbStadiums, getNflStadiums, getNbaStadiums, getNhlStadiums, getSoccerStadiums } from '@/data/stadiums';
import { f1Tracks } from '@/data/f1Tracks';
import { marathons } from '@/data/marathons';

interface MapVisualizationProps {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
}

// Map Data URLs - using reliable CDN sources
const GEO_URL_WORLD = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const GEO_URL_USA = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Mapping FIPS codes (from US topojson) to Postal Codes (from your data)
const fipsToAbbr: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT", "10": "DE",
  "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
  "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM",
  "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY"
};

// Comprehensive country name to ISO mapping for world-atlas format
// Maps Natural Earth country names (used in world-atlas topojson) to ISO 2-letter codes
const countryNameToISO: Record<string, string> = {
  // Africa
  "Algeria": "DZ",
  "Angola": "AO",
  "Benin": "BJ",
  "Botswana": "BW",
  "Burkina Faso": "BF",
  "Burundi": "BI",
  "Cabo Verde": "CV",
  "Cape Verde": "CV",
  "Cameroon": "CM",
  "Central African Rep.": "CF",
  "Central African Republic": "CF",
  "Chad": "TD",
  "Comoros": "KM",
  "Congo": "CG",
  "Republic of the Congo": "CG",
  "Republic of Congo": "CG",
  "Dem. Rep. Congo": "CD",
  "Democratic Republic of the Congo": "CD",
  "DR Congo": "CD",
  "Djibouti": "DJ",
  "Egypt": "EG",
  "Eq. Guinea": "GQ",
  "Equatorial Guinea": "GQ",
  "Eritrea": "ER",
  "Eswatini": "SZ",
  "Swaziland": "SZ",
  "Ethiopia": "ET",
  "Gabon": "GA",
  "Gambia": "GM",
  "The Gambia": "GM",
  "Ghana": "GH",
  "Guinea": "GN",
  "Guinea-Bissau": "GW",
  "Ivory Coast": "CI",
  "Côte d'Ivoire": "CI",
  "Kenya": "KE",
  "Lesotho": "LS",
  "Liberia": "LR",
  "Libya": "LY",
  "Madagascar": "MG",
  "Malawi": "MW",
  "Mali": "ML",
  "Mauritania": "MR",
  "Mauritius": "MU",
  "Morocco": "MA",
  "Mozambique": "MZ",
  "Namibia": "NA",
  "Niger": "NE",
  "Nigeria": "NG",
  "Rwanda": "RW",
  "Sao Tome and Principe": "ST",
  "São Tomé and Príncipe": "ST",
  "Senegal": "SN",
  "Seychelles": "SC",
  "Sierra Leone": "SL",
  "Somalia": "SO",
  "Somaliland": "SO",
  "South Africa": "ZA",
  "S. Sudan": "SS",
  "South Sudan": "SS",
  "Sudan": "SD",
  "Tanzania": "TZ",
  "United Republic of Tanzania": "TZ",
  "Togo": "TG",
  "Tunisia": "TN",
  "Uganda": "UG",
  "Zambia": "ZM",
  "Zimbabwe": "ZW",
  "W. Sahara": "EH",
  "Western Sahara": "EH",

  // Asia
  "Afghanistan": "AF",
  "Armenia": "AM",
  "Azerbaijan": "AZ",
  "Bahrain": "BH",
  "Bangladesh": "BD",
  "Bhutan": "BT",
  "Brunei": "BN",
  "Brunei Darussalam": "BN",
  "Cambodia": "KH",
  "China": "CN",
  "Cyprus": "CY",
  "N. Cyprus": "CY",
  "Georgia": "GE",
  "India": "IN",
  "Indonesia": "ID",
  "Iran": "IR",
  "Iraq": "IQ",
  "Israel": "IL",
  "Japan": "JP",
  "Jordan": "JO",
  "Kazakhstan": "KZ",
  "Kuwait": "KW",
  "Kyrgyzstan": "KG",
  "Laos": "LA",
  "Lao PDR": "LA",
  "Lebanon": "LB",
  "Malaysia": "MY",
  "Maldives": "MV",
  "Mongolia": "MN",
  "Myanmar": "MM",
  "Burma": "MM",
  "Nepal": "NP",
  "North Korea": "KP",
  "Dem. Rep. Korea": "KP",
  "Oman": "OM",
  "Pakistan": "PK",
  "Palestine": "PS",
  "Palestinian Territories": "PS",
  "Philippines": "PH",
  "Qatar": "QA",
  "Saudi Arabia": "SA",
  "Singapore": "SG",
  "South Korea": "KR",
  "Korea": "KR",
  "Sri Lanka": "LK",
  "Syria": "SY",
  "Syrian Arab Republic": "SY",
  "Taiwan": "TW",
  "Tajikistan": "TJ",
  "Thailand": "TH",
  "Timor-Leste": "TL",
  "East Timor": "TL",
  "Turkey": "TR",
  "Türkiye": "TR",
  "Turkmenistan": "TM",
  "United Arab Emirates": "AE",
  "Uzbekistan": "UZ",
  "Vietnam": "VN",
  "Viet Nam": "VN",
  "Yemen": "YE",

  // Europe
  "Albania": "AL",
  "Andorra": "AD",
  "Austria": "AT",
  "Belarus": "BY",
  "Belgium": "BE",
  "Bosnia and Herz.": "BA",
  "Bosnia and Herzegovina": "BA",
  "Bulgaria": "BG",
  "Croatia": "HR",
  "Czech Rep.": "CZ",
  "Czech Republic": "CZ",
  "Czechia": "CZ",
  "Denmark": "DK",
  "Estonia": "EE",
  "Finland": "FI",
  "France": "FR",
  "Germany": "DE",
  "Greece": "GR",
  "Hungary": "HU",
  "Iceland": "IS",
  "Ireland": "IE",
  "Italy": "IT",
  "Kosovo": "XK",
  "Latvia": "LV",
  "Liechtenstein": "LI",
  "Lithuania": "LT",
  "Luxembourg": "LU",
  "Malta": "MT",
  "Moldova": "MD",
  "Monaco": "MC",
  "Montenegro": "ME",
  "Netherlands": "NL",
  "North Macedonia": "MK",
  "Macedonia": "MK",
  "Norway": "NO",
  "Poland": "PL",
  "Portugal": "PT",
  "Romania": "RO",
  "Russia": "RU",
  "Russian Federation": "RU",
  "San Marino": "SM",
  "Serbia": "RS",
  "Slovakia": "SK",
  "Slovenia": "SI",
  "Spain": "ES",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Ukraine": "UA",
  "United Kingdom": "GB",
  "Vatican": "VA",
  "Vatican City": "VA",

  // North America
  "Antigua and Barbuda": "AG",
  "Bahamas": "BS",
  "The Bahamas": "BS",
  "Barbados": "BB",
  "Belize": "BZ",
  "Canada": "CA",
  "Costa Rica": "CR",
  "Cuba": "CU",
  "Dominica": "DM",
  "Dominican Rep.": "DO",
  "Dominican Republic": "DO",
  "El Salvador": "SV",
  "Grenada": "GD",
  "Guatemala": "GT",
  "Haiti": "HT",
  "Honduras": "HN",
  "Jamaica": "JM",
  "Mexico": "MX",
  "Nicaragua": "NI",
  "Panama": "PA",
  "Saint Kitts and Nevis": "KN",
  "St. Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "St. Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC",
  "St. Vin. and Gren.": "VC",
  "Trinidad and Tobago": "TT",
  "United States": "US",
  "United States of America": "US",

  // South America
  "Argentina": "AR",
  "Bolivia": "BO",
  "Brazil": "BR",
  "Chile": "CL",
  "Colombia": "CO",
  "Ecuador": "EC",
  "Guyana": "GY",
  "Paraguay": "PY",
  "Peru": "PE",
  "Suriname": "SR",
  "Uruguay": "UY",
  "Venezuela": "VE",
  "Falkland Is.": "FK",
  "Falkland Islands": "FK",
  "Fr. S. Antarctic Lands": "TF",

  // Oceania
  "Australia": "AU",
  "Fiji": "FJ",
  "Kiribati": "KI",
  "Marshall Islands": "MH",
  "Micronesia": "FM",
  "Nauru": "NR",
  "New Zealand": "NZ",
  "Palau": "PW",
  "Papua New Guinea": "PG",
  "Samoa": "WS",
  "Solomon Is.": "SB",
  "Solomon Islands": "SB",
  "Tonga": "TO",
  "Tuvalu": "TV",
  "Vanuatu": "VU",
  "New Caledonia": "NC",

  // Other territories and variations
  "Greenland": "GL",
  "Puerto Rico": "PR",
  "Fr. Polynesia": "PF",
  "French Polynesia": "PF",
};

// Country centroid coordinates [longitude, latitude]
const countryCoordinates: Record<string, [number, number]> = {
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
const stateCoordinates: Record<string, [number, number]> = {
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
const cityCoordinates: Record<string, [number, number]> = {
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
  "Johannesburg": [28.0473, -26.2041], "Mumbai": [72.8777, 19.076],
  "Delhi": [77.1025, 28.7041], "Bangalore": [77.5946, 12.9716],
  "Bangkok": [100.5018, 13.7563], "Seoul": [126.978, 37.5665],
  "Taipei": [121.5654, 25.033], "Mexico City": [-99.1332, 19.4326],
  "São Paulo": [-46.6333, -23.5505], "Rio de Janeiro": [-43.1729, -22.9068],
  "Buenos Aires": [-58.3816, -34.6037], "Lima": [-77.0428, -12.0464],
  "Bogota": [-74.0721, 4.711], "Santiago": [-70.6693, -33.4489],
  "Atlanta": [-84.388, 33.749], "Denver": [-104.9903, 39.7392],
  "Seattle": [-122.3321, 47.6062], "Miami": [-80.1918, 25.7617],
  "Detroit": [-83.0458, 42.3314], "Phoenix": [-112.074, 33.4484],
  "Minneapolis": [-93.265, 44.9778], "Cleveland": [-81.6944, 41.4993],
  "Pittsburgh": [-79.9959, 40.4406], "Cincinnati": [-84.512, 39.1031],
  "St. Louis": [-90.1994, 38.627], "Kansas City": [-94.5786, 39.0997],
  "New Orleans": [-90.0715, 29.9511], "Indianapolis": [-86.1581, 39.7684],
  "Nashville": [-86.7816, 36.1627], "Charlotte": [-80.8431, 35.2271],
  "Baltimore": [-76.6122, 39.2904], "Milwaukee": [-87.9065, 43.0389],
  "San Diego": [-117.1611, 32.7157], "Oakland": [-122.2711, 37.8044],
  "Tampa": [-82.4572, 27.9506], "Orlando": [-81.3792, 28.5383],
  "Manchester": [-2.2426, 53.4808], "Liverpool": [-2.9916, 53.4084],
  "Birmingham": [-1.8904, 52.4862], "Glasgow": [-4.2518, 55.8642],
  "Turin": [7.6869, 45.0703], "Milan": [9.19, 45.4642], "Naples": [14.2681, 40.8518],
  "Seville": [-5.9845, 37.3891], "Valencia": [-0.3763, 39.4699],
  "Lisbon": [-9.1393, 38.7223], "Porto": [-8.611, 41.1579],
  "Athens": [23.7275, 37.9838], "Istanbul": [28.9784, 41.0082],
  "Doha": [51.5310, 25.2854], "Riyadh": [46.6753, 24.7136],
  "Frankfurt": [8.6821, 50.1109], "Zurich": [8.5417, 47.3769],
  "Brussels": [4.3517, 50.8503], "Copenhagen": [12.5683, 55.6761],
  "Stockholm": [18.0686, 59.3293], "Oslo": [10.7522, 59.9139],
  "Helsinki": [24.9384, 60.1699], "Warsaw": [21.0122, 52.2297],
  "Prague": [14.4378, 50.0755], "Budapest": [19.0402, 47.4979],
  "Dublin": [-6.2603, 53.3498], "Auckland": [174.7633, -36.8485],
  "Kuala Lumpur": [101.6869, 3.139], "Jakarta": [106.8456, -6.2088],
  "Manila": [120.9842, 14.5995], "Ho Chi Minh City": [106.6297, 10.8231],
  "Hanoi": [105.8342, 21.0278], "Colombo": [79.8612, 6.9271],
  "Kathmandu": [85.324, 27.7172], "Dhaka": [90.4125, 23.8103],
  "Karachi": [67.0011, 24.8607], "Lahore": [74.3587, 31.5204],
  "Addis Ababa": [38.7578, 9.0227], "Nairobi": [36.8219, -1.2921],
  "Lagos": [3.3792, 6.5244], "Accra": [-0.187, 5.6037],
  "Casablanca": [-7.5898, 33.5731], "Marrakech": [-7.9811, 31.6295],
  "Green Bay": [-88.0199, 44.5192], "Foxborough": [-71.2662, 42.0654],
  "East Rutherford": [-74.0742, 40.8128], "Pasadena": [-118.1445, 34.1478],
  "Glendale": [-112.1859, 33.5387], "Arlington": [-97.1081, 32.7357],
  "Inglewood": [-118.3531, 33.9617], "Santa Clara": [-121.9552, 37.3541],
  "Canton": [-81.3784, 40.7989], "Louisville": [-85.7585, 38.2527],
  "Flushing Meadows": [-73.8458, 40.7498], "Wimbledon": [-0.2135, 51.4340],
  "Roland Garros": [2.2530, 48.8469], "Monte Carlo": [7.4246, 43.7384],
  "Le Mans": [0.2062, 47.9566], "Monza": [9.2891, 45.6156],
  "Spa": [5.9714, 50.4372], "Silverstone": [-1.0169, 52.0786],
  "Monaco": [7.4246, 43.7384], "Indianapolis Motor": [-86.2353, 39.7950],
  "Daytona Beach": [-81.0228, 29.2108], "Las Vegas": [-115.1398, 36.1699],
  "Abu Dhabi Circuit": [54.6031, 24.4672], "Jeddah": [39.1728, 21.4858],
  "Suzuka": [136.5340, 34.8431], "Sepang": [101.7372, 2.7614],
  "Landover": [-76.8645, 38.9076], "Orchard Park": [-78.7870, 42.7738],
  "Paradise": [-115.1785, 36.0611], "Elmont": [-73.7068, 40.7198],
  "Carson": [-118.2606, 33.8303],
  "Kolkata": [88.3639, 22.5726], "Chennai": [80.2707, 13.0827],
  "Ahmedabad": [72.5714, 23.0225], "Mohali": [76.7179, 30.6928],
  "Centurion": [28.1881, -25.8603], "Durban": [31.0218, -29.8587],
  "Port Elizabeth": [25.6022, -33.9608], "Perth": [115.8605, -31.9505],
  "Adelaide": [138.6007, -34.9285], "Brisbane": [153.0251, -27.4698],
  "Bridgetown": [-59.5988, 13.0969], "Kingston": [-76.7936, 17.9714],
  "Lord's": [-0.1729, 51.5294], "The Oval": [-0.1152, 51.4837],
  "Edgbaston": [-1.9026, 52.4559], "Headingley": [-1.5820, 53.8176],
};

// Helper to get country code from country name
function getCountryCode(countryName: string): string {
  const countryMap: Record<string, string> = {
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
  };
  return countryMap[countryName] || "";
}

// Get coordinates for an item based on category
function getItemCoordinates(category: Category, itemId: string): [number, number] | null {
  switch (category) {
    case 'nationalParks': {
      const park = nationalParks.find(p => p.id === itemId);
      if (park?.lat && park?.lng) return [park.lng, park.lat]; // [longitude, latitude]
      return null;
    }
    case 'stateParks': {
      const park = stateParks.find(p => p.id === itemId);
      if (park?.lat && park?.lng) return [park.lng, park.lat];
      return null;
    }
    case 'unesco': {
      const site = unescoSites.find(s => s.id === itemId);
      if (site?.lat && site?.lng) return [site.lng, site.lat];
      return null;
    }
    case 'fiveKPeaks': {
      const mountain = get5000mPeaks().find(m => m.id === itemId);
      if (mountain?.lat && mountain?.lng) return [mountain.lng, mountain.lat];
      return null;
    }
    case 'fourteeners': {
      const mountain = getUS14ers().find(m => m.id === itemId);
      if (mountain?.lat && mountain?.lng) return [mountain.lng, mountain.lat];
      return null;
    }
    case 'museums': {
      const museum = museums.find(m => m.id === itemId);
      if (museum?.lat && museum?.lng) return [museum.lng, museum.lat];
      return null;
    }
    case 'mlbStadiums': {
      const stadium = getMlbStadiums().find(s => s.id === itemId);
      if (stadium?.lat && stadium?.lng) return [stadium.lng, stadium.lat];
      return null;
    }
    case 'nflStadiums': {
      const stadium = getNflStadiums().find(s => s.id === itemId);
      if (stadium?.lat && stadium?.lng) return [stadium.lng, stadium.lat];
      return null;
    }
    case 'nbaStadiums': {
      const stadium = getNbaStadiums().find(s => s.id === itemId);
      if (stadium?.lat && stadium?.lng) return [stadium.lng, stadium.lat];
      return null;
    }
    case 'nhlStadiums': {
      const stadium = getNhlStadiums().find(s => s.id === itemId);
      if (stadium?.lat && stadium?.lng) return [stadium.lng, stadium.lat];
      return null;
    }
    case 'soccerStadiums': {
      const stadium = getSoccerStadiums().find(s => s.id === itemId);
      if (stadium?.lat && stadium?.lng) return [stadium.lng, stadium.lat];
      return null;
    }
    case 'f1Tracks': {
      const track = f1Tracks.find(t => t.id === itemId);
      if (track?.lat && track?.lng) return [track.lng, track.lat];
      return null;
    }
    case 'marathons': {
      const marathon = marathons.find(m => m.id === itemId);
      if (marathon?.lat && marathon?.lng) return [marathon.lng, marathon.lat];
      return null;
    }
    default:
      return null;
  }
}

// Marker type with optional sport field for stadiums and parkType for parks
interface MarkerData {
  coordinates: [number, number];
  status: Status;
  id: string;
  sport?: string;
  parkType?: string;
}

// Get markers for a category
function getCategoryMarkers(
  category: Category,
  selections: UserSelections,
  subcategory?: string
): MarkerData[] {
  const markers: MarkerData[] = [];
  for (const selection of selections[category]) {
    const coords = getItemCoordinates(category, selection.id);
    if (coords) {
      const marker: MarkerData = { coordinates: coords, status: selection.status, id: selection.id };
      // Add sport data for stadium categories
      if (category === 'mlbStadiums') {
        marker.sport = 'Baseball';
      } else if (category === 'nflStadiums') {
        marker.sport = 'American Football';
      } else if (category === 'nbaStadiums') {
        marker.sport = 'Basketball';
      } else if (category === 'nhlStadiums') {
        marker.sport = 'Hockey';
      } else if (category === 'soccerStadiums') {
        const stadium = getSoccerStadiums().find(s => s.id === selection.id);
        marker.sport = stadium?.sport || 'Football';
      }
      // Add park type for national parks
      if (category === 'nationalParks') {
        const park = nationalParks.find(p => p.id === selection.id);
        if (park) {
          marker.parkType = park.type;
          // Filter by subcategory if specified
          if (subcategory && subcategory !== 'All' && park.type !== subcategory) {
            continue;
          }
        }
      }
      markers.push(marker);
    }
  }
  return markers;
}

function WorldMap({ selections, onToggle }: { selections: UserSelections; onToggle?: (id: string, currentStatus: Status) => void }) {
  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 160, center: [0, 0] }}
      className="w-full h-full"
    >
      <ZoomableGroup>
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} id="sphere" fill="none" />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        <Geographies geography={GEO_URL_WORLD}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const id = countryNameToISO[countryName] || geo.properties["ISO_A2"] || geo.id;
              const status = id ? getSelectionStatus(selections, 'countries', id) : 'unvisited';
              const statusClass = status === 'bucketList' ? 'bucket-list' : status;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className={`region-path ${statusClass} outline-none focus:outline-none`}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", filter: "brightness(0.9)" },
                    pressed: { outline: "none" },
                  }}
                  data-tip={countryName}
                  onClick={() => {
                    if (id && onToggle) {
                      onToggle(id, status);
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}

function USMap({ selections, onToggle }: { selections: UserSelections; onToggle?: (id: string, currentStatus: Status) => void }) {
  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 1000 }}
      className="w-full h-full"
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL_USA}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const fips = geo.id as string;
              const id = fipsToAbbr[fips];
              const name = geo.properties.name;
              const status = id ? getSelectionStatus(selections, 'states', id) : 'unvisited';
              const statusClass = status === 'bucketList' ? 'bucket-list' : status;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className={`region-path ${statusClass} outline-none focus:outline-none`}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", filter: "brightness(0.9)" },
                    pressed: { outline: "none" },
                  }}
                  data-tip={name}
                  onClick={() => {
                    if (id && onToggle) {
                      onToggle(id, status);
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}

// US territories that cannot be displayed on the Albers USA projection
const unsupportedUSTerritoriesParks = ['american-samoa', 'virgin-islands'];

// US Map with flag markers (for National Parks) or mountain markers (for 14ers)
function USMarkerMap({
  category,
  selections,
  onToggle,
  subcategory
}: {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
}) {
  // Filter out parks in territories that can't be displayed on Albers USA projection
  const markers = getCategoryMarkers(category, selections, subcategory).filter(
    marker => !unsupportedUSTerritoriesParks.includes(marker.id)
  );
  const isMountains = category === 'fourteeners';

  // Get the appropriate marker for the category
  const getUSMarkerIcon = (marker: MarkerData) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

    if (isMountains) {
      return renderMountainMarker(fillColor);
    }

    // Default flag marker for parks
    return (
      <g transform="translate(-9, -18)">
        {/* Flag pole */}
        <line x1="2" y1="3" x2="2" y2="18" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
        {/* Waving Flag */}
        <path
          d="M2 3C2 3 6 1 10 3C14 5 17 3 17 3V10C17 10 14 12 10 10C6 8 2 10 2 10V3Z"
          fill={fillColor}
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
    );
  };

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 1000 }}
      className="w-full h-full"
    >
      <ZoomableGroup>
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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinates={marker.coordinates}
            onClick={() => {
              if (onToggle) {
                onToggle(marker.id, marker.status);
              }
            }}
          >
            <g className="cursor-pointer">
              {getUSMarkerIcon(marker)}
            </g>
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
}

// Sport-specific marker SVG paths for stadiums
function renderSportMarker(sport: string | undefined, fillColor: string) {
  const strokeColor = "#ffffff";
  const strokeWidth = 0.8;

  switch (sport) {
    case "Football":
      // Soccer ball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M8 4L6 6.5L7 9.5H9L10 6.5L8 4Z" fill={strokeColor} />
          <path d="M8 4V2" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M10 6.5L12 5.5" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M9 9.5L11 12" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M7 9.5L5 12" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M6 6.5L4 5.5" stroke={strokeColor} strokeWidth={0.6} />
        </g>
      );
    case "American Football":
      // American football
      return (
        <g transform="translate(-8, -8)">
          <ellipse cx="8" cy="8" rx="7" ry="4" transform="rotate(-45 8 8)" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M8 5v6" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M6 7h4" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M6 9h4" stroke={strokeColor} strokeWidth={0.6} />
        </g>
      );
    case "Baseball":
      // Baseball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M4.5 4C5.5 6 5.5 10 4.5 12" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M11.5 4C10.5 6 10.5 10 11.5 12" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M5 5.5L4 6" stroke={strokeColor} strokeWidth={0.5} />
          <path d="M5 10.5L4 10" stroke={strokeColor} strokeWidth={0.5} />
          <path d="M11 5.5L12 6" stroke={strokeColor} strokeWidth={0.5} />
          <path d="M11 10.5L12 10" stroke={strokeColor} strokeWidth={0.5} />
        </g>
      );
    case "Basketball":
      // Basketball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M2 9C4 8 6 8 8 8s4 0 6 1" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M8 2v12" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M11.5 12C10 10 10 6 11.5 4" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M4.5 12C6 10 6 6 4.5 4" stroke={strokeColor} strokeWidth={0.6} fill="none" />
        </g>
      );
    case "Cricket":
      // Cricket ball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M8 2c2 2 2 10 0 12" stroke={strokeColor} strokeWidth={0.6} strokeDasharray="1.5 1" fill="none" />
          <path d="M8 2c-2 2-2 10 0 12" stroke={strokeColor} strokeWidth={0.6} strokeDasharray="1.5 1" fill="none" />
        </g>
      );
    case "Rugby":
      // Rugby ball
      return (
        <g transform="translate(-8, -8)">
          <ellipse cx="8" cy="8" rx="8" ry="5.5" transform="rotate(-45 8 8)" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M6 10L5 11" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M11 5L10 6" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M5.5 5.5l5 5" stroke={strokeColor} strokeWidth={0.6} />
        </g>
      );
    case "Tennis":
      // Tennis ball
      return (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M2 8c0 4 3 7 6 7" stroke={strokeColor} strokeWidth={0.8} fill="none" />
          <path d="M14 8c0-4-3-7-6-7" stroke={strokeColor} strokeWidth={0.8} fill="none" />
        </g>
      );
    case "Motorsport":
      // Checkered flag
      return (
        <g transform="translate(-8, -14)">
          <line x1="2" y1="2" x2="2" y2="14" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="2" y="2" width="10" height="8" fill={fillColor} stroke={strokeColor} strokeWidth={0.6} />
          {/* Checkered pattern */}
          <rect x="2" y="2" width="2.5" height="2" fill="#ffffff" />
          <rect x="7" y="2" width="2.5" height="2" fill="#ffffff" />
          <rect x="4.5" y="4" width="2.5" height="2" fill="#ffffff" />
          <rect x="9.5" y="4" width="2.5" height="2" fill="#ffffff" />
          <rect x="2" y="6" width="2.5" height="2" fill="#ffffff" />
          <rect x="7" y="6" width="2.5" height="2" fill="#ffffff" />
          <rect x="4.5" y="8" width="2.5" height="2" fill="#ffffff" />
          <rect x="9.5" y="8" width="2.5" height="2" fill="#ffffff" />
        </g>
      );
    default:
      // Default flag marker (generic stadium)
      return (
        <g transform="translate(-6, -12)">
          <line x1="1.5" y1="2" x2="1.5" y2="12" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M1.5 2C1.5 2 4.5 0.5 7 2C9.5 3.5 12 2 12 2V7C12 7 9.5 8.5 7 7C4.5 5.5 1.5 7 1.5 7V2Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </g>
      );
  }
}

// Improved sneaker marker for marathons
function renderSneakerMarker(fillColor: string) {
  return (
    <g transform="translate(-12, -12)">
      {/* Running Shoe Body */}
      <path
        d="M3 16l1.5-6 4.5-3.5 5.5 1 4 4v4.5H3z"
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Thick Foam Sole */}
      <path
        d="M2 16h18.5c1.5 0 2.5 1 2 2.5s-2 2.5-3.5 2.5H5c-2 0-3.5-1.5-3-5z"
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Speed Stripes (White details) */}
      <path
        d="M9 16l3-4M12.5 16l3-4M16 16l3-4"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  );
}

// Mountain peak marker with summit flag for mountains/peaks
function renderMountainMarker(fillColor: string) {
  const strokeColor = "#ffffff";
  return (
    <g transform="translate(-12, -20)">
      {/* Mountain shape */}
      <path
        d="M3 20h18L12 5l-9 15z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Snow cap / ridge detail */}
      <path
        d="M7.5 12.5l2.5 2 2-2 2 2 2.5-2"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flag pole */}
      <path
        d="M12 5V1"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Flag */}
      <path
        d="M12 1l5 2-5 2"
        fill={strokeColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

// F1 car marker for Formula 1 race tracks
function renderF1CarMarker(fillColor: string) {
  const strokeColor = "#ffffff";
  return (
    <g transform="translate(-12, -12)">
      {/* Rear wing */}
      <path
        d="M2 10h2v4H2z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rear wheel */}
      <circle cx="7" cy="12" r="3" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
      {/* Front wheel */}
      <circle cx="17" cy="12" r="3" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
      {/* Body/chassis */}
      <path
        d="M7 12h10"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Cockpit/halo */}
      <path
        d="M8 12c0-3 1.5-5 4-5s4 2 4 5"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Front wing */}
      <path
        d="M20 12h2v1h-2z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Air intake */}
      <path
        d="M10.5 9h3"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  );
}

// World Map with flag markers (for UNESCO, Mountains, Museums, Stadiums)
// Marathons use shoe markers instead of flags
function WorldMarkerMap({
  category,
  selections,
  onToggle,
  subcategory
}: {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
}) {
  const markers = getCategoryMarkers(category, selections, subcategory);
  const isMarathons = category === 'marathons';
  const isMountains = category === 'fiveKPeaks' || category === 'fourteeners';
  const isF1Tracks = category === 'f1Tracks';
  const isStadiums = category === 'mlbStadiums' || category === 'nflStadiums' || category === 'nbaStadiums' || category === 'nhlStadiums' || category === 'soccerStadiums';

  // Get the appropriate marker icon based on category and sport
  const getMarkerIcon = (marker: MarkerData) => {
    const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

    if (isMarathons) {
      return renderSneakerMarker(fillColor);
    }

    if (isMountains) {
      return renderMountainMarker(fillColor);
    }

    if (isF1Tracks) {
      return renderF1CarMarker(fillColor);
    }

    if (isStadiums) {
      return renderSportMarker(marker.sport, fillColor);
    }

    // Default flag marker for other categories (UNESCO, Museums)
    return (
      <g transform="translate(-6, -12)">
        <line x1="1.5" y1="2" x2="1.5" y2="12" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M1.5 2C1.5 2 4.5 0.5 7 2C9.5 3.5 12 2 12 2V7C12 7 9.5 8.5 7 7C4.5 5.5 1.5 7 1.5 7V2Z"
          fill={fillColor}
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </g>
    );
  };

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 160, center: [0, 0] }}
      className="w-full h-full"
    >
      <ZoomableGroup>
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} id="sphere-markers" fill="none" />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        <Geographies geography={GEO_URL_WORLD}>
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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinates={marker.coordinates}
            onClick={() => {
              if (onToggle) {
                onToggle(marker.id, marker.status);
              }
            }}
          >
            <g className="cursor-pointer">
              {getMarkerIcon(marker)}
            </g>
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
}

// Check if category uses region coloring (countries/states) vs markers (other categories)
function usesRegionMap(category: Category): boolean {
  return category === 'countries' || category === 'states';
}

// Get the appropriate map component for a category
function getMapComponent(
  category: Category,
  selections: UserSelections,
  onToggle?: (id: string, currentStatus: Status) => void,
  subcategory?: string
) {
  switch (category) {
    case 'countries':
      return <WorldMap key="world" selections={selections} onToggle={onToggle} />;
    case 'states':
      return <USMap key="us" selections={selections} onToggle={onToggle} />;
    case 'nationalParks':
      return <USMarkerMap key="us-parks" category={category} selections={selections} onToggle={onToggle} />;
    case 'stateParks':
      return <USMarkerMap key="us-state-parks" category={category} selections={selections} onToggle={onToggle} />;
    case 'fourteeners':
      return <USMarkerMap key="us-14ers" category={category} selections={selections} onToggle={onToggle} />;
    default:
      return <WorldMarkerMap key="world-markers" category={category} selections={selections} onToggle={onToggle} subcategory={subcategory} />;
  }
}

export default function MapVisualization({ category, selections, onToggle, subcategory }: MapVisualizationProps) {
  const isRegionMap = usesRegionMap(category);

  return (
    <div className="w-full bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 shadow-inner mb-6">
      <div className="aspect-[16/9] w-full max-h-[500px]">
        {getMapComponent(category, selections, onToggle, subcategory)}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 pb-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Bucket List</span>
        </div>
        {isRegionMap && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500"></span>
            <span>Not Visited</span>
          </div>
        )}
      </div>
    </div>
  );
}
