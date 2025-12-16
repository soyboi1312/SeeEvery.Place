/**
 * src/lib/mapConstants.ts
 * Lightweight constants and map data URLs.
 * Extracted from mapUtils to prevent eager loading of all data files.
 */

// Map Data URLs - relative paths to static files in public/geo/
// These files are copied from node_modules by scripts/copy-geo-assets.js
export const GEO_URL_WORLD = "/geo/countries-110m.json";
export const GEO_URL_USA = "/geo/states-10m.json";

// US territories that cannot be displayed on the Albers USA projection
export const UNSUPPORTED_ALBERS_USA_IDS = new Set([
  'american-samoa',
  'virgin-islands',
]);

// Stadium category to sport type mapping
export const stadiumCategoryToSport: Record<string, string> = {
  'mlbStadiums': 'Baseball',
  'nflStadiums': 'American Football',
  'nbaStadiums': 'Basketball',
  'nhlStadiums': 'Hockey',
  'soccerStadiums': 'Football',
};

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
  "Ivory Coast": "CI", "Cote d'Ivoire": "CI", "Kenya": "KE", "Lesotho": "LS", "Liberia": "LR",
  "Libya": "LY", "Madagascar": "MG", "Malawi": "MW", "Mali": "ML", "Mauritania": "MR",
  "Mauritius": "MU", "Morocco": "MA", "Mozambique": "MZ", "Namibia": "NA", "Niger": "NE",
  "Nigeria": "NG", "Rwanda": "RW", "Sao Tome and Principe": "ST",
  "Senegal": "SN", "Seychelles": "SC", "Sierra Leone": "SL", "Somalia": "SO", "Somaliland": "SO",
  "South Africa": "ZA", "S. Sudan": "SS", "South Sudan": "SS", "Sudan": "SD",
  "Tanzania": "TZ", "United Republic of Tanzania": "TZ", "Togo": "TG", "Tunisia": "TN",
  "Uganda": "UG", "Zambia": "ZM", "Zimbabwe": "ZW", "W. Sahara": "EH", "Western Sahara": "EH",

  // Asia
  "Afghanistan": "AF", "Armenia": "AM", "Azerbaijan": "AZ", "Bahrain": "BH", "Bangladesh": "BD",
  "Bhutan": "BT", "Brunei": "BN", "Brunei Darussalam": "BN", "Cambodia": "KH", "China": "CN",
  "Cyprus": "CY", "N. Cyprus": "CY", "Georgia": "GE", "India": "IN", "Indonesia": "ID",
  "Iran": "IR", "Iraq": "IQ", "Israel (Occupied Palestine)": "IL", "Japan": "JP", "Jordan": "JO", "Kazakhstan": "KZ",
  "Kuwait": "KW", "Kyrgyzstan": "KG", "Laos": "LA", "Lao PDR": "LA", "Lebanon": "LB",
  "Malaysia": "MY", "Maldives": "MV", "Mongolia": "MN", "Myanmar": "MM", "Burma": "MM",
  "Nepal": "NP", "North Korea": "KP", "Dem. Rep. Korea": "KP", "Oman": "OM", "Pakistan": "PK",
  "Palestine": "PS", "Palestinian Territories": "PS", "Philippines": "PH", "Qatar": "QA",
  "Saudi Arabia": "SA", "Singapore": "SG", "South Korea": "KR", "Korea": "KR", "Sri Lanka": "LK",
  "Syria": "SY", "Syrian Arab Republic": "SY", "Taiwan": "TW", "Tajikistan": "TJ",
  "Thailand": "TH", "Timor-Leste": "TL", "East Timor": "TL", "Turkey": "TR", "Turkiye": "TR",
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

  // Other territories (excluding US territories like Puerto Rico which are tracked separately)
  "Greenland": "GL", "Fr. Polynesia": "PF", "French Polynesia": "PF",
};
