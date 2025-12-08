import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { Category, categoryLabels, categoryIcons } from '@/lib/types';
import Link from 'next/link';

const categories: Category[] = [
  'countries',
  'states',
  'nationalParks',
  'nationalMonuments',
  'stateParks',
  'fiveKPeaks',
  'fourteeners',
  'museums',
  'mlbStadiums',
  'nflStadiums',
  'nbaStadiums',
  'nhlStadiums',
  'soccerStadiums',
  'f1Tracks',
  'marathons',
  'airports',
  'skiResorts',
  'themeParks',
  'surfingReserves',
  'weirdAmericana',
];

// Category-specific keywords for SEO
const categoryKeywords: Record<Category, string[]> = {
  countries: ['country tracker', 'countries visited map', 'travel map', 'world travel tracker'],
  states: ['US states tracker', 'states visited map', 'road trip tracker', 'USA travel map'],
  nationalParks: ['national parks tracker', 'NPS checklist', 'park passport', 'national park visited'],
  nationalMonuments: ['national monuments tracker', 'US monuments checklist', 'NPS monuments', 'monument bucket list'],
  stateParks: ['state parks tracker', 'state park checklist', 'hiking tracker'],
  fiveKPeaks: ['mountain tracker', '8000ers checklist', 'peak bagging', 'summit tracker'],
  fourteeners: ['14ers tracker', 'fourteener checklist', 'Colorado 14ers', 'high altitude hiking'],
  museums: ['museum tracker', 'museums visited', 'art museum checklist', 'museum bucket list'],
  mlbStadiums: ['MLB stadium tracker', 'ballpark checklist', 'baseball stadium visited'],
  nflStadiums: ['NFL stadium tracker', 'football stadium checklist', 'gridiron bucket list'],
  nbaStadiums: ['NBA arena tracker', 'basketball arena checklist', 'courts visited'],
  nhlStadiums: ['NHL arena tracker', 'hockey arena checklist', 'rinks visited'],
  soccerStadiums: ['soccer stadium tracker', 'football grounds visited', 'pitch checklist'],
  f1Tracks: ['F1 circuit tracker', 'Formula 1 tracks visited', 'Grand Prix checklist'],
  marathons: ['marathon tracker', 'World Marathon Majors', 'running bucket list'],
  airports: ['airport tracker', 'airports visited', 'aviation enthusiast', 'travel hubs'],
  skiResorts: ['ski resort tracker', 'slopes visited', 'skiing bucket list', 'powder destinations'],
  themeParks: ['theme park tracker', 'amusement parks visited', 'Disney checklist', 'roller coaster bucket list'],
  surfingReserves: ['surf spot tracker', 'waves surfed', 'surfing bucket list', 'beach breaks visited'],
  weirdAmericana: ['roadside attractions', 'quirky landmarks', 'weird museums', 'unusual USA sights', 'Americana bucket list'],
};

// Generate JSON-LD structured data for SEO
function generateJsonLd(category: Category, label: string, description: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Track ${label} | See Every Place`,
    description: description,
    url: `${baseUrl}/track/${category}`,
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'See Every Place',
      url: baseUrl,
    },
    keywords: categoryKeywords[category]?.join(', ') || `${label} tracker`,
  };
}

const categoryDescriptions: Record<Category, string> = {
  countries: 'Track all 197 countries around the world. Mark countries as visited or add them to your bucket list.',
  states: 'Track all 50 US states plus Washington DC. Perfect for road trippers and domestic travelers.',
  nationalParks: 'Track National Parks. From Yellowstone to Yosemite, never lose track of your park adventures.',
  nationalMonuments: 'Track US National Monuments. From Devils Tower to the Statue of Liberty, explore 129 protected landmarks.',
  stateParks: 'Track State Parks. Discover hidden gems and scenic wonders across all 50 states.',
  fiveKPeaks: 'Track famous peaks over 5000 meters including the 8000ers and Seven Summits. For mountaineers and summit chasers.',
  fourteeners: 'Track US 14ers - peaks over 14,000 feet. All 58 fourteeners in Colorado, California, and Washington.',
  museums: 'Track world-class museums you have visited. From the Louvre to the Met, keep a record of your cultural experiences.',
  mlbStadiums: 'Track MLB baseball stadiums. From Fenway Park to Dodger Stadium, record every ballpark you have visited.',
  nflStadiums: 'Track NFL football stadiums. From Lambeau Field to SoFi Stadium, mark every gridiron venue.',
  nbaStadiums: 'Track NBA basketball arenas. From Madison Square Garden to Crypto.com Arena, check off every court.',
  nhlStadiums: 'Track NHL hockey arenas. From Bell Centre to TD Garden, record every rink you have visited.',
  soccerStadiums: 'Track famous soccer stadiums worldwide. From Camp Nou to Old Trafford, mark every pitch.',
  f1Tracks: 'Track Formula 1 race tracks. From Monaco to Silverstone, record every Grand Prix circuit you have visited.',
  marathons: 'Track the World Marathon Majors. Boston, London, Berlin, Chicago, New York, and Tokyo.',
  airports: 'Track major airports worldwide. From JFK to Changi, record every hub you have traveled through.',
  skiResorts: 'Track world-class ski resorts. From Whistler to Zermatt, mark every powder paradise you have conquered.',
  themeParks: 'Track theme parks and attractions. From Disney to Universal, check off every magical destination.',
  surfingReserves: 'Track World Surfing Reserves and legendary breaks. From Pipeline to Teahupo\'o, mark every wave you have ridden.',
  weirdAmericana: 'Track quirky roadside attractions across America. From giant balls of twine to mystery spots, collect the weird and wonderful!',
};

// Example places for each category with unique facts and reasons to visit
interface PlaceExample {
  name: string;
  fact: string;
  reason: string;
}

const categoryExamples: Record<Category, PlaceExample[]> = {
  countries: [
    { name: 'Japan', fact: 'Has over 6,800 islands and the world\'s oldest company, founded in 578 AD', reason: 'Experience the perfect blend of ancient temples and cutting-edge technology' },
    { name: 'Iceland', fact: 'Has no mosquitoes and runs almost entirely on renewable geothermal energy', reason: 'Witness the Northern Lights and bathe in natural hot springs' },
    { name: 'New Zealand', fact: 'Was the first country to give women the right to vote in 1893', reason: 'Explore dramatic landscapes from fjords to glowworm caves' },
    { name: 'Morocco', fact: 'Home to the world\'s oldest university, founded in 859 AD', reason: 'Get lost in ancient medinas and experience Sahara desert camping' },
    { name: 'Peru', fact: 'Has 90 different microclimates and over 3,000 varieties of potatoes', reason: 'Trek to Machu Picchu and explore the Sacred Valley' },
    { name: 'Norway', fact: 'Has the longest road tunnel in the world at 24.5 km', reason: 'Cruise through stunning fjords and chase the midnight sun' },
    { name: 'Bhutan', fact: 'The only carbon-negative country in the world', reason: 'Experience Gross National Happiness and pristine Himalayan monasteries' },
    { name: 'Portugal', fact: 'Produced half of the world\'s cork and has the oldest bookstore (1732)', reason: 'Savor pastéis de nata and explore colorful coastal towns' },
  ],
  states: [
    { name: 'Alaska', fact: 'Has more coastline than all other US states combined', reason: 'See glaciers calving into the sea and spot grizzly bears in the wild' },
    { name: 'Hawaii', fact: 'The only US state that grows coffee commercially', reason: 'Experience active volcanoes and world-class snorkeling' },
    { name: 'Montana', fact: 'Has the largest migratory elk herd in the nation', reason: 'Explore Glacier National Park before the glaciers disappear' },
    { name: 'Utah', fact: 'Has the greatest concentration of national parks (5) in the US', reason: 'Hike through otherworldly red rock formations and slot canyons' },
    { name: 'Maine', fact: 'Is the closest US state to Africa', reason: 'Feast on fresh lobster and watch sunrise first in the continental US' },
    { name: 'Louisiana', fact: 'Has parishes instead of counties, the only US state to do so', reason: 'Experience Mardi Gras and authentic Cajun cuisine in New Orleans' },
    { name: 'Wyoming', fact: 'Has the lowest population of any US state with under 600,000 people', reason: 'Visit Yellowstone, the world\'s first national park' },
  ],
  nationalParks: [
    { name: 'Yellowstone', fact: 'Sits atop one of the world\'s largest active volcanic systems', reason: 'See Old Faithful and half the world\'s geothermal features' },
    { name: 'Grand Canyon', fact: 'Contains rocks that are 1.8 billion years old', reason: 'Witness one of the Seven Natural Wonders of the World' },
    { name: 'Zion', fact: 'Has the world\'s largest natural arch, Kolob Arch, at 287 feet', reason: 'Hike the famous Angels Landing trail with chains' },
    { name: 'Yosemite', fact: 'El Capitan is the largest exposed granite monolith in the world', reason: 'See towering waterfalls and giant sequoia trees' },
    { name: 'Acadia', fact: 'First national park established east of the Mississippi River', reason: 'Watch sunrise from Cadillac Mountain, first in the US' },
    { name: 'Denali', fact: 'Contains North America\'s tallest peak at 20,310 feet', reason: 'Spot the Big Five: moose, caribou, wolf, Dall sheep, and grizzly' },
    { name: 'Great Smoky Mountains', fact: 'Most visited national park with over 12 million visitors yearly', reason: 'Experience synchronized firefly displays in early summer' },
    { name: 'Arches', fact: 'Has over 2,000 natural stone arches, the highest density in the world', reason: 'Photograph Delicate Arch at sunset' },
  ],
  nationalMonuments: [
    { name: 'Devils Tower, Wyoming', fact: 'First US National Monument (1906) and featured in Close Encounters of the Third Kind', reason: 'See the iconic 867-foot volcanic rock formation sacred to Native Americans' },
    { name: 'Statue of Liberty, New York', fact: 'Gift from France in 1886, standing 305 feet from ground to torch tip', reason: 'Climb to the crown for unmatched views of New York Harbor' },
    { name: 'Grand Staircase-Escalante, Utah', fact: 'One of the largest monuments at 1.87 million acres with slot canyons', reason: 'Explore remote wilderness with ancient fossils and petroglyphs' },
    { name: 'Muir Woods, California', fact: 'One of the last old-growth coast redwood forests, some trees over 1,000 years old', reason: 'Walk among giants just 12 miles north of San Francisco' },
    { name: 'Bears Ears, Utah', fact: 'Contains over 100,000 archaeological sites from ancient Puebloan cultures', reason: 'Experience one of the most significant cultural landscapes in the US' },
    { name: 'Bandelier, New Mexico', fact: 'Contains cliff dwellings carved into volcanic tuff over 11,000 years ago', reason: 'Climb ladders into ancient Ancestral Puebloan cave homes' },
    { name: 'Craters of the Moon, Idaho', fact: 'Has lava flows so recent that astronauts trained here for the moon missions', reason: 'Walk through an otherworldly volcanic landscape of cinder cones' },
    { name: 'Vermilion Cliffs, Arizona', fact: 'Home to The Wave, one of the most photographed rock formations on Earth', reason: 'Win the permit lottery to see the famous striped sandstone waves' },
  ],
  stateParks: [
    { name: 'Custer State Park, SD', fact: 'Home to one of the largest free-roaming bison herds (1,300+)', reason: 'Drive the Wildlife Loop and witness the annual buffalo roundup' },
    { name: 'Anza-Borrego Desert, CA', fact: 'Largest state park in California at over 600,000 acres', reason: 'See desert wildflower super blooms and metal sculptures' },
    { name: 'Baxter State Park, ME', fact: 'Contains Mount Katahdin, northern terminus of the Appalachian Trail', reason: 'Experience true wilderness with limited vehicle access' },
    { name: 'Palo Duro Canyon, TX', fact: 'Second largest canyon in the US after the Grand Canyon', reason: 'See the outdoor musical drama "TEXAS" under the stars' },
    { name: 'Valley of Fire, NV', fact: 'Has 3,000-year-old petroglyphs carved by ancient Puebloans', reason: 'Photograph the red sandstone formations that seem to be on fire' },
    { name: 'Watkins Glen, NY', fact: 'Features 19 waterfalls along a 2-mile gorge trail', reason: 'Walk behind waterfalls through 200-foot stone walls' },
    { name: 'Julia Pfeiffer Burns, CA', fact: 'One of only two waterfalls in California that fall directly into the ocean', reason: 'See the iconic McWay Falls from the cliff overlook' },
  ],
  fiveKPeaks: [
    { name: 'Mount Everest', fact: 'Grows about 4mm taller each year due to tectonic activity', reason: 'Stand on top of the world at 8,849m, the ultimate mountaineering achievement' },
    { name: 'K2', fact: 'Has a 25% fatality rate, making it far deadlier than Everest', reason: 'Witness the "Savage Mountain" - considered the hardest 8,000er to climb' },
    { name: 'Kilimanjaro', fact: 'A freestanding volcanic mountain with five distinct climate zones', reason: 'Summit Africa\'s highest peak without technical climbing experience' },
    { name: 'Mont Blanc', fact: 'First mountain climbed for sport in 1786, starting modern alpinism', reason: 'Ski or hike Western Europe\'s highest peak with incredible views' },
    { name: 'Denali', fact: 'Has the largest base-to-peak rise of any mountain on Earth', reason: 'Climb North America\'s tallest mountain in 24-hour daylight' },
    { name: 'Aconcagua', fact: 'Highest peak outside Asia and in both Western and Southern hemispheres', reason: 'Summit the "Stone Sentinel" without technical climbing' },
    { name: 'Matterhorn', fact: 'Has a perfectly pyramidal peak visible from 4 countries', reason: 'Climb the most iconic mountain silhouette in the world' },
  ],
  fourteeners: [
    { name: 'Mount Elbert', fact: 'Highest peak in Colorado and the Rocky Mountains at 14,440 ft', reason: 'Summit Colorado\'s tallest via a moderate class 1 hike' },
    { name: 'Pikes Peak', fact: 'Inspired "America the Beautiful" from its summit view', reason: 'Drive, hike, or take a cog railway to experience this famous peak' },
    { name: 'Longs Peak', fact: 'Only fourteener in Rocky Mountain National Park', reason: 'Challenge yourself on the famous Keyhole Route scramble' },
    { name: 'Mount of the Holy Cross', fact: 'Features a natural cross-shaped snow formation in a couloir', reason: 'Photograph the iconic cross-shaped snowfield' },
    { name: 'Maroon Bells', fact: 'Most photographed peaks in North America', reason: 'See the iconic twin peaks reflected in Maroon Lake' },
    { name: 'Mount Whitney', fact: 'Highest peak in the contiguous US at 14,505 ft', reason: 'Hike from lowest to highest point in the US in Death Valley combo' },
    { name: 'Capitol Peak', fact: 'Considered the most dangerous fourteener due to the Knife Edge', reason: 'Test your climbing skills on this technical class 4 peak' },
    { name: 'Quandary Peak', fact: 'One of the most accessible fourteeners, popular for beginners', reason: 'Bag your first fourteener on this well-maintained trail' },
  ],
  museums: [
    { name: 'The Louvre, Paris', fact: 'Would take 200 days to see every piece if you spent 30 seconds each', reason: 'See the Mona Lisa and 35,000 works spanning 9,000 years' },
    { name: 'British Museum, London', fact: 'Has 8 million objects but only 1% are on display at any time', reason: 'See the Rosetta Stone and Egyptian mummies for free' },
    { name: 'Smithsonian, Washington DC', fact: 'Largest museum complex with 154 million items across 19 museums', reason: 'Explore world-class collections completely free of charge' },
    { name: 'Vatican Museums, Rome', fact: 'Michelangelo painted the Sistine Chapel ceiling while lying on his back', reason: 'Walk through 2,000 years of art ending at the Sistine Chapel' },
    { name: 'Rijksmuseum, Amsterdam', fact: 'Building has a road running through it for cyclists', reason: 'Stand before Rembrandt\'s Night Watch and Vermeer\'s masterpieces' },
    { name: 'The Met, New York', fact: 'Has 2 million works including a complete Egyptian temple', reason: 'Explore the Temple of Dendur and armor from every continent' },
    { name: 'Uffizi Gallery, Florence', fact: 'Originally built as offices for Florentine magistrates in 1560', reason: 'See Botticelli\'s Birth of Venus in its birthplace' },
    { name: 'Hermitage, St. Petersburg', fact: 'Has 3 million items and employs cats to guard against mice', reason: 'Walk through 400 rooms of art in a former imperial palace' },
  ],
  mlbStadiums: [
    { name: 'Fenway Park, Boston', fact: 'Oldest MLB stadium (1912) with the iconic Green Monster wall', reason: 'Experience baseball history at America\'s most beloved ballpark' },
    { name: 'Wrigley Field, Chicago', fact: 'Ivy-covered outfield walls were planted in 1937', reason: 'Catch a rooftop game view from the surrounding buildings' },
    { name: 'Oracle Park, San Francisco', fact: 'Splash hits into McCovey Cove have been retrieved by kayakers', reason: 'Watch kayakers chase home runs with bay and city views' },
    { name: 'PNC Park, Pittsburgh', fact: 'Consistently rated the best ballpark in America for its views', reason: 'See the city skyline and bridges beyond the outfield' },
    { name: 'Dodger Stadium, Los Angeles', fact: 'Largest MLB stadium by seating capacity at 56,000', reason: 'Watch a game with mountain views and famous Dodger Dogs' },
    { name: 'Camden Yards, Baltimore', fact: 'Started the retro ballpark revolution when it opened in 1992', reason: 'Experience the stadium that changed modern ballpark design' },
    { name: 'Coors Field, Denver', fact: 'The rooftop row of purple seats marks exactly one mile above sea level', reason: 'Watch balls fly farther in the thin mile-high air' },
  ],
  nflStadiums: [
    { name: 'Lambeau Field, Green Bay', fact: 'Oldest NFL stadium in continuous use, known as the "Frozen Tundra"', reason: 'Experience the legendary "Lambeau Leap" celebration live' },
    { name: 'AT&T Stadium, Dallas', fact: 'Has the world\'s largest column-free interior and massive video board', reason: 'Tour "Jerry World" with its $1.2 billion worth of art' },
    { name: 'SoFi Stadium, Los Angeles', fact: 'Most expensive stadium ever built at $5.5 billion', reason: 'Experience the stunning transparent roof and oculus video board' },
    { name: 'Arrowhead Stadium, Kansas City', fact: 'Holds the Guinness World Record for loudest stadium at 142.2 dB', reason: 'Feel the roar of the loudest fans in sports' },
    { name: 'Caesars Superdome, New Orleans', fact: 'First domed stadium to host a Super Bowl', reason: 'Experience the electric atmosphere of Who Dat Nation' },
    { name: 'Highmark Stadium, Buffalo', fact: 'Famous for tailgate parties and fans jumping through tables', reason: 'Join the wildest tailgate culture in the NFL' },
    { name: 'Lincoln Financial Field, Philadelphia', fact: 'Has a jail and courtroom in the stadium for unruly fans', reason: 'Experience the passion of Eagles fans at the "Linc"' },
  ],
  nbaStadiums: [
    { name: 'Madison Square Garden, NYC', fact: 'Known as "The World\'s Most Famous Arena" since 1968', reason: 'Watch basketball where legends played in the heart of Manhattan' },
    { name: 'United Center, Chicago', fact: 'Has a Michael Jordan statue and Bulls\' six championship banners', reason: 'Feel the energy where MJ created basketball magic' },
    { name: 'Chase Center, San Francisco', fact: 'First privately financed NBA arena in over 20 years', reason: 'Watch the Warriors in their waterfront tech-forward arena' },
    { name: 'Crypto.com Arena, Los Angeles', fact: 'Hosts Lakers, Clippers, Kings, and Sparks plus major concerts', reason: 'Spot celebrities courtside at Hollywood\'s home court' },
    { name: 'TD Garden, Boston', fact: 'Displays 17 Celtics championship banners, most in NBA history', reason: 'Experience the storied rivalry between Celtics and Lakers' },
    { name: 'Little Caesars Arena, Detroit', fact: 'Features a unique "gondola" seating section hanging over the ice/court', reason: 'Watch games from a unique suspended gondola section' },
    { name: 'Fiserv Forum, Milwaukee', fact: 'Has a 5,000-square-foot plaza that opens to the arena', reason: 'Join the Deer District atmosphere during Bucks games' },
  ],
  nhlStadiums: [
    { name: 'Bell Centre, Montreal', fact: 'Most Canadiens banners hang from the rafters - 24 Stanley Cups', reason: 'Experience hockey\'s most storied franchise and passionate fans' },
    { name: 'TD Garden, Boston', fact: 'Bruins have retired 12 numbers, displayed alongside Celtics banners', reason: 'Feel the intensity of Original Six hockey rivalry games' },
    { name: 'Madison Square Garden, NYC', fact: 'Rangers are the only Original Six team playing in the same city since 1926', reason: 'Watch hockey where Gretzky and Messier played' },
    { name: 'Scotiabank Arena, Toronto', fact: 'Upper deck is further from ice than any other NHL arena', reason: 'Experience the passion of Leafs Nation in hockey\'s mecca' },
    { name: 'T-Mobile Arena, Las Vegas', fact: 'First major professional sports venue on the Las Vegas Strip', reason: 'Watch hockey with Vegas showmanship and entertainment' },
    { name: 'Climate Pledge Arena, Seattle', fact: 'World\'s first zero-carbon certified arena', reason: 'Watch the NHL\'s newest team in a renovated historic arena' },
    { name: 'United Center, Chicago', fact: 'Blackhawks have won 6 Stanley Cups, 3 since 2010', reason: 'Hear the roar when Chelsea Dagger plays after goals' },
  ],
  soccerStadiums: [
    { name: 'Camp Nou, Barcelona', fact: 'Largest stadium in Europe with 99,354 capacity', reason: 'Feel the magic of "Més que un club" at FC Barcelona\'s home' },
    { name: 'Santiago Bernabéu, Madrid', fact: 'Undergoing €1 billion renovation with retractable roof and 360° screen', reason: 'Visit Real Madrid\'s legendary home with 15 Champions League trophies' },
    { name: 'Old Trafford, Manchester', fact: 'Known as the "Theatre of Dreams" since 1910', reason: 'Experience Premier League football at iconic Manchester United' },
    { name: 'Anfield, Liverpool', fact: 'Famous for fans singing "You\'ll Never Walk Alone" before matches', reason: 'Stand in the Kop end for the most atmospheric experience' },
    { name: 'Allianz Arena, Munich', fact: 'Exterior can display 16 million color combinations', reason: 'See the stadium glow red on Bayern Munich match nights' },
    { name: 'San Siro, Milan', fact: 'Shared by rivals AC Milan and Inter Milan since 1947', reason: 'Watch the Derby della Madonnina, one of football\'s fiercest rivalries' },
    { name: 'Maracanã, Rio de Janeiro', fact: 'Once held nearly 200,000 fans for the 1950 World Cup final', reason: 'Experience Brazilian football passion in this iconic stadium' },
    { name: 'Wembley Stadium, London', fact: 'The arch is visible from 13 miles away and is 133m tall', reason: 'Watch England play under the iconic arch' },
  ],
  f1Tracks: [
    { name: 'Monaco Grand Prix', fact: 'Slowest F1 race due to tight streets; average speed is 100 mph', reason: 'Watch cars race past superyachts on the world\'s most glamorous circuit' },
    { name: 'Silverstone, UK', fact: 'First-ever Formula 1 race was held here in 1950', reason: 'Visit the birthplace of F1 and feel motorsport history' },
    { name: 'Spa-Francorchamps, Belgium', fact: 'Eau Rouge corner is considered the most challenging in F1', reason: 'Experience one of the fastest and most dramatic tracks' },
    { name: 'Monza, Italy', fact: 'Fastest track on the calendar with 260+ mph top speeds', reason: 'Feel the passion of the Tifosi supporting Ferrari' },
    { name: 'Suzuka, Japan', fact: 'Only figure-8 circuit on the F1 calendar', reason: 'See the unique crossover bridge and dedicated Japanese fans' },
    { name: 'Singapore Grand Prix', fact: 'First-ever F1 night race, held under 1,500 lighting projectors', reason: 'Watch cars race through the illuminated city streets' },
    { name: 'Circuit of the Americas, USA', fact: 'Turn 1 is a blind 133-foot climb to the apex', reason: 'Experience F1\'s impressive US home with Austin vibes' },
    { name: 'Las Vegas Strip Circuit', fact: 'Cars reach 212 mph past the famous casino hotels', reason: 'See F1 cars race down the iconic Las Vegas Strip at night' },
  ],
  marathons: [
    { name: 'Boston Marathon', fact: 'World\'s oldest annual marathon (1897) requiring a qualifying time', reason: 'Earn your way in and run the legendary "Heartbreak Hill"' },
    { name: 'London Marathon', fact: 'Largest annual fundraising event, raising over £1 billion total', reason: 'Run past Big Ben, Tower Bridge, and Buckingham Palace' },
    { name: 'Berlin Marathon', fact: 'Fastest course - current world record was set here', reason: 'Chase a personal best on this famously flat course' },
    { name: 'Chicago Marathon', fact: 'Flat, fast course through 29 diverse neighborhoods', reason: 'Experience incredible crowd support in the Windy City' },
    { name: 'New York City Marathon', fact: 'Largest marathon in the world with 50,000+ runners', reason: 'Cross five boroughs and finish in Central Park' },
    { name: 'Tokyo Marathon', fact: 'One of the hardest to enter with a 10:1 lottery odds', reason: 'Experience unmatched Japanese organization and crowd etiquette' },
    { name: 'Sydney Marathon', fact: 'Only World Major that lets you run across a major harbor bridge', reason: 'Cross the Sydney Harbour Bridge with Opera House views' },
  ],
  airports: [
    { name: 'Singapore Changi', fact: 'Has a 40m indoor waterfall, butterfly garden, and free movie theater', reason: 'Experience the world\'s best airport with endless amenities' },
    { name: 'Tokyo Haneda', fact: 'One of the busiest airports with legendary punctuality rates', reason: 'See the futuristic departure halls and Japanese efficiency' },
    { name: 'Dubai International', fact: 'Busiest airport for international passengers in the world', reason: 'Explore the world\'s largest duty-free shopping area' },
    { name: 'London Heathrow', fact: 'A plane takes off or lands every 45 seconds at peak times', reason: 'Spot planes from around the world at Europe\'s busiest hub' },
    { name: 'Denver International', fact: 'Conspiracy theories surround its art, including the "Blue Mustang"', reason: 'See the controversial artwork and tent-like roof design' },
    { name: 'Hong Kong International', fact: 'Built on a man-made island created from reclaimed land', reason: 'Experience the stunning architecture and IMAX theater' },
    { name: 'Amsterdam Schiphol', fact: 'Has a real Rijksmuseum annex with Dutch Golden Age paintings', reason: 'View world-class art while waiting for your flight' },
    { name: 'Incheon International', fact: 'Has a free Korean culture museum and traditional performances', reason: 'Experience Korean culture and spa services during layovers' },
  ],
  skiResorts: [
    { name: 'Whistler Blackcomb, Canada', fact: 'Largest ski resort in North America with 8,171 acres', reason: 'Ski the resort that hosted the 2010 Winter Olympics' },
    { name: 'Zermatt, Switzerland', fact: 'Car-free village with views of the iconic Matterhorn', reason: 'Ski with the most famous mountain silhouette as your backdrop' },
    { name: 'Chamonix, France', fact: 'Hosted the first Winter Olympics in 1924', reason: 'Experience legendary off-piste terrain and alpine culture' },
    { name: 'Niseko, Japan', fact: 'Receives an average of 15 meters (50 feet) of powder annually', reason: 'Float through the lightest, driest powder snow on Earth' },
    { name: 'St. Anton, Austria', fact: 'Birthplace of alpine skiing and ski instruction', reason: 'Ski where the sport was invented with vibrant après-ski' },
    { name: 'Vail, Colorado', fact: 'Largest single-mountain ski resort in the US with 5,317 acres', reason: 'Experience world-class skiing with Rocky Mountain views' },
    { name: 'Verbier, Switzerland', fact: 'Known for extreme off-piste terrain and the Verbier Xtreme competition', reason: 'Challenge yourself on some of Europe\'s most technical runs' },
    { name: 'Jackson Hole, Wyoming', fact: 'Corbet\'s Couloir is considered one of skiing\'s most terrifying drops', reason: 'Test your skills on legendary steep terrain' },
  ],
  themeParks: [
    { name: 'Walt Disney World, Orlando', fact: 'Covers 25,000 acres - roughly the size of San Francisco', reason: 'Experience the magic across four parks and endless attractions' },
    { name: 'Universal Studios Japan', fact: 'Has the world\'s best-rated Harry Potter experience', reason: 'Enter the Wizarding World with Japanese attention to detail' },
    { name: 'Tokyo DisneySea', fact: 'Consistently rated the world\'s best theme park for theming', reason: 'Experience Disney\'s most immersive and beautiful park' },
    { name: 'Europa-Park, Germany', fact: 'Built by a family who started with a small castle tour in 1975', reason: 'Explore Europe in miniature with world-class coasters' },
    { name: 'Universal Islands of Adventure', fact: 'Hagrid\'s Magical Creatures ride took 7 years to build', reason: 'Experience the Wizarding World and groundbreaking rides' },
    { name: 'Ferrari World, Abu Dhabi', fact: 'Home to the world\'s fastest roller coaster at 149 mph', reason: 'Feel F1 speeds on Formula Rossa under the largest roof ever built' },
    { name: 'Efteling, Netherlands', fact: 'One of oldest theme parks in the world (1952) inspired by fairy tales', reason: 'Step into a storybook at this enchanting Dutch park' },
    { name: 'Shanghai Disneyland', fact: 'Has the largest Disney castle ever built at 197 feet', reason: 'See Disney reimagined with Chinese cultural influences' },
  ],
  surfingReserves: [
    { name: 'Banzai Pipeline, Hawaii', fact: 'Breaks over a shallow reef just 3-5 feet below the surface', reason: 'Witness the most famous and dangerous wave in surfing' },
    { name: 'Malibu, California', fact: 'The "perfect wave" that helped birth modern surfing culture', reason: 'Ride the wave where legends like Mickey Dora surfed' },
    { name: 'Gold Coast, Australia', fact: 'Has over 57km of coastline with consistent surf year-round', reason: 'Surf the world-famous Superbank point break' },
    { name: 'Ericeira, Portugal', fact: 'Europe\'s first World Surfing Reserve with 7 world-class waves', reason: 'Experience authentic Portuguese surf culture and variety of breaks' },
    { name: 'Santa Cruz, California', fact: 'First place on the US mainland where surfing was introduced in 1885', reason: 'Visit Steamer Lane and the Santa Cruz Surfing Museum' },
    { name: 'Manly Beach, Australia', fact: 'Site of Australia\'s first surfing demonstrations in 1914', reason: 'Surf one of Australia\'s most accessible urban beach breaks' },
    { name: 'Huanchaco, Peru', fact: 'Locals still surf on traditional reed boats called caballitos de totora', reason: 'See 3,000-year-old surfing tradition still practiced today' },
    { name: 'Guéthary, France', fact: 'Part of the Basque Country with big wave surfing at Parlementia', reason: 'Experience European big wave surfing and Basque culture' },
  ],
  weirdAmericana: [
    { name: 'Cadillac Ranch, Texas', fact: 'Ten Cadillacs buried nose-first have been spray-painted by millions of visitors since 1974', reason: 'Add your own layer of paint to this ever-evolving public art installation' },
    { name: 'World\'s Largest Ball of Twine, Kansas', fact: 'Over 40 feet in circumference, with annual twine-a-thons to keep it growing', reason: 'Witness Midwestern dedication and add your own strand to history' },
    { name: 'Carhenge, Nebraska', fact: 'Replica of Stonehenge made from 39 vintage cars spray-painted gray', reason: 'See American ingenuity turn junkyard cars into prehistoric art' },
    { name: 'Winchester Mystery House, California', fact: 'Has stairs leading to ceilings and doors opening to walls, built to confuse ghosts', reason: 'Explore 160 rooms of architectural madness built by a grieving widow' },
    { name: 'Wall Drug, South Dakota', fact: 'Famous for billboards starting hundreds of miles away advertising free ice water', reason: 'Experience the ultimate American roadside tourist trap' },
    { name: 'International UFO Museum, New Mexico', fact: 'Located in Roswell, home of the famous 1947 alleged UFO crash', reason: 'Dive into alien conspiracy theories and extraterrestrial exhibits' },
    { name: 'Salvation Mountain, California', fact: 'One man spent 30 years building this painted desert mountain with adobe and donated paint', reason: 'See Leonard Knight\'s colorful message of love in the California desert' },
    { name: 'House on the Rock, Wisconsin', fact: 'Contains the world\'s largest carousel with 269 animals but no horses', reason: 'Get lost in eccentric collections including a 200-foot sea creature' },
    { name: 'Corn Palace, South Dakota', fact: 'Exterior murals made entirely of corn are redesigned every year', reason: 'See the world\'s only palace decorated with thousands of ears of corn' },
    { name: 'Mystery Spot, California', fact: 'Balls appear to roll uphill and people seem to change height in this gravitational anomaly', reason: 'Experience mind-bending optical illusions in a tilted cabin' },
  ],
};

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = categoryLabels[category as Category] || category;
  const description = categoryDescriptions[category as Category] || `Track ${label} you have visited.`;
  const keywords = categoryKeywords[category as Category] || [`${label} tracker`];

  return {
    title: `Track ${label} Visited | Free Interactive Map | See Every Place`,
    description: `${description} Create beautiful shareable maps and bucket lists for free.`,
    keywords: [...keywords, 'travel tracker', 'bucket list', 'free travel app'],
    openGraph: {
      title: `Track ${label} Visited | See Every Place`,
      description: description,
      type: 'website',
    },
  };
}

export default async function CategoryLandingPage({ params }: Props) {
  const { category } = await params;

  if (!categories.includes(category as Category)) {
    redirect('/');
  }

  const label = categoryLabels[category as Category];
  const icon = categoryIcons[category as Category];
  const description = categoryDescriptions[category as Category];
  const jsonLd = generateJsonLd(category as Category, label, description);

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <Script
        id={`json-ld-${category}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super text-primary-400">™</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <Link
            href={`/?category=${category}`}
            className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
          >
            Start Tracking
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <span className="text-6xl mb-4 block">{icon}</span>
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-4">
            Track {label} You&apos;ve Visited
          </h1>
          <p className="text-xl text-primary-600 dark:text-primary-300 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10 text-center">
            <div className="text-3xl mb-3">🗺️</div>
            <h3 className="font-bold text-primary-900 dark:text-white mb-2">Interactive Map</h3>
            <p className="text-primary-600 dark:text-primary-400 text-sm">
              Visual map showing your visited {label.toLowerCase()} in green
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10 text-center">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-bold text-primary-900 dark:text-white mb-2">Bucket List</h3>
            <p className="text-primary-600 dark:text-primary-400 text-sm">
              Mark {label.toLowerCase()} you want to visit next
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10 text-center">
            <div className="text-3xl mb-3">📤</div>
            <h3 className="font-bold text-primary-900 dark:text-white mb-2">Share Stats</h3>
            <p className="text-primary-600 dark:text-primary-400 text-sm">
              Create beautiful shareable graphics
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href={`/?category=${category}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            Start Tracking {label}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-4 text-primary-500 dark:text-primary-400 text-sm">
            Free to use, no account required
          </p>
        </div>

        {/* Examples Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2 text-center">
            {label} to Explore
          </h2>
          <p className="text-primary-600 dark:text-primary-300 text-center mb-8">
            Here are some amazing {label.toLowerCase()} to add to your bucket list
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {categoryExamples[category as Category]?.map((example, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-premium border border-black/5 dark:border-white/10 hover:shadow-premium-lg transition-shadow"
              >
                <h3 className="font-bold text-primary-900 dark:text-white text-lg mb-2">{example.name}</h3>
                <div className="space-y-2">
                  <p className="text-primary-600 dark:text-primary-400 text-sm">
                    <span className="font-medium text-primary-700 dark:text-primary-300">Unique fact:</span>{' '}
                    {example.fact}
                  </p>
                  <p className="text-primary-600 dark:text-primary-400 text-sm">
                    <span className="font-medium text-accent-600 dark:text-accent-400">Why visit:</span>{' '}
                    {example.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-6 text-center">
            Also Track
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories
              .filter((c) => c !== category)
              .slice(0, 4)
              .map((c) => (
                <Link
                  key={c}
                  href={`/track/${c}`}
                  className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-premium border border-black/5 dark:border-white/10 hover:shadow-premium-lg transition-all text-center"
                >
                  <span className="text-2xl block mb-2">{categoryIcons[c]}</span>
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{categoryLabels[c]}</span>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">About</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Suggest</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>
    </div>
    </>
  );
}
