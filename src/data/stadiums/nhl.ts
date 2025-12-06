import type { Stadium } from './types';

// NHL - National Hockey League (32 teams)
export const nhlStadiums: Stadium[] = [
  // Atlantic Division
  { id: "nhl-bruins", name: "TD Garden (NHL)", city: "Boston", country: "USA", sport: "Hockey", capacity: 17850, lat: 42.3662, lng: -71.0621, team: "Boston Bruins", league: "NHL" },
  { id: "nhl-sabres", name: "KeyBank Center", city: "Buffalo", country: "USA", sport: "Hockey", capacity: 19070, lat: 42.8750, lng: -78.8764, team: "Buffalo Sabres", league: "NHL" },
  { id: "nhl-redwings", name: "Little Caesars Arena (NHL)", city: "Detroit", country: "USA", sport: "Hockey", capacity: 19515, lat: 42.3411, lng: -83.0553, team: "Detroit Red Wings", league: "NHL" },
  { id: "nhl-panthers", name: "Amerant Bank Arena", city: "Sunrise", country: "USA", sport: "Hockey", capacity: 19250, lat: 26.1585, lng: -80.3256, team: "Florida Panthers", league: "NHL" },
  { id: "nhl-canadiens", name: "Bell Centre", city: "Montreal", country: "Canada", sport: "Hockey", capacity: 21302, lat: 45.4961, lng: -73.5693, team: "Montreal Canadiens", league: "NHL" },
  { id: "nhl-senators", name: "Canadian Tire Centre", city: "Ottawa", country: "Canada", sport: "Hockey", capacity: 18652, lat: 45.2969, lng: -75.9272, team: "Ottawa Senators", league: "NHL" },
  { id: "nhl-lightning", name: "Amalie Arena", city: "Tampa", country: "USA", sport: "Hockey", capacity: 19092, lat: 27.9428, lng: -82.4519, team: "Tampa Bay Lightning", league: "NHL" },
  { id: "nhl-leafs", name: "Scotiabank Arena (NHL)", city: "Toronto", country: "Canada", sport: "Hockey", capacity: 18800, lat: 43.6435, lng: -79.3791, team: "Toronto Maple Leafs", league: "NHL" },
  // Metropolitan Division
  { id: "nhl-hurricanes", name: "PNC Arena", city: "Raleigh", country: "USA", sport: "Hockey", capacity: 18680, lat: 35.8033, lng: -78.7220, team: "Carolina Hurricanes", league: "NHL" },
  { id: "nhl-bluejackets", name: "Nationwide Arena", city: "Columbus", country: "USA", sport: "Hockey", capacity: 18500, lat: 39.9693, lng: -83.0060, team: "Columbus Blue Jackets", league: "NHL" },
  { id: "nhl-devils", name: "Prudential Center", city: "Newark", country: "USA", sport: "Hockey", capacity: 16514, lat: 40.7335, lng: -74.1712, team: "New Jersey Devils", league: "NHL" },
  { id: "nhl-islanders", name: "UBS Arena", city: "Elmont", country: "USA", sport: "Hockey", capacity: 17255, lat: 40.7198, lng: -73.7068, team: "New York Islanders", league: "NHL" },
  { id: "nhl-rangers", name: "Madison Square Garden (NHL)", city: "New York", country: "USA", sport: "Hockey", capacity: 18006, lat: 40.7505, lng: -73.9934, team: "New York Rangers", league: "NHL" },
  { id: "nhl-flyers", name: "Wells Fargo Center (NHL)", city: "Philadelphia", country: "USA", sport: "Hockey", capacity: 19543, lat: 39.9012, lng: -75.1720, team: "Philadelphia Flyers", league: "NHL" },
  { id: "nhl-penguins", name: "PPG Paints Arena", city: "Pittsburgh", country: "USA", sport: "Hockey", capacity: 18387, lat: 40.4395, lng: -79.9892, team: "Pittsburgh Penguins", league: "NHL" },
  { id: "nhl-capitals", name: "Capital One Arena (NHL)", city: "Washington", country: "USA", sport: "Hockey", capacity: 18573, lat: 38.8982, lng: -77.0209, team: "Washington Capitals", league: "NHL" },
  // Central Division
  { id: "nhl-coyotes", name: "Mullett Arena", city: "Tempe", country: "USA", sport: "Hockey", capacity: 5000, lat: 33.4255, lng: -111.9326, team: "Utah Hockey Club", league: "NHL" },
  { id: "nhl-blackhawks", name: "United Center (NHL)", city: "Chicago", country: "USA", sport: "Hockey", capacity: 19717, lat: 41.8807, lng: -87.6742, team: "Chicago Blackhawks", league: "NHL" },
  { id: "nhl-avalanche", name: "Ball Arena (NHL)", city: "Denver", country: "USA", sport: "Hockey", capacity: 18007, lat: 39.7487, lng: -105.0077, team: "Colorado Avalanche", league: "NHL" },
  { id: "nhl-stars", name: "American Airlines Center (NHL)", city: "Dallas", country: "USA", sport: "Hockey", capacity: 18532, lat: 32.7905, lng: -96.8103, team: "Dallas Stars", league: "NHL" },
  { id: "nhl-wild", name: "Xcel Energy Center", city: "St. Paul", country: "USA", sport: "Hockey", capacity: 17954, lat: 44.9448, lng: -93.1012, team: "Minnesota Wild", league: "NHL" },
  { id: "nhl-predators", name: "Bridgestone Arena", city: "Nashville", country: "USA", sport: "Hockey", capacity: 17159, lat: 36.1592, lng: -86.7785, team: "Nashville Predators", league: "NHL" },
  { id: "nhl-blues", name: "Enterprise Center", city: "St. Louis", country: "USA", sport: "Hockey", capacity: 18096, lat: 38.6268, lng: -90.2025, team: "St. Louis Blues", league: "NHL" },
  { id: "nhl-jets", name: "Canada Life Centre", city: "Winnipeg", country: "Canada", sport: "Hockey", capacity: 15321, lat: 49.8929, lng: -97.1436, team: "Winnipeg Jets", league: "NHL" },
  // Pacific Division
  { id: "nhl-ducks", name: "Honda Center", city: "Anaheim", country: "USA", sport: "Hockey", capacity: 17174, lat: 33.8078, lng: -117.8765, team: "Anaheim Ducks", league: "NHL" },
  { id: "nhl-flames", name: "Scotiabank Saddledome", city: "Calgary", country: "Canada", sport: "Hockey", capacity: 19289, lat: 51.0374, lng: -114.0519, team: "Calgary Flames", league: "NHL" },
  { id: "nhl-oilers", name: "Rogers Place", city: "Edmonton", country: "Canada", sport: "Hockey", capacity: 18347, lat: 53.5469, lng: -113.4978, team: "Edmonton Oilers", league: "NHL" },
  { id: "nhl-kings", name: "Crypto.com Arena (NHL)", city: "Los Angeles", country: "USA", sport: "Hockey", capacity: 18230, lat: 34.0430, lng: -118.2673, team: "Los Angeles Kings", league: "NHL" },
  { id: "nhl-sharks", name: "SAP Center", city: "San Jose", country: "USA", sport: "Hockey", capacity: 17562, lat: 37.3327, lng: -121.9010, team: "San Jose Sharks", league: "NHL" },
  { id: "nhl-kraken", name: "Climate Pledge Arena", city: "Seattle", country: "USA", sport: "Hockey", capacity: 17100, lat: 47.6221, lng: -122.3540, team: "Seattle Kraken", league: "NHL" },
  { id: "nhl-canucks", name: "Rogers Arena", city: "Vancouver", country: "Canada", sport: "Hockey", capacity: 18910, lat: 49.2778, lng: -123.1089, team: "Vancouver Canucks", league: "NHL" },
  { id: "nhl-knights", name: "T-Mobile Arena", city: "Las Vegas", country: "USA", sport: "Hockey", capacity: 17500, lat: 36.1029, lng: -115.1785, team: "Vegas Golden Knights", league: "NHL" },
];
