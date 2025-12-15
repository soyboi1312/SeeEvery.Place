import type { Stadium } from './types';

// Six Nations International Stadiums
export const sixNationsStadiums: Stadium[] = [
  { id: "rugby-twickenham", name: "Twickenham Stadium", city: "London", country: "UK", sport: "Rugby", capacity: 82000, lat: 51.4559, lng: -0.3415, team: "England", league: "Six Nations" },
  { id: "rugby-principality", name: "Principality Stadium", city: "Cardiff", country: "UK", sport: "Rugby", capacity: 73931, lat: 51.4782, lng: -3.1826, team: "Wales", league: "Six Nations" },
  { id: "rugby-aviva", name: "Aviva Stadium", city: "Dublin", country: "Ireland", sport: "Rugby", capacity: 51700, lat: 53.3353, lng: -6.2289, team: "Ireland", league: "Six Nations" },
  { id: "rugby-murrayfield", name: "BT Murrayfield Stadium", city: "Edinburgh", country: "UK", sport: "Rugby", capacity: 67144, lat: 55.9422, lng: -3.2406, team: "Scotland", league: "Six Nations" },
  { id: "rugby-stade-de-france", name: "Stade de France", city: "Paris", country: "France", sport: "Rugby", capacity: 81338, lat: 48.9244, lng: 2.3601, team: "France", league: "Six Nations" },
  { id: "rugby-olimpico-rome", name: "Stadio Olimpico", city: "Rome", country: "Italy", sport: "Rugby", capacity: 70634, lat: 41.9341, lng: 12.4547, team: "Italy", league: "Six Nations" },
];

// English Premiership Rugby - 10 teams
export const premiershipRugbyStadiums: Stadium[] = [
  { id: "rugby-bath", name: "Recreation Ground", city: "Bath", country: "UK", sport: "Rugby", capacity: 14509, lat: 51.3867, lng: -2.3594, team: "Bath Rugby", league: "Premiership Rugby" },
  { id: "rugby-bristol", name: "Ashton Gate Stadium", city: "Bristol", country: "UK", sport: "Rugby", capacity: 27000, lat: 51.4400, lng: -2.6203, team: "Bristol Bears", league: "Premiership Rugby" },
  { id: "rugby-exeter", name: "Sandy Park", city: "Exeter", country: "UK", sport: "Rugby", capacity: 13593, lat: 50.7208, lng: -3.4683, team: "Exeter Chiefs", league: "Premiership Rugby" },
  { id: "rugby-gloucester", name: "Kingsholm Stadium", city: "Gloucester", country: "UK", sport: "Rugby", capacity: 16500, lat: 51.8681, lng: -2.2414, team: "Gloucester Rugby", league: "Premiership Rugby" },
  { id: "rugby-harlequins", name: "Twickenham Stoop", city: "London", country: "UK", sport: "Rugby", capacity: 14816, lat: 51.4603, lng: -0.3422, team: "Harlequins", league: "Premiership Rugby" },
  { id: "rugby-leicester", name: "Mattioli Woods Welford Road", city: "Leicester", country: "UK", sport: "Rugby", capacity: 25849, lat: 52.6219, lng: -1.1397, team: "Leicester Tigers", league: "Premiership Rugby" },
  { id: "rugby-newcastle", name: "Kingston Park", city: "Newcastle", country: "UK", sport: "Rugby", capacity: 10200, lat: 55.0133, lng: -1.6600, team: "Newcastle Falcons", league: "Premiership Rugby" },
  { id: "rugby-northampton", name: "Franklin's Gardens", city: "Northampton", country: "UK", sport: "Rugby", capacity: 15249, lat: 52.2406, lng: -0.8986, team: "Northampton Saints", league: "Premiership Rugby" },
  { id: "rugby-sale", name: "Salford Community Stadium", city: "Salford", country: "UK", sport: "Rugby", capacity: 12000, lat: 53.4744, lng: -2.3472, team: "Sale Sharks", league: "Premiership Rugby" },
  { id: "rugby-saracens", name: "StoneX Stadium", city: "London", country: "UK", sport: "Rugby", capacity: 10000, lat: 51.6033, lng: -0.2417, team: "Saracens", league: "Premiership Rugby" },
];

// French Top 14 - 14 teams
export const top14Stadiums: Stadium[] = [
  { id: "rugby-bayonne", name: "Stade Jean-Dauger", city: "Bayonne", country: "France", sport: "Rugby", capacity: 18000, lat: 43.4847, lng: -1.4728, team: "Aviron Bayonnais", league: "Top 14" },
  { id: "rugby-bordeaux", name: "Stade Chaban-Delmas", city: "Bordeaux", country: "France", sport: "Rugby", capacity: 34694, lat: 44.8378, lng: -0.5953, team: "Union Bordeaux Bègles", league: "Top 14" },
  { id: "rugby-castres", name: "Stade Pierre-Fabre", city: "Castres", country: "France", sport: "Rugby", capacity: 11500, lat: 43.6044, lng: 2.2481, team: "Castres Olympique", league: "Top 14" },
  { id: "rugby-clermont", name: "Stade Marcel-Michelin", city: "Clermont-Ferrand", country: "France", sport: "Rugby", capacity: 19820, lat: 45.7667, lng: 3.1069, team: "ASM Clermont Auvergne", league: "Top 14" },
  { id: "rugby-la-rochelle", name: "Stade Marcel-Deflandre", city: "La Rochelle", country: "France", sport: "Rugby", capacity: 16000, lat: 46.1628, lng: -1.1353, team: "Stade Rochelais", league: "Top 14" },
  { id: "rugby-lyon", name: "Matmut Stadium de Gerland", city: "Lyon", country: "France", sport: "Rugby", capacity: 35029, lat: 45.7256, lng: 4.8317, team: "Lyon OU", league: "Top 14" },
  { id: "rugby-montpellier", name: "GGL Stadium", city: "Montpellier", country: "France", sport: "Rugby", capacity: 15711, lat: 43.6319, lng: 3.8233, team: "Montpellier Hérault Rugby", league: "Top 14" },
  { id: "rugby-pau", name: "Stade du Hameau", city: "Pau", country: "France", sport: "Rugby", capacity: 14786, lat: 43.3150, lng: -0.3614, team: "Section Paloise", league: "Top 14" },
  { id: "rugby-perpignan", name: "Stade Aimé-Giral", city: "Perpignan", country: "France", sport: "Rugby", capacity: 14592, lat: 42.6972, lng: 2.8994, team: "USA Perpignan", league: "Top 14" },
  { id: "rugby-racing", name: "Paris La Défense Arena", city: "Nanterre", country: "France", sport: "Rugby", capacity: 32000, lat: 48.8958, lng: 2.2292, team: "Racing 92", league: "Top 14" },
  { id: "rugby-stade-francais", name: "Stade Jean-Bouin", city: "Paris", country: "France", sport: "Rugby", capacity: 20000, lat: 48.8433, lng: 2.2536, team: "Stade Français", league: "Top 14" },
  { id: "rugby-toulon", name: "Stade Mayol", city: "Toulon", country: "France", sport: "Rugby", capacity: 18000, lat: 43.1172, lng: 5.9347, team: "RC Toulon", league: "Top 14" },
  { id: "rugby-toulouse", name: "Stade Ernest-Wallon", city: "Toulouse", country: "France", sport: "Rugby", capacity: 19500, lat: 43.6006, lng: 1.4381, team: "Stade Toulousain", league: "Top 14" },
  { id: "rugby-vannes", name: "Stade de la Rabine", city: "Vannes", country: "France", sport: "Rugby", capacity: 11300, lat: 47.6567, lng: -2.7581, team: "RC Vannes", league: "Top 14" },
];

// United Rugby Championship (URC) - Ireland, Wales, Scotland, Italy, South Africa
export const urcStadiums: Stadium[] = [
  // Ireland
  { id: "rugby-connacht", name: "Dexcom Stadium", city: "Galway", country: "Ireland", sport: "Rugby", capacity: 8090, lat: 53.2775, lng: -9.0264, team: "Connacht", league: "URC" },
  { id: "rugby-leinster", name: "Aviva Stadium", city: "Dublin", country: "Ireland", sport: "Rugby", capacity: 51700, lat: 53.3353, lng: -6.2289, team: "Leinster", league: "URC" },
  { id: "rugby-munster", name: "Thomond Park", city: "Limerick", country: "Ireland", sport: "Rugby", capacity: 25600, lat: 52.6658, lng: -8.6281, team: "Munster", league: "URC" },
  { id: "rugby-ulster", name: "Kingspan Stadium", city: "Belfast", country: "UK", sport: "Rugby", capacity: 18196, lat: 54.5814, lng: -5.9422, team: "Ulster", league: "URC" },
  // Wales
  { id: "rugby-cardiff", name: "Cardiff Arms Park", city: "Cardiff", country: "UK", sport: "Rugby", capacity: 12750, lat: 51.4792, lng: -3.1800, team: "Cardiff Rugby", league: "URC" },
  { id: "rugby-dragons", name: "Rodney Parade", city: "Newport", country: "UK", sport: "Rugby", capacity: 8500, lat: 51.5872, lng: -2.9872, team: "Dragons RFC", league: "URC" },
  { id: "rugby-ospreys", name: "Swansea.com Stadium", city: "Swansea", country: "UK", sport: "Rugby", capacity: 21088, lat: 51.6428, lng: -3.9347, team: "Ospreys", league: "URC" },
  { id: "rugby-scarlets", name: "Parc y Scarlets", city: "Llanelli", country: "UK", sport: "Rugby", capacity: 14870, lat: 51.6753, lng: -4.1494, team: "Scarlets", league: "URC" },
  // Scotland
  { id: "rugby-edinburgh", name: "DAM Health Stadium", city: "Edinburgh", country: "UK", sport: "Rugby", capacity: 7800, lat: 55.9422, lng: -3.2406, team: "Edinburgh Rugby", league: "URC" },
  { id: "rugby-glasgow", name: "Scotstoun Stadium", city: "Glasgow", country: "UK", sport: "Rugby", capacity: 7351, lat: 55.8900, lng: -4.3597, team: "Glasgow Warriors", league: "URC" },
  // Italy
  { id: "rugby-benetton", name: "Stadio Monigo", city: "Treviso", country: "Italy", sport: "Rugby", capacity: 8000, lat: 45.6833, lng: 12.2653, team: "Benetton Rugby", league: "URC" },
  { id: "rugby-zebre", name: "Stadio Sergio Lanfranchi", city: "Parma", country: "Italy", sport: "Rugby", capacity: 5000, lat: 44.8122, lng: 10.3219, team: "Zebre Parma", league: "URC" },
  // South Africa
  { id: "rugby-bulls", name: "Loftus Versfeld", city: "Pretoria", country: "South Africa", sport: "Rugby", capacity: 51762, lat: -25.7536, lng: 28.2228, team: "Bulls", league: "URC" },
  { id: "rugby-lions", name: "Ellis Park Stadium", city: "Johannesburg", country: "South Africa", sport: "Rugby", capacity: 62567, lat: -26.1987, lng: 28.0561, team: "Lions", league: "URC" },
  { id: "rugby-sharks", name: "Hollywoodbets Kings Park", city: "Durban", country: "South Africa", sport: "Rugby", capacity: 55000, lat: -29.8322, lng: 31.0278, team: "Sharks", league: "URC" },
  { id: "rugby-stormers", name: "DHL Stadium", city: "Cape Town", country: "South Africa", sport: "Rugby", capacity: 55000, lat: -33.9033, lng: 18.4111, team: "Stormers", league: "URC" },
];

// Super Rugby Pacific - New Zealand and Australia
export const superRugbyStadiums: Stadium[] = [
  // New Zealand
  { id: "rugby-blues", name: "Eden Park", city: "Auckland", country: "New Zealand", sport: "Rugby", capacity: 50000, lat: -36.8746, lng: 174.7448, team: "Blues", league: "Super Rugby Pacific" },
  { id: "rugby-chiefs", name: "FMG Stadium Waikato", city: "Hamilton", country: "New Zealand", sport: "Rugby", capacity: 25111, lat: -37.7889, lng: 175.3025, team: "Chiefs", league: "Super Rugby Pacific" },
  { id: "rugby-crusaders", name: "Apollo Projects Stadium", city: "Christchurch", country: "New Zealand", sport: "Rugby", capacity: 18000, lat: -43.5408, lng: 172.6128, team: "Crusaders", league: "Super Rugby Pacific" },
  { id: "rugby-highlanders", name: "Forsyth Barr Stadium", city: "Dunedin", country: "New Zealand", sport: "Rugby", capacity: 30748, lat: -45.8844, lng: 170.5033, team: "Highlanders", league: "Super Rugby Pacific" },
  { id: "rugby-hurricanes", name: "Sky Stadium", city: "Wellington", country: "New Zealand", sport: "Rugby", capacity: 34500, lat: -41.2733, lng: 174.7858, team: "Hurricanes", league: "Super Rugby Pacific" },
  { id: "rugby-moana", name: "Mt Smart Stadium", city: "Auckland", country: "New Zealand", sport: "Rugby", capacity: 30000, lat: -36.9172, lng: 174.8144, team: "Moana Pasifika", league: "Super Rugby Pacific" },
  // Australia
  { id: "rugby-brumbies", name: "GIO Stadium", city: "Canberra", country: "Australia", sport: "Rugby", capacity: 25011, lat: -35.2478, lng: 149.1031, team: "Brumbies", league: "Super Rugby Pacific" },
  { id: "rugby-force", name: "HBF Park", city: "Perth", country: "Australia", sport: "Rugby", capacity: 20500, lat: -31.9447, lng: 115.8656, team: "Western Force", league: "Super Rugby Pacific" },
  { id: "rugby-reds", name: "Suncorp Stadium", city: "Brisbane", country: "Australia", sport: "Rugby", capacity: 52500, lat: -27.4648, lng: 153.0095, team: "Queensland Reds", league: "Super Rugby Pacific" },
  { id: "rugby-waratahs", name: "Allianz Stadium", city: "Sydney", country: "Australia", sport: "Rugby", capacity: 42500, lat: -33.8878, lng: 151.2225, team: "NSW Waratahs", league: "Super Rugby Pacific" },
  { id: "rugby-rebels", name: "AAMI Park", city: "Melbourne", country: "Australia", sport: "Rugby", capacity: 30050, lat: -37.8250, lng: 144.9833, team: "Melbourne Rebels", league: "Super Rugby Pacific" },
  { id: "rugby-drua", name: "Churchill Park", city: "Lautoka", country: "Fiji", sport: "Rugby", capacity: 16000, lat: -17.6167, lng: 177.4500, team: "Fijian Drua", league: "Super Rugby Pacific" },
];

// Major League Rugby (USA) - 12 teams
export const mlrStadiums: Stadium[] = [
  { id: "rugby-anthem", name: "Segra Field", city: "Leesburg", country: "USA", sport: "Rugby", capacity: 5000, lat: 39.0922, lng: -77.5439, team: "Old Glory DC", league: "MLR" },
  { id: "rugby-arrows", name: "York Lions Stadium", city: "Toronto", country: "Canada", sport: "Rugby", capacity: 9600, lat: 43.7750, lng: -79.5014, team: "Toronto Arrows", league: "MLR" },
  { id: "rugby-chicago-hounds", name: "SeatGeek Stadium", city: "Bridgeview", country: "USA", sport: "Rugby", capacity: 20000, lat: 41.7681, lng: -87.8014, team: "Chicago Hounds", league: "MLR" },
  { id: "rugby-dallas-jackals", name: "Choctaw Stadium", city: "Arlington", country: "USA", sport: "Rugby", capacity: 10000, lat: 32.7506, lng: -97.0825, team: "Dallas Jackals", league: "MLR" },
  { id: "rugby-free-jacks", name: "Veterans Memorial Stadium", city: "Quincy", country: "USA", sport: "Rugby", capacity: 10000, lat: 42.2511, lng: -70.9981, team: "New England Free Jacks", league: "MLR" },
  { id: "rugby-houston", name: "Aveva Stadium", city: "Houston", country: "USA", sport: "Rugby", capacity: 8000, lat: 29.6528, lng: -95.5694, team: "Houston SaberCats", league: "MLR" },
  { id: "rugby-miami-sharks", name: "Pitbull Stadium", city: "Fort Lauderdale", country: "USA", sport: "Rugby", capacity: 4000, lat: 26.1903, lng: -80.1036, team: "Miami Sharks", league: "MLR" },
  { id: "rugby-nola-gold", name: "Gold Mine", city: "Metairie", country: "USA", sport: "Rugby", capacity: 4500, lat: 30.0019, lng: -90.1592, team: "NOLA Gold", league: "MLR" },
  { id: "rugby-san-diego", name: "Snapdragon Stadium", city: "San Diego", country: "USA", sport: "Rugby", capacity: 35000, lat: 32.7839, lng: -117.1208, team: "San Diego Legion", league: "MLR" },
  { id: "rugby-seattle", name: "Starfire Stadium", city: "Tukwila", country: "USA", sport: "Rugby", capacity: 4000, lat: 47.4636, lng: -122.2631, team: "Seattle Seawolves", league: "MLR" },
  { id: "rugby-utah", name: "Zions Bank Stadium", city: "Herriman", country: "USA", sport: "Rugby", capacity: 5000, lat: 40.4733, lng: -112.0189, team: "Utah Warriors", league: "MLR" },
  { id: "rugby-anthem-ny", name: "Colgate Stadium", city: "Hamilton", country: "USA", sport: "Rugby", capacity: 10000, lat: 42.8208, lng: -75.5336, team: "RFC New York", league: "MLR" },
];

// Rugby World Cup Stadiums (notable international venues)
export const rwcStadiums: Stadium[] = [
  { id: "rugby-yokohama", name: "International Stadium Yokohama", city: "Yokohama", country: "Japan", sport: "Rugby", capacity: 72327, lat: 35.5103, lng: 139.6064, team: "RWC 2019 Final", league: "International" },
  { id: "rugby-tokyo", name: "Tokyo Stadium", city: "Tokyo", country: "Japan", sport: "Rugby", capacity: 49970, lat: 35.6647, lng: 139.5272, team: "RWC 2019", league: "International" },
  { id: "rugby-ellis-park", name: "Ellis Park Stadium", city: "Johannesburg", country: "South Africa", sport: "Rugby", capacity: 62567, lat: -26.1987, lng: 28.0561, team: "RWC 1995 Final", league: "International" },
  { id: "rugby-suncorp", name: "Suncorp Stadium", city: "Brisbane", country: "Australia", sport: "Rugby", capacity: 52500, lat: -27.4648, lng: 153.0095, team: "International", league: "International" },
  { id: "rugby-free-state", name: "Free State Stadium", city: "Bloemfontein", country: "South Africa", sport: "Rugby", capacity: 48000, lat: -29.1142, lng: 26.2089, team: "South Africa", league: "International" },
  { id: "rugby-nelson-mandela", name: "Nelson Mandela Bay Stadium", city: "Port Elizabeth", country: "South Africa", sport: "Rugby", capacity: 46000, lat: -33.9353, lng: 25.5356, team: "South Africa", league: "International" },
  { id: "rugby-millennium", name: "Millennium Stadium", city: "Cardiff", country: "UK", sport: "Rugby", capacity: 73931, lat: 51.4782, lng: -3.1826, team: "RWC 1999 Final", league: "International" },
  { id: "rugby-stade-nice", name: "Allianz Riviera", city: "Nice", country: "France", sport: "Rugby", capacity: 35624, lat: 43.7053, lng: 7.1928, team: "RWC 2023", league: "International" },
  { id: "rugby-stade-marseille", name: "Orange Vélodrome", city: "Marseille", country: "France", sport: "Rugby", capacity: 67394, lat: 43.2697, lng: 5.3959, team: "RWC 2023", league: "International" },
  { id: "rugby-stade-lyon", name: "Groupama Stadium", city: "Lyon", country: "France", sport: "Rugby", capacity: 59186, lat: 45.7653, lng: 4.9822, team: "RWC 2023", league: "International" },
  { id: "rugby-stade-bordeaux", name: "Matmut Atlantique", city: "Bordeaux", country: "France", sport: "Rugby", capacity: 42115, lat: 44.8973, lng: -0.5614, team: "RWC 2023", league: "International" },
];

// Japan Rugby League One - Top Division
export const japanRugbyStadiums: Stadium[] = [
  { id: "rugby-wild-knights", name: "Kumagaya Rugby Stadium", city: "Kumagaya", country: "Japan", sport: "Rugby", capacity: 25600, lat: 36.1569, lng: 139.3817, team: "Saitama Wild Knights", league: "Japan Rugby League One" },
  { id: "rugby-sungoliath", name: "Prince Chichibu Memorial Rugby Ground", city: "Tokyo", country: "Japan", sport: "Rugby", capacity: 27188, lat: 35.6761, lng: 139.7186, team: "Tokyo Sungoliath", league: "Japan Rugby League One" },
  { id: "rugby-steelers", name: "Noevir Stadium Kobe", city: "Kobe", country: "Japan", sport: "Rugby", capacity: 30132, lat: 34.6647, lng: 135.1736, team: "Kobelco Kobe Steelers", league: "Japan Rugby League One" },
  { id: "rugby-black-rams", name: "Chichibunomiya Rugby Stadium", city: "Tokyo", country: "Japan", sport: "Rugby", capacity: 27188, lat: 35.6761, lng: 139.7186, team: "Ricoh Black Rams", league: "Japan Rugby League One" },
  { id: "rugby-brave-lupus", name: "Hanazono Rugby Stadium", city: "Higashiosaka", country: "Japan", sport: "Rugby", capacity: 30000, lat: 34.6703, lng: 135.6339, team: "Toshiba Brave Lupus", league: "Japan Rugby League One" },
  { id: "rugby-verblitz", name: "Paloma Mizuho Rugby Stadium", city: "Nagoya", country: "Japan", sport: "Rugby", capacity: 20000, lat: 35.1167, lng: 136.9500, team: "Toyota Verblitz", league: "Japan Rugby League One" },
];

// Combined Rugby Stadiums (all leagues)
export const rugbyStadiums: Stadium[] = [
  ...sixNationsStadiums,
  ...premiershipRugbyStadiums,
  ...top14Stadiums,
  ...urcStadiums,
  ...superRugbyStadiums,
  ...mlrStadiums,
  ...rwcStadiums,
  ...japanRugbyStadiums,
];
