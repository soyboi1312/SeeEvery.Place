export interface USCity {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  region: string;
  population: number;
  lat: number;
  lng: number;
}

// Major US cities by population and cultural significance
export const usCities: USCity[] = [
  // Northeast
  { id: "new-york", name: "New York City", state: "New York", stateCode: "NY", region: "Northeast", population: 8336817, lat: 40.7128, lng: -74.0060 },
  { id: "philadelphia", name: "Philadelphia", state: "Pennsylvania", stateCode: "PA", region: "Northeast", population: 1584064, lat: 39.9526, lng: -75.1652 },
  { id: "boston", name: "Boston", state: "Massachusetts", stateCode: "MA", region: "Northeast", population: 692600, lat: 42.3601, lng: -71.0589 },
  { id: "pittsburgh", name: "Pittsburgh", state: "Pennsylvania", stateCode: "PA", region: "Northeast", population: 302971, lat: 40.4406, lng: -79.9959 },
  { id: "newark", name: "Newark", state: "New Jersey", stateCode: "NJ", region: "Northeast", population: 311549, lat: 40.7357, lng: -74.1724 },
  { id: "buffalo", name: "Buffalo", state: "New York", stateCode: "NY", region: "Northeast", population: 278349, lat: 42.8864, lng: -78.8784 },
  { id: "providence", name: "Providence", state: "Rhode Island", stateCode: "RI", region: "Northeast", population: 190934, lat: 41.8240, lng: -71.4128 },
  { id: "hartford", name: "Hartford", state: "Connecticut", stateCode: "CT", region: "Northeast", population: 121054, lat: 41.7658, lng: -72.6734 },
  { id: "baltimore", name: "Baltimore", state: "Maryland", stateCode: "MD", region: "Northeast", population: 585708, lat: 39.2904, lng: -76.6122 },
  { id: "washington-dc", name: "Washington D.C.", state: "District of Columbia", stateCode: "DC", region: "Northeast", population: 689545, lat: 38.9072, lng: -77.0369 },

  // Southeast
  { id: "miami", name: "Miami", state: "Florida", stateCode: "FL", region: "Southeast", population: 442241, lat: 25.7617, lng: -80.1918 },
  { id: "atlanta", name: "Atlanta", state: "Georgia", stateCode: "GA", region: "Southeast", population: 498715, lat: 33.7490, lng: -84.3880 },
  { id: "charlotte", name: "Charlotte", state: "North Carolina", stateCode: "NC", region: "Southeast", population: 874579, lat: 35.2271, lng: -80.8431 },
  { id: "tampa", name: "Tampa", state: "Florida", stateCode: "FL", region: "Southeast", population: 399700, lat: 27.9506, lng: -82.4572 },
  { id: "orlando", name: "Orlando", state: "Florida", stateCode: "FL", region: "Southeast", population: 307573, lat: 28.5383, lng: -81.3792 },
  { id: "new-orleans", name: "New Orleans", state: "Louisiana", stateCode: "LA", region: "Southeast", population: 383997, lat: 29.9511, lng: -90.0715 },
  { id: "jacksonville", name: "Jacksonville", state: "Florida", stateCode: "FL", region: "Southeast", population: 949611, lat: 30.3322, lng: -81.6557 },
  { id: "nashville", name: "Nashville", state: "Tennessee", stateCode: "TN", region: "Southeast", population: 689447, lat: 36.1627, lng: -86.7816 },
  { id: "memphis", name: "Memphis", state: "Tennessee", stateCode: "TN", region: "Southeast", population: 633104, lat: 35.1495, lng: -90.0490 },
  { id: "louisville", name: "Louisville", state: "Kentucky", stateCode: "KY", region: "Southeast", population: 633045, lat: 38.2527, lng: -85.7585 },
  { id: "raleigh", name: "Raleigh", state: "North Carolina", stateCode: "NC", region: "Southeast", population: 467665, lat: 35.7796, lng: -78.6382 },
  { id: "richmond", name: "Richmond", state: "Virginia", stateCode: "VA", region: "Southeast", population: 226610, lat: 37.5407, lng: -77.4360 },
  { id: "birmingham", name: "Birmingham", state: "Alabama", stateCode: "AL", region: "Southeast", population: 200733, lat: 33.5207, lng: -86.8025 },
  { id: "charleston", name: "Charleston", state: "South Carolina", stateCode: "SC", region: "Southeast", population: 150227, lat: 32.7765, lng: -79.9311 },
  { id: "savannah", name: "Savannah", state: "Georgia", stateCode: "GA", region: "Southeast", population: 147780, lat: 32.0809, lng: -81.0912 },

  // Midwest
  { id: "chicago", name: "Chicago", state: "Illinois", stateCode: "IL", region: "Midwest", population: 2746388, lat: 41.8781, lng: -87.6298 },
  { id: "detroit", name: "Detroit", state: "Michigan", stateCode: "MI", region: "Midwest", population: 639111, lat: 42.3314, lng: -83.0458 },
  { id: "indianapolis", name: "Indianapolis", state: "Indiana", stateCode: "IN", region: "Midwest", population: 887642, lat: 39.7684, lng: -86.1581 },
  { id: "columbus", name: "Columbus", state: "Ohio", stateCode: "OH", region: "Midwest", population: 905748, lat: 39.9612, lng: -82.9988 },
  { id: "milwaukee", name: "Milwaukee", state: "Wisconsin", stateCode: "WI", region: "Midwest", population: 577222, lat: 43.0389, lng: -87.9065 },
  { id: "cleveland", name: "Cleveland", state: "Ohio", stateCode: "OH", region: "Midwest", population: 372624, lat: 41.4993, lng: -81.6944 },
  { id: "minneapolis", name: "Minneapolis", state: "Minnesota", stateCode: "MN", region: "Midwest", population: 429954, lat: 44.9778, lng: -93.2650 },
  { id: "st-paul", name: "St. Paul", state: "Minnesota", stateCode: "MN", region: "Midwest", population: 311527, lat: 44.9537, lng: -93.0900 },
  { id: "kansas-city-mo", name: "Kansas City", state: "Missouri", stateCode: "MO", region: "Midwest", population: 508090, lat: 39.0997, lng: -94.5786 },
  { id: "st-louis", name: "St. Louis", state: "Missouri", stateCode: "MO", region: "Midwest", population: 301578, lat: 38.6270, lng: -90.1994 },
  { id: "cincinnati", name: "Cincinnati", state: "Ohio", stateCode: "OH", region: "Midwest", population: 309317, lat: 39.1031, lng: -84.5120 },
  { id: "omaha", name: "Omaha", state: "Nebraska", stateCode: "NE", region: "Midwest", population: 486051, lat: 41.2565, lng: -95.9345 },
  { id: "des-moines", name: "Des Moines", state: "Iowa", stateCode: "IA", region: "Midwest", population: 214237, lat: 41.5868, lng: -93.6250 },
  { id: "madison", name: "Madison", state: "Wisconsin", stateCode: "WI", region: "Midwest", population: 269840, lat: 43.0731, lng: -89.4012 },
  { id: "grand-rapids", name: "Grand Rapids", state: "Michigan", stateCode: "MI", region: "Midwest", population: 198917, lat: 42.9634, lng: -85.6681 },

  // Southwest
  { id: "houston", name: "Houston", state: "Texas", stateCode: "TX", region: "Southwest", population: 2304580, lat: 29.7604, lng: -95.3698 },
  { id: "san-antonio", name: "San Antonio", state: "Texas", stateCode: "TX", region: "Southwest", population: 1547253, lat: 29.4241, lng: -98.4936 },
  { id: "dallas", name: "Dallas", state: "Texas", stateCode: "TX", region: "Southwest", population: 1304379, lat: 32.7767, lng: -96.7970 },
  { id: "austin", name: "Austin", state: "Texas", stateCode: "TX", region: "Southwest", population: 978908, lat: 30.2672, lng: -97.7431 },
  { id: "fort-worth", name: "Fort Worth", state: "Texas", stateCode: "TX", region: "Southwest", population: 918915, lat: 32.7555, lng: -97.3308 },
  { id: "phoenix", name: "Phoenix", state: "Arizona", stateCode: "AZ", region: "Southwest", population: 1608139, lat: 33.4484, lng: -112.0740 },
  { id: "tucson", name: "Tucson", state: "Arizona", stateCode: "AZ", region: "Southwest", population: 542629, lat: 32.2226, lng: -110.9747 },
  { id: "albuquerque", name: "Albuquerque", state: "New Mexico", stateCode: "NM", region: "Southwest", population: 564559, lat: 35.0844, lng: -106.6504 },
  { id: "el-paso", name: "El Paso", state: "Texas", stateCode: "TX", region: "Southwest", population: 678815, lat: 31.7619, lng: -106.4850 },
  { id: "santa-fe", name: "Santa Fe", state: "New Mexico", stateCode: "NM", region: "Southwest", population: 87505, lat: 35.6870, lng: -105.9378 },
  { id: "las-vegas", name: "Las Vegas", state: "Nevada", stateCode: "NV", region: "Southwest", population: 641903, lat: 36.1699, lng: -115.1398 },
  { id: "oklahoma-city", name: "Oklahoma City", state: "Oklahoma", stateCode: "OK", region: "Southwest", population: 681054, lat: 35.4676, lng: -97.5164 },
  { id: "tulsa", name: "Tulsa", state: "Oklahoma", stateCode: "OK", region: "Southwest", population: 413066, lat: 36.1540, lng: -95.9928 },

  // West
  { id: "los-angeles", name: "Los Angeles", state: "California", stateCode: "CA", region: "West", population: 3898747, lat: 34.0522, lng: -118.2437 },
  { id: "san-diego", name: "San Diego", state: "California", stateCode: "CA", region: "West", population: 1386932, lat: 32.7157, lng: -117.1611 },
  { id: "san-jose", name: "San Jose", state: "California", stateCode: "CA", region: "West", population: 1013240, lat: 37.3382, lng: -121.8863 },
  { id: "san-francisco", name: "San Francisco", state: "California", stateCode: "CA", region: "West", population: 873965, lat: 37.7749, lng: -122.4194 },
  { id: "seattle", name: "Seattle", state: "Washington", stateCode: "WA", region: "West", population: 737015, lat: 47.6062, lng: -122.3321 },
  { id: "denver", name: "Denver", state: "Colorado", stateCode: "CO", region: "West", population: 715522, lat: 39.7392, lng: -104.9903 },
  { id: "portland", name: "Portland", state: "Oregon", stateCode: "OR", region: "West", population: 652503, lat: 45.5152, lng: -122.6784 },
  { id: "sacramento", name: "Sacramento", state: "California", stateCode: "CA", region: "West", population: 524943, lat: 38.5816, lng: -121.4944 },
  { id: "oakland", name: "Oakland", state: "California", stateCode: "CA", region: "West", population: 433031, lat: 37.8044, lng: -122.2712 },
  { id: "fresno", name: "Fresno", state: "California", stateCode: "CA", region: "West", population: 542107, lat: 36.7378, lng: -119.7871 },
  { id: "long-beach", name: "Long Beach", state: "California", stateCode: "CA", region: "West", population: 466742, lat: 33.7701, lng: -118.1937 },
  { id: "colorado-springs", name: "Colorado Springs", state: "Colorado", stateCode: "CO", region: "West", population: 478961, lat: 38.8339, lng: -104.8214 },
  { id: "salt-lake-city", name: "Salt Lake City", state: "Utah", stateCode: "UT", region: "West", population: 199723, lat: 40.7608, lng: -111.8910 },
  { id: "boise", name: "Boise", state: "Idaho", stateCode: "ID", region: "West", population: 235684, lat: 43.6150, lng: -116.2023 },
  { id: "spokane", name: "Spokane", state: "Washington", stateCode: "WA", region: "West", population: 228989, lat: 47.6588, lng: -117.4260 },
  { id: "reno", name: "Reno", state: "Nevada", stateCode: "NV", region: "West", population: 264165, lat: 39.5296, lng: -119.8138 },

  // Alaska & Hawaii
  { id: "anchorage", name: "Anchorage", state: "Alaska", stateCode: "AK", region: "Alaska", population: 291247, lat: 61.2181, lng: -149.9003 },
  { id: "fairbanks", name: "Fairbanks", state: "Alaska", stateCode: "AK", region: "Alaska", population: 32515, lat: 64.8378, lng: -147.7164 },
  { id: "juneau", name: "Juneau", state: "Alaska", stateCode: "AK", region: "Alaska", population: 32255, lat: 58.3019, lng: -134.4197 },
  { id: "honolulu", name: "Honolulu", state: "Hawaii", stateCode: "HI", region: "Pacific", population: 350964, lat: 21.3069, lng: -157.8583 },
];

export const usCityRegions = ["Northeast", "Southeast", "Midwest", "Southwest", "West", "Alaska", "Pacific"];

export const getUSCitiesByRegion = (region: string) =>
  usCities.filter(c => c.region === region);

export const getUSCitiesByState = (stateCode: string) =>
  usCities.filter(c => c.stateCode === stateCode);

export const getTotalUSCities = () => usCities.length;
