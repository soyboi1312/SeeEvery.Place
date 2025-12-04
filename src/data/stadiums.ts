export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  sport: string;
  capacity: number;
  lat: number;
  lng: number;
  team?: string;
  league?: string;
}

// Professional sports stadiums - MLB, NFL, NBA, NHL, MLS + International
export const stadiums: Stadium[] = [
  // =====================
  // MLB - Major League Baseball (30 teams)
  // =====================
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

  // =====================
  // NFL - National Football League (32 teams)
  // =====================
  // AFC East
  { id: "nfl-bills", name: "Highmark Stadium", city: "Orchard Park", country: "USA", sport: "American Football", capacity: 71608, lat: 42.7738, lng: -78.7870, team: "Buffalo Bills", league: "NFL" },
  { id: "nfl-dolphins", name: "Hard Rock Stadium", city: "Miami Gardens", country: "USA", sport: "American Football", capacity: 65326, lat: 25.9580, lng: -80.2389, team: "Miami Dolphins", league: "NFL" },
  { id: "nfl-patriots", name: "Gillette Stadium", city: "Foxborough", country: "USA", sport: "American Football", capacity: 65878, lat: 42.0909, lng: -71.2643, team: "New England Patriots", league: "NFL" },
  { id: "nfl-jets", name: "MetLife Stadium", city: "East Rutherford", country: "USA", sport: "American Football", capacity: 82500, lat: 40.8128, lng: -74.0742, team: "New York Jets", league: "NFL" },
  // AFC North
  { id: "nfl-ravens", name: "M&T Bank Stadium", city: "Baltimore", country: "USA", sport: "American Football", capacity: 71008, lat: 39.2780, lng: -76.6227, team: "Baltimore Ravens", league: "NFL" },
  { id: "nfl-bengals", name: "Paycor Stadium", city: "Cincinnati", country: "USA", sport: "American Football", capacity: 65515, lat: 39.0955, lng: -84.5161, team: "Cincinnati Bengals", league: "NFL" },
  { id: "nfl-browns", name: "Cleveland Browns Stadium", city: "Cleveland", country: "USA", sport: "American Football", capacity: 67431, lat: 41.5061, lng: -81.6995, team: "Cleveland Browns", league: "NFL" },
  { id: "nfl-steelers", name: "Acrisure Stadium", city: "Pittsburgh", country: "USA", sport: "American Football", capacity: 68400, lat: 40.4468, lng: -80.0158, team: "Pittsburgh Steelers", league: "NFL" },
  // AFC South
  { id: "nfl-texans", name: "NRG Stadium", city: "Houston", country: "USA", sport: "American Football", capacity: 72220, lat: 29.6847, lng: -95.4107, team: "Houston Texans", league: "NFL" },
  { id: "nfl-colts", name: "Lucas Oil Stadium", city: "Indianapolis", country: "USA", sport: "American Football", capacity: 67000, lat: 39.7601, lng: -86.1639, team: "Indianapolis Colts", league: "NFL" },
  { id: "nfl-jaguars", name: "EverBank Stadium", city: "Jacksonville", country: "USA", sport: "American Football", capacity: 67814, lat: 30.3239, lng: -81.6373, team: "Jacksonville Jaguars", league: "NFL" },
  { id: "nfl-titans", name: "Nissan Stadium", city: "Nashville", country: "USA", sport: "American Football", capacity: 69143, lat: 36.1665, lng: -86.7713, team: "Tennessee Titans", league: "NFL" },
  // AFC West
  { id: "nfl-broncos", name: "Empower Field at Mile High", city: "Denver", country: "USA", sport: "American Football", capacity: 76125, lat: 39.7439, lng: -105.0201, team: "Denver Broncos", league: "NFL" },
  { id: "nfl-chiefs", name: "Arrowhead Stadium", city: "Kansas City", country: "USA", sport: "American Football", capacity: 76416, lat: 39.0489, lng: -94.4839, team: "Kansas City Chiefs", league: "NFL" },
  { id: "nfl-raiders", name: "Allegiant Stadium", city: "Las Vegas", country: "USA", sport: "American Football", capacity: 65000, lat: 36.0909, lng: -115.1833, team: "Las Vegas Raiders", league: "NFL" },
  { id: "nfl-chargers", name: "SoFi Stadium", city: "Inglewood", country: "USA", sport: "American Football", capacity: 70240, lat: 33.9534, lng: -118.3392, team: "Los Angeles Chargers", league: "NFL" },
  // NFC East
  { id: "nfl-cowboys", name: "AT&T Stadium", city: "Arlington", country: "USA", sport: "American Football", capacity: 80000, lat: 32.7473, lng: -97.0945, team: "Dallas Cowboys", league: "NFL" },
  { id: "nfl-giants", name: "MetLife Stadium (Giants)", city: "East Rutherford", country: "USA", sport: "American Football", capacity: 82500, lat: 40.8135, lng: -74.0745, team: "New York Giants", league: "NFL" },
  { id: "nfl-eagles", name: "Lincoln Financial Field", city: "Philadelphia", country: "USA", sport: "American Football", capacity: 69796, lat: 39.9008, lng: -75.1675, team: "Philadelphia Eagles", league: "NFL" },
  { id: "nfl-commanders", name: "Commanders Field", city: "Landover", country: "USA", sport: "American Football", capacity: 67617, lat: 38.9076, lng: -76.8645, team: "Washington Commanders", league: "NFL" },
  // NFC North
  { id: "nfl-bears", name: "Soldier Field", city: "Chicago", country: "USA", sport: "American Football", capacity: 61500, lat: 41.8623, lng: -87.6167, team: "Chicago Bears", league: "NFL" },
  { id: "nfl-lions", name: "Ford Field", city: "Detroit", country: "USA", sport: "American Football", capacity: 65000, lat: 42.3400, lng: -83.0456, team: "Detroit Lions", league: "NFL" },
  { id: "nfl-packers", name: "Lambeau Field", city: "Green Bay", country: "USA", sport: "American Football", capacity: 81441, lat: 44.5013, lng: -88.0622, team: "Green Bay Packers", league: "NFL" },
  { id: "nfl-vikings", name: "U.S. Bank Stadium", city: "Minneapolis", country: "USA", sport: "American Football", capacity: 66860, lat: 44.9737, lng: -93.2575, team: "Minnesota Vikings", league: "NFL" },
  // NFC South
  { id: "nfl-falcons", name: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", sport: "American Football", capacity: 71000, lat: 33.7553, lng: -84.4006, team: "Atlanta Falcons", league: "NFL" },
  { id: "nfl-panthers", name: "Bank of America Stadium", city: "Charlotte", country: "USA", sport: "American Football", capacity: 74867, lat: 35.2258, lng: -80.8528, team: "Carolina Panthers", league: "NFL" },
  { id: "nfl-saints", name: "Caesars Superdome", city: "New Orleans", country: "USA", sport: "American Football", capacity: 73208, lat: 29.9511, lng: -90.0812, team: "New Orleans Saints", league: "NFL" },
  { id: "nfl-bucs", name: "Raymond James Stadium", city: "Tampa", country: "USA", sport: "American Football", capacity: 69218, lat: 27.9759, lng: -82.5033, team: "Tampa Bay Buccaneers", league: "NFL" },
  // NFC West
  { id: "nfl-cardinals", name: "State Farm Stadium", city: "Glendale", country: "USA", sport: "American Football", capacity: 63400, lat: 33.5276, lng: -112.2626, team: "Arizona Cardinals", league: "NFL" },
  { id: "nfl-rams", name: "SoFi Stadium (Rams)", city: "Inglewood", country: "USA", sport: "American Football", capacity: 70240, lat: 33.9536, lng: -118.3390, team: "Los Angeles Rams", league: "NFL" },
  { id: "nfl-49ers", name: "Levi's Stadium", city: "Santa Clara", country: "USA", sport: "American Football", capacity: 68500, lat: 37.4033, lng: -121.9694, team: "San Francisco 49ers", league: "NFL" },
  { id: "nfl-seahawks", name: "Lumen Field", city: "Seattle", country: "USA", sport: "American Football", capacity: 68740, lat: 47.5952, lng: -122.3316, team: "Seattle Seahawks", league: "NFL" },

  // =====================
  // NBA - National Basketball Association (30 teams)
  // =====================
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

  // =====================
  // NHL - National Hockey League (32 teams)
  // =====================
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

  // =====================
  // MLS - Major League Soccer (29 teams)
  // =====================
  { id: "mls-atlanta", name: "Mercedes-Benz Stadium (MLS)", city: "Atlanta", country: "USA", sport: "Football", capacity: 42500, lat: 33.7553, lng: -84.4006, team: "Atlanta United FC", league: "MLS" },
  { id: "mls-austin", name: "Q2 Stadium", city: "Austin", country: "USA", sport: "Football", capacity: 20738, lat: 30.3874, lng: -97.7191, team: "Austin FC", league: "MLS" },
  { id: "mls-charlotte", name: "Bank of America Stadium (MLS)", city: "Charlotte", country: "USA", sport: "Football", capacity: 38000, lat: 35.2258, lng: -80.8528, team: "Charlotte FC", league: "MLS" },
  { id: "mls-chicago", name: "Soldier Field (MLS)", city: "Chicago", country: "USA", sport: "Football", capacity: 61500, lat: 41.8623, lng: -87.6167, team: "Chicago Fire FC", league: "MLS" },
  { id: "mls-cincinnati", name: "TQL Stadium", city: "Cincinnati", country: "USA", sport: "Football", capacity: 26000, lat: 39.1112, lng: -84.5231, team: "FC Cincinnati", league: "MLS" },
  { id: "mls-colorado", name: "Dick's Sporting Goods Park", city: "Commerce City", country: "USA", sport: "Football", capacity: 18061, lat: 39.8056, lng: -104.8919, team: "Colorado Rapids", league: "MLS" },
  { id: "mls-columbus", name: "Lower.com Field", city: "Columbus", country: "USA", sport: "Football", capacity: 20371, lat: 39.9689, lng: -83.0170, team: "Columbus Crew", league: "MLS" },
  { id: "mls-dallas", name: "Toyota Stadium", city: "Frisco", country: "USA", sport: "Football", capacity: 20500, lat: 33.1545, lng: -96.8353, team: "FC Dallas", league: "MLS" },
  { id: "mls-houston", name: "Shell Energy Stadium", city: "Houston", country: "USA", sport: "Football", capacity: 22039, lat: 29.7523, lng: -95.3524, team: "Houston Dynamo FC", league: "MLS" },
  { id: "mls-lafc", name: "BMO Stadium", city: "Los Angeles", country: "USA", sport: "Football", capacity: 22000, lat: 34.0129, lng: -118.2847, team: "Los Angeles FC", league: "MLS" },
  { id: "mls-lagalaxy", name: "Dignity Health Sports Park", city: "Carson", country: "USA", sport: "Football", capacity: 27000, lat: 33.8644, lng: -118.2611, team: "LA Galaxy", league: "MLS" },
  { id: "mls-miami", name: "Chase Stadium", city: "Fort Lauderdale", country: "USA", sport: "Football", capacity: 21550, lat: 26.1929, lng: -80.1599, team: "Inter Miami CF", league: "MLS" },
  { id: "mls-minnesota", name: "Allianz Field", city: "St. Paul", country: "USA", sport: "Football", capacity: 19400, lat: 44.9528, lng: -93.1653, team: "Minnesota United FC", league: "MLS" },
  { id: "mls-montreal", name: "Saputo Stadium", city: "Montreal", country: "Canada", sport: "Football", capacity: 19619, lat: 45.5628, lng: -73.5528, team: "CF Montreal", league: "MLS" },
  { id: "mls-nashville", name: "Geodis Park", city: "Nashville", country: "USA", sport: "Football", capacity: 30000, lat: 36.1313, lng: -86.7654, team: "Nashville SC", league: "MLS" },
  { id: "mls-newengland", name: "Gillette Stadium (MLS)", city: "Foxborough", country: "USA", sport: "Football", capacity: 20000, lat: 42.0909, lng: -71.2643, team: "New England Revolution", league: "MLS" },
  { id: "mls-nycfc", name: "Yankee Stadium (MLS)", city: "Bronx", country: "USA", sport: "Football", capacity: 30321, lat: 40.8296, lng: -73.9262, team: "New York City FC", league: "MLS" },
  { id: "mls-redbulls", name: "Red Bull Arena", city: "Harrison", country: "USA", sport: "Football", capacity: 25000, lat: 40.7368, lng: -74.1503, team: "New York Red Bulls", league: "MLS" },
  { id: "mls-orlando", name: "Inter&Co Stadium", city: "Orlando", country: "USA", sport: "Football", capacity: 25500, lat: 28.5412, lng: -81.3892, team: "Orlando City SC", league: "MLS" },
  { id: "mls-philadelphia", name: "Subaru Park", city: "Chester", country: "USA", sport: "Football", capacity: 18500, lat: 39.8328, lng: -75.3789, team: "Philadelphia Union", league: "MLS" },
  { id: "mls-portland", name: "Providence Park", city: "Portland", country: "USA", sport: "Football", capacity: 25218, lat: 45.5217, lng: -122.6917, team: "Portland Timbers", league: "MLS" },
  { id: "mls-saltlake", name: "America First Field", city: "Sandy", country: "USA", sport: "Football", capacity: 20213, lat: 40.5830, lng: -111.8933, team: "Real Salt Lake", league: "MLS" },
  { id: "mls-sanjose", name: "PayPal Park", city: "San Jose", country: "USA", sport: "Football", capacity: 18000, lat: 37.3514, lng: -121.9250, team: "San Jose Earthquakes", league: "MLS" },
  { id: "mls-seattle", name: "Lumen Field (MLS)", city: "Seattle", country: "USA", sport: "Football", capacity: 37722, lat: 47.5952, lng: -122.3316, team: "Seattle Sounders FC", league: "MLS" },
  { id: "mls-sporting", name: "Children's Mercy Park", city: "Kansas City", country: "USA", sport: "Football", capacity: 18467, lat: 39.1218, lng: -94.8231, team: "Sporting Kansas City", league: "MLS" },
  { id: "mls-stlouis", name: "CityPark", city: "St. Louis", country: "USA", sport: "Football", capacity: 22500, lat: 38.6322, lng: -90.2088, team: "St. Louis City SC", league: "MLS" },
  { id: "mls-toronto", name: "BMO Field", city: "Toronto", country: "Canada", sport: "Football", capacity: 30000, lat: 43.6332, lng: -79.4185, team: "Toronto FC", league: "MLS" },
  { id: "mls-vancouver", name: "BC Place", city: "Vancouver", country: "Canada", sport: "Football", capacity: 22120, lat: 49.2768, lng: -123.1119, team: "Vancouver Whitecaps FC", league: "MLS" },
  { id: "mls-dc", name: "Audi Field", city: "Washington", country: "USA", sport: "Football", capacity: 20000, lat: 38.8686, lng: -77.0128, team: "D.C. United", league: "MLS" },
  // MLS Expansion Teams
  { id: "mls-sandiego", name: "Snapdragon Stadium", city: "San Diego", country: "USA", sport: "Football", capacity: 35000, lat: 32.7839, lng: -117.1208, team: "San Diego FC", league: "MLS" },

  // =====================
  // International Football (Soccer) Stadiums
  // =====================
  { id: "camp-nou", name: "Camp Nou", city: "Barcelona", country: "Spain", sport: "Football", capacity: 99354, lat: 41.3809, lng: 2.1228 },
  { id: "santiago-bernabeu", name: "Santiago Bernabéu", city: "Madrid", country: "Spain", sport: "Football", capacity: 81044, lat: 40.4531, lng: -3.6883 },
  { id: "old-trafford", name: "Old Trafford", city: "Manchester", country: "UK", sport: "Football", capacity: 74310, lat: 53.4631, lng: -2.2913 },
  { id: "wembley", name: "Wembley Stadium", city: "London", country: "UK", sport: "Football", capacity: 90000, lat: 51.5560, lng: -0.2795 },
  { id: "allianz-arena", name: "Allianz Arena", city: "Munich", country: "Germany", sport: "Football", capacity: 75000, lat: 48.2188, lng: 11.6247 },
  { id: "signal-iduna", name: "Signal Iduna Park", city: "Dortmund", country: "Germany", sport: "Football", capacity: 81365, lat: 51.4926, lng: 7.4518 },
  { id: "san-siro", name: "San Siro", city: "Milan", country: "Italy", sport: "Football", capacity: 80018, lat: 45.4781, lng: 9.1240 },
  { id: "maracana", name: "Maracanã", city: "Rio de Janeiro", country: "Brazil", sport: "Football", capacity: 78838, lat: -22.9121, lng: -43.2302 },
  { id: "anfield", name: "Anfield", city: "Liverpool", country: "UK", sport: "Football", capacity: 61276, lat: 53.4308, lng: -2.9608 },
  { id: "emirates", name: "Emirates Stadium", city: "London", country: "UK", sport: "Football", capacity: 60260, lat: 51.5549, lng: -0.1084 },
  { id: "parc-des-princes", name: "Parc des Princes", city: "Paris", country: "France", sport: "Football", capacity: 47929, lat: 48.8414, lng: 2.2530 },
  { id: "azteca", name: "Estadio Azteca", city: "Mexico City", country: "Mexico", sport: "Football", capacity: 87523, lat: 19.3029, lng: -99.1505 },
  { id: "la-bombonera", name: "La Bombonera", city: "Buenos Aires", country: "Argentina", sport: "Football", capacity: 54000, lat: -34.6356, lng: -58.3647 },
  { id: "stamford-bridge", name: "Stamford Bridge", city: "London", country: "UK", sport: "Football", capacity: 40341, lat: 51.4817, lng: -0.1910 },
  { id: "tottenham-stadium", name: "Tottenham Hotspur Stadium", city: "London", country: "UK", sport: "Football", capacity: 62850, lat: 51.6043, lng: -0.0662 },
  { id: "allianz-stadium-juve", name: "Allianz Stadium", city: "Turin", country: "Italy", sport: "Football", capacity: 41507, lat: 45.1096, lng: 7.6413 },
  { id: "estadio-da-luz", name: "Estádio da Luz", city: "Lisbon", country: "Portugal", sport: "Football", capacity: 64642, lat: 38.7527, lng: -9.1847 },
  { id: "stade-velodrome", name: "Stade Vélodrome", city: "Marseille", country: "France", sport: "Football", capacity: 67394, lat: 43.2697, lng: 5.3959 },

  // =====================
  // International Baseball
  // =====================
  { id: "tokyo-dome", name: "Tokyo Dome", city: "Tokyo", country: "Japan", sport: "Baseball", capacity: 55000, lat: 35.7056, lng: 139.7519 },
  { id: "koshien", name: "Hanshin Koshien Stadium", city: "Nishinomiya", country: "Japan", sport: "Baseball", capacity: 47508, lat: 34.7211, lng: 135.3619 },
  { id: "jamsil", name: "Jamsil Baseball Stadium", city: "Seoul", country: "South Korea", sport: "Baseball", capacity: 25553, lat: 37.5122, lng: 127.0719 },

  // =====================
  // Cricket Stadiums
  // =====================
  // Australia
  { id: "mcg", name: "Melbourne Cricket Ground", city: "Melbourne", country: "Australia", sport: "Cricket", capacity: 100024, lat: -37.8200, lng: 144.9834 },
  { id: "scg", name: "Sydney Cricket Ground", city: "Sydney", country: "Australia", sport: "Cricket", capacity: 48000, lat: -33.8917, lng: 151.2247 },
  { id: "adelaide-oval", name: "Adelaide Oval", city: "Adelaide", country: "Australia", sport: "Cricket", capacity: 53583, lat: -34.9156, lng: 138.5961 },
  { id: "gabba", name: "The Gabba", city: "Brisbane", country: "Australia", sport: "Cricket", capacity: 42000, lat: -27.4858, lng: 153.0381 },
  { id: "waca", name: "WACA Ground", city: "Perth", country: "Australia", sport: "Cricket", capacity: 24500, lat: -31.9603, lng: 115.8792 },
  { id: "optus-stadium", name: "Optus Stadium", city: "Perth", country: "Australia", sport: "Cricket", capacity: 60000, lat: -31.9512, lng: 115.8891 },
  // England
  { id: "lords", name: "Lord's Cricket Ground", city: "London", country: "UK", sport: "Cricket", capacity: 30000, lat: 51.5294, lng: -0.1729 },
  { id: "the-oval", name: "The Oval", city: "London", country: "UK", sport: "Cricket", capacity: 25500, lat: 51.4837, lng: -0.1152 },
  { id: "edgbaston", name: "Edgbaston Cricket Ground", city: "Birmingham", country: "UK", sport: "Cricket", capacity: 25000, lat: 52.4559, lng: -1.9025 },
  { id: "old-trafford-cricket", name: "Old Trafford Cricket Ground", city: "Manchester", country: "UK", sport: "Cricket", capacity: 26000, lat: 53.4569, lng: -2.2875 },
  { id: "headingley", name: "Headingley Cricket Ground", city: "Leeds", country: "UK", sport: "Cricket", capacity: 18350, lat: 53.8178, lng: -1.5822 },
  { id: "trent-bridge", name: "Trent Bridge", city: "Nottingham", country: "UK", sport: "Cricket", capacity: 17500, lat: 52.9369, lng: -1.1319 },
  { id: "rose-bowl", name: "The Rose Bowl", city: "Southampton", country: "UK", sport: "Cricket", capacity: 25000, lat: 50.9244, lng: -1.3222 },
  // India
  { id: "eden-gardens", name: "Eden Gardens", city: "Kolkata", country: "India", sport: "Cricket", capacity: 68000, lat: 22.5647, lng: 88.3433 },
  { id: "wankhede", name: "Wankhede Stadium", city: "Mumbai", country: "India", sport: "Cricket", capacity: 33108, lat: 18.9389, lng: 72.8258 },
  { id: "narendra-modi", name: "Narendra Modi Stadium", city: "Ahmedabad", country: "India", sport: "Cricket", capacity: 132000, lat: 23.0920, lng: 72.5967 },
  { id: "chinnaswamy", name: "M. Chinnaswamy Stadium", city: "Bangalore", country: "India", sport: "Cricket", capacity: 40000, lat: 12.9788, lng: 77.5996 },
  { id: "chidambaram", name: "MA Chidambaram Stadium", city: "Chennai", country: "India", sport: "Cricket", capacity: 50000, lat: 13.0627, lng: 80.2792 },
  { id: "feroz-shah-kotla", name: "Arun Jaitley Stadium", city: "Delhi", country: "India", sport: "Cricket", capacity: 41820, lat: 28.6377, lng: 77.2433 },
  { id: "rajiv-gandhi", name: "Rajiv Gandhi International Stadium", city: "Hyderabad", country: "India", sport: "Cricket", capacity: 55000, lat: 17.4065, lng: 78.5507 },
  { id: "punjab-cricket", name: "Punjab Cricket Association Stadium", city: "Mohali", country: "India", sport: "Cricket", capacity: 26950, lat: 30.6928, lng: 76.7377 },
  // Pakistan
  { id: "national-karachi", name: "National Stadium", city: "Karachi", country: "Pakistan", sport: "Cricket", capacity: 34228, lat: 24.8925, lng: 67.0675 },
  { id: "gaddafi-stadium", name: "Gaddafi Stadium", city: "Lahore", country: "Pakistan", sport: "Cricket", capacity: 27000, lat: 31.5136, lng: 74.3358 },
  { id: "rawalpindi-cricket", name: "Rawalpindi Cricket Stadium", city: "Rawalpindi", country: "Pakistan", sport: "Cricket", capacity: 15000, lat: 33.6167, lng: 73.0833 },
  // South Africa
  { id: "newlands", name: "Newlands Cricket Ground", city: "Cape Town", country: "South Africa", sport: "Cricket", capacity: 25000, lat: -33.9281, lng: 18.4394 },
  { id: "wanderers", name: "The Wanderers Stadium", city: "Johannesburg", country: "South Africa", sport: "Cricket", capacity: 34000, lat: -26.1328, lng: 28.0561 },
  { id: "supersport-park", name: "SuperSport Park", city: "Centurion", country: "South Africa", sport: "Cricket", capacity: 22000, lat: -25.8103, lng: 28.2128 },
  { id: "kingsmead", name: "Kingsmead Cricket Ground", city: "Durban", country: "South Africa", sport: "Cricket", capacity: 25000, lat: -29.8528, lng: 31.0192 },
  // New Zealand
  { id: "basin-reserve", name: "Basin Reserve", city: "Wellington", country: "New Zealand", sport: "Cricket", capacity: 11600, lat: -41.2969, lng: 174.7781 },
  { id: "hagley-oval", name: "Hagley Oval", city: "Christchurch", country: "New Zealand", sport: "Cricket", capacity: 20000, lat: -43.5256, lng: 172.6197 },
  { id: "eden-park-cricket", name: "Eden Park (Cricket)", city: "Auckland", country: "New Zealand", sport: "Cricket", capacity: 50000, lat: -36.8746, lng: 174.7448 },
  // West Indies
  { id: "kensington-oval", name: "Kensington Oval", city: "Bridgetown", country: "Barbados", sport: "Cricket", capacity: 28000, lat: 13.1075, lng: -59.6231 },
  { id: "sabina-park", name: "Sabina Park", city: "Kingston", country: "Jamaica", sport: "Cricket", capacity: 20000, lat: 17.9886, lng: -76.7828 },
  { id: "queens-park-oval", name: "Queen's Park Oval", city: "Port of Spain", country: "Trinidad", sport: "Cricket", capacity: 25000, lat: 10.6714, lng: -61.5086 },
  // Sri Lanka
  { id: "r-premadasa", name: "R. Premadasa Stadium", city: "Colombo", country: "Sri Lanka", sport: "Cricket", capacity: 35000, lat: 6.9147, lng: 79.8628 },
  { id: "galle-international", name: "Galle International Stadium", city: "Galle", country: "Sri Lanka", sport: "Cricket", capacity: 35000, lat: 6.0328, lng: 80.2150 },
  { id: "pallekele", name: "Pallekele International Stadium", city: "Kandy", country: "Sri Lanka", sport: "Cricket", capacity: 35000, lat: 7.2164, lng: 80.6828 },
  // Bangladesh
  { id: "sher-e-bangla", name: "Sher-e-Bangla Stadium", city: "Dhaka", country: "Bangladesh", sport: "Cricket", capacity: 26000, lat: 23.8067, lng: 90.3678 },
  // Zimbabwe
  { id: "harare-sports-club", name: "Harare Sports Club", city: "Harare", country: "Zimbabwe", sport: "Cricket", capacity: 10000, lat: -17.8111, lng: 31.0456 },
  // UAE
  { id: "dubai-cricket", name: "Dubai International Cricket Stadium", city: "Dubai", country: "UAE", sport: "Cricket", capacity: 25000, lat: 25.0478, lng: 55.2078 },
  { id: "sheikh-zayed", name: "Sheikh Zayed Cricket Stadium", city: "Abu Dhabi", country: "UAE", sport: "Cricket", capacity: 20000, lat: 24.4672, lng: 54.3833 },

  // =====================
  // Rugby Stadiums
  // =====================
  { id: "twickenham", name: "Twickenham Stadium", city: "London", country: "UK", sport: "Rugby", capacity: 82000, lat: 51.4559, lng: -0.3415 },
  { id: "stade-de-france", name: "Stade de France", city: "Paris", country: "France", sport: "Rugby", capacity: 81338, lat: 48.9244, lng: 2.3601 },
  { id: "eden-park", name: "Eden Park", city: "Auckland", country: "New Zealand", sport: "Rugby", capacity: 50000, lat: -36.8746, lng: 174.7448 },
  { id: "principality", name: "Principality Stadium", city: "Cardiff", country: "UK", sport: "Rugby", capacity: 73931, lat: 51.4782, lng: -3.1826 },
  { id: "aviva-stadium", name: "Aviva Stadium", city: "Dublin", country: "Ireland", sport: "Rugby", capacity: 51700, lat: 53.3353, lng: -6.2289 },
  { id: "ellis-park", name: "Ellis Park Stadium", city: "Johannesburg", country: "South Africa", sport: "Rugby", capacity: 62567, lat: -26.1987, lng: 28.0561 },

  // =====================
  // Tennis Stadiums
  // =====================
  // Grand Slam Venues
  { id: "arthur-ashe", name: "Arthur Ashe Stadium", city: "New York", country: "USA", sport: "Tennis", capacity: 23771, lat: 40.7498, lng: -73.8458, league: "US Open" },
  { id: "louis-armstrong", name: "Louis Armstrong Stadium", city: "New York", country: "USA", sport: "Tennis", capacity: 14053, lat: 40.7503, lng: -73.8467, league: "US Open" },
  { id: "centre-court", name: "Centre Court (Wimbledon)", city: "London", country: "UK", sport: "Tennis", capacity: 14979, lat: 51.4340, lng: -0.2135, league: "Wimbledon" },
  { id: "court-1-wimbledon", name: "No.1 Court (Wimbledon)", city: "London", country: "UK", sport: "Tennis", capacity: 12345, lat: 51.4335, lng: -0.2140, league: "Wimbledon" },
  { id: "rod-laver", name: "Rod Laver Arena", city: "Melbourne", country: "Australia", sport: "Tennis", capacity: 14820, lat: -37.8215, lng: 144.9784, league: "Australian Open" },
  { id: "margaret-court", name: "Margaret Court Arena", city: "Melbourne", country: "Australia", sport: "Tennis", capacity: 7500, lat: -37.8219, lng: 144.9792, league: "Australian Open" },
  { id: "john-cain", name: "John Cain Arena", city: "Melbourne", country: "Australia", sport: "Tennis", capacity: 10500, lat: -37.8208, lng: 144.9778, league: "Australian Open" },
  { id: "philippe-chatrier", name: "Court Philippe-Chatrier", city: "Paris", country: "France", sport: "Tennis", capacity: 15225, lat: 48.8469, lng: 2.2530, league: "French Open" },
  { id: "court-suzanne-lenglen", name: "Court Suzanne-Lenglen", city: "Paris", country: "France", sport: "Tennis", capacity: 10068, lat: 48.8461, lng: 2.2522, league: "French Open" },
  // ATP Masters 1000 / WTA 1000 Venues
  { id: "indian-wells", name: "Indian Wells Tennis Garden", city: "Indian Wells", country: "USA", sport: "Tennis", capacity: 16100, lat: 33.7239, lng: -116.3056, league: "ATP/WTA" },
  { id: "hard-rock-tennis", name: "Hard Rock Stadium (Tennis)", city: "Miami", country: "USA", sport: "Tennis", capacity: 14000, lat: 25.9580, lng: -80.2389, league: "ATP/WTA" },
  { id: "monte-carlo-tennis", name: "Monte-Carlo Country Club", city: "Monte Carlo", country: "Monaco", sport: "Tennis", capacity: 10200, lat: 43.7536, lng: 7.4406, league: "ATP" },
  { id: "caja-magica", name: "Caja Mágica", city: "Madrid", country: "Spain", sport: "Tennis", capacity: 12442, lat: 40.3722, lng: -3.6878, league: "ATP/WTA" },
  { id: "foro-italico", name: "Foro Italico", city: "Rome", country: "Italy", sport: "Tennis", capacity: 10500, lat: 41.9331, lng: 12.4550, league: "ATP/WTA" },
  { id: "iga-swiatek-arena", name: "IGA Stadium", city: "Montreal", country: "Canada", sport: "Tennis", capacity: 12126, lat: 45.5306, lng: -73.6250, league: "ATP/WTA" },
  { id: "sobeys-stadium", name: "Sobeys Stadium", city: "Toronto", country: "Canada", sport: "Tennis", capacity: 12500, lat: 43.7711, lng: -79.5111, league: "ATP/WTA" },
  { id: "lindner-family", name: "Lindner Family Tennis Center", city: "Cincinnati", country: "USA", sport: "Tennis", capacity: 11400, lat: 39.3472, lng: -84.3744, league: "ATP/WTA" },
  { id: "qizhong-forest", name: "Qizhong Forest Sports City Arena", city: "Shanghai", country: "China", sport: "Tennis", capacity: 15000, lat: 31.1431, lng: 121.3519, league: "ATP" },
  // ATP Finals / WTA Finals
  { id: "pala-alpitour", name: "Pala Alpitour", city: "Turin", country: "Italy", sport: "Tennis", capacity: 15000, lat: 45.0425, lng: 7.6619, league: "ATP Finals" },
  { id: "o2-arena-tennis", name: "The O2 Arena", city: "London", country: "UK", sport: "Tennis", capacity: 17500, lat: 51.5030, lng: 0.0032, league: "ATP Finals" },
  // Other Major Tennis Venues
  { id: "bercy", name: "Accor Arena (Paris-Bercy)", city: "Paris", country: "France", sport: "Tennis", capacity: 15609, lat: 48.8383, lng: 2.3781, league: "ATP" },
  { id: "dubai-tennis", name: "Dubai Tennis Stadium", city: "Dubai", country: "UAE", sport: "Tennis", capacity: 5000, lat: 25.2128, lng: 55.2519, league: "ATP/WTA" },
  { id: "qatar-tennis", name: "Khalifa International Tennis Complex", city: "Doha", country: "Qatar", sport: "Tennis", capacity: 7000, lat: 25.2597, lng: 51.4511, league: "ATP/WTA" },
  { id: "ariake-coliseum", name: "Ariake Coliseum", city: "Tokyo", country: "Japan", sport: "Tennis", capacity: 10000, lat: 35.6353, lng: 139.7903, league: "ATP/WTA" },
  { id: "abierto-mexicano", name: "Arena GNP Seguros", city: "Acapulco", country: "Mexico", sport: "Tennis", capacity: 6500, lat: 16.8589, lng: -99.8769, league: "ATP/WTA" },
  { id: "queen-s-club", name: "Queen's Club", city: "London", country: "UK", sport: "Tennis", capacity: 7500, lat: 51.4872, lng: -0.2144, league: "ATP" },
  { id: "halle-tennis", name: "OWL Arena", city: "Halle", country: "Germany", sport: "Tennis", capacity: 12300, lat: 52.0625, lng: 8.3508, league: "ATP" },
  { id: "us-open-grandstand", name: "Grandstand (US Open)", city: "New York", country: "USA", sport: "Tennis", capacity: 8125, lat: 40.7489, lng: -73.8442, league: "US Open" },

  // =====================
  // Motorsport Circuits
  // =====================
  { id: "monaco", name: "Circuit de Monaco", city: "Monte Carlo", country: "Monaco", sport: "Motorsport", capacity: 37000, lat: 43.7347, lng: 7.4206 },
  { id: "silverstone", name: "Silverstone Circuit", city: "Silverstone", country: "UK", sport: "Motorsport", capacity: 150000, lat: 52.0786, lng: -1.0169 },
  { id: "monza", name: "Autodromo di Monza", city: "Monza", country: "Italy", sport: "Motorsport", capacity: 113000, lat: 45.6156, lng: 9.2811 },
  { id: "indy", name: "Indianapolis Motor Speedway", city: "Indianapolis", country: "USA", sport: "Motorsport", capacity: 257325, lat: 39.7950, lng: -86.2353 },
  { id: "daytona", name: "Daytona International Speedway", city: "Daytona Beach", country: "USA", sport: "Motorsport", capacity: 101500, lat: 29.1852, lng: -81.0705 },
  { id: "spa", name: "Circuit de Spa-Francorchamps", city: "Spa", country: "Belgium", sport: "Motorsport", capacity: 70000, lat: 50.4372, lng: 5.9714 },
  { id: "suzuka", name: "Suzuka International Racing Course", city: "Suzuka", country: "Japan", sport: "Motorsport", capacity: 155000, lat: 34.8431, lng: 136.5340 },
  { id: "interlagos", name: "Autódromo José Carlos Pace", city: "São Paulo", country: "Brazil", sport: "Motorsport", capacity: 60000, lat: -23.7036, lng: -46.6975 },
  { id: "yas-marina", name: "Yas Marina Circuit", city: "Abu Dhabi", country: "UAE", sport: "Motorsport", capacity: 60000, lat: 24.4672, lng: 54.6031 },
  { id: "cota", name: "Circuit of the Americas", city: "Austin", country: "USA", sport: "Motorsport", capacity: 120000, lat: 30.1327, lng: -97.6412 },
];

export const sports = ["Baseball", "American Football", "Basketball", "Hockey", "Football", "Cricket", "Rugby", "Tennis", "Motorsport"];

export const leagues = ["MLB", "NFL", "NBA", "NHL", "MLS"];

export const getStadiumsBySport = (sport: string) =>
  stadiums.filter(s => s.sport === sport);

export const getStadiumsByLeague = (league: string) =>
  stadiums.filter(s => s.league === league);

export const getStadiumsByCountry = (country: string) =>
  stadiums.filter(s => s.country === country);

export const getTotalStadiums = () => stadiums.length;
