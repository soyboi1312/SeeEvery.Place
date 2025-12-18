import { CountryCode } from './countries';
import { usCities } from './usCities';

export interface WorldCity {
  id: string;
  name: string;
  country: string;
  countryCode: CountryCode;
  continent: string;
  population: number;
  lat: number;
  lng: number;
  stateCode?: string; // For US cities to enable cross-check with US states
}

// International cities (non-US) by population and cultural/economic significance
// Includes at least one city (usually capital) per country in countries.ts
const internationalCities: WorldCity[] = [
  // ============ ASIA ============
  // Major cities
  { id: "tokyo", name: "Tokyo", country: "Japan", countryCode: "JP", continent: "Asia", population: 37400068, lat: 35.6762, lng: 139.6503 },
  { id: "delhi", name: "Delhi", country: "India", countryCode: "IN", continent: "Asia", population: 28514000, lat: 28.7041, lng: 77.1025 },
  { id: "shanghai", name: "Shanghai", country: "China", countryCode: "CN", continent: "Asia", population: 25582000, lat: 31.2304, lng: 121.4737 },
  { id: "beijing", name: "Beijing", country: "China", countryCode: "CN", continent: "Asia", population: 19618000, lat: 39.9042, lng: 116.4074 },
  { id: "mumbai", name: "Mumbai", country: "India", countryCode: "IN", continent: "Asia", population: 19980000, lat: 19.0760, lng: 72.8777 },
  { id: "osaka", name: "Osaka", country: "Japan", countryCode: "JP", continent: "Asia", population: 19281000, lat: 34.6937, lng: 135.5023 },
  { id: "dhaka", name: "Dhaka", country: "Bangladesh", countryCode: "BD", continent: "Asia", population: 19578000, lat: 23.8103, lng: 90.4125 },
  { id: "kolkata", name: "Kolkata", country: "India", countryCode: "IN", continent: "Asia", population: 14681000, lat: 22.5726, lng: 88.3639 },
  { id: "karachi", name: "Karachi", country: "Pakistan", countryCode: "PK", continent: "Asia", population: 14910000, lat: 24.8607, lng: 67.0011 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", countryCode: "TH", continent: "Asia", population: 10156000, lat: 13.7563, lng: 100.5018 },
  { id: "seoul", name: "Seoul", country: "South Korea", countryCode: "KR", continent: "Asia", population: 9776000, lat: 37.5665, lng: 126.9780 },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", countryCode: "ID", continent: "Asia", population: 10770000, lat: -6.2088, lng: 106.8456 },
  { id: "singapore", name: "Singapore", country: "Singapore", countryCode: "SG", continent: "Asia", population: 5850000, lat: 1.3521, lng: 103.8198 },
  { id: "hong-kong", name: "Hong Kong", country: "Hong Kong", countryCode: "HK", continent: "Asia", population: 7482000, lat: 22.3193, lng: 114.1694 },
  { id: "macao", name: "Macao", country: "Macao", countryCode: "MO", continent: "Asia", population: 695168, lat: 22.1987, lng: 113.5439 },
  { id: "ho-chi-minh-city", name: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN", continent: "Asia", population: 8993000, lat: 10.8231, lng: 106.6297 },
  { id: "manila", name: "Manila", country: "Philippines", countryCode: "PH", continent: "Asia", population: 13482000, lat: 14.5995, lng: 120.9842 },
  { id: "taipei", name: "Taipei", country: "Taiwan", countryCode: "TW", continent: "Asia", population: 2646000, lat: 25.0330, lng: 121.5654 },
  { id: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", countryCode: "MY", continent: "Asia", population: 7564000, lat: 3.1390, lng: 101.6869 },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", countryCode: "VN", continent: "Asia", population: 4678000, lat: 21.0285, lng: 105.8542 },
  { id: "guangzhou", name: "Guangzhou", country: "China", countryCode: "CN", continent: "Asia", population: 13081000, lat: 23.1291, lng: 113.2644 },
  { id: "shenzhen", name: "Shenzhen", country: "China", countryCode: "CN", continent: "Asia", population: 12356000, lat: 22.5431, lng: 114.0579 },
  { id: "chengdu", name: "Chengdu", country: "China", countryCode: "CN", continent: "Asia", population: 9135000, lat: 30.5728, lng: 104.0668 },
  { id: "kyoto", name: "Kyoto", country: "Japan", countryCode: "JP", continent: "Asia", population: 1461000, lat: 35.0116, lng: 135.7681 },
  // Additional Asian capitals/cities
  { id: "kabul", name: "Kabul", country: "Afghanistan", countryCode: "AF", continent: "Asia", population: 4601789, lat: 34.5553, lng: 69.2075 },
  { id: "yerevan", name: "Yerevan", country: "Armenia", countryCode: "AM", continent: "Asia", population: 1075800, lat: 40.1872, lng: 44.5152 },
  { id: "baku", name: "Baku", country: "Azerbaijan", countryCode: "AZ", continent: "Asia", population: 2303100, lat: 40.4093, lng: 49.8671 },
  { id: "manama", name: "Manama", country: "Bahrain", countryCode: "BH", continent: "Asia", population: 411000, lat: 26.2285, lng: 50.5860 },
  { id: "thimphu", name: "Thimphu", country: "Bhutan", countryCode: "BT", continent: "Asia", population: 114551, lat: 27.4728, lng: 89.6390 },
  { id: "bandar-seri-begawan", name: "Bandar Seri Begawan", country: "Brunei", countryCode: "BN", continent: "Asia", population: 100700, lat: 4.9031, lng: 114.9398 },
  { id: "phnom-penh", name: "Phnom Penh", country: "Cambodia", countryCode: "KH", continent: "Asia", population: 2129371, lat: 11.5564, lng: 104.9282 },
  { id: "nicosia", name: "Nicosia", country: "Cyprus", countryCode: "CY", continent: "Asia", population: 330000, lat: 35.1856, lng: 33.3823 },
  { id: "tbilisi", name: "Tbilisi", country: "Georgia", countryCode: "GE", continent: "Asia", population: 1118035, lat: 41.7151, lng: 44.8271 },
  { id: "tehran", name: "Tehran", country: "Iran", countryCode: "IR", continent: "Asia", population: 9034000, lat: 35.6892, lng: 51.3890 },
  { id: "baghdad", name: "Baghdad", country: "Iraq", countryCode: "IQ", continent: "Asia", population: 8126000, lat: 33.3152, lng: 44.3661 },
  { id: "jerusalem", name: "Jerusalem", country: "Israel", countryCode: "IL", continent: "Asia", population: 936425, lat: 31.7683, lng: 35.2137 },
  { id: "tel-aviv", name: "Tel Aviv", country: "Israel", countryCode: "IL", continent: "Asia", population: 460613, lat: 32.0853, lng: 34.7818 },
  { id: "amman", name: "Amman", country: "Jordan", countryCode: "JO", continent: "Asia", population: 4007000, lat: 31.9454, lng: 35.9284 },
  { id: "astana", name: "Astana", country: "Kazakhstan", countryCode: "KZ", continent: "Asia", population: 1350000, lat: 51.1694, lng: 71.4491 },
  { id: "kuwait-city", name: "Kuwait City", country: "Kuwait", countryCode: "KW", continent: "Asia", population: 3114000, lat: 29.3759, lng: 47.9774 },
  { id: "bishkek", name: "Bishkek", country: "Kyrgyzstan", countryCode: "KG", continent: "Asia", population: 1074075, lat: 42.8746, lng: 74.5698 },
  { id: "vientiane", name: "Vientiane", country: "Laos", countryCode: "LA", continent: "Asia", population: 948477, lat: 17.9757, lng: 102.6331 },
  { id: "beirut", name: "Beirut", country: "Lebanon", countryCode: "LB", continent: "Asia", population: 2424000, lat: 33.8938, lng: 35.5018 },
  { id: "male", name: "Malé", country: "Maldives", countryCode: "MV", continent: "Asia", population: 252768, lat: 4.1755, lng: 73.5093 },
  { id: "ulaanbaatar", name: "Ulaanbaatar", country: "Mongolia", countryCode: "MN", continent: "Asia", population: 1539810, lat: 47.8864, lng: 106.9057 },
  { id: "naypyidaw", name: "Naypyidaw", country: "Myanmar", countryCode: "MM", continent: "Asia", population: 1160242, lat: 19.7633, lng: 96.0785 },
  { id: "kathmandu", name: "Kathmandu", country: "Nepal", countryCode: "NP", continent: "Asia", population: 1442271, lat: 27.7172, lng: 85.3240 },
  { id: "pyongyang", name: "Pyongyang", country: "North Korea", countryCode: "KP", continent: "Asia", population: 2870000, lat: 39.0392, lng: 125.7625 },
  { id: "muscat", name: "Muscat", country: "Oman", countryCode: "OM", continent: "Asia", population: 1421000, lat: 23.5880, lng: 58.3829 },
  { id: "islamabad", name: "Islamabad", country: "Pakistan", countryCode: "PK", continent: "Asia", population: 1095064, lat: 33.6844, lng: 73.0479 },
  { id: "ramallah", name: "Ramallah", country: "Palestine", countryCode: "PS", continent: "Asia", population: 38998, lat: 31.9038, lng: 35.2034 },
  { id: "doha", name: "Doha", country: "Qatar", countryCode: "QA", continent: "Asia", population: 2382000, lat: 25.2854, lng: 51.5310 },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", countryCode: "SA", continent: "Asia", population: 7676000, lat: 24.7136, lng: 46.6753 },
  { id: "colombo", name: "Colombo", country: "Sri Lanka", countryCode: "LK", continent: "Asia", population: 752993, lat: 6.9271, lng: 79.8612 },
  { id: "damascus", name: "Damascus", country: "Syria", countryCode: "SY", continent: "Asia", population: 2079000, lat: 33.5138, lng: 36.2765 },
  { id: "dushanbe", name: "Dushanbe", country: "Tajikistan", countryCode: "TJ", continent: "Asia", population: 863400, lat: 38.5598, lng: 68.7740 },
  { id: "dili", name: "Dili", country: "Timor-Leste", countryCode: "TL", continent: "Asia", population: 222323, lat: -8.5569, lng: 125.5603 },
  { id: "ashgabat", name: "Ashgabat", country: "Turkmenistan", countryCode: "TM", continent: "Asia", population: 1031992, lat: 37.9601, lng: 58.3261 },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", countryCode: "AE", continent: "Asia", population: 3331000, lat: 25.2048, lng: 55.2708 },
  { id: "abu-dhabi", name: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE", continent: "Asia", population: 1483000, lat: 24.4539, lng: 54.3773 },
  { id: "tashkent", name: "Tashkent", country: "Uzbekistan", countryCode: "UZ", continent: "Asia", population: 2860600, lat: 41.2995, lng: 69.2401 },
  { id: "sanaa", name: "Sana'a", country: "Yemen", countryCode: "YE", continent: "Asia", population: 2957000, lat: 15.3694, lng: 44.1910 },

  // ============ EUROPE ============
  // Major cities
  { id: "london", name: "London", country: "United Kingdom", countryCode: "GB", continent: "Europe", population: 9002000, lat: 51.5074, lng: -0.1278 },
  { id: "paris", name: "Paris", country: "France", countryCode: "FR", continent: "Europe", population: 10901000, lat: 48.8566, lng: 2.3522 },
  { id: "moscow", name: "Moscow", country: "Russia", countryCode: "RU", continent: "Europe", population: 12538000, lat: 55.7558, lng: 37.6173 },
  { id: "istanbul", name: "Istanbul", country: "Türkiye", countryCode: "TR", continent: "Europe", population: 15029000, lat: 41.0082, lng: 28.9784 },
  { id: "berlin", name: "Berlin", country: "Germany", countryCode: "DE", continent: "Europe", population: 3645000, lat: 52.5200, lng: 13.4050 },
  { id: "madrid", name: "Madrid", country: "Spain", countryCode: "ES", continent: "Europe", population: 6642000, lat: 40.4168, lng: -3.7038 },
  { id: "rome", name: "Rome", country: "Italy", countryCode: "IT", continent: "Europe", population: 4342000, lat: 41.9028, lng: 12.4964 },
  { id: "barcelona", name: "Barcelona", country: "Spain", countryCode: "ES", continent: "Europe", population: 5585000, lat: 41.3851, lng: 2.1734 },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", countryCode: "NL", continent: "Europe", population: 1149000, lat: 52.3676, lng: 4.9041 },
  { id: "vienna", name: "Vienna", country: "Austria", countryCode: "AT", continent: "Europe", population: 1921000, lat: 48.2082, lng: 16.3738 },
  { id: "munich", name: "Munich", country: "Germany", countryCode: "DE", continent: "Europe", population: 1472000, lat: 48.1351, lng: 11.5820 },
  { id: "milan", name: "Milan", country: "Italy", countryCode: "IT", continent: "Europe", population: 3140000, lat: 45.4642, lng: 9.1900 },
  { id: "prague", name: "Prague", country: "Czechia", countryCode: "CZ", continent: "Europe", population: 1309000, lat: 50.0755, lng: 14.4378 },
  { id: "budapest", name: "Budapest", country: "Hungary", countryCode: "HU", continent: "Europe", population: 1756000, lat: 47.4979, lng: 19.0402 },
  { id: "lisbon", name: "Lisbon", country: "Portugal", countryCode: "PT", continent: "Europe", population: 2942000, lat: 38.7223, lng: -9.1393 },
  { id: "dublin", name: "Dublin", country: "Ireland", countryCode: "IE", continent: "Europe", population: 1228000, lat: 53.3498, lng: -6.2603 },
  { id: "copenhagen", name: "Copenhagen", country: "Denmark", countryCode: "DK", continent: "Europe", population: 1346000, lat: 55.6761, lng: 12.5683 },
  { id: "stockholm", name: "Stockholm", country: "Sweden", countryCode: "SE", continent: "Europe", population: 1632000, lat: 59.3293, lng: 18.0686 },
  { id: "oslo", name: "Oslo", country: "Norway", countryCode: "NO", continent: "Europe", population: 1043000, lat: 59.9139, lng: 10.7522 },
  { id: "helsinki", name: "Helsinki", country: "Finland", countryCode: "FI", continent: "Europe", population: 1305000, lat: 60.1699, lng: 24.9384 },
  { id: "zurich", name: "Zurich", country: "Switzerland", countryCode: "CH", continent: "Europe", population: 434000, lat: 47.3769, lng: 8.5417 },
  { id: "brussels", name: "Brussels", country: "Belgium", countryCode: "BE", continent: "Europe", population: 2110000, lat: 50.8503, lng: 4.3517 },
  { id: "athens", name: "Athens", country: "Greece", countryCode: "GR", continent: "Europe", population: 3154000, lat: 37.9838, lng: 23.7275 },
  { id: "warsaw", name: "Warsaw", country: "Poland", countryCode: "PL", continent: "Europe", population: 1790000, lat: 52.2297, lng: 21.0122 },
  { id: "st-petersburg", name: "St. Petersburg", country: "Russia", countryCode: "RU", continent: "Europe", population: 5383000, lat: 59.9343, lng: 30.3351 },
  { id: "florence", name: "Florence", country: "Italy", countryCode: "IT", continent: "Europe", population: 382000, lat: 43.7696, lng: 11.2558 },
  { id: "venice", name: "Venice", country: "Italy", countryCode: "IT", continent: "Europe", population: 261000, lat: 45.4408, lng: 12.3155 },
  { id: "edinburgh", name: "Edinburgh", country: "United Kingdom", countryCode: "GB", continent: "Europe", population: 527000, lat: 55.9533, lng: -3.1883 },
  { id: "manchester", name: "Manchester", country: "United Kingdom", countryCode: "GB", continent: "Europe", population: 2770000, lat: 53.4808, lng: -2.2426 },
  { id: "monaco", name: "Monaco", country: "Monaco", countryCode: "MC", continent: "Europe", population: 39242, lat: 43.7384, lng: 7.4246 },
  { id: "vatican-city", name: "Vatican City", country: "Vatican City", countryCode: "VA", continent: "Europe", population: 825, lat: 41.9029, lng: 12.4534 },
  // Additional European capitals
  { id: "tirana", name: "Tirana", country: "Albania", countryCode: "AL", continent: "Europe", population: 418495, lat: 41.3275, lng: 19.8187 },
  { id: "andorra-la-vella", name: "Andorra la Vella", country: "Andorra", countryCode: "AD", continent: "Europe", population: 22886, lat: 42.5063, lng: 1.5218 },
  { id: "minsk", name: "Minsk", country: "Belarus", countryCode: "BY", continent: "Europe", population: 1996553, lat: 53.9045, lng: 27.5615 },
  { id: "sarajevo", name: "Sarajevo", country: "Bosnia and Herzegovina", countryCode: "BA", continent: "Europe", population: 275524, lat: 43.8564, lng: 18.4131 },
  { id: "sofia", name: "Sofia", country: "Bulgaria", countryCode: "BG", continent: "Europe", population: 1236000, lat: 42.6977, lng: 23.3219 },
  { id: "zagreb", name: "Zagreb", country: "Croatia", countryCode: "HR", continent: "Europe", population: 806341, lat: 45.8150, lng: 15.9819 },
  { id: "tallinn", name: "Tallinn", country: "Estonia", countryCode: "EE", continent: "Europe", population: 437619, lat: 59.4370, lng: 24.7536 },
  { id: "reykjavik", name: "Reykjavik", country: "Iceland", countryCode: "IS", continent: "Europe", population: 131136, lat: 64.1466, lng: -21.9426 },
  { id: "pristina", name: "Pristina", country: "Kosovo", countryCode: "XK", continent: "Europe", population: 198897, lat: 42.6629, lng: 21.1655 },
  { id: "riga", name: "Riga", country: "Latvia", countryCode: "LV", continent: "Europe", population: 614618, lat: 56.9496, lng: 24.1052 },
  { id: "vaduz", name: "Vaduz", country: "Liechtenstein", countryCode: "LI", continent: "Europe", population: 5696, lat: 47.1410, lng: 9.5209 },
  { id: "vilnius", name: "Vilnius", country: "Lithuania", countryCode: "LT", continent: "Europe", population: 580020, lat: 54.6872, lng: 25.2797 },
  { id: "luxembourg-city", name: "Luxembourg City", country: "Luxembourg", countryCode: "LU", continent: "Europe", population: 124509, lat: 49.6117, lng: 6.1319 },
  { id: "valletta", name: "Valletta", country: "Malta", countryCode: "MT", continent: "Europe", population: 5827, lat: 35.8989, lng: 14.5146 },
  { id: "chisinau", name: "Chișinău", country: "Moldova", countryCode: "MD", continent: "Europe", population: 532513, lat: 47.0105, lng: 28.8638 },
  { id: "podgorica", name: "Podgorica", country: "Montenegro", countryCode: "ME", continent: "Europe", population: 185937, lat: 42.4304, lng: 19.2594 },
  { id: "skopje", name: "Skopje", country: "North Macedonia", countryCode: "MK", continent: "Europe", population: 544086, lat: 41.9973, lng: 21.4280 },
  { id: "bucharest", name: "Bucharest", country: "Romania", countryCode: "RO", continent: "Europe", population: 1883425, lat: 44.4268, lng: 26.1025 },
  { id: "san-marino-city", name: "San Marino", country: "San Marino", countryCode: "SM", continent: "Europe", population: 4040, lat: 43.9424, lng: 12.4578 },
  { id: "belgrade", name: "Belgrade", country: "Serbia", countryCode: "RS", continent: "Europe", population: 1374000, lat: 44.7866, lng: 20.4489 },
  { id: "bratislava", name: "Bratislava", country: "Slovakia", countryCode: "SK", continent: "Europe", population: 432864, lat: 48.1486, lng: 17.1077 },
  { id: "ljubljana", name: "Ljubljana", country: "Slovenia", countryCode: "SI", continent: "Europe", population: 284355, lat: 46.0569, lng: 14.5058 },
  { id: "kyiv", name: "Kyiv", country: "Ukraine", countryCode: "UA", continent: "Europe", population: 2884000, lat: 50.4501, lng: 30.5234 },

  // ============ NORTH AMERICA (excluding US) ============
  { id: "mexico-city", name: "Mexico City", country: "Mexico", countryCode: "MX", continent: "North America", population: 21782000, lat: 19.4326, lng: -99.1332 },
  { id: "toronto", name: "Toronto", country: "Canada", countryCode: "CA", continent: "North America", population: 6197000, lat: 43.6532, lng: -79.3832 },
  { id: "montreal", name: "Montreal", country: "Canada", countryCode: "CA", continent: "North America", population: 4221000, lat: 45.5017, lng: -73.5673 },
  { id: "vancouver", name: "Vancouver", country: "Canada", countryCode: "CA", continent: "North America", population: 2581000, lat: 49.2827, lng: -123.1207 },
  { id: "guadalajara", name: "Guadalajara", country: "Mexico", countryCode: "MX", continent: "North America", population: 5003000, lat: 20.6597, lng: -103.3496 },
  { id: "havana", name: "Havana", country: "Cuba", countryCode: "CU", continent: "North America", population: 2136000, lat: 23.1136, lng: -82.3666 },
  { id: "calgary", name: "Calgary", country: "Canada", countryCode: "CA", continent: "North America", population: 1392000, lat: 51.0447, lng: -114.0719 },
  { id: "ottawa", name: "Ottawa", country: "Canada", countryCode: "CA", continent: "North America", population: 1393000, lat: 45.4215, lng: -75.6972 },
  { id: "monterrey", name: "Monterrey", country: "Mexico", countryCode: "MX", continent: "North America", population: 5036000, lat: 25.6866, lng: -100.3161 },
  // Caribbean & Central America capitals
  { id: "st-johns-antigua", name: "St. John's", country: "Antigua and Barbuda", countryCode: "AG", continent: "North America", population: 22193, lat: 17.1274, lng: -61.8468 },
  { id: "nassau", name: "Nassau", country: "Bahamas", countryCode: "BS", continent: "North America", population: 274400, lat: 25.0480, lng: -77.3554 },
  { id: "bridgetown", name: "Bridgetown", country: "Barbados", countryCode: "BB", continent: "North America", population: 89000, lat: 13.1132, lng: -59.5988 },
  { id: "belmopan", name: "Belmopan", country: "Belize", countryCode: "BZ", continent: "North America", population: 20621, lat: 17.2510, lng: -88.7590 },
  { id: "san-jose-cr", name: "San José", country: "Costa Rica", countryCode: "CR", continent: "North America", population: 342188, lat: 9.9281, lng: -84.0907 },
  { id: "roseau", name: "Roseau", country: "Dominica", countryCode: "DM", continent: "North America", population: 14725, lat: 15.3092, lng: -61.3794 },
  { id: "santo-domingo", name: "Santo Domingo", country: "Dominican Republic", countryCode: "DO", continent: "North America", population: 3172000, lat: 18.4861, lng: -69.9312 },
  { id: "san-salvador", name: "San Salvador", country: "El Salvador", countryCode: "SV", continent: "North America", population: 567698, lat: 13.6929, lng: -89.2182 },
  { id: "st-georges", name: "St. George's", country: "Grenada", countryCode: "GD", continent: "North America", population: 7500, lat: 12.0528, lng: -61.7417 },
  { id: "guatemala-city", name: "Guatemala City", country: "Guatemala", countryCode: "GT", continent: "North America", population: 2934841, lat: 14.6349, lng: -90.5069 },
  { id: "port-au-prince", name: "Port-au-Prince", country: "Haiti", countryCode: "HT", continent: "North America", population: 2618894, lat: 18.5944, lng: -72.3074 },
  { id: "tegucigalpa", name: "Tegucigalpa", country: "Honduras", countryCode: "HN", continent: "North America", population: 1126534, lat: 14.0818, lng: -87.2068 },
  { id: "kingston", name: "Kingston", country: "Jamaica", countryCode: "JM", continent: "North America", population: 937700, lat: 18.0179, lng: -76.8099 },
  { id: "managua", name: "Managua", country: "Nicaragua", countryCode: "NI", continent: "North America", population: 1055247, lat: 12.1150, lng: -86.2362 },
  { id: "panama-city", name: "Panama City", country: "Panama", countryCode: "PA", continent: "North America", population: 880691, lat: 9.1012, lng: -79.4025 },
  { id: "basseterre", name: "Basseterre", country: "Saint Kitts and Nevis", countryCode: "KN", continent: "North America", population: 14000, lat: 17.2958, lng: -62.7267 },
  { id: "castries", name: "Castries", country: "Saint Lucia", countryCode: "LC", continent: "North America", population: 22000, lat: 14.0101, lng: -60.9875 },
  { id: "kingstown", name: "Kingstown", country: "Saint Vincent and the Grenadines", countryCode: "VC", continent: "North America", population: 16500, lat: 13.1587, lng: -61.2248 },
  { id: "port-of-spain", name: "Port of Spain", country: "Trinidad and Tobago", countryCode: "TT", continent: "North America", population: 37074, lat: 10.6596, lng: -61.5086 },

  // ============ SOUTH AMERICA ============
  { id: "sao-paulo", name: "São Paulo", country: "Brazil", countryCode: "BR", continent: "South America", population: 21846000, lat: -23.5505, lng: -46.6333 },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", countryCode: "AR", continent: "South America", population: 15024000, lat: -34.6037, lng: -58.3816 },
  { id: "rio-de-janeiro", name: "Rio de Janeiro", country: "Brazil", countryCode: "BR", continent: "South America", population: 13374000, lat: -22.9068, lng: -43.1729 },
  { id: "lima", name: "Lima", country: "Peru", countryCode: "PE", continent: "South America", population: 10719000, lat: -12.0464, lng: -77.0428 },
  { id: "bogota", name: "Bogotá", country: "Colombia", countryCode: "CO", continent: "South America", population: 10978000, lat: 4.7110, lng: -74.0721 },
  { id: "santiago", name: "Santiago", country: "Chile", countryCode: "CL", continent: "South America", population: 6767000, lat: -33.4489, lng: -70.6693 },
  { id: "caracas", name: "Caracas", country: "Venezuela", countryCode: "VE", continent: "South America", population: 2935000, lat: 10.4806, lng: -66.9036 },
  { id: "medellin", name: "Medellín", country: "Colombia", countryCode: "CO", continent: "South America", population: 3934000, lat: 6.2442, lng: -75.5812 },
  { id: "quito", name: "Quito", country: "Ecuador", countryCode: "EC", continent: "South America", population: 2011000, lat: -0.1807, lng: -78.4678 },
  { id: "montevideo", name: "Montevideo", country: "Uruguay", countryCode: "UY", continent: "South America", population: 1947000, lat: -34.9011, lng: -56.1645 },
  { id: "cartagena", name: "Cartagena", country: "Colombia", countryCode: "CO", continent: "South America", population: 1028000, lat: 10.3910, lng: -75.4794 },
  // Additional South American capitals
  { id: "la-paz", name: "La Paz", country: "Bolivia", countryCode: "BO", continent: "South America", population: 816044, lat: -16.4897, lng: -68.1193 },
  { id: "brasilia", name: "Brasília", country: "Brazil", countryCode: "BR", continent: "South America", population: 2817068, lat: -15.7975, lng: -47.8919 },
  { id: "georgetown", name: "Georgetown", country: "Guyana", countryCode: "GY", continent: "South America", population: 118363, lat: 6.8013, lng: -58.1551 },
  { id: "asuncion", name: "Asunción", country: "Paraguay", countryCode: "PY", continent: "South America", population: 525294, lat: -25.2637, lng: -57.5759 },
  { id: "paramaribo", name: "Paramaribo", country: "Suriname", countryCode: "SR", continent: "South America", population: 241000, lat: 5.8520, lng: -55.2038 },

  // ============ AFRICA ============
  { id: "cairo", name: "Cairo", country: "Egypt", countryCode: "EG", continent: "Africa", population: 20484000, lat: 30.0444, lng: 31.2357 },
  { id: "lagos", name: "Lagos", country: "Nigeria", countryCode: "NG", continent: "Africa", population: 14368000, lat: 6.5244, lng: 3.3792 },
  { id: "kinshasa", name: "Kinshasa", country: "DR Congo", countryCode: "CD", continent: "Africa", population: 14342000, lat: -4.4419, lng: 15.2663 },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", countryCode: "ZA", continent: "Africa", population: 5635000, lat: -26.2041, lng: 28.0473 },
  { id: "cape-town", name: "Cape Town", country: "South Africa", countryCode: "ZA", continent: "Africa", population: 4524000, lat: -33.9249, lng: 18.4241 },
  { id: "nairobi", name: "Nairobi", country: "Kenya", countryCode: "KE", continent: "Africa", population: 4734000, lat: -1.2921, lng: 36.8219 },
  { id: "casablanca", name: "Casablanca", country: "Morocco", countryCode: "MA", continent: "Africa", population: 3752000, lat: 33.5731, lng: -7.5898 },
  { id: "addis-ababa", name: "Addis Ababa", country: "Ethiopia", countryCode: "ET", continent: "Africa", population: 4794000, lat: 9.0320, lng: 38.7469 },
  { id: "accra", name: "Accra", country: "Ghana", countryCode: "GH", continent: "Africa", population: 2557000, lat: 5.6037, lng: -0.1870 },
  { id: "dar-es-salaam", name: "Dar es Salaam", country: "Tanzania", countryCode: "TZ", continent: "Africa", population: 6702000, lat: -6.7924, lng: 39.2083 },
  { id: "marrakech", name: "Marrakech", country: "Morocco", countryCode: "MA", continent: "Africa", population: 929000, lat: 31.6295, lng: -7.9811 },
  { id: "tunis", name: "Tunis", country: "Tunisia", countryCode: "TN", continent: "Africa", population: 2365000, lat: 36.8065, lng: 10.1815 },
  { id: "alexandria", name: "Alexandria", country: "Egypt", countryCode: "EG", continent: "Africa", population: 5200000, lat: 31.2001, lng: 29.9187 },
  // Additional African capitals
  { id: "algiers", name: "Algiers", country: "Algeria", countryCode: "DZ", continent: "Africa", population: 3415811, lat: 36.7538, lng: 3.0588 },
  { id: "luanda", name: "Luanda", country: "Angola", countryCode: "AO", continent: "Africa", population: 8952496, lat: -8.8390, lng: 13.2894 },
  { id: "porto-novo", name: "Porto-Novo", country: "Benin", countryCode: "BJ", continent: "Africa", population: 264320, lat: 6.4969, lng: 2.6289 },
  { id: "gaborone", name: "Gaborone", country: "Botswana", countryCode: "BW", continent: "Africa", population: 231626, lat: -24.6282, lng: 25.9231 },
  { id: "ouagadougou", name: "Ouagadougou", country: "Burkina Faso", countryCode: "BF", continent: "Africa", population: 2453496, lat: 12.3714, lng: -1.5197 },
  { id: "gitega", name: "Gitega", country: "Burundi", countryCode: "BI", continent: "Africa", population: 135467, lat: -3.4264, lng: 29.9246 },
  { id: "praia", name: "Praia", country: "Cabo Verde", countryCode: "CV", continent: "Africa", population: 159050, lat: 14.9315, lng: -23.5087 },
  { id: "yaounde", name: "Yaoundé", country: "Cameroon", countryCode: "CM", continent: "Africa", population: 2440462, lat: 3.8480, lng: 11.5021 },
  { id: "bangui", name: "Bangui", country: "Central African Republic", countryCode: "CF", continent: "Africa", population: 889231, lat: 4.3947, lng: 18.5582 },
  { id: "ndjamena", name: "N'Djamena", country: "Chad", countryCode: "TD", continent: "Africa", population: 1476040, lat: 12.1348, lng: 15.0557 },
  { id: "moroni", name: "Moroni", country: "Comoros", countryCode: "KM", continent: "Africa", population: 111326, lat: -11.7022, lng: 43.2551 },
  { id: "brazzaville", name: "Brazzaville", country: "Congo", countryCode: "CG", continent: "Africa", population: 2388000, lat: -4.2634, lng: 15.2429 },
  { id: "djibouti-city", name: "Djibouti", country: "Djibouti", countryCode: "DJ", continent: "Africa", population: 562000, lat: 11.5886, lng: 43.1456 },
  { id: "malabo", name: "Malabo", country: "Equatorial Guinea", countryCode: "GQ", continent: "Africa", population: 297000, lat: 3.7500, lng: 8.7833 },
  { id: "asmara", name: "Asmara", country: "Eritrea", countryCode: "ER", continent: "Africa", population: 963000, lat: 15.3229, lng: 38.9251 },
  { id: "mbabane", name: "Mbabane", country: "Eswatini", countryCode: "SZ", continent: "Africa", population: 94874, lat: -26.3186, lng: 31.1410 },
  { id: "libreville", name: "Libreville", country: "Gabon", countryCode: "GA", continent: "Africa", population: 797003, lat: 0.4162, lng: 9.4673 },
  { id: "banjul", name: "Banjul", country: "Gambia", countryCode: "GM", continent: "Africa", population: 34828, lat: 13.4549, lng: -16.5790 },
  { id: "conakry", name: "Conakry", country: "Guinea", countryCode: "GN", continent: "Africa", population: 1767200, lat: 9.6412, lng: -13.5784 },
  { id: "bissau", name: "Bissau", country: "Guinea-Bissau", countryCode: "GW", continent: "Africa", population: 492004, lat: 11.8636, lng: -15.5977 },
  { id: "yamoussoukro", name: "Yamoussoukro", country: "Ivory Coast", countryCode: "CI", continent: "Africa", population: 355573, lat: 6.8276, lng: -5.2893 },
  { id: "maseru", name: "Maseru", country: "Lesotho", countryCode: "LS", continent: "Africa", population: 330790, lat: -29.3167, lng: 27.4833 },
  { id: "monrovia", name: "Monrovia", country: "Liberia", countryCode: "LR", continent: "Africa", population: 1517964, lat: 6.3106, lng: -10.8047 },
  { id: "tripoli", name: "Tripoli", country: "Libya", countryCode: "LY", continent: "Africa", population: 1126000, lat: 32.8872, lng: 13.1913 },
  { id: "antananarivo", name: "Antananarivo", country: "Madagascar", countryCode: "MG", continent: "Africa", population: 1275207, lat: -18.8792, lng: 47.5079 },
  { id: "lilongwe", name: "Lilongwe", country: "Malawi", countryCode: "MW", continent: "Africa", population: 989318, lat: -13.9626, lng: 33.7741 },
  { id: "bamako", name: "Bamako", country: "Mali", countryCode: "ML", continent: "Africa", population: 2009109, lat: 12.6392, lng: -8.0029 },
  { id: "nouakchott", name: "Nouakchott", country: "Mauritania", countryCode: "MR", continent: "Africa", population: 1195600, lat: 18.0735, lng: -15.9582 },
  { id: "port-louis", name: "Port Louis", country: "Mauritius", countryCode: "MU", continent: "Africa", population: 147066, lat: -20.1609, lng: 57.5012 },
  { id: "rabat", name: "Rabat", country: "Morocco", countryCode: "MA", continent: "Africa", population: 577827, lat: 34.0209, lng: -6.8416 },
  { id: "maputo", name: "Maputo", country: "Mozambique", countryCode: "MZ", continent: "Africa", population: 1191613, lat: -25.9692, lng: 32.5732 },
  { id: "windhoek", name: "Windhoek", country: "Namibia", countryCode: "NA", continent: "Africa", population: 446200, lat: -22.5597, lng: 17.0832 },
  { id: "niamey", name: "Niamey", country: "Niger", countryCode: "NE", continent: "Africa", population: 1388648, lat: 13.5127, lng: 2.1128 },
  { id: "abuja", name: "Abuja", country: "Nigeria", countryCode: "NG", continent: "Africa", population: 3652000, lat: 9.0579, lng: 7.4951 },
  { id: "kigali", name: "Kigali", country: "Rwanda", countryCode: "RW", continent: "Africa", population: 1132686, lat: -1.9706, lng: 30.1044 },
  { id: "sao-tome", name: "São Tomé", country: "Sao Tome and Principe", countryCode: "ST", continent: "Africa", population: 80000, lat: 0.3365, lng: 6.7311 },
  { id: "dakar", name: "Dakar", country: "Senegal", countryCode: "SN", continent: "Africa", population: 1146053, lat: 14.7167, lng: -17.4677 },
  { id: "victoria", name: "Victoria", country: "Seychelles", countryCode: "SC", continent: "Africa", population: 26000, lat: -4.6191, lng: 55.4513 },
  { id: "freetown", name: "Freetown", country: "Sierra Leone", countryCode: "SL", continent: "Africa", population: 1055964, lat: 8.4657, lng: -13.2317 },
  { id: "mogadishu", name: "Mogadishu", country: "Somalia", countryCode: "SO", continent: "Africa", population: 2388000, lat: 2.0469, lng: 45.3182 },
  { id: "pretoria", name: "Pretoria", country: "South Africa", countryCode: "ZA", continent: "Africa", population: 741651, lat: -25.7461, lng: 28.1881 },
  { id: "juba", name: "Juba", country: "South Sudan", countryCode: "SS", continent: "Africa", population: 525953, lat: 4.8594, lng: 31.5713 },
  { id: "khartoum", name: "Khartoum", country: "Sudan", countryCode: "SD", continent: "Africa", population: 7869000, lat: 15.5007, lng: 32.5599 },
  { id: "dodoma", name: "Dodoma", country: "Tanzania", countryCode: "TZ", continent: "Africa", population: 410956, lat: -6.1629, lng: 35.7516 },
  { id: "lome", name: "Lomé", country: "Togo", countryCode: "TG", continent: "Africa", population: 837437, lat: 6.1256, lng: 1.2254 },
  { id: "kampala", name: "Kampala", country: "Uganda", countryCode: "UG", continent: "Africa", population: 1507080, lat: 0.3476, lng: 32.5825 },
  { id: "lusaka", name: "Lusaka", country: "Zambia", countryCode: "ZM", continent: "Africa", population: 3308400, lat: -15.3875, lng: 28.3228 },
  { id: "harare", name: "Harare", country: "Zimbabwe", countryCode: "ZW", continent: "Africa", population: 1606000, lat: -17.8292, lng: 31.0522 },

  // ============ OCEANIA ============
  { id: "sydney", name: "Sydney", country: "Australia", countryCode: "AU", continent: "Oceania", population: 5312000, lat: -33.8688, lng: 151.2093 },
  { id: "melbourne", name: "Melbourne", country: "Australia", countryCode: "AU", continent: "Oceania", population: 5078000, lat: -37.8136, lng: 144.9631 },
  { id: "brisbane", name: "Brisbane", country: "Australia", countryCode: "AU", continent: "Oceania", population: 2514000, lat: -27.4698, lng: 153.0251 },
  { id: "perth", name: "Perth", country: "Australia", countryCode: "AU", continent: "Oceania", population: 2085000, lat: -31.9505, lng: 115.8605 },
  { id: "auckland", name: "Auckland", country: "New Zealand", countryCode: "NZ", continent: "Oceania", population: 1657000, lat: -36.8485, lng: 174.7633 },
  { id: "wellington", name: "Wellington", country: "New Zealand", countryCode: "NZ", continent: "Oceania", population: 418500, lat: -41.2865, lng: 174.7762 },
  { id: "adelaide", name: "Adelaide", country: "Australia", countryCode: "AU", continent: "Oceania", population: 1359000, lat: -34.9285, lng: 138.6007 },
  { id: "gold-coast", name: "Gold Coast", country: "Australia", countryCode: "AU", continent: "Oceania", population: 679127, lat: -28.0167, lng: 153.4000 },
  { id: "canberra", name: "Canberra", country: "Australia", countryCode: "AU", continent: "Oceania", population: 453558, lat: -35.2809, lng: 149.1300 },
  // Pacific Island capitals
  { id: "suva", name: "Suva", country: "Fiji", countryCode: "FJ", continent: "Oceania", population: 93970, lat: -18.1416, lng: 178.4419 },
  { id: "south-tarawa", name: "South Tarawa", country: "Kiribati", countryCode: "KI", continent: "Oceania", population: 63439, lat: 1.3382, lng: 173.0176 },
  { id: "majuro", name: "Majuro", country: "Marshall Islands", countryCode: "MH", continent: "Oceania", population: 27797, lat: 7.0897, lng: 171.3803 },
  { id: "palikir", name: "Palikir", country: "Micronesia", countryCode: "FM", continent: "Oceania", population: 6647, lat: 6.9147, lng: 158.1610 },
  { id: "yaren", name: "Yaren", country: "Nauru", countryCode: "NR", continent: "Oceania", population: 1100, lat: -0.5466, lng: 166.9210 },
  { id: "ngerulmud", name: "Ngerulmud", country: "Palau", countryCode: "PW", continent: "Oceania", population: 391, lat: 7.5006, lng: 134.6242 },
  { id: "port-moresby", name: "Port Moresby", country: "Papua New Guinea", countryCode: "PG", continent: "Oceania", population: 364125, lat: -9.4438, lng: 147.1803 },
  { id: "apia", name: "Apia", country: "Samoa", countryCode: "WS", continent: "Oceania", population: 36735, lat: -13.8333, lng: -171.7500 },
  { id: "honiara", name: "Honiara", country: "Solomon Islands", countryCode: "SB", continent: "Oceania", population: 84520, lat: -9.4456, lng: 159.9729 },
  { id: "nukualofa", name: "Nukuʻalofa", country: "Tonga", countryCode: "TO", continent: "Oceania", population: 27600, lat: -21.2089, lng: -175.1982 },
  { id: "funafuti", name: "Funafuti", country: "Tuvalu", countryCode: "TV", continent: "Oceania", population: 6320, lat: -8.5243, lng: 179.1942 },
  { id: "port-vila", name: "Port Vila", country: "Vanuatu", countryCode: "VU", continent: "Oceania", population: 51437, lat: -17.7338, lng: 168.3219 },

  // ============ ANTARCTICA ============
  { id: "mcmurdo-station", name: "McMurdo Station", country: "Antarctica", countryCode: "AQ", continent: "Antarctica", population: 1258, lat: -77.8463, lng: 166.6681 },
];

// Select major US cities for the World view, derived from usCities (DRY principle)
// Include cities with significant international recognition/travel relevance
const US_WORLD_CITIES = new Set([
  'new-york', 'los-angeles', 'chicago', 'san-francisco', 'miami',
  'las-vegas', 'washington-dc', 'boston', 'seattle', 'houston',
  'atlanta', 'dallas', 'denver', 'phoenix', 'honolulu'
]);

const usWorldCities: WorldCity[] = usCities
  .filter(city => US_WORLD_CITIES.has(city.id))
  .map(city => ({
    id: city.id, // Keep same ID for database consistency
    name: city.name,
    country: "United States",
    countryCode: "US" as CountryCode,
    continent: "North America",
    population: city.population,
    lat: city.lat,
    lng: city.lng,
    stateCode: city.stateCode,
  }));

// Export merged array of international + US cities
export const worldCities: WorldCity[] = [...internationalCities, ...usWorldCities];

export const worldCityContinents = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"];

export const getWorldCitiesByContinent = (continent: string) =>
  worldCities.filter(c => c.continent === continent);

export const getWorldCitiesByCountry = (countryCode: string) =>
  worldCities.filter(c => c.countryCode === countryCode);

export const getTotalWorldCities = () => worldCities.length;
