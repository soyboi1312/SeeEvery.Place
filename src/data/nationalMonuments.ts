export interface NationalMonument {
  id: string;
  name: string;
  state: string;
  region: string;
  lat: number;
  lng: number;
}

// All 138 US National Monuments
export const nationalMonuments: NationalMonument[] = [
  // =====================
  // ALASKA
  // =====================
  { id: "nm-admiralty-island", name: "Admiralty Island", state: "AK", region: "Alaska", lat: 57.6400, lng: -134.3500 },
  { id: "nm-aleutian-islands-wwii", name: "Aleutian Islands World War II", state: "AK", region: "Alaska", lat: 52.8700, lng: 173.1600 },
  { id: "nm-aniakchak", name: "Aniakchak", state: "AK", region: "Alaska", lat: 56.9000, lng: -158.1500 },
  { id: "nm-cape-krusenstern", name: "Cape Krusenstern", state: "AK", region: "Alaska", lat: 67.4100, lng: -163.5000 },
  { id: "nm-misty-fjords", name: "Misty Fjords", state: "AK", region: "Alaska", lat: 55.6200, lng: -130.6100 },

  // =====================
  // WEST - Arizona
  // =====================
  { id: "nm-agua-fria", name: "Agua Fria", state: "AZ", region: "West", lat: 34.1500, lng: -112.0800 },
  { id: "nm-baaj-nwaavjo", name: "Baaj Nwaavjo I'tah Kukveni – Ancestral Footprints of the Grand Canyon", state: "AZ", region: "West", lat: 35.5400, lng: -112.0000 },
  { id: "nm-canyon-de-chelly", name: "Canyon de Chelly", state: "AZ", region: "West", lat: 36.1300, lng: -109.4700 },
  { id: "nm-casa-grande-ruins", name: "Casa Grande Ruins", state: "AZ", region: "West", lat: 32.9900, lng: -111.5400 },
  { id: "nm-chiricahua", name: "Chiricahua", state: "AZ", region: "West", lat: 32.0200, lng: -109.3500 },
  { id: "nm-grand-canyon-parashant", name: "Grand Canyon-Parashant", state: "AZ", region: "West", lat: 36.4000, lng: -113.7000 },
  { id: "nm-hohokam-pima", name: "Hohokam Pima", state: "AZ", region: "West", lat: 33.1900, lng: -111.9100 },
  { id: "nm-ironwood-forest", name: "Ironwood Forest", state: "AZ", region: "West", lat: 32.4600, lng: -111.5700 },
  { id: "nm-montezuma-castle", name: "Montezuma Castle", state: "AZ", region: "West", lat: 34.6100, lng: -111.8400 },
  { id: "nm-navajo", name: "Navajo", state: "AZ", region: "West", lat: 36.6800, lng: -110.5300 },
  { id: "nm-organ-pipe-cactus", name: "Organ Pipe Cactus", state: "AZ", region: "West", lat: 32.0400, lng: -112.8600 },
  { id: "nm-pipe-spring", name: "Pipe Spring", state: "AZ", region: "West", lat: 36.8600, lng: -112.7400 },
  { id: "nm-sonoran-desert", name: "Sonoran Desert", state: "AZ", region: "West", lat: 33.0000, lng: -112.4600 },
  { id: "nm-sunset-crater-volcano", name: "Sunset Crater Volcano", state: "AZ", region: "West", lat: 35.3600, lng: -111.5000 },
  { id: "nm-tonto", name: "Tonto", state: "AZ", region: "West", lat: 33.6500, lng: -111.0900 },
  { id: "nm-tuzigoot", name: "Tuzigoot", state: "AZ", region: "West", lat: 34.7900, lng: -112.0400 },
  { id: "nm-vermilion-cliffs", name: "Vermilion Cliffs", state: "AZ", region: "West", lat: 36.8100, lng: -111.7400 },
  { id: "nm-walnut-canyon", name: "Walnut Canyon", state: "AZ", region: "West", lat: 35.1700, lng: -111.5100 },
  { id: "nm-wupatki", name: "Wupatki", state: "AZ", region: "West", lat: 35.5200, lng: -111.3700 },

  // =====================
  // WEST - California
  // =====================
  { id: "nm-berryessa-snow-mountain", name: "Berryessa Snow Mountain", state: "CA", region: "West", lat: 39.2200, lng: -122.7700 },
  { id: "nm-cabrillo", name: "Cabrillo", state: "CA", region: "West", lat: 32.6700, lng: -117.2400 },
  { id: "nm-california-coastal", name: "California Coastal", state: "CA", region: "West", lat: 36.8900, lng: -122.1800 },
  { id: "nm-carrizo-plain", name: "Carrizo Plain", state: "CA", region: "West", lat: 35.1600, lng: -119.7500 },
  { id: "nm-castle-mountains", name: "Castle Mountains", state: "CA", region: "West", lat: 35.2500, lng: -115.1100 },
  { id: "nm-cesar-chavez", name: "César E. Chávez", state: "CA", region: "West", lat: 35.2273, lng: -118.5614 },
  { id: "nm-chuckwalla", name: "Chuckwalla", state: "CA", region: "West", lat: 33.6000, lng: -115.3000 },
  { id: "nm-devils-postpile", name: "Devils Postpile", state: "CA", region: "West", lat: 37.5000, lng: -119.0800 },
  { id: "nm-fort-ord", name: "Fort Ord", state: "CA", region: "West", lat: 36.6392, lng: -121.7353 },
  { id: "nm-giant-sequoia", name: "Giant Sequoia", state: "CA", region: "West", lat: 36.0400, lng: -118.5000 },
  { id: "nm-lava-beds", name: "Lava Beds", state: "CA", region: "West", lat: 41.7100, lng: -121.5100 },
  { id: "nm-mojave-trails", name: "Mojave Trails", state: "CA", region: "West", lat: 34.6000, lng: -116.0000 },
  { id: "nm-muir-woods", name: "Muir Woods", state: "CA", region: "West", lat: 37.8900, lng: -122.5800 },
  { id: "nm-saint-francis-dam", name: "Saint Francis Dam Disaster", state: "CA", region: "West", lat: 34.5500, lng: -118.5100 },
  { id: "nm-san-gabriel-mountains", name: "San Gabriel Mountains", state: "CA", region: "West", lat: 34.2200, lng: -118.0600 },
  { id: "nm-sand-to-snow", name: "Sand to Snow", state: "CA", region: "West", lat: 34.0800, lng: -116.6800 },
  { id: "nm-santa-rosa-san-jacinto", name: "Santa Rosa and San Jacinto Mountains", state: "CA", region: "West", lat: 33.8000, lng: -116.7000 },
  { id: "nm-sattitla-highlands", name: "Sáttítla Highlands", state: "CA", region: "West", lat: 41.5000, lng: -121.5000 },
  { id: "nm-tule-lake", name: "Tule Lake", state: "CA", region: "West", lat: 41.8900, lng: -121.3700 },

  // =====================
  // WEST - Colorado
  // =====================
  { id: "nm-browns-canyon", name: "Browns Canyon", state: "CO", region: "West", lat: 38.6150, lng: -106.0590 },
  { id: "nm-camp-hale", name: "Camp Hale-Continental Divide", state: "CO", region: "West", lat: 39.4400, lng: -106.3700 },
  { id: "nm-canyons-of-ancients", name: "Canyons of the Ancients", state: "CO", region: "West", lat: 37.3700, lng: -109.0000 },
  { id: "nm-chimney-rock", name: "Chimney Rock", state: "CO", region: "West", lat: 37.1917, lng: -107.3064 },
  { id: "nm-colorado", name: "Colorado", state: "CO", region: "West", lat: 39.0400, lng: -108.6900 },
  { id: "nm-florissant-fossil-beds", name: "Florissant Fossil Beds", state: "CO", region: "West", lat: 38.9200, lng: -105.2700 },
  { id: "nm-hovenweep", name: "Hovenweep", state: "CO/UT", region: "West", lat: 37.3800, lng: -109.0800 },
  { id: "nm-yucca-house", name: "Yucca House", state: "CO", region: "West", lat: 37.2500, lng: -108.6900 },

  // =====================
  // WEST - Hawaii
  // =====================
  { id: "nm-papahanaumokuakea", name: "Papahānaumokuākea Marine", state: "HI", region: "West", lat: 25.7000, lng: -171.7300 },

  // =====================
  // WEST - Idaho
  // =====================
  { id: "nm-craters-of-moon", name: "Craters of the Moon", state: "ID", region: "West", lat: 43.4200, lng: -113.5200 },
  { id: "nm-hagerman-fossil-beds", name: "Hagerman Fossil Beds", state: "ID", region: "West", lat: 42.7900, lng: -114.9500 },

  // =====================
  // WEST - Montana
  // =====================
  { id: "nm-little-bighorn", name: "Little Bighorn Battlefield", state: "MT", region: "West", lat: 45.5700, lng: -107.4300 },
  { id: "nm-pompeys-pillar", name: "Pompeys Pillar", state: "MT", region: "West", lat: 45.9900, lng: -108.0010 },
  { id: "nm-upper-missouri-breaks", name: "Upper Missouri River Breaks", state: "MT", region: "West", lat: 47.7800, lng: -109.0200 },

  // =====================
  // WEST - Nevada
  // =====================
  { id: "nm-avi-kwa-ame", name: "Avi Kwa Ame", state: "NV", region: "West", lat: 35.4000, lng: -115.0000 },
  { id: "nm-basin-and-range", name: "Basin and Range", state: "NV", region: "West", lat: 37.9000, lng: -115.4000 },
  { id: "nm-gold-butte", name: "Gold Butte", state: "NV", region: "West", lat: 36.2810, lng: -114.2010 },
  { id: "nm-tule-springs-fossil", name: "Tule Springs Fossil Beds", state: "NV", region: "West", lat: 36.3200, lng: -115.2700 },

  // =====================
  // WEST - Oregon
  // =====================
  { id: "nm-cascade-siskiyou", name: "Cascade-Siskiyou", state: "OR/CA", region: "West", lat: 42.0800, lng: -122.4600 },
  { id: "nm-john-day-fossil-beds", name: "John Day Fossil Beds", state: "OR", region: "West", lat: 44.6700, lng: -120.0500 },
  { id: "nm-newberry-volcanic", name: "Newberry Volcanic", state: "OR", region: "West", lat: 43.6900, lng: -121.2500 },
  { id: "nm-oregon-caves", name: "Oregon Caves", state: "OR", region: "West", lat: 42.1000, lng: -123.4100 },

  // =====================
  // WEST - Utah
  // =====================
  { id: "nm-bears-ears", name: "Bears Ears", state: "UT", region: "West", lat: 37.6300, lng: -109.8600 },
  { id: "nm-cedar-breaks", name: "Cedar Breaks", state: "UT", region: "West", lat: 37.6300, lng: -112.8500 },
  { id: "nm-dinosaur", name: "Dinosaur", state: "UT/CO", region: "West", lat: 40.5300, lng: -108.9800 },
  { id: "nm-grand-staircase-escalante", name: "Grand Staircase-Escalante", state: "UT", region: "West", lat: 37.4000, lng: -111.6800 },
  { id: "nm-jurassic", name: "Jurassic", state: "UT", region: "West", lat: 39.3200, lng: -110.6900 },
  { id: "nm-natural-bridges", name: "Natural Bridges", state: "UT", region: "West", lat: 37.5800, lng: -110.0000 },
  { id: "nm-rainbow-bridge", name: "Rainbow Bridge", state: "UT", region: "West", lat: 37.0800, lng: -110.9600 },
  { id: "nm-timpanogos-cave", name: "Timpanogos Cave", state: "UT", region: "West", lat: 40.4400, lng: -111.7100 },

  // =====================
  // WEST - Washington
  // =====================
  { id: "nm-hanford-reach", name: "Hanford Reach", state: "WA", region: "West", lat: 46.4800, lng: -119.5300 },
  { id: "nm-mount-st-helens", name: "Mount St. Helens Volcanic", state: "WA", region: "West", lat: 46.2300, lng: -122.1800 },
  { id: "nm-san-juan-islands", name: "San Juan Islands", state: "WA", region: "West", lat: 48.5300, lng: -123.0300 },

  // =====================
  // WEST - Wyoming
  // =====================
  { id: "nm-devils-tower", name: "Devils Tower", state: "WY", region: "West", lat: 44.5900, lng: -104.7200 },
  { id: "nm-fossil-butte", name: "Fossil Butte", state: "WY", region: "West", lat: 41.8600, lng: -110.7700 },

  // =====================
  // SOUTHWEST - New Mexico
  // =====================
  { id: "nm-aztec-ruins", name: "Aztec Ruins", state: "NM", region: "Southwest", lat: 36.8300, lng: -107.0000 },
  { id: "nm-bandelier", name: "Bandelier", state: "NM", region: "Southwest", lat: 35.7800, lng: -106.2700 },
  { id: "nm-capulin-volcano", name: "Capulin Volcano", state: "NM", region: "Southwest", lat: 36.7900, lng: -103.9600 },
  { id: "nm-el-malpais", name: "El Malpais", state: "NM", region: "Southwest", lat: 34.8800, lng: -108.0500 },
  { id: "nm-el-morro", name: "El Morro", state: "NM", region: "Southwest", lat: 35.0400, lng: -108.3500 },
  { id: "nm-fort-union", name: "Fort Union", state: "NM", region: "Southwest", lat: 35.9250, lng: -105.0090 },
  { id: "nm-gila-cliff-dwellings", name: "Gila Cliff Dwellings", state: "NM", region: "Southwest", lat: 33.2400, lng: -108.2800 },
  { id: "nm-kasha-katuwe", name: "Kasha-Katuwe Tent Rocks", state: "NM", region: "Southwest", lat: 35.6700, lng: -106.4200 },
  { id: "nm-organ-mountains", name: "Organ Mountains-Desert Peaks", state: "NM", region: "Southwest", lat: 32.3000, lng: -106.5500 },
  { id: "nm-petroglyph", name: "Petroglyph", state: "NM", region: "Southwest", lat: 35.1600, lng: -106.7600 },
  { id: "nm-prehistoric-trackways", name: "Prehistoric Trackways", state: "NM", region: "Southwest", lat: 32.3500, lng: -106.9000 },
  { id: "nm-rio-grande-del-norte", name: "Río Grande del Norte", state: "NM", region: "Southwest", lat: 36.6667, lng: -105.7000 },
  { id: "nm-salinas-pueblo-missions", name: "Salinas Pueblo Missions", state: "NM", region: "Southwest", lat: 34.2600, lng: -106.0600 },

  // =====================
  // SOUTHWEST - Texas
  // =====================
  { id: "nm-alibates-flint", name: "Alibates Flint Quarries", state: "TX", region: "Southwest", lat: 35.5700, lng: -101.6700 },
  { id: "nm-castner-range", name: "Castner Range", state: "TX", region: "Southwest", lat: 31.9000, lng: -106.5000 },
  { id: "nm-military-working-dog", name: "Military Working Dog Teams", state: "TX", region: "Southwest", lat: 29.3900, lng: -98.6170 },
  { id: "nm-waco-mammoth", name: "Waco Mammoth", state: "TX", region: "Southwest", lat: 31.6060, lng: -97.1740 },

  // =====================
  // MIDWEST - Illinois
  // =====================
  { id: "nm-emmett-till", name: "Emmett Till and Mamie Till-Mobley", state: "IL/MS", region: "Midwest", lat: 41.8140, lng: -87.6169 },
  { id: "nm-springfield-race-riot", name: "Springfield 1908 Race Riot", state: "IL", region: "Midwest", lat: 39.8040, lng: -89.6410 },

  // =====================
  // MIDWEST - Iowa
  // =====================
  { id: "nm-effigy-mounds", name: "Effigy Mounds", state: "IA", region: "Midwest", lat: 43.0900, lng: -91.1900 },

  // =====================
  // MIDWEST - Minnesota
  // =====================
  { id: "nm-grand-portage", name: "Grand Portage", state: "MN", region: "Midwest", lat: 47.9600, lng: -89.6800 },
  { id: "nm-pipestone", name: "Pipestone", state: "MN", region: "Midwest", lat: 44.0100, lng: -96.3300 },

  // =====================
  // MIDWEST - Missouri
  // =====================
  { id: "nm-george-washington-carver", name: "George Washington Carver", state: "MO", region: "Midwest", lat: 36.9860, lng: -94.3540 },

  // =====================
  // MIDWEST - Nebraska
  // =====================
  { id: "nm-agate-fossil-beds", name: "Agate Fossil Beds", state: "NE", region: "Midwest", lat: 42.4160, lng: -103.7280 },
  { id: "nm-scotts-bluff", name: "Scotts Bluff", state: "NE", region: "Midwest", lat: 41.8300, lng: -103.7000 },

  // =====================
  // MIDWEST - Ohio
  // =====================
  { id: "nm-charles-young", name: "Charles Young Buffalo Soldiers", state: "OH", region: "Midwest", lat: 39.7072, lng: -83.8903 },

  // =====================
  // MIDWEST - South Dakota
  // =====================
  { id: "nm-jewel-cave", name: "Jewel Cave", state: "SD", region: "Midwest", lat: 43.7300, lng: -103.8300 },

  // =====================
  // SOUTHEAST - Alabama
  // =====================
  { id: "nm-birmingham-civil-rights", name: "Birmingham Civil Rights", state: "AL", region: "Southeast", lat: 33.5130, lng: -86.8150 },
  { id: "nm-freedom-riders", name: "Freedom Riders", state: "AL", region: "Southeast", lat: 33.6580, lng: -85.8310 },
  { id: "nm-russell-cave", name: "Russell Cave", state: "AL", region: "Southeast", lat: 34.9700, lng: -85.8000 },

  // =====================
  // SOUTHEAST - Florida
  // =====================
  { id: "nm-castillo-san-marcos", name: "Castillo de San Marcos", state: "FL", region: "Southeast", lat: 29.8980, lng: -81.3110 },
  { id: "nm-fort-matanzas", name: "Fort Matanzas", state: "FL", region: "Southeast", lat: 29.7150, lng: -81.2390 },

  // =====================
  // SOUTHEAST - Georgia
  // =====================
  { id: "nm-fort-frederica", name: "Fort Frederica", state: "GA", region: "Southeast", lat: 31.2240, lng: -81.3930 },
  { id: "nm-fort-pulaski", name: "Fort Pulaski", state: "GA", region: "Southeast", lat: 32.0270, lng: -80.8900 },

  // =====================
  // SOUTHEAST - Kentucky
  // =====================
  { id: "nm-camp-nelson", name: "Camp Nelson", state: "KY", region: "Southeast", lat: 37.7800, lng: -84.6000 },
  { id: "nm-mill-springs-battlefield", name: "Mill Springs Battlefield", state: "KY", region: "Southeast", lat: 37.0700, lng: -84.7400 },

  // =====================
  // SOUTHEAST - Louisiana
  // =====================
  { id: "nm-poverty-point", name: "Poverty Point", state: "LA", region: "Southeast", lat: 32.6300, lng: -91.4100 },

  // =====================
  // SOUTHEAST - Maryland
  // =====================
  { id: "nm-fort-mchenry", name: "Fort McHenry", state: "MD", region: "Southeast", lat: 39.2630, lng: -76.5790 },
  { id: "nm-harriet-tubman", name: "Harriet Tubman Underground Railroad", state: "MD", region: "Southeast", lat: 38.4483, lng: -76.1387 },

  // =====================
  // SOUTHEAST - Mississippi
  // =====================
  { id: "nm-medgar-myrlie-evers", name: "Medgar and Myrlie Evers Home", state: "MS", region: "Southeast", lat: 32.3410, lng: -90.2130 },

  // =====================
  // SOUTHEAST - Virginia
  // =====================
  { id: "nm-booker-t-washington", name: "Booker T. Washington", state: "VA", region: "Southeast", lat: 37.1230, lng: -79.7660 },
  { id: "nm-fort-monroe", name: "Fort Monroe", state: "VA", region: "Southeast", lat: 37.0040, lng: -76.3080 },
  { id: "nm-george-washington-birthplace", name: "George Washington Birthplace", state: "VA", region: "Southeast", lat: 38.1861, lng: -76.9305 },

  // =====================
  // NORTHEAST - Washington DC
  // =====================
  { id: "nm-belmont-paul", name: "Belmont-Paul Women's Equality", state: "DC", region: "Northeast", lat: 38.8900, lng: -77.0000 },
  { id: "nm-president-lincoln-cottage", name: "President Lincoln and Soldiers' Home", state: "DC", region: "Northeast", lat: 38.9416, lng: -77.0117 },

  // =====================
  // NORTHEAST - Maine
  // =====================
  { id: "nm-frances-perkins", name: "Frances Perkins", state: "ME", region: "Northeast", lat: 44.0050, lng: -69.5560 },
  { id: "nm-katahdin-woods-waters", name: "Katahdin Woods and Waters", state: "ME", region: "Northeast", lat: 45.9700, lng: -68.6200 },

  // =====================
  // NORTHEAST - New York
  // =====================
  { id: "nm-african-burial-ground", name: "African Burial Ground", state: "NY", region: "Northeast", lat: 40.7144, lng: -74.0042 },
  { id: "nm-castle-clinton", name: "Castle Clinton", state: "NY", region: "Northeast", lat: 40.7036, lng: -74.0169 },
  { id: "nm-fort-stanwix", name: "Fort Stanwix", state: "NY", region: "Northeast", lat: 43.2180, lng: -75.4590 },
  { id: "nm-governors-island", name: "Governors Island", state: "NY", region: "Northeast", lat: 40.6910, lng: -74.0160 },
  { id: "nm-statue-of-liberty", name: "Statue of Liberty", state: "NY/NJ", region: "Northeast", lat: 40.6900, lng: -74.0400 },
  { id: "nm-stonewall", name: "Stonewall", state: "NY", region: "Northeast", lat: 40.7336, lng: -74.0021 },

  // =====================
  // NORTHEAST - Pennsylvania
  // =====================
  { id: "nm-carlisle-indian-school", name: "Carlisle Federal Indian Boarding School", state: "PA", region: "Northeast", lat: 40.2100, lng: -77.1800 },

  // =====================
  // PACIFIC / MARINE
  // =====================
  { id: "nm-marianas-trench", name: "Marianas Trench Marine", state: "MP/GU", region: "Pacific", lat: 20.0000, lng: 145.0000 },
  { id: "nm-northeast-canyons-seamounts", name: "Northeast Canyons and Seamounts Marine", state: "Atlantic", region: "Atlantic", lat: 40.4000, lng: -68.0000 },
  { id: "nm-pacific-islands-heritage", name: "Pacific Islands Heritage Marine", state: "Pacific", region: "Pacific", lat: 16.7500, lng: -169.5200 },
  { id: "nm-rose-atoll", name: "Rose Atoll Marine", state: "AS", region: "Pacific", lat: -14.5500, lng: -168.5400 },

  // =====================
  // US VIRGIN ISLANDS
  // =====================
  { id: "nm-buck-island-reef", name: "Buck Island Reef", state: "VI", region: "Caribbean", lat: 17.7900, lng: -64.6200 },
  { id: "nm-virgin-islands-coral-reef", name: "Virgin Islands Coral Reef", state: "VI", region: "Caribbean", lat: 18.3100, lng: -64.7200 },
];

export const monumentRegions = ["Alaska", "West", "Southwest", "Midwest", "Southeast", "Northeast", "Pacific", "Atlantic", "Caribbean"];

export const getMonumentsByRegion = (region: string) =>
  nationalMonuments.filter(m => m.region === region);

export const getMonumentsByState = (state: string) =>
  nationalMonuments.filter(m => m.state === state || m.state.includes(state));

export const getTotalMonuments = () => nationalMonuments.length;
