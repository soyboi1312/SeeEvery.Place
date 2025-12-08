export interface StatePark {
  id: string;
  name: string;
  state: string;
  region: string;
  lat: number;
  lng: number;
}

// Notable US State Parks - organized by region
export const stateParks: StatePark[] = [
  // =====================
  // NORTHEAST
  // =====================
  // Connecticut
  { id: "sp-sleeping-giant", name: "Sleeping Giant", state: "CT", region: "Northeast", lat: 41.4231, lng: -72.8976 },
  { id: "sp-hammonasset", name: "Hammonasset Beach", state: "CT", region: "Northeast", lat: 41.2631, lng: -72.5509 },
  { id: "sp-kent-falls", name: "Kent Falls", state: "CT", region: "Northeast", lat: 41.7757, lng: -73.4218 },

  // Delaware
  { id: "sp-cape-henlopen", name: "Cape Henlopen", state: "DE", region: "Northeast", lat: 38.7967, lng: -75.0877 },
  { id: "sp-trap-pond", name: "Trap Pond", state: "DE", region: "Northeast", lat: 38.5256, lng: -75.4768 },
  { id: "sp-delaware-seashore", name: "Delaware Seashore", state: "DE", region: "Northeast", lat: 38.6412, lng: -75.0625 },

  // Maine
  { id: "sp-baxter", name: "Baxter", state: "ME", region: "Northeast", lat: 46.0000, lng: -68.9167 },
  { id: "sp-camden-hills", name: "Camden Hills", state: "ME", region: "Northeast", lat: 44.2473, lng: -69.0592 },
  { id: "sp-rangeley-lake", name: "Rangeley Lake", state: "ME", region: "Northeast", lat: 44.9731, lng: -70.6434 },
  { id: "sp-aroostook", name: "Aroostook", state: "ME", region: "Northeast", lat: 46.9092, lng: -68.1378 },
  { id: "sp-sebago-lake", name: "Sebago Lake", state: "ME", region: "Northeast", lat: 43.8853, lng: -70.5531 },

  // Maryland
  { id: "sp-assateague-md", name: "Assateague", state: "MD", region: "Northeast", lat: 38.1972, lng: -75.1511 },
  { id: "sp-cunningham-falls", name: "Cunningham Falls", state: "MD", region: "Northeast", lat: 39.6389, lng: -77.4647 },
  { id: "sp-deep-creek-lake", name: "Deep Creek Lake", state: "MD", region: "Northeast", lat: 39.5025, lng: -79.3372 },
  { id: "sp-patapsco", name: "Patapsco Valley", state: "MD", region: "Northeast", lat: 39.3017, lng: -76.7350 },
  { id: "sp-sandy-point", name: "Sandy Point", state: "MD", region: "Northeast", lat: 39.0114, lng: -76.3983 },

  // Massachusetts
  { id: "sp-nickerson", name: "Nickerson", state: "MA", region: "Northeast", lat: 41.7650, lng: -69.9581 },
  { id: "sp-mount-greylock", name: "Mount Greylock", state: "MA", region: "Northeast", lat: 42.6376, lng: -73.1662 },
  { id: "sp-walden-pond", name: "Walden Pond", state: "MA", region: "Northeast", lat: 42.4392, lng: -71.3411 },
  { id: "sp-salisbury-beach", name: "Salisbury Beach", state: "MA", region: "Northeast", lat: 42.8459, lng: -70.8128 },
  { id: "sp-myles-standish", name: "Myles Standish", state: "MA", region: "Northeast", lat: 41.8517, lng: -70.6928 },

  // New Hampshire
  { id: "sp-franconia-notch", name: "Franconia Notch", state: "NH", region: "Northeast", lat: 44.1386, lng: -71.6806 },
  { id: "sp-crawford-notch", name: "Crawford Notch", state: "NH", region: "Northeast", lat: 44.1764, lng: -71.4025 },
  { id: "sp-mount-monadnock", name: "Mount Monadnock", state: "NH", region: "Northeast", lat: 42.8608, lng: -72.1089 },
  { id: "sp-mt-washington", name: "Mount Washington", state: "NH", region: "Northeast", lat: 44.2706, lng: -71.3033 },
  { id: "sp-rhododendron", name: "Rhododendron", state: "NH", region: "Northeast", lat: 42.8536, lng: -72.1900 },

  // New Jersey
  { id: "sp-high-point", name: "High Point", state: "NJ", region: "Northeast", lat: 41.3206, lng: -74.6617 },
  { id: "sp-island-beach", name: "Island Beach", state: "NJ", region: "Northeast", lat: 39.8061, lng: -74.0892 },
  { id: "sp-bass-river", name: "Bass River", state: "NJ", region: "Northeast", lat: 39.6156, lng: -74.4225 },
  { id: "sp-wharton", name: "Wharton", state: "NJ", region: "Northeast", lat: 39.6639, lng: -74.5881 },
  { id: "sp-liberty-sp", name: "Liberty State Park", state: "NJ", region: "Northeast", lat: 40.7092, lng: -74.0547 },

  // New York
  { id: "sp-letchworth", name: "Letchworth", state: "NY", region: "Northeast", lat: 42.5684, lng: -77.9553 },
  { id: "sp-watkins-glen", name: "Watkins Glen", state: "NY", region: "Northeast", lat: 42.3742, lng: -76.8856 },
  { id: "sp-taughannock-falls", name: "Taughannock Falls", state: "NY", region: "Northeast", lat: 42.5459, lng: -76.6003 },
  { id: "sp-harriman", name: "Harriman", state: "NY", region: "Northeast", lat: 41.2412, lng: -74.0873 },
  { id: "sp-allegany", name: "Allegany", state: "NY", region: "Northeast", lat: 42.0684, lng: -78.7553 },
  { id: "sp-niagara-falls", name: "Niagara Falls", state: "NY", region: "Northeast", lat: 43.0828, lng: -79.0742 },
  { id: "sp-jones-beach", name: "Jones Beach", state: "NY", region: "Northeast", lat: 40.5959, lng: -73.5079 },
  { id: "sp-bear-mountain", name: "Bear Mountain", state: "NY", region: "Northeast", lat: 41.3126, lng: -73.9890 },
  { id: "sp-robert-moses", name: "Robert Moses", state: "NY", region: "Northeast", lat: 40.6263, lng: -73.2701 },

  // Pennsylvania
  { id: "sp-ricketts-glen", name: "Ricketts Glen", state: "PA", region: "Northeast", lat: 41.3303, lng: -76.2636 },
  { id: "sp-ohiopyle", name: "Ohiopyle", state: "PA", region: "Northeast", lat: 39.8692, lng: -79.4950 },
  { id: "sp-presque-isle", name: "Presque Isle", state: "PA", region: "Northeast", lat: 42.1553, lng: -80.1011 },
  { id: "sp-worlds-end", name: "Worlds End", state: "PA", region: "Northeast", lat: 41.4631, lng: -76.5756 },
  { id: "sp-hickory-run", name: "Hickory Run", state: "PA", region: "Northeast", lat: 41.0328, lng: -75.6406 },
  { id: "sp-pymatuning", name: "Pymatuning", state: "PA", region: "Northeast", lat: 41.5603, lng: -80.4639 },

  // Rhode Island
  { id: "sp-colt", name: "Colt", state: "RI", region: "Northeast", lat: 41.6967, lng: -71.2536 },
  { id: "sp-burlingame", name: "Burlingame", state: "RI", region: "Northeast", lat: 41.3906, lng: -71.7256 },
  { id: "sp-lincoln-woods", name: "Lincoln Woods", state: "RI", region: "Northeast", lat: 41.8992, lng: -71.4322 },

  // Vermont
  { id: "sp-smugglers-notch", name: "Smugglers' Notch", state: "VT", region: "Northeast", lat: 44.5592, lng: -72.7828 },
  { id: "sp-mount-mansfield", name: "Mount Mansfield", state: "VT", region: "Northeast", lat: 44.5436, lng: -72.8142 },
  { id: "sp-camel-hump", name: "Camel's Hump", state: "VT", region: "Northeast", lat: 44.3197, lng: -72.8861 },
  { id: "sp-groton", name: "Groton", state: "VT", region: "Northeast", lat: 44.2753, lng: -72.2706 },
  { id: "sp-button-bay", name: "Button Bay", state: "VT", region: "Northeast", lat: 44.1656, lng: -73.3692 },

  // =====================
  // SOUTHEAST
  // =====================
  // Alabama
  { id: "sp-gulf", name: "Gulf", state: "AL", region: "Southeast", lat: 30.2550, lng: -87.6397 },
  { id: "sp-desoto", name: "DeSoto", state: "AL", region: "Southeast", lat: 34.5025, lng: -85.5928 },
  { id: "sp-cheaha", name: "Cheaha", state: "AL", region: "Southeast", lat: 33.4831, lng: -85.8089 },
  { id: "sp-oak-mountain", name: "Oak Mountain", state: "AL", region: "Southeast", lat: 33.3339, lng: -86.7717 },
  { id: "sp-cathedral-caverns", name: "Cathedral Caverns", state: "AL", region: "Southeast", lat: 34.5717, lng: -86.2103 },

  // Arkansas
  { id: "sp-devils-den", name: "Devil's Den", state: "AR", region: "Southeast", lat: 35.7778, lng: -94.2431 },
  { id: "sp-petit-jean", name: "Petit Jean", state: "AR", region: "Southeast", lat: 35.1106, lng: -92.9350 },
  { id: "sp-mount-magazine", name: "Mount Magazine", state: "AR", region: "Southeast", lat: 35.1711, lng: -93.6336 },
  { id: "sp-crater-diamonds", name: "Crater of Diamonds", state: "AR", region: "Southeast", lat: 34.0322, lng: -93.6694 },
  { id: "sp-blanchard-springs", name: "Blanchard Springs", state: "AR", region: "Southeast", lat: 35.9594, lng: -92.1731 },

  // Florida
  { id: "sp-florida-caverns", name: "Florida Caverns", state: "FL", region: "Southeast", lat: 30.8033, lng: -85.2089 },
  { id: "sp-bahia-honda", name: "Bahia Honda", state: "FL", region: "Southeast", lat: 24.6617, lng: -81.2728 },
  { id: "sp-st-andrews", name: "St. Andrews", state: "FL", region: "Southeast", lat: 30.1311, lng: -85.7372 },
  { id: "sp-ichetucknee", name: "Ichetucknee Springs", state: "FL", region: "Southeast", lat: 29.9839, lng: -82.7622 },
  { id: "sp-myakka-river", name: "Myakka River", state: "FL", region: "Southeast", lat: 27.2331, lng: -82.3117 },
  { id: "sp-rainbow-springs", name: "Rainbow Springs", state: "FL", region: "Southeast", lat: 29.1025, lng: -82.4353 },
  { id: "sp-grayton-beach", name: "Grayton Beach", state: "FL", region: "Southeast", lat: 30.3472, lng: -86.1417 },
  { id: "sp-jonathan-dickinson", name: "Jonathan Dickinson", state: "FL", region: "Southeast", lat: 27.0208, lng: -80.1283 },
  { id: "sp-devil-millhopper", name: "Devil's Millhopper", state: "FL", region: "Southeast", lat: 29.7086, lng: -82.3897 },

  // Georgia
  { id: "sp-cloudland-canyon", name: "Cloudland Canyon", state: "GA", region: "Southeast", lat: 34.8367, lng: -85.4811 },
  { id: "sp-providence-canyon", name: "Providence Canyon", state: "GA", region: "Southeast", lat: 32.0667, lng: -84.9000 },
  { id: "sp-tallulah-gorge", name: "Tallulah Gorge", state: "GA", region: "Southeast", lat: 34.7367, lng: -83.3925 },
  { id: "sp-amicalola-falls", name: "Amicalola Falls", state: "GA", region: "Southeast", lat: 34.5669, lng: -84.2467 },
  { id: "sp-fort-mountain", name: "Fort Mountain", state: "GA", region: "Southeast", lat: 34.7650, lng: -84.7028 },
  { id: "sp-stephen-foster", name: "Stephen C. Foster", state: "GA", region: "Southeast", lat: 30.8189, lng: -82.3553 },
  { id: "sp-jekyll-island", name: "Jekyll Island", state: "GA", region: "Southeast", lat: 31.0708, lng: -81.4258 },

  // Kentucky
  { id: "sp-cumberland-falls", name: "Cumberland Falls", state: "KY", region: "Southeast", lat: 36.8381, lng: -84.3453 },
  { id: "sp-natural-bridge", name: "Natural Bridge", state: "KY", region: "Southeast", lat: 37.7753, lng: -83.6831 },
  { id: "sp-carter-caves", name: "Carter Caves", state: "KY", region: "Southeast", lat: 38.3700, lng: -83.1233 },
  { id: "sp-breaks-interstate", name: "Breaks Interstate", state: "KY", region: "Southeast", lat: 37.2919, lng: -82.2922 },
  { id: "sp-bernheim", name: "Bernheim Forest", state: "KY", region: "Southeast", lat: 37.9175, lng: -85.6553 },

  // Louisiana
  { id: "sp-fontainebleau", name: "Fontainebleau", state: "LA", region: "Southeast", lat: 30.3428, lng: -90.0389 },
  { id: "sp-chicot", name: "Chicot", state: "LA", region: "Southeast", lat: 30.7883, lng: -92.2806 },
  { id: "sp-kisatchie", name: "Kisatchie", state: "LA", region: "Southeast", lat: 31.5483, lng: -93.0647 },
  { id: "sp-cypremort-point", name: "Cypremort Point", state: "LA", region: "Southeast", lat: 29.7139, lng: -91.8764 },
  { id: "sp-grand-isle", name: "Grand Isle", state: "LA", region: "Southeast", lat: 29.2417, lng: -89.9872 },

  // Mississippi
  { id: "sp-tishomingo", name: "Tishomingo", state: "MS", region: "Southeast", lat: 34.6086, lng: -88.1911 },
  { id: "sp-clarkco", name: "Clarkco", state: "MS", region: "Southeast", lat: 32.2483, lng: -88.6867 },
  { id: "sp-natchez", name: "Natchez", state: "MS", region: "Southeast", lat: 31.5383, lng: -91.3878 },
  { id: "sp-gulf-islands", name: "Gulf Islands", state: "MS", region: "Southeast", lat: 30.3058, lng: -88.9364 },

  // North Carolina
  { id: "sp-chimney-rock", name: "Chimney Rock", state: "NC", region: "Southeast", lat: 35.4394, lng: -82.2467 },
  { id: "sp-hanging-rock", name: "Hanging Rock", state: "NC", region: "Southeast", lat: 36.3917, lng: -80.2650 },
  { id: "sp-grandfather-mountain", name: "Grandfather Mountain", state: "NC", region: "Southeast", lat: 36.0986, lng: -81.8289 },
  { id: "sp-stone-mountain", name: "Stone Mountain", state: "NC", region: "Southeast", lat: 36.3892, lng: -81.0392 },
  { id: "sp-falls-lake", name: "Falls Lake", state: "NC", region: "Southeast", lat: 36.0200, lng: -78.7100 },
  { id: "sp-pilot-mountain", name: "Pilot Mountain", state: "NC", region: "Southeast", lat: 36.3394, lng: -80.4678 },
  { id: "sp-jockeys-ridge", name: "Jockey's Ridge", state: "NC", region: "Southeast", lat: 35.9597, lng: -75.6325 },

  // South Carolina
  { id: "sp-table-rock-sc", name: "Table Rock", state: "SC", region: "Southeast", lat: 35.0253, lng: -82.7086 },
  { id: "sp-caesars-head", name: "Caesars Head", state: "SC", region: "Southeast", lat: 35.1081, lng: -82.6253 },
  { id: "sp-huntington-beach", name: "Huntington Beach", state: "SC", region: "Southeast", lat: 33.5156, lng: -79.0586 },
  { id: "sp-devils-fork", name: "Devils Fork", state: "SC", region: "Southeast", lat: 34.9531, lng: -82.9478 },
  { id: "sp-edisto-beach", name: "Edisto Beach", state: "SC", region: "Southeast", lat: 32.5011, lng: -80.3003 },
  { id: "sp-myrtle-beach", name: "Myrtle Beach", state: "SC", region: "Southeast", lat: 33.6561, lng: -78.9306 },

  // Tennessee
  { id: "sp-fall-creek-falls", name: "Fall Creek Falls", state: "TN", region: "Southeast", lat: 35.6631, lng: -85.3522 },
  { id: "sp-rock-island", name: "Rock Island", state: "TN", region: "Southeast", lat: 35.8056, lng: -85.6444 },
  { id: "sp-burgess-falls", name: "Burgess Falls", state: "TN", region: "Southeast", lat: 36.0419, lng: -85.5933 },
  { id: "sp-south-cumberland", name: "South Cumberland", state: "TN", region: "Southeast", lat: 35.2578, lng: -85.8364 },
  { id: "sp-cummins-falls", name: "Cummins Falls", state: "TN", region: "Southeast", lat: 36.2494, lng: -85.5817 },
  { id: "sp-roan-mountain", name: "Roan Mountain", state: "TN", region: "Southeast", lat: 36.1592, lng: -82.0842 },
  { id: "sp-radnor-lake", name: "Radnor Lake", state: "TN", region: "Southeast", lat: 36.0569, lng: -86.8097 },
  { id: "sp-meeman-shelby", name: "Meeman-Shelby Forest", state: "TN", region: "Southeast", lat: 35.3394, lng: -90.0231 },

  // Virginia
  { id: "sp-first-landing", name: "First Landing", state: "VA", region: "Southeast", lat: 36.9186, lng: -76.0372 },
  { id: "sp-natural-bridge-va", name: "Natural Bridge", state: "VA", region: "Southeast", lat: 37.6281, lng: -79.5436 },
  { id: "sp-grayson-highlands", name: "Grayson Highlands", state: "VA", region: "Southeast", lat: 36.6336, lng: -81.5125 },
  { id: "sp-sky-meadows", name: "Sky Meadows", state: "VA", region: "Southeast", lat: 38.9886, lng: -77.9625 },
  { id: "sp-hungry-mother", name: "Hungry Mother", state: "VA", region: "Southeast", lat: 36.8781, lng: -81.5228 },
  { id: "sp-false-cape", name: "False Cape", state: "VA", region: "Southeast", lat: 36.6017, lng: -75.9117 },

  // West Virginia
  { id: "sp-blackwater-falls", name: "Blackwater Falls", state: "WV", region: "Southeast", lat: 39.1133, lng: -79.4886 },
  { id: "sp-coopers-rock", name: "Coopers Rock", state: "WV", region: "Southeast", lat: 39.6522, lng: -79.7800 },
  { id: "sp-hawks-nest", name: "Hawks Nest", state: "WV", region: "Southeast", lat: 38.1331, lng: -81.1028 },
  { id: "sp-babcock", name: "Babcock", state: "WV", region: "Southeast", lat: 38.0047, lng: -80.9489 },
  { id: "sp-lost-river", name: "Lost River", state: "WV", region: "Southeast", lat: 39.0583, lng: -78.8892 },
  { id: "sp-cass-scenic", name: "Cass Scenic Railroad", state: "WV", region: "Southeast", lat: 38.3981, lng: -79.9175 },

  // =====================
  // MIDWEST
  // =====================
  // Illinois
  { id: "sp-starved-rock", name: "Starved Rock", state: "IL", region: "Midwest", lat: 41.3217, lng: -88.9897 },
  { id: "sp-matthiessen", name: "Matthiessen", state: "IL", region: "Midwest", lat: 41.3022, lng: -89.0206 },
  { id: "sp-giant-city", name: "Giant City", state: "IL", region: "Midwest", lat: 37.6011, lng: -89.1881 },
  { id: "sp-illinois-beach", name: "Illinois Beach", state: "IL", region: "Midwest", lat: 42.4317, lng: -87.8078 },
  { id: "sp-buffalo-rock", name: "Buffalo Rock", state: "IL", region: "Midwest", lat: 41.3283, lng: -88.8833 },
  { id: "sp-pere-marquette", name: "Pere Marquette", state: "IL", region: "Midwest", lat: 38.9603, lng: -90.5153 },

  // Indiana
  { id: "sp-turkey-run", name: "Turkey Run", state: "IN", region: "Midwest", lat: 39.8825, lng: -87.2131 },
  { id: "sp-brown-county", name: "Brown County", state: "IN", region: "Midwest", lat: 39.1653, lng: -86.2247 },
  { id: "sp-clifty-falls", name: "Clifty Falls", state: "IN", region: "Midwest", lat: 38.7547, lng: -85.4267 },
  { id: "sp-mccormicks-creek", name: "McCormick's Creek", state: "IN", region: "Midwest", lat: 39.2819, lng: -86.7186 },
  { id: "sp-pokagon", name: "Pokagon", state: "IN", region: "Midwest", lat: 41.7089, lng: -85.0286 },
  { id: "sp-shades", name: "Shades", state: "IN", region: "Midwest", lat: 39.9303, lng: -87.0636 },

  // Iowa
  { id: "sp-maquoketa-caves", name: "Maquoketa Caves", state: "IA", region: "Midwest", lat: 42.0778, lng: -90.8247 },
  { id: "sp-backbone", name: "Backbone", state: "IA", region: "Midwest", lat: 42.6111, lng: -91.5653 },
  { id: "sp-pikes-peak", name: "Pikes Peak", state: "IA", region: "Midwest", lat: 43.0253, lng: -91.1772 },
  { id: "sp-ledges", name: "Ledges", state: "IA", region: "Midwest", lat: 41.9956, lng: -93.8833 },
  { id: "sp-waubonsie", name: "Waubonsie", state: "IA", region: "Midwest", lat: 40.6289, lng: -95.6850 },

  // Kansas
  { id: "sp-mushroom-rock", name: "Mushroom Rock", state: "KS", region: "Midwest", lat: 38.7286, lng: -98.0303 },
  { id: "sp-kanopolis", name: "Kanopolis", state: "KS", region: "Midwest", lat: 38.6867, lng: -98.1261 },
  { id: "sp-scott", name: "Scott", state: "KS", region: "Midwest", lat: 38.6750, lng: -100.9053 },
  { id: "sp-milford", name: "Milford", state: "KS", region: "Midwest", lat: 39.1097, lng: -96.9003 },

  // Michigan
  { id: "sp-porcupine-mountains", name: "Porcupine Mountains", state: "MI", region: "Midwest", lat: 46.8081, lng: -89.7656 },
  { id: "sp-tahquamenon-falls", name: "Tahquamenon Falls", state: "MI", region: "Midwest", lat: 46.5753, lng: -85.2428 },
  { id: "sp-pictured-rocks", name: "Pictured Rocks", state: "MI", region: "Midwest", lat: 46.5653, lng: -86.4167 },
  { id: "sp-sleeping-bear-dunes", name: "Sleeping Bear Dunes", state: "MI", region: "Midwest", lat: 44.8614, lng: -86.0439 },
  { id: "sp-warren-dunes", name: "Warren Dunes", state: "MI", region: "Midwest", lat: 41.8994, lng: -86.5928 },
  { id: "sp-holland", name: "Holland", state: "MI", region: "Midwest", lat: 42.7686, lng: -86.1803 },
  { id: "sp-ludington", name: "Ludington", state: "MI", region: "Midwest", lat: 43.9461, lng: -86.4578 },
  { id: "sp-hartwick-pines", name: "Hartwick Pines", state: "MI", region: "Midwest", lat: 44.7464, lng: -84.6653 },

  // Minnesota
  { id: "sp-gooseberry-falls", name: "Gooseberry Falls", state: "MN", region: "Midwest", lat: 47.1392, lng: -91.4681 },
  { id: "sp-itasca", name: "Itasca", state: "MN", region: "Midwest", lat: 47.2317, lng: -95.2003 },
  { id: "sp-tettegouche", name: "Tettegouche", state: "MN", region: "Midwest", lat: 47.3439, lng: -91.1994 },
  { id: "sp-split-rock", name: "Split Rock Lighthouse", state: "MN", region: "Midwest", lat: 47.2000, lng: -91.3667 },
  { id: "sp-interstate-mn", name: "Interstate", state: "MN", region: "Midwest", lat: 45.4022, lng: -92.6500 },
  { id: "sp-cascade-river", name: "Cascade River", state: "MN", region: "Midwest", lat: 47.7078, lng: -90.5236 },
  { id: "sp-fort-snelling", name: "Fort Snelling", state: "MN", region: "Midwest", lat: 44.8928, lng: -93.1811 },

  // Missouri
  { id: "sp-ha-ha-tonka", name: "Ha Ha Tonka", state: "MO", region: "Midwest", lat: 37.9714, lng: -92.7742 },
  { id: "sp-elephant-rocks", name: "Elephant Rocks", state: "MO", region: "Midwest", lat: 37.6286, lng: -90.6861 },
  { id: "sp-johnson-shut-ins", name: "Johnson's Shut-Ins", state: "MO", region: "Midwest", lat: 37.5503, lng: -90.8386 },
  { id: "sp-table-rock-mo", name: "Table Rock", state: "MO", region: "Midwest", lat: 36.5792, lng: -93.3178 },
  { id: "sp-meramec", name: "Meramec", state: "MO", region: "Midwest", lat: 38.2050, lng: -90.9864 },
  { id: "sp-roaring-river", name: "Roaring River", state: "MO", region: "Midwest", lat: 36.5883, lng: -93.8392 },

  // Nebraska
  { id: "sp-chadron", name: "Chadron", state: "NE", region: "Midwest", lat: 42.8317, lng: -103.0281 },
  { id: "sp-fort-robinson", name: "Fort Robinson", state: "NE", region: "Midwest", lat: 42.6742, lng: -103.4628 },
  { id: "sp-indian-cave", name: "Indian Cave", state: "NE", region: "Midwest", lat: 40.2617, lng: -95.5550 },
  { id: "sp-mahoney", name: "Mahoney", state: "NE", region: "Midwest", lat: 41.0231, lng: -96.3072 },
  { id: "sp-niobrara", name: "Niobrara", state: "NE", region: "Midwest", lat: 42.8467, lng: -100.0378 },

  // North Dakota
  { id: "sp-fort-abraham-lincoln", name: "Fort Abraham Lincoln", state: "ND", region: "Midwest", lat: 46.7778, lng: -100.8342 },
  { id: "sp-turtle-river", name: "Turtle River", state: "ND", region: "Midwest", lat: 47.8772, lng: -97.6025 },
  { id: "sp-icelandic", name: "Icelandic", state: "ND", region: "Midwest", lat: 48.9025, lng: -97.4614 },

  // Ohio
  { id: "sp-hocking-hills", name: "Hocking Hills", state: "OH", region: "Midwest", lat: 39.4353, lng: -82.5361 },
  { id: "sp-cuyahoga-sp", name: "Cuyahoga Valley (Salt Run)", state: "OH", region: "Midwest", lat: 41.2575, lng: -81.5647 },
  { id: "sp-nelson-kennedy-ledges", name: "Nelson-Kennedy Ledges", state: "OH", region: "Midwest", lat: 41.3639, lng: -81.0228 },
  { id: "sp-mohican", name: "Mohican", state: "OH", region: "Midwest", lat: 40.6036, lng: -82.2522 },
  { id: "sp-old-mans-cave", name: "Old Man's Cave", state: "OH", region: "Midwest", lat: 39.4342, lng: -82.5386 },
  { id: "sp-john-bryan", name: "John Bryan", state: "OH", region: "Midwest", lat: 39.7931, lng: -83.8469 },

  // South Dakota
  { id: "sp-custer", name: "Custer", state: "SD", region: "Midwest", lat: 43.7650, lng: -103.4125 },
  { id: "sp-bear-butte", name: "Bear Butte", state: "SD", region: "Midwest", lat: 44.4761, lng: -103.4208 },
  { id: "sp-palisades", name: "Palisades", state: "SD", region: "Midwest", lat: 43.4978, lng: -96.1656 },
  { id: "sp-newton-hills", name: "Newton Hills", state: "SD", region: "Midwest", lat: 43.2211, lng: -96.5817 },

  // Wisconsin
  { id: "sp-devils-lake", name: "Devil's Lake", state: "WI", region: "Midwest", lat: 43.4247, lng: -89.7306 },
  { id: "sp-peninsula", name: "Peninsula", state: "WI", region: "Midwest", lat: 45.1289, lng: -87.2286 },
  { id: "sp-mirror-lake", name: "Mirror Lake", state: "WI", region: "Midwest", lat: 43.5717, lng: -89.8050 },
  { id: "sp-copper-falls", name: "Copper Falls", state: "WI", region: "Midwest", lat: 46.3722, lng: -90.6417 },
  { id: "sp-willow-river", name: "Willow River", state: "WI", region: "Midwest", lat: 45.0475, lng: -92.6761 },
  { id: "sp-governor-dodge", name: "Governor Dodge", state: "WI", region: "Midwest", lat: 43.0167, lng: -90.1017 },
  { id: "sp-amnicon-falls", name: "Amnicon Falls", state: "WI", region: "Midwest", lat: 46.6056, lng: -91.8894 },

  // =====================
  // SOUTHWEST
  // =====================
  // Arizona
  { id: "sp-kartchner-caverns", name: "Kartchner Caverns", state: "AZ", region: "Southwest", lat: 31.8372, lng: -110.3472 },
  { id: "sp-slide-rock", name: "Slide Rock", state: "AZ", region: "Southwest", lat: 34.9297, lng: -111.7517 },
  { id: "sp-dead-horse-ranch", name: "Dead Horse Ranch", state: "AZ", region: "Southwest", lat: 34.7706, lng: -112.0078 },
  { id: "sp-red-rock", name: "Red Rock", state: "AZ", region: "Southwest", lat: 34.8439, lng: -111.8017 },
  { id: "sp-lost-dutchman", name: "Lost Dutchman", state: "AZ", region: "Southwest", lat: 33.4569, lng: -111.4778 },
  { id: "sp-catalina", name: "Catalina", state: "AZ", region: "Southwest", lat: 32.4233, lng: -110.7119 },
  { id: "sp-patagonia-lake", name: "Patagonia Lake", state: "AZ", region: "Southwest", lat: 31.4875, lng: -110.8494 },

  // Colorado
  { id: "sp-roxborough", name: "Roxborough", state: "CO", region: "Southwest", lat: 39.4281, lng: -105.0697 },
  { id: "sp-cherry-creek", name: "Cherry Creek", state: "CO", region: "Southwest", lat: 39.6397, lng: -104.8514 },
  { id: "sp-eldorado-canyon", name: "Eldorado Canyon", state: "CO", region: "Southwest", lat: 39.9306, lng: -105.2864 },
  { id: "sp-golden-gate-canyon", name: "Golden Gate Canyon", state: "CO", region: "Southwest", lat: 39.8353, lng: -105.4289 },
  { id: "sp-mueller", name: "Mueller", state: "CO", region: "Southwest", lat: 38.8642, lng: -105.1844 },
  { id: "sp-colorado-monuments", name: "Colorado National Monument", state: "CO", region: "Southwest", lat: 39.0553, lng: -108.7181 },
  { id: "sp-rifle-falls", name: "Rifle Falls", state: "CO", region: "Southwest", lat: 39.6764, lng: -107.6978 },
  { id: "sp-staunton", name: "Staunton", state: "CO", region: "Southwest", lat: 39.4997, lng: -105.3961 },

  // New Mexico
  { id: "sp-city-of-rocks", name: "City of Rocks", state: "NM", region: "Southwest", lat: 32.5814, lng: -107.9736 },
  { id: "sp-hyde-memorial", name: "Hyde Memorial", state: "NM", region: "Southwest", lat: 35.7072, lng: -105.8722 },
  { id: "sp-bottomless-lakes", name: "Bottomless Lakes", state: "NM", region: "Southwest", lat: 33.3117, lng: -104.3264 },
  { id: "sp-bluewater-lake", name: "Bluewater Lake", state: "NM", region: "Southwest", lat: 35.2722, lng: -108.0889 },
  { id: "sp-elephant-butte", name: "Elephant Butte Lake", state: "NM", region: "Southwest", lat: 33.1542, lng: -107.1958 },
  { id: "sp-heron-lake", name: "Heron Lake", state: "NM", region: "Southwest", lat: 36.6658, lng: -106.7244 },

  // Oklahoma
  { id: "sp-beavers-bend", name: "Beavers Bend", state: "OK", region: "Southwest", lat: 34.1344, lng: -94.6625 },
  { id: "sp-turner-falls", name: "Turner Falls", state: "OK", region: "Southwest", lat: 34.4244, lng: -97.1436 },
  { id: "sp-robbers-cave", name: "Robbers Cave", state: "OK", region: "Southwest", lat: 34.9386, lng: -95.3447 },
  { id: "sp-natural-falls", name: "Natural Falls", state: "OK", region: "Southwest", lat: 36.3789, lng: -94.6550 },
  { id: "sp-lake-murray", name: "Lake Murray", state: "OK", region: "Southwest", lat: 34.0592, lng: -97.0683 },
  { id: "sp-wichita-mountains", name: "Wichita Mountains", state: "OK", region: "Southwest", lat: 34.7531, lng: -98.7136 },

  // Texas
  { id: "sp-palo-duro-canyon", name: "Palo Duro Canyon", state: "TX", region: "Southwest", lat: 34.9408, lng: -101.6517 },
  { id: "sp-enchanted-rock", name: "Enchanted Rock", state: "TX", region: "Southwest", lat: 30.5061, lng: -98.8197 },
  { id: "sp-garner", name: "Garner", state: "TX", region: "Southwest", lat: 29.5914, lng: -99.7325 },
  { id: "sp-lost-maples", name: "Lost Maples", state: "TX", region: "Southwest", lat: 29.8072, lng: -99.5692 },
  { id: "sp-big-bend-ranch", name: "Big Bend Ranch", state: "TX", region: "Southwest", lat: 29.4667, lng: -104.0167 },
  { id: "sp-pedernales-falls", name: "Pedernales Falls", state: "TX", region: "Southwest", lat: 30.3108, lng: -98.2567 },
  { id: "sp-caprock-canyons", name: "Caprock Canyons", state: "TX", region: "Southwest", lat: 34.4128, lng: -101.0675 },
  { id: "sp-mckinney-falls", name: "McKinney Falls", state: "TX", region: "Southwest", lat: 30.1825, lng: -97.7222 },
  { id: "sp-devils-river", name: "Devil's River", state: "TX", region: "Southwest", lat: 29.9069, lng: -100.9878 },
  { id: "sp-colorado-bend", name: "Colorado Bend", state: "TX", region: "Southwest", lat: 31.0142, lng: -98.4425 },
  { id: "sp-hueco-tanks", name: "Hueco Tanks", state: "TX", region: "Southwest", lat: 31.9169, lng: -106.0419 },
  { id: "sp-longhorn-cavern", name: "Longhorn Cavern", state: "TX", region: "Southwest", lat: 30.6886, lng: -98.3517 },

  // Utah
  { id: "sp-dead-horse-point", name: "Dead Horse Point", state: "UT", region: "Southwest", lat: 38.4872, lng: -109.7378 },
  { id: "sp-goblin-valley", name: "Goblin Valley", state: "UT", region: "Southwest", lat: 38.5614, lng: -110.7039 },
  { id: "sp-snow-canyon", name: "Snow Canyon", state: "UT", region: "Southwest", lat: 37.2050, lng: -113.6503 },
  { id: "sp-kodachrome-basin", name: "Kodachrome Basin", state: "UT", region: "Southwest", lat: 37.5014, lng: -111.9950 },
  { id: "sp-antelope-island", name: "Antelope Island", state: "UT", region: "Southwest", lat: 41.0194, lng: -112.2453 },
  { id: "sp-coral-pink-sand", name: "Coral Pink Sand Dunes", state: "UT", region: "Southwest", lat: 37.0353, lng: -112.7308 },
  { id: "sp-escalante-petrified", name: "Escalante Petrified Forest", state: "UT", region: "Southwest", lat: 37.7833, lng: -111.6019 },

  // =====================
  // WEST
  // =====================
  // Alaska
  { id: "sp-chugach", name: "Chugach", state: "AK", region: "West", lat: 61.1389, lng: -149.8222 },
  { id: "sp-kachemak-bay", name: "Kachemak Bay", state: "AK", region: "West", lat: 59.6464, lng: -151.0653 },
  { id: "sp-denali-state", name: "Denali State Park", state: "AK", region: "West", lat: 62.5333, lng: -150.4167 },
  { id: "sp-kodiak", name: "Fort Abercrombie", state: "AK", region: "West", lat: 57.8083, lng: -152.3472 },

  // California
  { id: "sp-anza-borrego", name: "Anza-Borrego Desert", state: "CA", region: "West", lat: 33.1175, lng: -116.3003 },
  { id: "sp-big-sur", name: "Julia Pfeiffer Burns", state: "CA", region: "West", lat: 36.1592, lng: -121.6714 },
  { id: "sp-humboldt-redwoods", name: "Humboldt Redwoods", state: "CA", region: "West", lat: 40.3325, lng: -123.9633 },
  { id: "sp-mount-tamalpais", name: "Mount Tamalpais", state: "CA", region: "West", lat: 37.9139, lng: -122.5961 },
  { id: "sp-point-lobos", name: "Point Lobos", state: "CA", region: "West", lat: 36.5178, lng: -121.9411 },
  { id: "sp-emerald-bay", name: "Emerald Bay", state: "CA", region: "West", lat: 38.9517, lng: -120.1072 },
  { id: "sp-henry-cowell", name: "Henry Cowell Redwoods", state: "CA", region: "West", lat: 37.0422, lng: -122.0581 },
  { id: "sp-mcarthur-burney", name: "McArthur-Burney Falls", state: "CA", region: "West", lat: 41.0128, lng: -121.6514 },
  { id: "sp-calaveras-big-trees", name: "Calaveras Big Trees", state: "CA", region: "West", lat: 38.2797, lng: -120.3017 },
  { id: "sp-pfeiffer-big-sur", name: "Pfeiffer Big Sur", state: "CA", region: "West", lat: 36.2478, lng: -121.7811 },
  { id: "sp-castle-crags", name: "Castle Crags", state: "CA", region: "West", lat: 41.1683, lng: -122.3244 },
  { id: "sp-torrey-pines", name: "Torrey Pines", state: "CA", region: "West", lat: 32.9189, lng: -117.2506 },
  { id: "sp-morro-bay", name: "Morro Bay", state: "CA", region: "West", lat: 35.3683, lng: -120.8547 },
  { id: "sp-doheny", name: "Doheny", state: "CA", region: "West", lat: 33.4622, lng: -117.6872 },

  // Hawaii
  { id: "sp-waimea-canyon", name: "Waimea Canyon", state: "HI", region: "West", lat: 22.0681, lng: -159.6589 },
  { id: "sp-na-pali-coast", name: "Na Pali Coast", state: "HI", region: "West", lat: 22.1717, lng: -159.6367 },
  { id: "sp-iao-valley", name: "Iao Valley", state: "HI", region: "West", lat: 20.8797, lng: -156.5425 },
  { id: "sp-koke-e", name: "Kokee", state: "HI", region: "West", lat: 22.1264, lng: -159.6583 },
  { id: "sp-hapuna-beach", name: "Hapuna Beach", state: "HI", region: "West", lat: 19.9881, lng: -155.8250 },
  { id: "sp-makena", name: "Makena", state: "HI", region: "West", lat: 20.6311, lng: -156.4414 },
  { id: "sp-akaka-falls", name: "Akaka Falls", state: "HI", region: "West", lat: 19.8544, lng: -155.1522 },
  { id: "sp-diamond-head", name: "Diamond Head", state: "HI", region: "West", lat: 21.2614, lng: -157.8056 },

  // Idaho
  { id: "sp-craters-moon", name: "Craters of the Moon", state: "ID", region: "West", lat: 43.4167, lng: -113.5167 },
  { id: "sp-bruneau-dunes", name: "Bruneau Dunes", state: "ID", region: "West", lat: 42.9011, lng: -115.6944 },
  { id: "sp-heyburn", name: "Heyburn", state: "ID", region: "West", lat: 47.3419, lng: -116.7758 },
  { id: "sp-harriman-id", name: "Harriman", state: "ID", region: "West", lat: 44.3653, lng: -111.4403 },
  { id: "sp-ponderosa", name: "Ponderosa", state: "ID", region: "West", lat: 44.9322, lng: -116.0492 },
  { id: "sp-thousand-springs", name: "Thousand Springs", state: "ID", region: "West", lat: 42.6700, lng: -114.8553 },

  // Montana
  { id: "sp-flathead-lake", name: "Flathead Lake", state: "MT", region: "West", lat: 47.8739, lng: -114.0494 },
  { id: "sp-makoshika", name: "Makoshika", state: "MT", region: "West", lat: 47.0725, lng: -104.7208 },
  { id: "sp-giant-springs", name: "Giant Springs", state: "MT", region: "West", lat: 47.5236, lng: -111.2000 },
  { id: "sp-bannack", name: "Bannack", state: "MT", region: "West", lat: 45.1606, lng: -112.9981 },
  { id: "sp-lewis-clark-caverns", name: "Lewis and Clark Caverns", state: "MT", region: "West", lat: 45.8339, lng: -111.8656 },

  // Nevada
  { id: "sp-valley-of-fire", name: "Valley of Fire", state: "NV", region: "West", lat: 36.4367, lng: -114.5139 },
  { id: "sp-cathedral-gorge", name: "Cathedral Gorge", state: "NV", region: "West", lat: 37.8119, lng: -114.4106 },
  { id: "sp-red-rock-canyon", name: "Red Rock Canyon", state: "NV", region: "West", lat: 36.1350, lng: -115.4294 },
  { id: "sp-lake-tahoe-nevada", name: "Lake Tahoe Nevada", state: "NV", region: "West", lat: 39.1900, lng: -119.9308 },
  { id: "sp-sand-harbor", name: "Sand Harbor", state: "NV", region: "West", lat: 39.1989, lng: -119.9308 },
  { id: "sp-berlin-ichthyosaur", name: "Berlin-Ichthyosaur", state: "NV", region: "West", lat: 38.8667, lng: -117.6000 },

  // Oregon
  { id: "sp-silver-falls", name: "Silver Falls", state: "OR", region: "West", lat: 44.8781, lng: -122.6556 },
  { id: "sp-smith-rock", name: "Smith Rock", state: "OR", region: "West", lat: 44.3681, lng: -121.1406 },
  { id: "sp-cape-perpetua", name: "Cape Perpetua", state: "OR", region: "West", lat: 44.2806, lng: -124.1097 },
  { id: "sp-ecola", name: "Ecola", state: "OR", region: "West", lat: 45.9183, lng: -123.9767 },
  { id: "sp-shore-acres", name: "Shore Acres", state: "OR", region: "West", lat: 43.3231, lng: -124.3811 },
  { id: "sp-tryon-creek", name: "Tryon Creek", state: "OR", region: "West", lat: 45.4417, lng: -122.6756 },
  { id: "sp-fort-stevens", name: "Fort Stevens", state: "OR", region: "West", lat: 46.2036, lng: -123.9636 },
  { id: "sp-sunset-bay", name: "Sunset Bay", state: "OR", region: "West", lat: 43.3336, lng: -124.3747 },

  // Washington
  { id: "sp-deception-pass", name: "Deception Pass", state: "WA", region: "West", lat: 48.4064, lng: -122.6472 },
  { id: "sp-palouse-falls", name: "Palouse Falls", state: "WA", region: "West", lat: 46.6631, lng: -118.2256 },
  { id: "sp-cape-disappointment", name: "Cape Disappointment", state: "WA", region: "West", lat: 46.2767, lng: -124.0519 },
  { id: "sp-moran", name: "Moran", state: "WA", region: "West", lat: 48.6542, lng: -122.8606 },
  { id: "sp-fort-worden", name: "Fort Worden", state: "WA", region: "West", lat: 48.1369, lng: -122.7672 },
  { id: "sp-sun-lakes-dry-falls", name: "Sun Lakes-Dry Falls", state: "WA", region: "West", lat: 47.6000, lng: -119.4000 },
  { id: "sp-lime-kiln", name: "Lime Kiln Point", state: "WA", region: "West", lat: 48.5156, lng: -123.1528 },
  { id: "sp-riverside", name: "Riverside", state: "WA", region: "West", lat: 47.7381, lng: -117.4989 },

  // Wyoming
  { id: "sp-hot-springs", name: "Hot Springs", state: "WY", region: "West", lat: 43.4317, lng: -108.1997 },
  { id: "sp-glendo", name: "Glendo", state: "WY", region: "West", lat: 42.4861, lng: -104.9533 },
  { id: "sp-buffalo-bill", name: "Buffalo Bill", state: "WY", region: "West", lat: 44.4825, lng: -109.1986 },
  { id: "sp-boysen", name: "Boysen", state: "WY", region: "West", lat: 43.4167, lng: -108.1833 },
  { id: "sp-guernsey", name: "Guernsey", state: "WY", region: "West", lat: 42.2553, lng: -104.7642 },
  { id: "sp-sinks-canyon", name: "Sinks Canyon", state: "WY", region: "West", lat: 42.7417, lng: -108.8167 },
];

export const stateParkRegions = ["Northeast", "Southeast", "Midwest", "Southwest", "West"];

export const getStateParksByRegion = (region: string) =>
  stateParks.filter(p => p.region === region);

export const getStateParksByState = (state: string) =>
  stateParks.filter(p => p.state === state);

export const getTotalStateParks = () => stateParks.length;
