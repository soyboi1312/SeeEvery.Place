export interface WeirdAmericana {
  id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  lat: number;
  lng: number;
  year?: number; // year built/established
}

// Quirky roadside attractions, unusual museums, and weird landmarks across America
export const weirdAmericana: WeirdAmericana[] = [
  // Giant Objects & Statues
  { id: "cadillac-ranch", name: "Cadillac Ranch", city: "Amarillo", state: "Texas", region: "Southwest", lat: 35.1872, lng: -101.9871, year: 1974 },
  { id: "carhenge", name: "Carhenge", city: "Alliance", state: "Nebraska", region: "Midwest", lat: 42.1425, lng: -102.8578, year: 1987 },
  { id: "largest-twine-ball-ks", name: "World's Largest Ball of Twine", city: "Cawker City", state: "Kansas", region: "Midwest", lat: 39.5092, lng: -98.4336, year: 1953 },
  { id: "worlds-largest-ball-paint", name: "World's Largest Ball of Paint", city: "Alexandria", state: "Indiana", region: "Midwest", lat: 40.2628, lng: -85.6767, year: 1977 },
  { id: "lucy-elephant", name: "Lucy the Elephant", city: "Margate City", state: "New Jersey", region: "Northeast", lat: 39.3206, lng: -74.5142, year: 1881 },
  { id: "corn-palace", name: "Corn Palace", city: "Mitchell", state: "South Dakota", region: "Midwest", lat: 43.7094, lng: -98.0292, year: 1892 },
  { id: "biggest-ball-twine-mn", name: "World's Largest Twine Ball by One Man", city: "Darwin", state: "Minnesota", region: "Midwest", lat: 45.0975, lng: -94.4108, year: 1950 },
  { id: "worlds-largest-buffalo", name: "World's Largest Buffalo", city: "Jamestown", state: "North Dakota", region: "Midwest", lat: 46.8922, lng: -98.6850, year: 1959 },
  { id: "blue-whale", name: "Blue Whale of Catoosa", city: "Catoosa", state: "Oklahoma", region: "Southwest", lat: 36.1917, lng: -95.7383, year: 1972 },
  { id: "worlds-largest-rocking-chair", name: "World's Largest Rocking Chair", city: "Casey", state: "Illinois", region: "Midwest", lat: 39.2989, lng: -87.9933, year: 2015 },
  { id: "jolly-green-giant", name: "Jolly Green Giant Statue", city: "Blue Earth", state: "Minnesota", region: "Midwest", lat: 43.6372, lng: -94.0983, year: 1979 },
  { id: "world-largest-pecan", name: "World's Largest Pecan", city: "Seguin", state: "Texas", region: "Southwest", lat: 29.5689, lng: -97.9650, year: 1962 },
  { id: "worlds-largest-ketchup", name: "World's Largest Catsup Bottle", city: "Collinsville", state: "Illinois", region: "Midwest", lat: 38.6728, lng: -89.9842, year: 1949 },
  { id: "paul-bunyan-babe", name: "Paul Bunyan and Babe the Blue Ox", city: "Bemidji", state: "Minnesota", region: "Midwest", lat: 47.4744, lng: -94.8797, year: 1937 },
  { id: "enchanted-highway", name: "Enchanted Highway Sculptures", city: "Regent", state: "North Dakota", region: "Midwest", lat: 46.4261, lng: -102.5542, year: 1993 },

  // Unusual Museums
  { id: "ufo-museum", name: "International UFO Museum", city: "Roswell", state: "New Mexico", region: "Southwest", lat: 33.3943, lng: -104.5231, year: 1991 },
  { id: "banana-museum", name: "International Banana Museum", city: "Mecca", state: "California", region: "West", lat: 33.5694, lng: -116.0747, year: 1976 },
  { id: "toilet-seat-museum", name: "Toilet Seat Art Museum", city: "San Antonio", state: "Texas", region: "Southwest", lat: 29.4614, lng: -98.4647, year: 1992 },
  { id: "spam-museum", name: "SPAM Museum", city: "Austin", state: "Minnesota", region: "Midwest", lat: 43.6683, lng: -92.9747, year: 2001 },
  { id: "mustard-museum", name: "National Mustard Museum", city: "Middleton", state: "Wisconsin", region: "Midwest", lat: 43.0972, lng: -89.5042, year: 1992 },
  { id: "unclaimed-baggage", name: "Unclaimed Baggage Center", city: "Scottsboro", state: "Alabama", region: "South", lat: 34.6722, lng: -86.0344, year: 1970 },
  { id: "barbed-wire-museum", name: "Kansas Barbed Wire Museum", city: "La Crosse", state: "Kansas", region: "Midwest", lat: 38.5314, lng: -99.3086, year: 1971 },
  { id: "pez-museum", name: "PEZ Visitor Center", city: "Orange", state: "Connecticut", region: "Northeast", lat: 41.2856, lng: -73.0258, year: 2011 },
  { id: "mutter-museum", name: "Mütter Museum", city: "Philadelphia", state: "Pennsylvania", region: "Northeast", lat: 39.9533, lng: -75.1764, year: 1858 },
  { id: "creation-museum", name: "Creation Museum", city: "Petersburg", state: "Kentucky", region: "South", lat: 39.0831, lng: -84.7828, year: 2007 },
  { id: "neon-museum", name: "Neon Museum", city: "Las Vegas", state: "Nevada", region: "West", lat: 36.1767, lng: -115.1350, year: 1996 },
  { id: "jello-museum", name: "Jell-O Gallery", city: "Le Roy", state: "New York", region: "Northeast", lat: 42.9811, lng: -77.9856, year: 1997 },
  { id: "burlingame-museum", name: "Burlingame Museum of PEZ Memorabilia", city: "Burlingame", state: "California", region: "West", lat: 37.5844, lng: -122.3658, year: 1995 },

  // Strange Architecture & Art
  { id: "winchester-house", name: "Winchester Mystery House", city: "San Jose", state: "California", region: "West", lat: 37.3186, lng: -121.9508, year: 1884 },
  { id: "salvation-mountain", name: "Salvation Mountain", city: "Niland", state: "California", region: "West", lat: 33.2542, lng: -115.4722, year: 1984 },
  { id: "coral-castle", name: "Coral Castle", city: "Homestead", state: "Florida", region: "South", lat: 25.5003, lng: -80.4447, year: 1923 },
  { id: "house-rock", name: "House on the Rock", city: "Spring Green", state: "Wisconsin", region: "Midwest", lat: 43.0928, lng: -90.1358, year: 1945 },
  { id: "bishops-castle", name: "Bishop Castle", city: "Rye", state: "Colorado", region: "West", lat: 37.9692, lng: -104.9942, year: 1969 },
  { id: "garden-of-eden", name: "Garden of Eden", city: "Lucas", state: "Kansas", region: "Midwest", lat: 39.0583, lng: -98.5364, year: 1907 },
  { id: "shoe-house", name: "Haines Shoe House", city: "Hellam", state: "Pennsylvania", region: "Northeast", lat: 40.0178, lng: -76.5728, year: 1948 },
  { id: "paper-house", name: "Paper House", city: "Rockport", state: "Massachusetts", region: "Northeast", lat: 42.6639, lng: -70.6175, year: 1922 },
  { id: "forestiere-gardens", name: "Forestiere Underground Gardens", city: "Fresno", state: "California", region: "West", lat: 36.8042, lng: -119.8242, year: 1906 },
  { id: "city-of-rocks", name: "City of Rocks", city: "Deming", state: "New Mexico", region: "Southwest", lat: 32.5500, lng: -107.9833, year: 1952 },

  // Quirky Landmarks
  { id: "wall-drug", name: "Wall Drug Store", city: "Wall", state: "South Dakota", region: "Midwest", lat: 43.9928, lng: -102.2411, year: 1931 },
  { id: "south-of-border", name: "South of the Border", city: "Dillon", state: "South Carolina", region: "South", lat: 34.4283, lng: -79.3617, year: 1950 },
  { id: "worlds-largest-truck-stop", name: "Iowa 80 Truckstop", city: "Walcott", state: "Iowa", region: "Midwest", lat: 41.5928, lng: -90.7708, year: 1964 },
  { id: "meow-wolf", name: "Meow Wolf House of Eternal Return", city: "Santa Fe", state: "New Mexico", region: "Southwest", lat: 35.6606, lng: -105.9961, year: 2016 },
  { id: "thing", name: "The Thing?", city: "Dragoon", state: "Arizona", region: "Southwest", lat: 32.0253, lng: -110.0472, year: 1965 },
  { id: "foamhenge", name: "Foamhenge", city: "Natural Bridge", state: "Virginia", region: "South", lat: 37.6283, lng: -79.5433, year: 2004 },
  { id: "dinosaur-world-ky", name: "Dinosaur World", city: "Cave City", state: "Kentucky", region: "South", lat: 37.1292, lng: -85.9350, year: 2004 },
  { id: "leaning-tower-niles", name: "Leaning Tower of Niles", city: "Niles", state: "Illinois", region: "Midwest", lat: 42.0122, lng: -87.8003, year: 1934 },
  { id: "london-bridge-az", name: "London Bridge", city: "Lake Havasu City", state: "Arizona", region: "Southwest", lat: 34.4717, lng: -114.3472, year: 1971 },
  { id: "gum-wall", name: "The Gum Wall", city: "Seattle", state: "Washington", region: "West", lat: 47.6083, lng: -122.3403, year: 1993 },
  { id: "area-51-mailbox", name: "The Black Mailbox (Area 51)", city: "Alamo", state: "Nevada", region: "West", lat: 37.4538, lng: -115.4827, year: 1996 },

  // Desert & Nature Oddities
  { id: "elmer-bottle-tree", name: "Elmer's Bottle Tree Ranch", city: "Oro Grande", state: "California", region: "West", lat: 34.6094, lng: -117.3306, year: 2000 },
  { id: "international-car-forest", name: "International Car Forest of the Last Church", city: "Goldfield", state: "Nevada", region: "West", lat: 37.7083, lng: -117.2361, year: 2002 },
  { id: "mystery-spot", name: "Mystery Spot", city: "Santa Cruz", state: "California", region: "West", lat: 37.0153, lng: -122.0017, year: 1939 },
  { id: "oregon-vortex", name: "Oregon Vortex", city: "Gold Hill", state: "Oregon", region: "West", lat: 42.4931, lng: -123.0836, year: 1930 },
  { id: "gravity-hill", name: "Gravity Hill", city: "Bedford", state: "Pennsylvania", region: "Northeast", lat: 40.0264, lng: -78.4767 },
  { id: "bonne-terre-mine", name: "Bonne Terre Mine", city: "Bonne Terre", state: "Missouri", region: "Midwest", lat: 37.9231, lng: -90.5553, year: 1864 },
];

export const weirdAmericanaRegions = ["West", "Southwest", "Midwest", "South", "Northeast"];

export const getWeirdAmericanaByRegion = (region: string) =>
  weirdAmericana.filter(w => w.region === region);

export const getTotalWeirdAmericana = () => weirdAmericana.length;
