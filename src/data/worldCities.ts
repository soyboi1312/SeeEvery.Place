export interface WorldCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  population: number;
  lat: number;
  lng: number;
}

// Major world cities by population and cultural/economic significance
export const worldCities: WorldCity[] = [
  // Asia
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
  { id: "ho-chi-minh-city", name: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN", continent: "Asia", population: 8993000, lat: 10.8231, lng: 106.6297 },
  { id: "manila", name: "Manila", country: "Philippines", countryCode: "PH", continent: "Asia", population: 13482000, lat: 14.5995, lng: 120.9842 },
  { id: "taipei", name: "Taipei", country: "Taiwan", countryCode: "TW", continent: "Asia", population: 2646000, lat: 25.0330, lng: 121.5654 },
  { id: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", countryCode: "MY", continent: "Asia", population: 7564000, lat: 3.1390, lng: 101.6869 },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", countryCode: "VN", continent: "Asia", population: 4678000, lat: 21.0285, lng: 105.8542 },
  { id: "guangzhou", name: "Guangzhou", country: "China", countryCode: "CN", continent: "Asia", population: 13081000, lat: 23.1291, lng: 113.2644 },
  { id: "shenzhen", name: "Shenzhen", country: "China", countryCode: "CN", continent: "Asia", population: 12356000, lat: 22.5431, lng: 114.0579 },
  { id: "chengdu", name: "Chengdu", country: "China", countryCode: "CN", continent: "Asia", population: 9135000, lat: 30.5728, lng: 104.0668 },
  { id: "kyoto", name: "Kyoto", country: "Japan", countryCode: "JP", continent: "Asia", population: 1461000, lat: 35.0116, lng: 135.7681 },

  // Europe
  { id: "london", name: "London", country: "United Kingdom", countryCode: "GB", continent: "Europe", population: 9002000, lat: 51.5074, lng: -0.1278 },
  { id: "paris", name: "Paris", country: "France", countryCode: "FR", continent: "Europe", population: 10901000, lat: 48.8566, lng: 2.3522 },
  { id: "moscow", name: "Moscow", country: "Russia", countryCode: "RU", continent: "Europe", population: 12538000, lat: 55.7558, lng: 37.6173 },
  { id: "istanbul", name: "Istanbul", country: "Turkey", countryCode: "TR", continent: "Europe", population: 15029000, lat: 41.0082, lng: 28.9784 },
  { id: "berlin", name: "Berlin", country: "Germany", countryCode: "DE", continent: "Europe", population: 3645000, lat: 52.5200, lng: 13.4050 },
  { id: "madrid", name: "Madrid", country: "Spain", countryCode: "ES", continent: "Europe", population: 6642000, lat: 40.4168, lng: -3.7038 },
  { id: "rome", name: "Rome", country: "Italy", countryCode: "IT", continent: "Europe", population: 4342000, lat: 41.9028, lng: 12.4964 },
  { id: "barcelona", name: "Barcelona", country: "Spain", countryCode: "ES", continent: "Europe", population: 5585000, lat: 41.3851, lng: 2.1734 },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", countryCode: "NL", continent: "Europe", population: 1149000, lat: 52.3676, lng: 4.9041 },
  { id: "vienna", name: "Vienna", country: "Austria", countryCode: "AT", continent: "Europe", population: 1921000, lat: 48.2082, lng: 16.3738 },
  { id: "munich", name: "Munich", country: "Germany", countryCode: "DE", continent: "Europe", population: 1472000, lat: 48.1351, lng: 11.5820 },
  { id: "milan", name: "Milan", country: "Italy", countryCode: "IT", continent: "Europe", population: 3140000, lat: 45.4642, lng: 9.1900 },
  { id: "prague", name: "Prague", country: "Czech Republic", countryCode: "CZ", continent: "Europe", population: 1309000, lat: 50.0755, lng: 14.4378 },
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

  // North America (excluding US - those are in usCities)
  { id: "mexico-city", name: "Mexico City", country: "Mexico", countryCode: "MX", continent: "North America", population: 21782000, lat: 19.4326, lng: -99.1332 },
  { id: "toronto", name: "Toronto", country: "Canada", countryCode: "CA", continent: "North America", population: 6197000, lat: 43.6532, lng: -79.3832 },
  { id: "montreal", name: "Montreal", country: "Canada", countryCode: "CA", continent: "North America", population: 4221000, lat: 45.5017, lng: -73.5673 },
  { id: "vancouver", name: "Vancouver", country: "Canada", countryCode: "CA", continent: "North America", population: 2581000, lat: 49.2827, lng: -123.1207 },
  { id: "guadalajara", name: "Guadalajara", country: "Mexico", countryCode: "MX", continent: "North America", population: 5003000, lat: 20.6597, lng: -103.3496 },
  { id: "havana", name: "Havana", country: "Cuba", countryCode: "CU", continent: "North America", population: 2136000, lat: 23.1136, lng: -82.3666 },
  { id: "calgary", name: "Calgary", country: "Canada", countryCode: "CA", continent: "North America", population: 1392000, lat: 51.0447, lng: -114.0719 },
  { id: "ottawa", name: "Ottawa", country: "Canada", countryCode: "CA", continent: "North America", population: 1393000, lat: 45.4215, lng: -75.6972 },
  { id: "monterrey", name: "Monterrey", country: "Mexico", countryCode: "MX", continent: "North America", population: 5036000, lat: 25.6866, lng: -100.3161 },

  // South America
  { id: "sao-paulo", name: "Sao Paulo", country: "Brazil", countryCode: "BR", continent: "South America", population: 21846000, lat: -23.5505, lng: -46.6333 },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", countryCode: "AR", continent: "South America", population: 15024000, lat: -34.6037, lng: -58.3816 },
  { id: "rio-de-janeiro", name: "Rio de Janeiro", country: "Brazil", countryCode: "BR", continent: "South America", population: 13374000, lat: -22.9068, lng: -43.1729 },
  { id: "lima", name: "Lima", country: "Peru", countryCode: "PE", continent: "South America", population: 10719000, lat: -12.0464, lng: -77.0428 },
  { id: "bogota", name: "Bogota", country: "Colombia", countryCode: "CO", continent: "South America", population: 10978000, lat: 4.7110, lng: -74.0721 },
  { id: "santiago", name: "Santiago", country: "Chile", countryCode: "CL", continent: "South America", population: 6767000, lat: -33.4489, lng: -70.6693 },
  { id: "caracas", name: "Caracas", country: "Venezuela", countryCode: "VE", continent: "South America", population: 2935000, lat: 10.4806, lng: -66.9036 },
  { id: "medellin", name: "Medellin", country: "Colombia", countryCode: "CO", continent: "South America", population: 3934000, lat: 6.2442, lng: -75.5812 },
  { id: "quito", name: "Quito", country: "Ecuador", countryCode: "EC", continent: "South America", population: 2011000, lat: -0.1807, lng: -78.4678 },
  { id: "montevideo", name: "Montevideo", country: "Uruguay", countryCode: "UY", continent: "South America", population: 1947000, lat: -34.9011, lng: -56.1645 },
  { id: "cartagena", name: "Cartagena", country: "Colombia", countryCode: "CO", continent: "South America", population: 1028000, lat: 10.3910, lng: -75.4794 },

  // Africa
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

  // Middle East
  { id: "dubai", name: "Dubai", country: "UAE", countryCode: "AE", continent: "Middle East", population: 3331000, lat: 25.2048, lng: 55.2708 },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", countryCode: "SA", continent: "Middle East", population: 7676000, lat: 24.7136, lng: 46.6753 },
  { id: "tehran", name: "Tehran", country: "Iran", countryCode: "IR", continent: "Middle East", population: 9034000, lat: 35.6892, lng: 51.3890 },
  { id: "baghdad", name: "Baghdad", country: "Iraq", countryCode: "IQ", continent: "Middle East", population: 8126000, lat: 33.3152, lng: 44.3661 },
  { id: "tel-aviv", name: "Tel Aviv", country: "Israel", countryCode: "IL", continent: "Middle East", population: 4181000, lat: 32.0853, lng: 34.7818 },
  { id: "jerusalem", name: "Jerusalem", country: "Israel", countryCode: "IL", continent: "Middle East", population: 936000, lat: 31.7683, lng: 35.2137 },
  { id: "doha", name: "Doha", country: "Qatar", countryCode: "QA", continent: "Middle East", population: 2382000, lat: 25.2854, lng: 51.5310 },
  { id: "abu-dhabi", name: "Abu Dhabi", country: "UAE", countryCode: "AE", continent: "Middle East", population: 1483000, lat: 24.4539, lng: 54.3773 },
  { id: "beirut", name: "Beirut", country: "Lebanon", countryCode: "LB", continent: "Middle East", population: 2424000, lat: 33.8938, lng: 35.5018 },
  { id: "amman", name: "Amman", country: "Jordan", countryCode: "JO", continent: "Middle East", population: 4007000, lat: 31.9454, lng: 35.9284 },
  { id: "muscat", name: "Muscat", country: "Oman", countryCode: "OM", continent: "Middle East", population: 1421000, lat: 23.5880, lng: 58.3829 },
  { id: "kuwait-city", name: "Kuwait City", country: "Kuwait", countryCode: "KW", continent: "Middle East", population: 3114000, lat: 29.3759, lng: 47.9774 },

  // Oceania
  { id: "sydney", name: "Sydney", country: "Australia", countryCode: "AU", continent: "Oceania", population: 5312000, lat: -33.8688, lng: 151.2093 },
  { id: "melbourne", name: "Melbourne", country: "Australia", countryCode: "AU", continent: "Oceania", population: 5078000, lat: -37.8136, lng: 144.9631 },
  { id: "brisbane", name: "Brisbane", country: "Australia", countryCode: "AU", continent: "Oceania", population: 2514000, lat: -27.4698, lng: 153.0251 },
  { id: "perth", name: "Perth", country: "Australia", countryCode: "AU", continent: "Oceania", population: 2085000, lat: -31.9505, lng: 115.8605 },
  { id: "auckland", name: "Auckland", country: "New Zealand", countryCode: "NZ", continent: "Oceania", population: 1657000, lat: -36.8485, lng: 174.7633 },
  { id: "wellington", name: "Wellington", country: "New Zealand", countryCode: "NZ", continent: "Oceania", population: 418000, lat: -41.2865, lng: 174.7762 },
  { id: "adelaide", name: "Adelaide", country: "Australia", countryCode: "AU", continent: "Oceania", population: 1359000, lat: -34.9285, lng: 138.6007 },
  { id: "gold-coast", name: "Gold Coast", country: "Australia", countryCode: "AU", continent: "Oceania", population: 679000, lat: -28.0167, lng: 153.4000 },
];

export const worldCityContinents = ["Asia", "Europe", "North America", "South America", "Africa", "Middle East", "Oceania"];

export const getWorldCitiesByContinent = (continent: string) =>
  worldCities.filter(c => c.continent === continent);

export const getWorldCitiesByCountry = (countryCode: string) =>
  worldCities.filter(c => c.countryCode === countryCode);

export const getTotalWorldCities = () => worldCities.length;
