import type { Stadium } from './types';

// MLB - Major League Baseball (30 teams)
export const mlbStadiums: Stadium[] = [
  // American League East
  { id: "mlb-yankees", name: "Yankee Stadium", city: "Bronx", country: "USA", sport: "Baseball", capacity: 46537, lat: 40.8296, lng: -73.9262, team: "New York Yankees", league: "MLB" },
  { id: "mlb-redsox", name: "Fenway Park", city: "Boston", country: "USA", sport: "Baseball", capacity: 37755, lat: 42.3467, lng: -71.0972, team: "Boston Red Sox", league: "MLB" },
  { id: "mlb-rays", name: "Tropicana Field", city: "St. Petersburg", country: "USA", sport: "Baseball", capacity: 25000, lat: 27.7682, lng: -82.6534, team: "Tampa Bay Rays", league: "MLB" },
  { id: "mlb-bluejays", name: "Rogers Centre", city: "Toronto", country: "Canada", sport: "Baseball", capacity: 49282, lat: 43.6414, lng: -79.3894, team: "Toronto Blue Jays", league: "MLB" },
  { id: "mlb-orioles", name: "Oriole Park at Camden Yards", city: "Baltimore", country: "USA", sport: "Baseball", capacity: 45971, lat: 39.2838, lng: -76.6216, team: "Baltimore Orioles", league: "MLB" },
  // American League Central
  { id: "mlb-whitesox", name: "Guaranteed Rate Field", city: "Chicago", country: "USA", sport: "Baseball", capacity: 40615, lat: 41.8299, lng: -87.6338, team: "Chicago White Sox", league: "MLB" },
  { id: "mlb-guardians", name: "Progressive Field", city: "Cleveland", country: "USA", sport: "Baseball", capacity: 34830, lat: 41.4962, lng: -81.6852, team: "Cleveland Guardians", league: "MLB" },
  { id: "mlb-tigers", name: "Comerica Park", city: "Detroit", country: "USA", sport: "Baseball", capacity: 41083, lat: 42.3390, lng: -83.0485, team: "Detroit Tigers", league: "MLB" },
  { id: "mlb-royals", name: "Kauffman Stadium", city: "Kansas City", country: "USA", sport: "Baseball", capacity: 37903, lat: 39.0517, lng: -94.4803, team: "Kansas City Royals", league: "MLB" },
  { id: "mlb-twins", name: "Target Field", city: "Minneapolis", country: "USA", sport: "Baseball", capacity: 38544, lat: 44.9817, lng: -93.2776, team: "Minnesota Twins", league: "MLB" },
  // American League West
  { id: "mlb-astros", name: "Minute Maid Park", city: "Houston", country: "USA", sport: "Baseball", capacity: 41168, lat: 29.7573, lng: -95.3555, team: "Houston Astros", league: "MLB" },
  { id: "mlb-angels", name: "Angel Stadium", city: "Anaheim", country: "USA", sport: "Baseball", capacity: 45517, lat: 33.8003, lng: -117.8827, team: "Los Angeles Angels", league: "MLB" },
  { id: "mlb-athletics", name: "Oakland Coliseum", city: "Oakland", country: "USA", sport: "Baseball", capacity: 46847, lat: 37.7516, lng: -122.2005, team: "Oakland Athletics", league: "MLB" },
  { id: "mlb-mariners", name: "T-Mobile Park", city: "Seattle", country: "USA", sport: "Baseball", capacity: 47929, lat: 47.5914, lng: -122.3325, team: "Seattle Mariners", league: "MLB" },
  { id: "mlb-rangers", name: "Globe Life Field", city: "Arlington", country: "USA", sport: "Baseball", capacity: 40300, lat: 32.7473, lng: -97.0849, team: "Texas Rangers", league: "MLB" },
  // National League East
  { id: "mlb-braves", name: "Truist Park", city: "Atlanta", country: "USA", sport: "Baseball", capacity: 41084, lat: 33.8907, lng: -84.4677, team: "Atlanta Braves", league: "MLB" },
  { id: "mlb-marlins", name: "LoanDepot Park", city: "Miami", country: "USA", sport: "Baseball", capacity: 36742, lat: 25.7781, lng: -80.2196, team: "Miami Marlins", league: "MLB" },
  { id: "mlb-mets", name: "Citi Field", city: "Queens", country: "USA", sport: "Baseball", capacity: 41922, lat: 40.7571, lng: -73.8458, team: "New York Mets", league: "MLB" },
  { id: "mlb-phillies", name: "Citizens Bank Park", city: "Philadelphia", country: "USA", sport: "Baseball", capacity: 42792, lat: 39.9061, lng: -75.1665, team: "Philadelphia Phillies", league: "MLB" },
  { id: "mlb-nationals", name: "Nationals Park", city: "Washington", country: "USA", sport: "Baseball", capacity: 41339, lat: 38.8730, lng: -77.0074, team: "Washington Nationals", league: "MLB" },
  // National League Central
  { id: "mlb-cubs", name: "Wrigley Field", city: "Chicago", country: "USA", sport: "Baseball", capacity: 41649, lat: 41.9484, lng: -87.6553, team: "Chicago Cubs", league: "MLB" },
  { id: "mlb-reds", name: "Great American Ball Park", city: "Cincinnati", country: "USA", sport: "Baseball", capacity: 42319, lat: 39.0979, lng: -84.5082, team: "Cincinnati Reds", league: "MLB" },
  { id: "mlb-brewers", name: "American Family Field", city: "Milwaukee", country: "USA", sport: "Baseball", capacity: 41900, lat: 43.0280, lng: -87.9712, team: "Milwaukee Brewers", league: "MLB" },
  { id: "mlb-pirates", name: "PNC Park", city: "Pittsburgh", country: "USA", sport: "Baseball", capacity: 38362, lat: 40.4469, lng: -80.0057, team: "Pittsburgh Pirates", league: "MLB" },
  { id: "mlb-cardinals", name: "Busch Stadium", city: "St. Louis", country: "USA", sport: "Baseball", capacity: 45494, lat: 38.6226, lng: -90.1928, team: "St. Louis Cardinals", league: "MLB" },
  // National League West
  { id: "mlb-dbacks", name: "Chase Field", city: "Phoenix", country: "USA", sport: "Baseball", capacity: 48519, lat: 33.4455, lng: -112.0667, team: "Arizona Diamondbacks", league: "MLB" },
  { id: "mlb-rockies", name: "Coors Field", city: "Denver", country: "USA", sport: "Baseball", capacity: 50144, lat: 39.7559, lng: -104.9942, team: "Colorado Rockies", league: "MLB" },
  { id: "mlb-dodgers", name: "Dodger Stadium", city: "Los Angeles", country: "USA", sport: "Baseball", capacity: 56000, lat: 34.0739, lng: -118.2400, team: "Los Angeles Dodgers", league: "MLB" },
  { id: "mlb-padres", name: "Petco Park", city: "San Diego", country: "USA", sport: "Baseball", capacity: 40209, lat: 32.7076, lng: -117.1570, team: "San Diego Padres", league: "MLB" },
  { id: "mlb-giants", name: "Oracle Park", city: "San Francisco", country: "USA", sport: "Baseball", capacity: 41915, lat: 37.7786, lng: -122.3893, team: "San Francisco Giants", league: "MLB" },
];
