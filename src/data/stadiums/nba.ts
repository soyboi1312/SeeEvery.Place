import type { Stadium } from './types';

// NBA - National Basketball Association (30 teams)
export const nbaStadiums: Stadium[] = [
  // Atlantic Division
  { id: "nba-celtics", name: "TD Garden", city: "Boston", country: "USA", sport: "Basketball", capacity: 19156, lat: 42.3662, lng: -71.0621, team: "Boston Celtics", league: "NBA" },
  { id: "nba-nets", name: "Barclays Center", city: "Brooklyn", country: "USA", sport: "Basketball", capacity: 17732, lat: 40.6826, lng: -73.9754, team: "Brooklyn Nets", league: "NBA" },
  { id: "nba-knicks", name: "Madison Square Garden", city: "New York", country: "USA", sport: "Basketball", capacity: 19812, lat: 40.7505, lng: -73.9934, team: "New York Knicks", league: "NBA" },
  { id: "nba-76ers", name: "Wells Fargo Center", city: "Philadelphia", country: "USA", sport: "Basketball", capacity: 20478, lat: 39.9012, lng: -75.1720, team: "Philadelphia 76ers", league: "NBA" },
  { id: "nba-raptors", name: "Scotiabank Arena", city: "Toronto", country: "Canada", sport: "Basketball", capacity: 19800, lat: 43.6435, lng: -79.3791, team: "Toronto Raptors", league: "NBA" },
  // Central Division
  { id: "nba-bulls", name: "United Center", city: "Chicago", country: "USA", sport: "Basketball", capacity: 20917, lat: 41.8807, lng: -87.6742, team: "Chicago Bulls", league: "NBA" },
  { id: "nba-cavs", name: "Rocket Mortgage FieldHouse", city: "Cleveland", country: "USA", sport: "Basketball", capacity: 19432, lat: 41.4965, lng: -81.6882, team: "Cleveland Cavaliers", league: "NBA" },
  { id: "nba-pistons", name: "Little Caesars Arena", city: "Detroit", country: "USA", sport: "Basketball", capacity: 20332, lat: 42.3411, lng: -83.0553, team: "Detroit Pistons", league: "NBA" },
  { id: "nba-pacers", name: "Gainbridge Fieldhouse", city: "Indianapolis", country: "USA", sport: "Basketball", capacity: 17923, lat: 39.7640, lng: -86.1555, team: "Indiana Pacers", league: "NBA" },
  { id: "nba-bucks", name: "Fiserv Forum", city: "Milwaukee", country: "USA", sport: "Basketball", capacity: 17341, lat: 43.0451, lng: -87.9172, team: "Milwaukee Bucks", league: "NBA" },
  // Southeast Division
  { id: "nba-hawks", name: "State Farm Arena", city: "Atlanta", country: "USA", sport: "Basketball", capacity: 18118, lat: 33.7573, lng: -84.3963, team: "Atlanta Hawks", league: "NBA" },
  { id: "nba-hornets", name: "Spectrum Center", city: "Charlotte", country: "USA", sport: "Basketball", capacity: 19077, lat: 35.2251, lng: -80.8392, team: "Charlotte Hornets", league: "NBA" },
  { id: "nba-heat", name: "Kaseya Center", city: "Miami", country: "USA", sport: "Basketball", capacity: 19600, lat: 25.7814, lng: -80.1870, team: "Miami Heat", league: "NBA" },
  { id: "nba-magic", name: "Amway Center", city: "Orlando", country: "USA", sport: "Basketball", capacity: 18846, lat: 28.5392, lng: -81.3839, team: "Orlando Magic", league: "NBA" },
  { id: "nba-wizards", name: "Capital One Arena", city: "Washington", country: "USA", sport: "Basketball", capacity: 20356, lat: 38.8982, lng: -77.0209, team: "Washington Wizards", league: "NBA" },
  // Northwest Division
  { id: "nba-nuggets", name: "Ball Arena", city: "Denver", country: "USA", sport: "Basketball", capacity: 19520, lat: 39.7487, lng: -105.0077, team: "Denver Nuggets", league: "NBA" },
  { id: "nba-twolves", name: "Target Center", city: "Minneapolis", country: "USA", sport: "Basketball", capacity: 18978, lat: 44.9795, lng: -93.2761, team: "Minnesota Timberwolves", league: "NBA" },
  { id: "nba-thunder", name: "Paycom Center", city: "Oklahoma City", country: "USA", sport: "Basketball", capacity: 18203, lat: 35.4634, lng: -97.5151, team: "Oklahoma City Thunder", league: "NBA" },
  { id: "nba-blazers", name: "Moda Center", city: "Portland", country: "USA", sport: "Basketball", capacity: 19441, lat: 45.5316, lng: -122.6668, team: "Portland Trail Blazers", league: "NBA" },
  { id: "nba-jazz", name: "Delta Center", city: "Salt Lake City", country: "USA", sport: "Basketball", capacity: 18306, lat: 40.7683, lng: -111.9011, team: "Utah Jazz", league: "NBA" },
  // Pacific Division
  { id: "nba-warriors", name: "Chase Center", city: "San Francisco", country: "USA", sport: "Basketball", capacity: 18064, lat: 37.7680, lng: -122.3877, team: "Golden State Warriors", league: "NBA" },
  { id: "nba-clippers", name: "Intuit Dome", city: "Inglewood", country: "USA", sport: "Basketball", capacity: 18000, lat: 33.9425, lng: -118.3417, team: "Los Angeles Clippers", league: "NBA" },
  { id: "nba-lakers", name: "Crypto.com Arena", city: "Los Angeles", country: "USA", sport: "Basketball", capacity: 18997, lat: 34.0430, lng: -118.2673, team: "Los Angeles Lakers", league: "NBA" },
  { id: "nba-suns", name: "Footprint Center", city: "Phoenix", country: "USA", sport: "Basketball", capacity: 17071, lat: 33.4457, lng: -112.0712, team: "Phoenix Suns", league: "NBA" },
  { id: "nba-kings", name: "Golden 1 Center", city: "Sacramento", country: "USA", sport: "Basketball", capacity: 17608, lat: 38.5802, lng: -121.4997, team: "Sacramento Kings", league: "NBA" },
  // Southwest Division
  { id: "nba-mavs", name: "American Airlines Center", city: "Dallas", country: "USA", sport: "Basketball", capacity: 19200, lat: 32.7905, lng: -96.8103, team: "Dallas Mavericks", league: "NBA" },
  { id: "nba-rockets", name: "Toyota Center", city: "Houston", country: "USA", sport: "Basketball", capacity: 18055, lat: 29.7508, lng: -95.3621, team: "Houston Rockets", league: "NBA" },
  { id: "nba-grizzlies", name: "FedExForum", city: "Memphis", country: "USA", sport: "Basketball", capacity: 17794, lat: 35.1382, lng: -90.0506, team: "Memphis Grizzlies", league: "NBA" },
  { id: "nba-pelicans", name: "Smoothie King Center", city: "New Orleans", country: "USA", sport: "Basketball", capacity: 16867, lat: 29.9490, lng: -90.0821, team: "New Orleans Pelicans", league: "NBA" },
  { id: "nba-spurs", name: "Frost Bank Center", city: "San Antonio", country: "USA", sport: "Basketball", capacity: 18418, lat: 29.4270, lng: -98.4375, team: "San Antonio Spurs", league: "NBA" },
];
