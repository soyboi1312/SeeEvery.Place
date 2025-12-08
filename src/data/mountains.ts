export interface Mountain {
  id: string;
  name: string;
  elevation: number; // meters
  country: string;
  countryCode: string;
  range: string;
  lat: number;
  lng: number;
}

// Mountains over 5,000 meters (famous peaks)
export const mountains: Mountain[] = [
  // Himalayas & Karakoram
  { id: "everest", name: "Mount Everest", elevation: 8849, country: "Nepal/China", countryCode: "NP", range: "Himalayas", lat: 27.9881, lng: 86.9250 },
  { id: "k2", name: "K2", elevation: 8611, country: "Pakistan/China", countryCode: "PK", range: "Karakoram", lat: 35.8825, lng: 76.5133 },
  { id: "kangchenjunga", name: "Kangchenjunga", elevation: 8586, country: "Nepal/India", countryCode: "NP", range: "Himalayas", lat: 27.7025, lng: 88.1475 },
  { id: "lhotse", name: "Lhotse", elevation: 8516, country: "Nepal/China", countryCode: "NP", range: "Himalayas", lat: 27.9617, lng: 86.9333 },
  { id: "makalu", name: "Makalu", elevation: 8485, country: "Nepal/China", countryCode: "NP", range: "Himalayas", lat: 27.8897, lng: 87.0889 },
  { id: "cho-oyu", name: "Cho Oyu", elevation: 8188, country: "Nepal/China", countryCode: "NP", range: "Himalayas", lat: 28.0942, lng: 86.6608 },
  { id: "dhaulagiri", name: "Dhaulagiri I", elevation: 8167, country: "Nepal", countryCode: "NP", range: "Himalayas", lat: 28.6967, lng: 83.4875 },
  { id: "manaslu", name: "Manaslu", elevation: 8163, country: "Nepal", countryCode: "NP", range: "Himalayas", lat: 28.5500, lng: 84.5597 },
  { id: "nanga-parbat", name: "Nanga Parbat", elevation: 8126, country: "Pakistan", countryCode: "PK", range: "Himalayas", lat: 35.2378, lng: 74.5892 },
  { id: "annapurna", name: "Annapurna I", elevation: 8091, country: "Nepal", countryCode: "NP", range: "Himalayas", lat: 28.5956, lng: 83.8203 },
  { id: "gasherbrum-i", name: "Gasherbrum I", elevation: 8080, country: "Pakistan/China", countryCode: "PK", range: "Karakoram", lat: 35.7242, lng: 76.6963 },
  { id: "broad-peak", name: "Broad Peak", elevation: 8051, country: "Pakistan/China", countryCode: "PK", range: "Karakoram", lat: 35.8117, lng: 76.5650 },
  { id: "gasherbrum-ii", name: "Gasherbrum II", elevation: 8034, country: "Pakistan/China", countryCode: "PK", range: "Karakoram", lat: 35.7583, lng: 76.6533 },
  { id: "shishapangma", name: "Shishapangma", elevation: 8027, country: "China", countryCode: "CN", range: "Himalayas", lat: 28.3528, lng: 85.7797 },

  // Andes
  { id: "aconcagua", name: "Aconcagua", elevation: 6961, country: "Argentina", countryCode: "AR", range: "Andes", lat: -32.6532, lng: -70.0109 },
  { id: "ojos-del-salado", name: "Ojos del Salado", elevation: 6893, country: "Argentina/Chile", countryCode: "AR", range: "Andes", lat: -27.1092, lng: -68.5414 },
  { id: "monte-pissis", name: "Monte Pissis", elevation: 6793, country: "Argentina", countryCode: "AR", range: "Andes", lat: -27.7542, lng: -68.7992 },
  { id: "huascaran", name: "Huascaran", elevation: 6768, country: "Peru", countryCode: "PE", range: "Andes", lat: -9.1220, lng: -77.6042 },
  { id: "llullaillaco", name: "Llullaillaco", elevation: 6739, country: "Argentina/Chile", countryCode: "AR", range: "Andes", lat: -24.7197, lng: -68.5353 },
  { id: "cotopaxi", name: "Cotopaxi", elevation: 5897, country: "Ecuador", countryCode: "EC", range: "Andes", lat: -0.6833, lng: -78.4375 },
  { id: "chimborazo", name: "Chimborazo", elevation: 6263, country: "Ecuador", countryCode: "EC", range: "Andes", lat: -1.4692, lng: -78.8175 },

  // Africa
  { id: "kilimanjaro", name: "Mount Kilimanjaro", elevation: 5895, country: "Tanzania", countryCode: "TZ", range: "East African", lat: -3.0674, lng: 37.3556 },
  { id: "mount-kenya", name: "Mount Kenya", elevation: 5199, country: "Kenya", countryCode: "KE", range: "East African", lat: -0.1521, lng: 37.3084 },
  { id: "rwenzori", name: "Rwenzori (Margherita Peak)", elevation: 5109, country: "Uganda/DRC", countryCode: "UG", range: "East African", lat: 0.3861, lng: 29.8719 },

  // North America
  { id: "denali", name: "Denali", elevation: 6190, country: "United States", countryCode: "US", range: "Alaska Range", lat: 63.0692, lng: -151.0063 },
  { id: "logan", name: "Mount Logan", elevation: 5959, country: "Canada", countryCode: "CA", range: "Saint Elias", lat: 60.5679, lng: -140.4055 },
  { id: "orizaba", name: "Pico de Orizaba", elevation: 5636, country: "Mexico", countryCode: "MX", range: "Trans-Mexican", lat: 19.0303, lng: -97.2686 },
  { id: "saint-elias", name: "Mount Saint Elias", elevation: 5489, country: "USA/Canada", countryCode: "US", range: "Saint Elias", lat: 60.2931, lng: -140.9264 },
  { id: "popocatepetl", name: "Popocatepetl", elevation: 5426, country: "Mexico", countryCode: "MX", range: "Trans-Mexican", lat: 19.0224, lng: -98.6277 },
  { id: "foraker", name: "Mount Foraker", elevation: 5304, country: "United States", countryCode: "US", range: "Alaska Range", lat: 62.9605, lng: -151.3992 },
  { id: "iztaccihuatl", name: "Iztaccihuatl", elevation: 5230, country: "Mexico", countryCode: "MX", range: "Trans-Mexican", lat: 19.1789, lng: -98.6422 },

  // Europe (Caucasus)
  { id: "elbrus", name: "Mount Elbrus", elevation: 5642, country: "Russia", countryCode: "RU", range: "Caucasus", lat: 43.3550, lng: 42.4392 },
  { id: "dykh-tau", name: "Dykh-Tau", elevation: 5205, country: "Russia", countryCode: "RU", range: "Caucasus", lat: 43.0500, lng: 43.1300 },
  { id: "shkhara", name: "Shkhara", elevation: 5193, country: "Georgia/Russia", countryCode: "GE", range: "Caucasus", lat: 43.0000, lng: 43.1167 },
  { id: "kazbek", name: "Mount Kazbek", elevation: 5047, country: "Georgia", countryCode: "GE", range: "Caucasus", lat: 42.6985, lng: 44.5201 },

  // Asia (non-Himalayan)
  { id: "damavand", name: "Mount Damavand", elevation: 5610, country: "Iran", countryCode: "IR", range: "Alborz", lat: 35.9516, lng: 52.1095 },
  { id: "ararat", name: "Mount Ararat", elevation: 5137, country: "Turkey", countryCode: "TR", range: "Armenian Highlands", lat: 39.7019, lng: 44.2986 },

  // Antarctica
  { id: "vinson", name: "Vinson Massif", elevation: 4892, country: "Antarctica", countryCode: "AQ", range: "Ellsworth", lat: -78.5254, lng: -85.6172 },

  // US 14ers - Colorado (peaks above 14,000 ft / 4267m)
  { id: "elbert", name: "Mount Elbert", elevation: 4401, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 39.1178, lng: -106.4454 },
  { id: "massive", name: "Mount Massive", elevation: 4398, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 39.1875, lng: -106.4756 },
  { id: "harvard", name: "Mount Harvard", elevation: 4396, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.9244, lng: -106.3206 },
  { id: "blanca", name: "Blanca Peak", elevation: 4374, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.5775, lng: -105.4856 },
  { id: "la-plata", name: "La Plata Peak", elevation: 4372, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 39.0294, lng: -106.4731 },
  { id: "uncompahgre", name: "Uncompahgre Peak", elevation: 4365, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 38.0717, lng: -107.4622 },
  { id: "crestone", name: "Crestone Peak", elevation: 4359, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.9669, lng: -105.5856 },
  { id: "lincoln", name: "Mount Lincoln", elevation: 4357, country: "United States", countryCode: "US", range: "Mosquito Range", lat: 39.3514, lng: -106.1114 },
  { id: "grays", name: "Grays Peak", elevation: 4352, country: "United States", countryCode: "US", range: "Front Range", lat: 39.6339, lng: -105.8175 },
  { id: "antero", name: "Mount Antero", elevation: 4351, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.6742, lng: -106.2461 },
  { id: "torreys", name: "Torreys Peak", elevation: 4351, country: "United States", countryCode: "US", range: "Front Range", lat: 39.6428, lng: -105.8214 },
  { id: "castle", name: "Castle Peak", elevation: 4353, country: "United States", countryCode: "US", range: "Elk Mountains", lat: 39.0097, lng: -106.8614 },
  { id: "quandary", name: "Quandary Peak", elevation: 4350, country: "United States", countryCode: "US", range: "Tenmile Range", lat: 39.3972, lng: -106.1064 },
  { id: "evans", name: "Mount Evans", elevation: 4350, country: "United States", countryCode: "US", range: "Front Range", lat: 39.5883, lng: -105.6433 },
  { id: "longs", name: "Longs Peak", elevation: 4346, country: "United States", countryCode: "US", range: "Front Range", lat: 40.2550, lng: -105.6156 },
  { id: "wilson-mt", name: "Mount Wilson", elevation: 4345, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.8392, lng: -107.9917 },
  { id: "shavano", name: "Mount Shavano", elevation: 4338, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.6192, lng: -106.2394 },
  { id: "princeton", name: "Mount Princeton", elevation: 4330, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.7492, lng: -106.2422 },
  { id: "belford", name: "Mount Belford", elevation: 4330, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.9608, lng: -106.3608 },
  { id: "crestone-needle", name: "Crestone Needle", elevation: 4330, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.9647, lng: -105.5767 },
  { id: "kit-carson", name: "Kit Carson Peak", elevation: 4317, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.9797, lng: -105.6025 },
  { id: "maroon", name: "Maroon Peak", elevation: 4317, country: "United States", countryCode: "US", range: "Elk Mountains", lat: 39.0708, lng: -106.9892 },
  { id: "tabeguache", name: "Tabeguache Peak", elevation: 4317, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.6256, lng: -106.2508 },
  { id: "sneffels", name: "Mount Sneffels", elevation: 4316, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 38.0036, lng: -107.7922 },
  { id: "oxford", name: "Mount Oxford", elevation: 4316, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.9647, lng: -106.3386 },
  { id: "el-diente", name: "El Diente Peak", elevation: 4315, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.8392, lng: -108.0053 },
  { id: "democrat", name: "Mount Democrat", elevation: 4314, country: "United States", countryCode: "US", range: "Mosquito Range", lat: 39.3397, lng: -106.1400 },
  { id: "capitol", name: "Capitol Peak", elevation: 4309, country: "United States", countryCode: "US", range: "Elk Mountains", lat: 39.1503, lng: -107.0833 },
  { id: "pikes", name: "Pikes Peak", elevation: 4302, country: "United States", countryCode: "US", range: "Front Range", lat: 38.8409, lng: -105.0423 },
  { id: "snowmass", name: "Snowmass Mountain", elevation: 4298, country: "United States", countryCode: "US", range: "Elk Mountains", lat: 39.1189, lng: -107.0667 },
  { id: "windom", name: "Windom Peak", elevation: 4294, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.6214, lng: -107.5917 },
  { id: "eolus", name: "Mount Eolus", elevation: 4293, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.6219, lng: -107.6206 },
  { id: "challenger", name: "Challenger Point", elevation: 4292, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.9803, lng: -105.6064 },
  { id: "columbia", name: "Mount Columbia", elevation: 4290, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.9039, lng: -106.2975 },
  { id: "missouri", name: "Missouri Mountain", elevation: 4289, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.9475, lng: -106.3778 },
  { id: "bierstadt", name: "Mount Bierstadt", elevation: 4287, country: "United States", countryCode: "US", range: "Front Range", lat: 39.5825, lng: -105.6686 },
  { id: "sunlight", name: "Sunlight Peak", elevation: 4285, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.6272, lng: -107.5958 },
  { id: "handies", name: "Handies Peak", elevation: 4285, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.9131, lng: -107.5042 },
  { id: "redcloud", name: "Redcloud Peak", elevation: 4280, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.9408, lng: -107.4217 },
  { id: "little-bear", name: "Little Bear Peak", elevation: 4280, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.5667, lng: -105.4972 },
  { id: "pyramid", name: "Pyramid Peak", elevation: 4275, country: "United States", countryCode: "US", range: "Elk Mountains", lat: 39.0714, lng: -106.9500 },
  { id: "wilson-peak", name: "Wilson Peak", elevation: 4274, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.8600, lng: -107.9847 },
  { id: "san-luis", name: "San Luis Peak", elevation: 4273, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.9869, lng: -106.9311 },
  { id: "wetterhorn", name: "Wetterhorn Peak", elevation: 4273, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 38.0606, lng: -107.5108 },
  { id: "huron", name: "Huron Peak", elevation: 4270, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 38.9453, lng: -106.4378 },
  { id: "holy-cross", name: "Mount of the Holy Cross", elevation: 4270, country: "United States", countryCode: "US", range: "Sawatch Range", lat: 39.4667, lng: -106.4817 },
  { id: "sunshine", name: "Sunshine Peak", elevation: 4268, country: "United States", countryCode: "US", range: "San Juan Mountains", lat: 37.9225, lng: -107.4256 },
  { id: "bross", name: "Mount Bross", elevation: 4320, country: "United States", countryCode: "US", range: "Mosquito Range", lat: 39.3353, lng: -106.1075 },
  { id: "cameron", name: "Mount Cameron", elevation: 4318, country: "United States", countryCode: "US", range: "Mosquito Range", lat: 39.3469, lng: -106.1186 },
  { id: "humboldt", name: "Humboldt Peak", elevation: 4287, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.9761, lng: -105.5553 },
  { id: "culebra", name: "Culebra Peak", elevation: 4282, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.1222, lng: -105.1856 },
  { id: "lindsey", name: "Mount Lindsey", elevation: 4280, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.5836, lng: -105.4450 },
  { id: "ellingwood", name: "Ellingwood Point", elevation: 4294, country: "United States", countryCode: "US", range: "Sangre de Cristo", lat: 37.5825, lng: -105.4925 },
  { id: "north-maroon", name: "North Maroon Peak", elevation: 4273, country: "United States", countryCode: "US", range: "Elk Mountains", lat: 39.0761, lng: -106.9875 },
  { id: "conundrum", name: "Conundrum Peak", elevation: 4272, country: "United States", countryCode: "US", range: "Elk Mountains", lat: 39.0164, lng: -106.8625 },

  // US 14ers - California
  { id: "whitney", name: "Mount Whitney", elevation: 4421, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 36.5785, lng: -118.2923 },
  { id: "williamson", name: "Mount Williamson", elevation: 4382, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 36.6561, lng: -118.3103 },
  { id: "white-mountain", name: "White Mountain Peak", elevation: 4344, country: "United States", countryCode: "US", range: "White Mountains", lat: 37.6342, lng: -118.2556 },
  { id: "north-palisade", name: "North Palisade", elevation: 4343, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 37.0942, lng: -118.5150 },
  { id: "shasta", name: "Mount Shasta", elevation: 4322, country: "United States", countryCode: "US", range: "Cascade Range", lat: 41.4092, lng: -122.1950 },
  { id: "sill", name: "Mount Sill", elevation: 4314, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 37.0944, lng: -118.5028 },
  { id: "russell", name: "Mount Russell", elevation: 4296, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 36.5917, lng: -118.2867 },
  { id: "split-mountain", name: "Split Mountain", elevation: 4287, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 37.0303, lng: -118.4208 },
  { id: "langley", name: "Mount Langley", elevation: 4277, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 36.5219, lng: -118.2383 },
  { id: "middle-palisade", name: "Middle Palisade", elevation: 4273, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 37.0706, lng: -118.4694 },
  { id: "muir", name: "Mount Muir", elevation: 4273, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 36.5639, lng: -118.2886 },
  { id: "tyndall", name: "Mount Tyndall", elevation: 4275, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 36.6456, lng: -118.3219 },
  { id: "thunderbolt", name: "Thunderbolt Peak", elevation: 4268, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 37.0972, lng: -118.5194 },
  { id: "starlight", name: "Starlight Peak", elevation: 4267, country: "United States", countryCode: "US", range: "Sierra Nevada", lat: 37.0964, lng: -118.5117 },

  // US 14ers - Washington
  { id: "rainier", name: "Mount Rainier", elevation: 4392, country: "United States", countryCode: "US", range: "Cascade Range", lat: 46.8528, lng: -121.7606 },
];

export const mountainRanges = [
  "Himalayas",
  "Karakoram",
  "Andes",
  "East African",
  "Alaska Range",
  "Saint Elias",
  "Trans-Mexican",
  "Caucasus",
  "Alborz",
  "Armenian Highlands",
  "Ellsworth",
  "Sawatch Range",
  "Sangre de Cristo",
  "San Juan Mountains",
  "Mosquito Range",
  "Front Range",
  "Elk Mountains",
  "Tenmile Range",
  "Sierra Nevada",
  "White Mountains",
  "Cascade Range",
];

export const getMountainsByRange = (range: string) =>
  mountains.filter(m => m.range === range);

export const getMountainsOver = (elevation: number) =>
  mountains.filter(m => m.elevation >= elevation);

export const getTotalMountains = () => mountains.length;

// 5000m+ peaks (elevation >= 5000m)
export const get5000mPeaks = () =>
  mountains.filter(m => m.elevation >= 5000);

// US 14ers (peaks >= 14,000 ft / 4267m in the contiguous United States)
// Excludes Alaska peaks which are categorized separately in 5000m+ peaks
const alaskaRanges = ['Alaska Range', 'Saint Elias'];
export const getUS14ers = () =>
  mountains.filter(m => m.elevation >= 4267 && m.countryCode === 'US' && !alaskaRanges.includes(m.range));

// Peak subcategory type
export type PeakSubcategory = "All" | "5000m+" | "US 14ers";

// Get peaks by subcategory
export const getPeaksBySubcategory = (subcategory: PeakSubcategory) => {
  switch (subcategory) {
    case "5000m+":
      return get5000mPeaks();
    case "US 14ers":
      return getUS14ers();
    default:
      return mountains;
  }
};
