import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { Category, categoryLabels, categoryIcons, CategoryGroup, getGroupForCategory } from '@/lib/types';
import Link from 'next/link';
import { getCategoryItemsAsync, CategoryItem } from '@/lib/categoryUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ChevronRight, ChevronDown } from 'lucide-react';
import { TravelerStats } from '@/components/TravelerStats';
import { ChallengesCard } from '@/components/ChallengesCard';
import { mountains } from '@/data/mountains';
import { mlbStadiums } from '@/data/stadiums/mlb';
import { nflStadiums } from '@/data/stadiums/nfl';
import { nbaStadiums } from '@/data/stadiums/nba';
import { nhlStadiums } from '@/data/stadiums/nhl';
import { soccerStadiums } from '@/data/stadiums/soccer';
import { nationalParks } from '@/data/nationalParks';
import { nationalMonuments } from '@/data/nationalMonuments';
import { stateParks } from '@/data/stateParks';
import { weirdAmericana } from '@/data/weirdAmericana';
import { usStates } from '@/data/usStates';

// Categories that support state-level filtering for SEO pages
const stateFilterableCategories: Category[] = [
  'nationalParks',
  'nationalMonuments',
  'stateParks',
  'weirdAmericana',
];

// State code to full name mapping
const stateNames: Record<string, string> = {};
usStates.forEach(s => {
  stateNames[s.code] = s.name;
});

// Get unique states for a category with counts
function getStatesWithCounts(category: Category): Array<{ code: string; name: string; count: number }> {
  const stateCounts: Record<string, number> = {};

  let items: { state: string }[] = [];
  switch (category) {
    case 'nationalParks':
      items = nationalParks;
      break;
    case 'nationalMonuments':
      items = nationalMonuments;
      break;
    case 'stateParks':
      items = stateParks;
      break;
    case 'weirdAmericana':
      items = weirdAmericana;
      break;
    default:
      return [];
  }

  items.forEach(item => {
    // Handle multi-state items like "WY/MT/ID"
    if (item.state.includes('/')) {
      item.state.split('/').forEach(s => {
        const code = s.trim();
        stateCounts[code] = (stateCounts[code] || 0) + 1;
      });
    } else {
      stateCounts[item.state] = (stateCounts[item.state] || 0) + 1;
    }
  });

  return Object.entries(stateCounts)
    .map(([code, count]) => ({
      code,
      name: stateNames[code] || code,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

const categories: Category[] = [
  'countries',
  'states',
  'territories',
  'usCities',
  'worldCities',
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
  territories: ['US territories tracker', 'Puerto Rico visited', 'Guam travel', 'American territories', 'US islands'],
  usCities: ['US cities tracker', 'cities visited USA', 'American cities checklist', 'city bucket list USA'],
  worldCities: ['world cities tracker', 'cities visited map', 'global city bucket list', 'capital cities checklist'],
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
  euroFootballStadiums: ['European football stadiums', 'Premier League stadiums', 'La Liga stadiums', 'Bundesliga stadiums', 'Serie A grounds', 'soccer grounds Europe'],
  rugbyStadiums: ['rugby stadium tracker', 'rugby grounds visited', 'Six Nations stadiums', 'rugby world cup venues', 'Premiership Rugby grounds'],
  cricketStadiums: ['cricket ground tracker', 'cricket stadiums visited', 'Test cricket venues', 'IPL stadiums', 'international cricket grounds'],
};

// FAQ content for each category
interface FAQ {
  question: string;
  answer: string;
}

const categoryFAQs: Partial<Record<Category, FAQ[]>> = {
  countries: [
    { question: 'How many countries are there in the world?', answer: 'There are 197 recognized countries in the world - 193 UN member states plus 4 observer/partially recognized states (Vatican City, Palestine, Taiwan, and Kosovo). Our tracker includes all 197.' },
    { question: 'What counts as visiting a country?', answer: 'Most travelers count a country as "visited" if they\'ve spent meaningful time there, not just airport layovers. Mark it visited when you\'ve explored outside the airport!' },
    { question: 'How can I share my country count?', answer: 'Use the Share button to create a beautiful shareable image with your map and stats. Perfect for social media bragging rights!' },
    { question: 'Is my country tracking data saved?', answer: 'Yes! Your data is automatically saved in your browser\'s local storage. No account needed - your progress stays on your device.' },
  ],
  states: [
    { question: 'How many US states are there to track?', answer: 'We track all 50 US states plus Washington D.C. for 51 total. US territories are tracked in a separate category.' },
    { question: 'What\'s the best way to visit all 50 states?', answer: 'Road trips are the most popular method. Many travelers use route optimization or themes (like Route 66 or the Pacific Coast Highway) to make their journey memorable.' },
    { question: 'How do I create a state visited map?', answer: 'Simply click on states you\'ve visited to mark them green. Use the Share feature to generate a beautiful map image to share on social media.' },
    { question: 'Can I also track territories?', answer: 'Yes! We include US territories like Puerto Rico, Guam, and the US Virgin Islands. They appear as clickable buttons below the map.' },
  ],
  nationalParks: [
    { question: 'How many US National Parks are there?', answer: 'There are currently 63 designated National Parks in the United States, managed by the National Park Service. We track all of them!' },
    { question: 'What\'s the difference between a National Park and National Monument?', answer: 'National Parks are designated by Congress and protect large areas of natural beauty. National Monuments can be designated by the President and often protect specific features. Both are worth visiting!' },
    { question: 'Do I need a park pass?', answer: 'While some parks are free, most charge entrance fees. The America the Beautiful Annual Pass ($80) covers entrance to all National Parks and over 2,000 federal recreation sites.' },
    { question: 'Which National Park should I visit first?', answer: 'Popular starter parks include Zion (Utah), Grand Canyon (Arizona), and Acadia (Maine). Choose based on your location and interests - each park offers unique experiences!' },
  ],
  nationalMonuments: [
    { question: 'How many National Monuments are in the US?', answer: 'There are over 130 National Monuments in the United States. They protect natural, cultural, and historical features significant to America.' },
    { question: 'Are National Monuments free to visit?', answer: 'Many National Monuments are free, but some charge entrance fees. The America the Beautiful pass covers monuments managed by NPS, BLM, and other federal agencies.' },
    { question: 'What\'s the oldest National Monument?', answer: 'Devils Tower in Wyoming was the first National Monument, designated by President Theodore Roosevelt on September 24, 1906.' },
  ],
  stateParks: [
    { question: 'How many state parks are there in the US?', answer: 'There are over 10,000 state park units across America! We track a curated list of the most notable state parks from all 50 states.' },
    { question: 'Are state parks cheaper than National Parks?', answer: 'Generally yes. State park entrance fees are typically lower, and many states offer annual passes for $30-75 covering all parks in that state.' },
    { question: 'What amenities do state parks offer?', answer: 'Most state parks offer camping, hiking trails, picnic areas, and nature programs. Many have cabins, lodges, and recreational facilities like swimming areas.' },
  ],
  fiveKPeaks: [
    { question: 'What is a 5000m peak?', answer: 'A 5000m peak is any mountain with a summit elevation of 5,000 meters (16,404 feet) or higher. This includes famous peaks like Mount Everest, K2, and Kilimanjaro.' },
    { question: 'How many 8000m peaks exist?', answer: 'There are 14 peaks over 8,000 meters, all located in the Himalayas and Karakoram ranges. Climbing all 14 is the ultimate mountaineering achievement.' },
    { question: 'Can beginners climb 5000m peaks?', answer: 'Some 5000m peaks like Kilimanjaro can be climbed by fit hikers without technical skills. Others require extensive mountaineering experience. Always research and prepare properly.' },
  ],
  fourteeners: [
    { question: 'What is a 14er?', answer: 'A 14er (fourteener) is a mountain peak with an elevation of at least 14,000 feet (4,267 meters). Colorado has 58 fourteeners - more than any other state!' },
    { question: 'How long does it take to climb a 14er?', answer: 'Most 14ers take 6-12 hours round trip. Some easier peaks like Quandary can be done in 5-6 hours, while technical peaks like Capitol may take 12+ hours.' },
    { question: 'Do I need special equipment?', answer: 'For Class 1 (hiking) 14ers, you need sturdy hiking boots, layers, water, and food. Class 3+ peaks may require helmets, ropes, and technical climbing gear.' },
    { question: 'What\'s the best time to climb 14ers?', answer: 'July through September offers the best conditions with less snow and stable weather. Start early to avoid afternoon thunderstorms common above treeline.' },
  ],
  mlbStadiums: [
    { question: 'How many MLB stadiums are there?', answer: 'There are 30 MLB teams with stadiums across the US and Canada. We track all current stadiums plus some historic ones.' },
    { question: 'Which MLB stadium is the oldest?', answer: 'Fenway Park in Boston (1912) is the oldest MLB stadium still in use, followed by Wrigley Field in Chicago (1914).' },
    { question: 'How much does it cost to visit all MLB stadiums?', answer: 'Budget travelers can complete the circuit for $5,000-10,000 including budget flights, cheap seats, and basic accommodations. Luxury trips can cost $20,000+.' },
    { question: 'What\'s the best way to plan an MLB stadium tour?', answer: 'Many fans do regional trips during the season, visiting 3-5 stadiums per trip. Schedule around home games and allow travel time between cities.' },
  ],
  f1Tracks: [
    { question: 'How many F1 tracks are on the calendar?', answer: 'The F1 calendar typically features 20-24 races per season across different circuits worldwide. The exact number varies year to year as new venues are added.' },
    { question: 'Can I drive on F1 circuits?', answer: 'Yes! Many circuits offer track days or driving experiences when not hosting races. Some offer pace car rides or arrive-and-drive karting on the same layouts.' },
    { question: 'Which F1 track should I visit?', answer: 'Monaco offers glamour, Silverstone has history, and Spa-Francorchamps features the most dramatic scenery. Austin (COTA) is great for American fans.' },
    { question: 'How much are F1 race tickets?', answer: 'General admission starts around $100-200, with grandstand seats $300-800+. Monaco and other prestige events can cost $1,000+ for good seats.' },
  ],
  marathons: [
    { question: 'What are the World Marathon Majors?', answer: 'The Abbott World Marathon Majors are the six most prestigious marathons: Tokyo, Boston, London, Berlin, Chicago, and New York City. Running all six earns you a Six Star Medal!' },
    { question: 'How do I qualify for the Boston Marathon?', answer: 'Boston requires qualifying times based on age and gender. For example, men 18-34 need 3:00:00, women 18-34 need 3:30:00. Times must be achieved at a qualifying race.' },
    { question: 'Which marathon is the fastest?', answer: 'Berlin is known as the fastest course due to its flat terrain. The current world record was set here. London and Chicago are also fast, flat courses.' },
    { question: 'Can anyone run a World Major?', answer: 'Most majors have lottery entries for non-qualifiers. You can also enter through charity programs or tour operators, though these typically require fundraising or higher fees.' },
  ],
  airports: [
    { question: 'Which is the world\'s best airport?', answer: 'Singapore Changi has been voted the world\'s best airport for many consecutive years, known for its gardens, entertainment, and amenities.' },
    { question: 'Do airport lounges count as "visiting"?', answer: 'That\'s up to you! Some collectors count any stopover, while purists only count airports where they\'ve cleared immigration or explored the terminal.' },
    { question: 'What makes an airport worth tracking?', answer: 'We track major international hubs, architecturally significant airports, and those with unique features or historical importance.' },
  ],
  skiResorts: [
    { question: 'Which ski resort has the most terrain?', answer: 'Les 3 Vallées in France is the world\'s largest ski area with 600km of slopes. In North America, Whistler Blackcomb is the largest with 8,171 acres.' },
    { question: 'What\'s the best time to ski?', answer: 'January-March offers the best conditions in most of the Northern Hemisphere. Southern Hemisphere resorts (Chile, New Zealand) have their season June-October.' },
    { question: 'Do I need to track individual runs?', answer: 'Our tracker focuses on resorts rather than runs. Visit once and mark it visited! Advanced skiers often keep separate lists of specific runs or challenges.' },
  ],
  themeParks: [
    { question: 'Which theme park is the most visited?', answer: 'Magic Kingdom at Walt Disney World is the world\'s most visited theme park with over 20 million visitors annually.' },
    { question: 'What\'s the difference between a theme park and amusement park?', answer: 'Theme parks have cohesive theming and immersive environments (like Disney or Universal), while amusement parks focus primarily on rides without overall themes.' },
    { question: 'How much should I budget for a theme park visit?', answer: 'Budget $100-200 per person per day for tickets. Add $50-100 for food and souvenirs. Multi-day visits and resort stays can increase costs significantly.' },
  ],
  surfingReserves: [
    { question: 'What is a World Surfing Reserve?', answer: 'World Surfing Reserves are dedicated to protecting the world\'s most outstanding waves, surf zones, and surrounding environments. They\'re recognized for their natural, cultural, and economic value.' },
    { question: 'Can beginners surf at these spots?', answer: 'Many reserves have beginner-friendly zones, but some famous breaks like Pipeline are for experts only. Research conditions before visiting any new surf spot.' },
    { question: 'How many World Surfing Reserves exist?', answer: 'There are currently 12 official World Surfing Reserves across 9 countries, with more being designated. We track these plus other legendary surf spots.' },
  ],
  weirdAmericana: [
    { question: 'What counts as weird Americana?', answer: 'Quirky roadside attractions, oversized statues, unusual museums, and bizarre landmarks that celebrate America\'s eccentric creativity and roadside culture.' },
    { question: 'Are these attractions free to visit?', answer: 'Many roadside attractions are free to view (like Cadillac Ranch). Some museums and indoor attractions charge admission, typically $5-20.' },
    { question: 'Where can I find the most weird attractions?', answer: 'Route 66 has the highest concentration, but every state has hidden gems. The Southwest, Midwest, and California are particularly rich in quirky stops.' },
  ],
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

// Generate FAQ JSON-LD schema
function generateFaqJsonLd(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate Breadcrumb JSON-LD schema for SEO
function generateBreadcrumbJsonLd(category: Category, label: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: `${baseUrl}/track/${category}`,
      },
    ],
  };
}

const categoryDescriptions: Record<Category, string> = {
  countries: 'Track all 197 countries around the world. Mark countries as visited or add them to your bucket list.',
  states: 'Track all 50 US states plus Washington DC. Perfect for road trippers and domestic travelers.',
  territories: 'Track US territories and islands. From Puerto Rico to Guam, explore America beyond the 50 states.',
  usCities: 'Track major US cities. From New York to Los Angeles, mark every American city you have explored.',
  worldCities: 'Track major world cities. From Tokyo to Paris, record every global metropolis you have visited.',
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
  euroFootballStadiums: 'Track European football stadiums across top leagues. From the Premier League to La Liga, mark every ground you have visited.',
  rugbyStadiums: 'Track professional rugby stadiums worldwide. From Six Nations to Super Rugby venues, record every ground you have experienced.',
  cricketStadiums: 'Track international cricket grounds. From Lord\'s to the MCG, mark every Test and ODI venue you have visited.',
};

// Example places for each category with unique facts and reasons to visit
interface PlaceExample {
  name: string;
  fact: string;
  reason: string;
}

const categoryExamples: Record<Category, PlaceExample[]> = {
  countries: [
    { name: 'Japan', fact: 'Home to over 6,800 islands and the world\'s oldest company, Kongō Gumi, founded in 578 AD. Japan has more vending machines per capita than any other country, with machines selling everything from hot ramen to fresh eggs.', reason: 'Experience the perfect blend of ancient temples and cutting-edge technology. Watch sumo wrestling, stay in a traditional ryokan, and ride the bullet train through cherry blossom-lined tracks.' },
    { name: 'Iceland', fact: 'The only country with no mosquitoes, and it runs almost entirely on renewable geothermal energy. Iceland has no army and its police don\'t carry guns, making it one of the safest countries on Earth.', reason: 'Witness the Northern Lights dancing across Arctic skies and bathe in the ethereal Blue Lagoon. Drive the Ring Road past volcanoes, glaciers, and waterfalls unlike anywhere else on the planet.' },
    { name: 'New Zealand', fact: 'First country to give women the right to vote (1893) and has more sheep than people, about 6 per person. It\'s also home to the world\'s steepest street, Baldwin Street in Dunedin.', reason: 'Explore dramatic landscapes ranging from the fjords of Milford Sound to magical glowworm caves in Waitomo. Experience Māori culture, bungee jump where it was invented, and walk through Middle-earth filming locations.' },
    { name: 'Morocco', fact: 'Home to the world\'s oldest continuously operating university, the University of al-Qarawiyyin, founded in 859 AD. The medina of Fez is the world\'s largest car-free urban area.', reason: 'Lose yourself in the labyrinthine souks of Marrakech and sleep under the stars in the Sahara Desert. Haggle for handcrafted treasures, sip mint tea on rooftop terraces, and explore the blue city of Chefchaouen.' },
    { name: 'Peru', fact: 'Contains 90 different microclimates and cultivates over 3,000 varieties of potatoes, the most genetic diversity for a single crop anywhere. The Nazca Lines remain one of archaeology\'s greatest mysteries.', reason: 'Trek the Inca Trail to the mystical citadel of Machu Picchu at sunrise. Float on Lake Titicaca, the world\'s highest navigable lake, and explore the Amazon rainforest that covers 60% of the country.' },
    { name: 'Norway', fact: 'Has the world\'s longest road tunnel at 24.5 km and invented skiing as a mode of transportation thousands of years ago. Norway\'s coastline would stretch around the equator twice if straightened.', reason: 'Cruise through UNESCO-listed fjords with thousand-foot waterfalls cascading down sheer cliffs. Chase the midnight sun in summer or witness the Northern Lights from a husky sled in winter.' },
    { name: 'Bhutan', fact: 'The only carbon-negative country in the world, absorbing more CO2 than it produces. Bhutan measures success by Gross National Happiness rather than GDP, and television was only introduced in 1999.', reason: 'Hike to the Tiger\'s Nest Monastery clinging impossibly to a cliff face. Experience a kingdom where ancient Buddhist traditions thrive alongside pristine Himalayan wilderness.' },
    { name: 'Portugal', fact: 'Produces half of the world\'s cork and is home to the world\'s oldest bookstore, Livraria Bertrand, opened in 1732. The country has been an independent state since 1143, making it one of Europe\'s oldest nations.', reason: 'Savor custard tarts fresh from century-old bakeries and surf world-class waves at Nazaré. Explore colorful tiles adorning Lisbon\'s historic neighborhoods and sip port wine in the cellars of Porto.' },
  ],
  states: [
    { name: 'Alaska', fact: 'Has more coastline than all other US states combined and is so large that if superimposed on the lower 48, it would stretch from coast to coast. Alaska contains 17 of the 20 highest peaks in the United States.', reason: 'Watch massive glaciers calve into the sea with thunderous roars and spot grizzly bears fishing for salmon. Experience 24 hours of summer daylight and cruise through fjords surrounded by breaching whales.' },
    { name: 'Hawaii', fact: 'The only US state that grows coffee commercially and is made up entirely of volcanic islands and it\'s still growing as Kilauea continues to erupt. Hawaii has its own time zone and no daylight saving time.', reason: 'Stand at the edge of an active volcano and snorkel with sea turtles in crystal-clear waters. Learn to surf on Waikiki Beach, attend a traditional luau, and drive the scenic Road to Hana.' },
    { name: 'Montana', fact: 'Home to the largest migratory elk herd in the nation and has more cattle than people. Montana\'s nickname "Big Sky Country" comes from its vast, unobstructed horizons that seem to stretch forever.', reason: 'Explore Glacier National Park before climate change claims its namesake glaciers. Only 25 of the original 150 remain. Fish blue-ribbon trout streams, spot wolves in their natural habitat, and experience true American frontier culture.' },
    { name: 'Utah', fact: 'The only state with five national parks, known as "The Mighty Five," and contains the highest concentration of slot canyons in the world. Utah\'s Great Salt Lake is saltier than the ocean.', reason: 'Hike through otherworldly red rock formations and squeeze through narrow slot canyons carved over millions of years. Mountain bike the famous Slickrock Trail, ski the "Greatest Snow on Earth," and marvel at ancient petroglyphs.' },
    { name: 'Maine', fact: 'The closest US state to Africa and produces 90% of the nation\'s lobster supply. Maine has more than 60 lighthouses dotting its rugged, rocky coastline.', reason: 'Feast on fresh lobster pulled straight from the ocean and watch the first sunrise in the continental US from Cadillac Mountain. Explore quaint fishing villages, hike Acadia\'s granite peaks, and sail past harbor seals.' },
    { name: 'Louisiana', fact: 'The only US state with parishes instead of counties, a legacy of its French colonial past. Louisiana\'s wetlands contain 40% of America\'s coastal marshes and the largest swamp in the country.', reason: 'Experience the magic of Mardi Gras in New Orleans and taste authentic Cajun and Creole cuisine passed down for generations. Take a swamp tour to spot alligators, dance to live jazz on Frenchmen Street, and explore plantation history.' },
    { name: 'Wyoming', fact: 'The least populous US state with under 600,000 people, fewer than the city of Denver. Wyoming was the first state to grant women the right to vote and is home to the world\'s first national park.', reason: 'Visit Yellowstone\'s geysers, hot springs, and abundant wildlife, then marvel at the Grand Tetons rising dramatically from the valley floor. Experience authentic dude ranch culture and witness some of the darkest night skies in America.' },
  ],
  territories: [
    { name: 'Puerto Rico', fact: 'Home to three of the world\'s five bioluminescent bays, where microscopic organisms light up the water like liquid stars. The island\'s El Yunque is the only tropical rainforest in the US National Forest System.', reason: 'Paddle through waters that glow electric blue with every stroke and explore 500 years of Spanish colonial history in colorful Old San Juan. Hike to hidden waterfalls in the rainforest and savor authentic mofongo by the beach.' },
    { name: 'U.S. Virgin Islands', fact: 'Despite being a US territory, cars drive on the left side of the road, a holdover from when Denmark owned the islands. The territory has more than 40 pristine beaches across its three main islands.', reason: 'Snorkel the crystal-clear waters of Trunk Bay, consistently rated one of the world\'s best beaches. Explore the ruins of sugar plantations, sail between islands, and swim with sea turtles at virtually every beach.' },
    { name: 'Guam', fact: 'Where America\'s day officially begins as the first US territory to see each new sunrise. Guam has been inhabited for 4,000 years and is home to the ancient Chamorro culture.', reason: 'Dive pristine WWII shipwrecks and explore underwater caves teeming with tropical fish. Experience unique Chamorro traditions, feast on kelaguen at a local fiesta, and watch the sun rise on a new day before anyone else in America.' },
    { name: 'American Samoa', fact: 'The only US territory south of the equator and the only place in America where the sun rises in the west due to its position relative to the International Date Line. It\'s the most traditional Polynesian culture under the US flag.', reason: 'Visit one of the least-traveled national parks in the entire system with fewer than 5,000 people visit annually. Experience authentic fa\'a Samoa (the Samoan way), witness traditional ceremonies, and hike through pristine volcanic landscapes.' },
    { name: 'Northern Mariana Islands', fact: 'Located above the Mariana Trench, the deepest point on Earth at nearly 36,000 feet, deeper than Mount Everest is tall. Saipan was the site of one of WWII\'s bloodiest Pacific battles.', reason: 'Dive into underwater caves and explore WWII relics scattered across the islands. Experience Chamorro and Carolinian cultures, swim in the famous Grotto, and stand at the cliffs where history was forever changed.' },
    { name: 'Midway Atoll', fact: 'Site of the pivotal 1942 Battle of Midway that turned the tide of WWII in the Pacific. Today it\'s home to the world\'s largest colony of Laysan albatrosses, with over a million birds nest here annually.', reason: 'Witness one of nature\'s most spectacular gatherings as albatrosses fill every inch of the island. See endangered Hawaiian monk seals basking on pristine beaches and walk among historic WWII bunkers in this remote wildlife sanctuary.' },
    { name: 'Wake Island', fact: 'A tiny coral atoll so remote it\'s always one day ahead of the US mainland, and it lies closer to Tokyo than to Honolulu. Wake was the site of a heroic 15-day defense by US Marines in WWII.', reason: 'Step foot on one of the most isolated spots on Earth where few civilians have ever been. Explore WWII history preserved in this strategic outpost and experience the profound solitude of the remote Pacific.' },
  ],
  usCities: [
    { name: 'New York City', fact: 'Home to 520 miles of subway track, the most extensive metro system in the US. The city that never sleeps truly lives up to its name. More than 800 languages are spoken here, making it the most linguistically diverse city on Earth.', reason: 'Catch a Broadway show, stroll through Central Park, and wander world-class museums like the Met and MoMA. Experience iconic neighborhoods from Greenwich Village to Harlem, grab a slice of New York pizza, and watch the sun set from the Brooklyn Bridge.' },
    { name: 'San Francisco', fact: 'The Golden Gate Bridge contains enough wire to wrap around the Earth three times, and the city\'s famous fog even has a name: Karl. San Francisco was built on 43 hills and still operates the world\'s last manually-operated cable cars.', reason: 'Ride the iconic cable cars up impossibly steep streets and watch sea lions bark at Fisherman\'s Wharf. Explore the tech culture of Silicon Valley, tour the eerie corridors of Alcatraz, and feast on sourdough bread and fresh Dungeness crab.' },
    { name: 'Chicago', fact: 'Birthplace of the skyscraper in 1885, Chicago reversed the flow of its river, an engineering marvel that\'s still considered one of the greatest feats in history. The city also invented the brownie, deep-dish pizza, and the zipper.', reason: 'Take an architectural boat tour along the Chicago River and gaze up at a skyline that changed how the world builds cities. Devour deep-dish pizza, catch a Cubs game at historic Wrigley Field, and explore the Art Institute\'s world-renowned collection.' },
    { name: 'New Orleans', fact: 'The birthplace of jazz and the only US city with its own cuisine style: Creole, a unique fusion of French, Spanish, African, and Caribbean influences. The city celebrates over 130 festivals every year.', reason: 'Let the sounds of live jazz draw you down Frenchmen Street and savor beignets at the legendary Café Du Monde. Explore the haunted history of the French Quarter, take a swamp tour to spot gators, and experience the magic of Mardi Gras.' },
    { name: 'Las Vegas', fact: 'The Entertainment Capital of the World has more than 200,000 hotel rooms, more than any other city on Earth. Its famous Strip isn\'t technically in Las Vegas; it\'s in the unincorporated towns of Paradise and Winchester.', reason: 'See world-class shows from Cirque du Soleil to legendary residencies, and explore themed resorts that recreate Paris, Venice, and ancient Egypt. Hit the casinos, catch a concert, and take a helicopter tour over the Grand Canyon at sunset.' },
    { name: 'Seattle', fact: 'Despite its rainy reputation, Seattle actually gets less annual rainfall than New York City, Miami, or Houston. The city is home to the first Starbucks and was built on top of the old city, and you can still tour the underground ruins.', reason: 'Watch fishmongers toss salmon at Pike Place Market and sip coffee where Starbucks began. Take in views of Mount Rainier from the Space Needle, explore the quirky Fremont neighborhood, and experience the thriving indie music scene that birthed grunge.' },
    { name: 'Austin', fact: 'Dubbed the Live Music Capital of the World with over 250 live music venues, Austin hosts more concerts per capita than anywhere else. The city\'s famous bat colony under Congress Avenue Bridge is the largest urban bat colony in North America.', reason: 'Catch live music seven nights a week and feast on legendary Texas BBQ at Franklin or la Barbecue. Paddle on Lady Bird Lake, explore the weird and wonderful South Congress strip, and watch 1.5 million bats emerge at sunset from under the bridge.' },
  ],
  worldCities: [
    { name: 'Tokyo', fact: 'Home to more Michelin-starred restaurants than any other city in the world, over 200. Tokyo seamlessly blends 400-year-old temples with neon-lit skyscrapers. The city\'s train system is so precise that delays are measured in seconds, not minutes.', reason: 'Wander through the serene gardens of ancient temples, then dive into the sensory overload of Shibuya Crossing, the world\'s busiest intersection. Experience everything from tiny ramen shops to robot restaurants, and watch sumo practice at a traditional stable.' },
    { name: 'Paris', fact: 'The Eiffel Tower grows up to 6 inches taller in summer as the iron expands from heat, and Paris has only one stop sign in the entire city. Underground, 6 million skeletons rest in the Catacombs.', reason: 'Stand before the Mona Lisa at the Louvre, climb to the top of the Eiffel Tower at sunset, and stroll along the Seine as booksellers hawk vintage prints. Savor croissants at a sidewalk café, explore Montmartre\'s artistic legacy, and get lost in the covered passages.' },
    { name: 'London', fact: 'With over 170 museums, many completely free. London has more museums than any other city in the world. Big Ben isn\'t the tower; it\'s actually the name of the bell inside.', reason: 'Explore the Tower of London\'s bloody history and marvel at the Crown Jewels before wandering through the British Museum\'s 8 million objects. Catch a West End show, have afternoon tea, and watch the Changing of the Guard at Buckingham Palace.' },
    { name: 'Rome', fact: 'The only city in the world containing an entire country within its borders (Vatican City). Rome was founded in 753 BC and is known as the Eternal City. Romans toss about €3,000 into the Trevi Fountain daily.', reason: 'Walk the same streets as gladiators at the Colosseum and gaze up at Michelangelo\'s Sistine Chapel ceiling. Toss a coin in the Trevi Fountain, devour authentic carbonara in Trastevere, and explore 2,500 years of history around every corner.' },
    { name: 'Singapore', fact: 'This tiny city-state is home to Changi Airport, consistently rated the world\'s best, complete with a butterfly garden and the world\'s tallest indoor waterfall. Singapore has banned chewing gum since 1992.', reason: 'Experience the future at Gardens by the Bay\'s Supertree Grove and dine at hawker centers serving some of Asia\'s best street food for just a few dollars. Explore the colorful shophouses of Chinatown and Little India, then cool off at one of the world\'s only urban rainforests.' },
    { name: 'Dubai', fact: 'Home to the world\'s tallest building (Burj Khalifa), largest shopping mall, deepest swimming pool, and soon the world\'s largest airport. Fifty years ago, Dubai was a small fishing village.', reason: 'Stand atop the Burj Khalifa watching the desert meet the sea, then ski indoors at the Mall of the Emirates. Wander through the atmospheric Gold Souk, take a sunset dhow cruise, and experience luxury that defies imagination at every turn.' },
    { name: 'Sydney', fact: 'The Sydney Opera House roof is covered with over 1 million tiles that are self-cleaning thanks to their special coating. Sydney Harbour is the world\'s deepest natural harbor and hosts the famous New Year\'s Eve fireworks.', reason: 'Climb the Sydney Harbour Bridge for panoramic views and watch surfers ride the waves at Bondi Beach. Explore the historic Rocks neighborhood, ferry across the harbor to Manly, and catch a performance inside the architectural marvel of the Opera House.' },
  ],
  nationalParks: [
    { name: 'Yellowstone', fact: 'Sits atop one of the world\'s largest active volcanic systems and contains half of all the geothermal features on Earth. The supervolcano beneath the park last erupted 640,000 years ago and created a caldera 30 by 45 miles wide.', reason: 'Watch Old Faithful erupt on schedule and marvel at the rainbow-colored Grand Prismatic Spring. Spot wolves, bison, and grizzlies roaming free, and explore over 10,000 hydrothermal features including geysers, hot springs, and mud pots.' },
    { name: 'Grand Canyon', fact: 'Carved by the Colorado River over 5-6 million years, the canyon exposes rocks that are 1.8 billion years old, nearly half the age of Earth itself. At its deepest point, the canyon plunges 6,093 feet.', reason: 'Stand at the rim and witness one of the Seven Natural Wonders of the World as colors shift throughout the day. Hike to the bottom on the Bright Angel Trail, raft the legendary Colorado River rapids, or watch condors soar on thermals.' },
    { name: 'Zion', fact: 'Home to Kolob Arch, one of the world\'s largest natural arches at 287 feet, and cliffs that tower 2,000 feet above the canyon floor. The unique hanging gardens here support plants found nowhere else on Earth.', reason: 'Brave the Angels Landing trail with its chain handholds and 1,500-foot drop-offs for unforgettable views. Wade through the Narrows slot canyon with walls towering above you, and watch the sunset paint the sandstone cliffs in brilliant oranges and reds.' },
    { name: 'Yosemite', fact: 'El Capitan is the largest exposed granite monolith in the world, rising 3,000 feet from the valley floor. The park\'s giant sequoias include trees over 2,000 years old with trunks you can drive through.', reason: 'Watch Yosemite Falls, the tallest waterfall in North America, thunder down during spring snowmelt. Hike to the top of Half Dome on cables, spot climbers inching up El Cap, and stand in awe of groves containing the largest living things on Earth.' },
    { name: 'Acadia', fact: 'The first national park established east of the Mississippi River and home to Cadillac Mountain, where you can be the first person in the United States to see the sunrise from October through March.', reason: 'Watch dawn break over the Atlantic from Cadillac Mountain\'s granite summit and explore 45 miles of historic carriage roads. Climb iron rungs on the Precipice Trail, feast on fresh lobster in Bar Harbor, and witness the thunder hole wave crashes.' },
    { name: 'Denali', fact: 'Home to North America\'s tallest peak at 20,310 feet, so massive it creates its own weather. The park spans 6 million acres but has only one road, keeping most of it true wilderness.', reason: 'Spot the "Big Five" of Alaskan wildlife: moose, caribou, wolf, Dall sheep, and grizzly bear. Take a flightseeing tour around Denali\'s peak, ride the park bus deep into the backcountry, and experience 24-hour summer daylight.' },
    { name: 'Great Smoky Mountains', fact: 'The most visited national park in America with over 12 million visitors annually, yet still maintains wilderness areas. The "smoke" is actually natural fog created by the forest\'s transpiration.', reason: 'Witness the magical synchronized firefly display in early June when thousands of fireflies blink in unison. Drive the scenic Blue Ridge Parkway, explore historic pioneer settlements, and hike through ancient forests older than the Himalayas.' },
    { name: 'Arches', fact: 'Contains over 2,000 natural stone arches, the highest concentration in the world, including the iconic Delicate Arch that appears on Utah license plates. New arches form as old ones collapse.', reason: 'Hike to Delicate Arch at sunset when the sandstone glows brilliant orange against the distant La Sal Mountains. Explore the Windows section, walk beneath Landscape Arch\'s 306-foot span, and witness geology in action as the desert transforms.' },
  ],
  nationalMonuments: [
    { name: 'Devils Tower, Wyoming', fact: 'The first US National Monument, designated by Theodore Roosevelt in 1906, and made famous by "Close Encounters of the Third Kind." This 867-foot volcanic rock formation is sacred to over 20 Native American tribes who call it Bear Lodge.', reason: 'Circle the tower on the 1.3-mile trail and watch rock climbers scale its distinctive columns. Witness the tower change colors at sunrise and sunset, and attend summer storytelling events that share Indigenous perspectives on this sacred site.' },
    { name: 'Statue of Liberty, New York', fact: 'A gift from France in 1886 celebrating the friendship forged during the American Revolution, Lady Liberty stands 305 feet tall and was the first sight for millions of immigrants arriving at Ellis Island.', reason: 'Climb the 354 steps to the crown for unmatched views of New York Harbor and the Manhattan skyline. Explore Ellis Island\'s moving immigration museum and stand where 12 million people first set foot in America in search of a better life.' },
    { name: 'Grand Staircase-Escalante, Utah', fact: 'One of the largest and most remote monuments at 1.87 million acres, this wilderness contains slot canyons so narrow you can touch both walls. Scientists continue to discover new dinosaur species here regularly.', reason: 'Hike through the zebra-striped walls of Zebra Slot Canyon and explore the ancient petrified forest. Navigate the challenging Hole-in-the-Rock Road, discover 75-million-year-old fossils, and experience true solitude in one of America\'s last frontiers.' },
    { name: 'Muir Woods, California', fact: 'One of the last remaining old-growth coast redwood forests, with trees soaring over 250 feet and some over 1,000 years old. The forest was saved from logging in 1908 and named after naturalist John Muir.', reason: 'Walk among cathedral-like groves of ancient giants just 12 miles north of the Golden Gate Bridge. Stand at the base of trees that were saplings when William the Conqueror invaded England, and experience the profound silence of the forest floor.' },
    { name: 'Bears Ears, Utah', fact: 'Contains over 100,000 archaeological sites from ancient Puebloan cultures, including cliff dwellings, ceremonial kivas, and rock art spanning 12,000 years of human history. The twin buttes are sacred to five tribes.', reason: 'Explore one of the most significant cultural landscapes in America and discover petroglyphs and pictographs hidden in remote canyons. Camp beneath stars unmarred by light pollution and walk in the footsteps of the Ancestral Puebloans.' },
    { name: 'Bandelier, New Mexico', fact: 'Home to cliff dwellings carved into volcanic tuff (compressed ash) by Ancestral Puebloans over 11,000 years ago. The soft rock made it possible to carve rooms directly into the canyon walls.', reason: 'Climb wooden ladders into ancient cave homes and explore reconstructed kivas where ceremonies were held. Walk the Main Loop Trail past hundreds of dwelling sites and imagine life in these cliffs before Europeans arrived in the Americas.' },
    { name: 'Craters of the Moon, Idaho', fact: 'Features lava flows so recent and moon-like that Apollo astronauts trained here before their lunar missions. The last eruption was only 2,000 years ago, and geologists expect the volcano to erupt again.', reason: 'Walk through an otherworldly landscape of cinder cones, lava tubes, and spatter cones that looks like another planet. Explore caves formed by flowing lava, stand in the caldera of an ancient volcano, and hike across fields of frozen black rock.' },
    { name: 'Vermilion Cliffs, Arizona', fact: 'Home to The Wave, one of the most photographed rock formations on Earth, with swirling sandstone striped in red, orange, and white. Only 64 permits per day are issued to protect this fragile landscape.', reason: 'Win the lottery for a permit to see The Wave\'s surreal, undulating stone canvas shaped by 190 million years of geological history. Even without a permit, explore the spectacular White Pocket formations and spot endangered California condors soaring overhead.' },
  ],
  stateParks: [
    { name: 'Custer State Park, SD', fact: 'Home to one of the largest free-roaming bison herds in North America with over 1,300 animals, plus wild burros that will stick their heads in your car windows. The park\'s Wildlife Loop Road is one of America\'s best wildlife drives.', reason: 'Witness the annual buffalo roundup each September when cowboys drive the entire herd across the prairie. Cruise the scenic Needles Highway through granite spires, spot bighorn sheep and pronghorn, and watch sunsets paint the Black Hills gold.' },
    { name: 'Anza-Borrego Desert, CA', fact: 'The largest state park in California at over 600,000 acres, bigger than some countries. Hidden throughout the desert are 130 giant metal sculptures of prehistoric creatures created by artist Ricardo Breceda.', reason: 'Time your visit for spring to witness spectacular wildflower super blooms that carpet the desert floor in vibrant colors. Hunt for the whimsical metal sculptures, explore slot canyons, and camp under some of the darkest skies in Southern California.' },
    { name: 'Baxter State Park, ME', fact: 'Contains Mount Katahdin, the northern terminus of the 2,190-mile Appalachian Trail, and remains one of the most primitive state parks with no electricity or running water. Gifted to Maine by Governor Percival Baxter over 32 years.', reason: 'Experience true wilderness where moose outnumber people and cell phones don\'t work. Hike to Katahdin\'s summit via the famous Knife Edge trail, congratulate thru-hikers completing their six-month journey, and disconnect from modern life completely.' },
    { name: 'Palo Duro Canyon, TX', fact: 'The second largest canyon in the United States after the Grand Canyon, stretching 120 miles long and 20 miles wide. The canyon was carved by a fork of the Red River and features stunning layers of red, yellow, and orange rock.', reason: 'Watch the outdoor musical drama "TEXAS" performed under the stars in the canyon amphitheater. Hike or horseback ride past hoodoos and colorful rock formations, spot the rare Texas horned lizard, and explore where Comanche once roamed.' },
    { name: 'Valley of Fire, NV', fact: 'Nevada\'s oldest state park features 3,000-year-old petroglyphs carved by ancient Puebloans and sandstone formations dating back 150 million years to the age of dinosaurs. The name comes from the brilliant red rocks that appear to burn at sunrise and sunset.', reason: 'Photograph the fire-red sandstone formations as they glow in golden hour light, especially the famous Wave-like Fire Wave formation. Explore ancient petroglyphs at Mouse\'s Tank, squeeze through narrow slot canyons, and visit a petrified forest.' },
    { name: 'Watkins Glen, NY', fact: 'Features 19 waterfalls along a 2-mile gorge trail that descends 400 feet through 200-foot stone walls, carved by Glen Creek over 12,000 years. The gorge was formed when glaciers retreated at the end of the Ice Age.', reason: 'Walk directly behind waterfalls on the famous Gorge Trail as water cascades around you. Climb 832 stone steps through tunnels and over bridges while mist from the falls cools you on hot summer days. It\'s like walking through a natural cathedral.' },
    { name: 'Julia Pfeiffer Burns, CA', fact: 'Home to McWay Falls, one of only two waterfalls in California that plunge directly into the ocean. The park is named after a Big Sur pioneer woman and sits on one of the most scenic stretches of Highway 1.', reason: 'Gaze at the iconic 80-foot waterfall cascading onto a pristine turquoise cove, the most photographed spot on the Big Sur coast. Hike through redwood forests, explore tide pools, and drive one of the world\'s most beautiful coastal roads.' },
  ],
  fiveKPeaks: [
    { name: 'Mount Everest', fact: 'The highest point on Earth at 8,849m and still growing about 4mm taller each year as the Indian subcontinent pushes into Asia. The summit is so high that jet streams regularly blast the peak with 200 mph winds.', reason: 'Stand on top of the world and achieve the ultimate mountaineering goal that has captivated humanity for a century. Whether you summit or trek to Base Camp, you\'ll experience the Khumbu Icefall, Sherpa culture, and views that humble even the most experienced adventurer.' },
    { name: 'K2', fact: 'Known as the "Savage Mountain" with a 25% fatality rate, with one climber dying for every four who summit. K2 is considered far more technically difficult than Everest due to its steep faces and extreme weather.', reason: 'Witness the world\'s most fearsome peak from Concordia, where multiple glaciers meet in one of mountaineering\'s most spectacular amphitheaters. Even trekking to K2 Base Camp is an epic adventure through the Karakoram Range\'s dramatic spires and ice towers.' },
    { name: 'Kilimanjaro', fact: 'The world\'s tallest freestanding volcanic mountain, rising from the African savanna to 5,895m with five distinct climate zones from tropical forest to arctic summit. Its glaciers are rapidly disappearing due to climate change.', reason: 'Summit Africa\'s highest peak without any technical climbing experience, just determination and fitness. Trek through rainforest past elephants and monkeys, then emerge onto alpine desert before reaching the snow-covered crater rim at sunrise.' },
    { name: 'Mont Blanc', fact: 'The birthplace of modern alpinism, first climbed for sport in 1786, and Western Europe\'s highest peak at 4,808m. The mountain sits on the border of France and Italy with its own microclimate that creates notoriously unpredictable weather.', reason: 'Climb where mountaineering was invented and ski some of Europe\'s most legendary off-piste terrain. Take the Aiguille du Midi cable car for instant access to high-altitude views, or complete the Tour du Mont Blanc hiking circuit around the entire massif.' },
    { name: 'Denali', fact: 'Has the largest base-to-peak rise of any mountain on Earth at 18,000 feet from base to summit compared to Everest\'s 12,000 feet. Located at 63°N latitude, Denali is the coldest and most remote of the Seven Summits.', reason: 'Climb North America\'s tallest peak under 24-hour summer daylight in one of the world\'s most demanding mountaineering challenges. Fly onto the Kahiltna Glacier, navigate crevasse fields, and test yourself against arctic conditions that rival Himalayan extremes.' },
    { name: 'Aconcagua', fact: 'The highest peak outside Asia at 6,961m and the tallest mountain in both the Western and Southern hemispheres. Known as the "Stone Sentinel" in the Quechua language, it\'s technically a non-technical climb that kills through altitude sickness.', reason: 'Summit one of the Seven Summits without technical climbing skills. Aconcagua rewards fitness and acclimatization rather than rope work. Trek through Andean valleys with views of condors soaring overhead and experience the legendary Patagonian winds.' },
    { name: 'Matterhorn', fact: 'Perhaps the world\'s most recognizable mountain, its perfect pyramidal peak is visible from four countries (Switzerland, Italy, France, Germany). The first ascent in 1865 ended in tragedy when four climbers fell to their deaths on the descent.', reason: 'Climb the most iconic mountain silhouette in the world via the famous Hörnli Ridge. Even if you don\'t summit, Zermatt offers world-class skiing with constant views of this legendary peak that has inspired mountaineers for over 150 years.' },
  ],
  fourteeners: [
    { name: 'Mount Elbert', fact: 'The highest peak in Colorado and the entire Rocky Mountains at 14,440 feet, yet it\'s one of the most accessible fourteeners via a straightforward Class 1 trail. The summit offers 360-degree views of Colorado\'s highest peaks.', reason: 'Stand atop the Rockies on a moderate hike that any fit hiker can complete in a day. Watch the sunrise paint the Sawatch Range in alpenglow, then celebrate bagging Colorado\'s tallest with a post-hike meal in the charming town of Leadville.' },
    { name: 'Pikes Peak', fact: 'The view from the summit inspired Katharine Lee Bates to write "America the Beautiful" in 1893. It\'s one of the most visited peaks in North America, accessible by hiking, driving, or the world\'s highest cog railway.', reason: 'Experience this famous peak your way: hike the challenging 13-mile Barr Trail, drive America\'s most dangerous road, or relax on the cog railway. The summit visitor center serves famous high-altitude donuts, and clear days reveal views stretching from Kansas to the Continental Divide.' },
    { name: 'Longs Peak', fact: 'The only fourteener in Rocky Mountain National Park and one of the most challenging non-technical fourteeners due to the famous Keyhole Route. Over 50 people have died attempting to summit this iconic flat-topped peak.', reason: 'Challenge yourself on the legendary Keyhole Route, scrambling through the Trough, across the Narrows, and up the Homestretch to the summit. Start at 3am to beat afternoon lightning storms and join the elite club of climbers who\'ve conquered this peak.' },
    { name: 'Mount of the Holy Cross', fact: 'Features a natural cross-shaped snow formation in a 1,500-foot couloir that inspired 19th-century pilgrims to trek for days to see it. The cross is best visible in early summer before the snow melts.', reason: 'Photograph the iconic cross that William Henry Jackson made famous in 1873 and that was once considered a national pilgrimage destination. The challenging hike gains 5,600 feet and crosses a ridge with stunning exposure. A true Colorado adventure.' },
    { name: 'Maroon Bells', fact: 'The most photographed peaks in North America, these distinctive twin summits of crumbling red mudstone have earned the nickname "Deadly Bells" for the dangerous loose rock that has claimed many lives.', reason: 'See the iconic reflection of burgundy peaks in Maroon Lake, a scene that graces countless calendars and screensavers. Experienced climbers can tackle the traverse between the two summits, or simply hike the scenic trail for one of Colorado\'s most spectacular views.' },
    { name: 'Mount Whitney', fact: 'The highest peak in the contiguous United States at 14,505 feet, located just 85 miles from Badwater Basin, the lowest point in North America. The summit is named for Josiah Whitney, the state geologist of California.', reason: 'Complete the ultimate high-low adventure by visiting Death Valley\'s lowest point and Whitney\'s summit in the same trip for a 14,000+ foot elevation swing. The 22-mile round-trip hike is accessible to fit hikers, offering Sierra Nevada views that stretch seemingly forever.' },
    { name: 'Capitol Peak', fact: 'Widely considered the most difficult and dangerous of Colorado\'s fourteeners due to the infamous Knife Edge, a narrow ridge with 2,000-foot drops on both sides. The peak requires Class 4 climbing and has claimed numerous lives.', reason: 'Test your mountaineering skills on the most technical standard fourteener route in Colorado. The Knife Edge traverse will have your heart pounding as you straddle a fin of rock with enormous exposure on both sides, the ultimate Colorado climbing achievement.' },
    { name: 'Quandary Peak', fact: 'One of the most accessible and popular fourteeners in Colorado, with a well-maintained trail and only 3,450 feet of elevation gain. Its name comes from miners who couldn\'t identify the blue mineral they found here (it turned out to be blue quartz).', reason: 'Bag your first fourteener on this welcoming peak that serves as a perfect introduction to high-altitude hiking. The trail is straightforward but rewarding, with sweeping views of the Tenmile Range and a summit celebration you\'ll never forget.' },
  ],
  museums: [
    { name: 'The Louvre, Paris', fact: 'The world\'s largest museum would take 200 days to see every piece if you spent just 30 seconds on each. Originally a 12th-century fortress, the building\'s glass pyramid entrance was controversial when unveiled in 1989 but is now beloved.', reason: 'Stand before the Mona Lisa\'s enigmatic smile and explore 35,000 works spanning 9,000 years of human creativity. Wander through the French Crown Jewels, the Winged Victory of Samothrace, and galleries so vast you could visit for a week and still see something new.' },
    { name: 'British Museum, London', fact: 'Houses 8 million objects spanning 2 million years of history, yet only 1% are on display at any time. The museum has been free to enter since opening in 1759 as the world\'s first national public museum.', reason: 'See the actual Rosetta Stone that unlocked Egyptian hieroglyphics and walk among mummies from ancient Egypt. Explore the controversial Elgin Marbles, examine samurai armor, and travel through human civilization without spending a penny.' },
    { name: 'Smithsonian, Washington DC', fact: 'The world\'s largest museum complex holds 154 million items across 19 museums and galleries. If you spent one minute at each item, it would take over 290 years. All Smithsonian museums are completely free.', reason: 'Stand next to the actual Spirit of St. Louis at Air and Space and see the Hope Diamond at Natural History. Touch a real moon rock, view Dorothy\'s ruby slippers, and explore world-class collections that belong to the American people, all at no cost.' },
    { name: 'Vatican Museums, Rome', fact: 'Michelangelo spent four years painting the Sistine Chapel ceiling (not lying down as myth suggests, but standing on scaffolding with his neck craned back). The museums contain 9 miles of galleries with 20,000 works.', reason: 'Journey through 2,000 years of artistic masterpieces collected by the Catholic Church, culminating in the breathtaking Sistine Chapel. Gaze up at Michelangelo\'s Creation of Adam and explore the Raphael Rooms that inspired generations of artists.' },
    { name: 'Rijksmuseum, Amsterdam', fact: 'The only major museum in the world with a public road and bike path running through its arches. The building itself is a masterpiece of Dutch Neo-Renaissance architecture housing 8,000 objects.', reason: 'Stand before Rembrandt\'s monumental Night Watch (recently restored to its original size) and Vermeer\'s intimate Girl with a Pearl Earring. Explore Dutch Golden Age masterpieces and the world\'s finest collection of Delftware.' },
    { name: 'The Met, New York', fact: 'Houses 2 million works including a complete Egyptian temple (the Temple of Dendur) that was a gift from Egypt and reassembled stone by stone. The rooftop garden offers stunning Central Park views.', reason: 'Explore the Temple of Dendur in its glass-enclosed atrium and try on virtual armor from across centuries. Walk through a reconstructed Frank Lloyd Wright room, see Washington Crossing the Delaware, and spend hours in the Egyptian wing\'s mummy collection.' },
    { name: 'Uffizi Gallery, Florence', fact: 'Designed by Vasari in 1560 as offices (uffizi) for Florentine magistrates, it became an art gallery in 1765 and houses the world\'s greatest collection of Renaissance art. The Medici family donated most of the collection.', reason: 'See Botticelli\'s Birth of Venus where it was created, steps from where Michelangelo and da Vinci walked. Marvel at Caravaggio\'s dramatic lighting, Raphael\'s madonnas, and centuries of Medici-collected masterpieces in the birthplace of the Renaissance.' },
    { name: 'Hermitage, St. Petersburg', fact: 'One of the world\'s largest museums with 3 million items across 400 rooms. You\'d walk 15 miles to see everything. The museum famously employs about 50 cats to protect the art from mice, continuing a tradition started by Empress Elizabeth.', reason: 'Wander through the opulent Winter Palace of the Russian tsars and discover masterpieces by da Vinci, Rembrandt, and Matisse. Climb the Jordan Staircase, explore the Gold Room\'s Scythian treasures, and meet the museum\'s famous feline guardians.' },
  ],
  mlbStadiums: [
    { name: 'Fenway Park, Boston', fact: 'The oldest active MLB stadium (opened 1912) features the iconic 37-foot Green Monster wall that has been denying home runs for over a century. The manually operated scoreboard inside the Monster is still updated by hand during games.', reason: 'Experience baseball history at America\'s most beloved ballpark, where Babe Ruth pitched and Ted Williams hit. Sit atop the Green Monster, visit Pesky\'s Pole, and feel the energy of Red Sox Nation in this intimate, century-old cathedral of baseball.' },
    { name: 'Wrigley Field, Chicago', fact: 'The ivy-covered outfield walls were planted in 1937 and have swallowed countless baseballs. Any ball lost in the ivy is ruled a ground-rule double. The stadium was the last in MLB to install lights (1988).', reason: 'Catch a rooftop game from the surrounding buildings and experience the only ballpark where you can watch for free from apartment windows. Stretch during the seventh inning, visit the Harry Caray statue, and soak in Cubs culture in Wrigleyville.' },
    { name: 'Oracle Park, San Francisco', fact: 'Splash hits into McCovey Cove have become a phenomenon, with kayakers patrolling the waters hoping to catch home run balls. Barry Bonds hit 35 of his 762 career homers into the bay.', reason: 'Watch kayakers scramble for home runs while enjoying stunning views of the bay and city skyline. Grab a garlic fries, see the world\'s largest baseball glove sculpture, and experience one of baseball\'s most picturesque settings.' },
    { name: 'PNC Park, Pittsburgh', fact: 'Consistently rated the best ballpark in America for its stunning views of the Roberto Clemente Bridge, Pittsburgh skyline, and three rivers beyond the outfield. The stadium cost only $216 million, a fraction of modern ballparks.', reason: 'Walk across the Clemente Bridge from downtown and enter through the gates with the best skyline view in sports. Enjoy affordable tickets and pierogies while watching the sunset turn the city golden behind the outfield.' },
    { name: 'Dodger Stadium, Los Angeles', fact: 'The largest MLB stadium by seating capacity at 56,000 and the third-oldest ballpark still in use. The stadium has hosted more fans than any other in baseball history, over 147 million since opening in 1962.', reason: 'Watch a game with the San Gabriel Mountains as your backdrop while enjoying a famous Dodger Dog. Experience Hollywood glamour in the stands, catch a sunset game, and explore the recently renovated centerfield plaza.' },
    { name: 'Camden Yards, Baltimore', fact: 'When it opened in 1992, Camden Yards revolutionized ballpark design, spawning every retro-modern stadium built since. The warehouse beyond right field has never been hit by a home run despite countless attempts.', reason: 'Experience the stadium that changed modern ballpark design and inspired a generation of classic-yet-modern venues. Sample the famous pit beef sandwiches, explore Eutaw Street, and watch Orioles games in the park that started it all.' },
    { name: 'Coors Field, Denver', fact: 'The row of purple seats on the upper deck marks exactly one mile above sea level, and the thin air causes baseballs to fly 9% farther than at sea level, making it the ultimate hitter\'s park.', reason: 'Watch balls soar through the mile-high air and spot the purple seats that mark 5,280 feet elevation. Enjoy Rocky Mountain views, sample craft beers at the Rooftop bar, and experience baseball in America\'s most unique atmosphere.' },
  ],
  nflStadiums: [
    { name: 'Lambeau Field, Green Bay', fact: 'The NFL\'s oldest stadium in continuous use (since 1957) is owned by the fans. The Packers are the only publicly-owned franchise in American pro sports. The "Frozen Tundra" has hosted legendary games in temperatures below -13°F.', reason: 'Experience the legendary "Lambeau Leap" celebration and tailgate with the most dedicated fans in football. Tour the stadium, learn about the Ice Bowl, and understand why Green Bay is the most storied franchise in NFL history.' },
    { name: 'AT&T Stadium, Dallas', fact: 'Features the world\'s largest column-free interior and a video board so massive (160 feet wide) that punts have hit it during games. Jerry Jones filled the stadium with $1.2 billion worth of contemporary art.', reason: 'Tour "Jerry World" and its museum-quality art collection, from Anish Kapoor to Ellsworth Kelly. Stand on the 50-yard line, see the world\'s largest video board, and experience football as only Texas can deliver it.' },
    { name: 'SoFi Stadium, Los Angeles', fact: 'The most expensive stadium ever built at $5.5 billion features a transparent roof and the "Infinity Screen," a double-sided, 70,000-square-foot video board that wraps around the entire bowl.', reason: 'Experience the stunning architectural achievement that reinvented what a stadium can be. Watch the ocean through the translucent roof, marvel at the Infinity Screen from any angle, and see why this is the future of sports venues.' },
    { name: 'Arrowhead Stadium, Kansas City', fact: 'Holds the Guinness World Record for loudest stadium at 142.2 decibels, louder than a jet engine at takeoff. The roar of Chiefs Kingdom has been known to cause false earthquake readings.', reason: 'Feel the roar of the loudest fans in professional sports and experience the legendary tailgate scene that starts at sunrise. Join the tomahawk chop, feel the ground shake when the Chiefs score, and understand why it\'s called the "Sea of Red."' },
    { name: 'Caesars Superdome, New Orleans', fact: 'The first domed stadium to host a Super Bowl (1978) and served as emergency shelter for 30,000 people during Hurricane Katrina in 2005. The dome\'s return in 2006 symbolized the city\'s resilience.', reason: 'Experience the electric atmosphere of Who Dat Nation in a stadium that represents New Orleans\' strength and spirit. The acoustics amplify crowd noise to deafening levels, making home games a true advantage for the Saints.' },
    { name: 'Highmark Stadium, Buffalo', fact: 'Famous for the most intense tailgate culture in the NFL, where fans have been known to jump through flaming tables and brave below-zero temperatures. The stadium\'s exposed design creates legendary cold-weather games.', reason: 'Join the wildest tailgate scene in professional sports where Bills Mafia breaks tables and grills for hours before kickoff. Experience the passion of a fanbase that waited decades for a championship and braves brutal winters with pride.' },
    { name: 'Lincoln Financial Field, Philadelphia', fact: 'The only NFL stadium with its own jail and municipal courtroom inside for unruly fans, a testament to the intensity (and occasional excess) of Eagles supporters. The stadium once booed Santa Claus.', reason: 'Experience the passion of Eagles fans at the "Linc," where opposing fans think twice before wearing their team\'s colors. Feel the energy of the most notoriously dedicated fanbase in the NFL and join the "E-A-G-L-E-S" chant.' },
  ],
  nbaStadiums: [
    { name: 'Madison Square Garden, NYC', fact: 'Known as "The World\'s Most Famous Arena" since 1968, MSG sits atop Penn Station in the heart of Manhattan. The current arena is the fourth venue to bear the name, and every major entertainer has performed here.', reason: 'Watch basketball where legends from Willis Reed to Patrick Ewing played, in the heart of Manhattan. Experience a Knicks game where celebrities fill the courtside seats and the crowd creates an atmosphere unlike any other arena in basketball.' },
    { name: 'United Center, Chicago', fact: 'The Michael Jordan statue outside greets visitors with MJ\'s famous pose, and six championship banners hang from the rafters from the Bulls\' dynasty years. The arena is also home to the Blackhawks.', reason: 'Feel the energy where MJ created basketball magic and see his iconic statue that captures "The Shot." Walk past the championship banners, visit the Bulls museum, and imagine the 1990s dynasty that defined an era of basketball.' },
    { name: 'Chase Center, San Francisco', fact: 'The first privately financed NBA arena in over 20 years cost $1.4 billion and sits on the San Francisco waterfront. The Warriors\' arena features cutting-edge technology and views of the bay.', reason: 'Watch the Warriors\' dynasty continue in their tech-forward waterfront arena that embodies Silicon Valley innovation. Explore the surrounding Thrive City plaza, catch a game with bay views, and see why this is the NBA\'s most modern venue.' },
    { name: 'Crypto.com Arena, Los Angeles', fact: 'The only arena that hosts four professional sports teams (Lakers, Clippers, Kings, Sparks) and transforms for concerts constantly. Jack Nicholson\'s courtside seat has been occupied since the 1970s.', reason: 'Spot celebrities courtside at Hollywood\'s home court, from Jack Nicholson to movie stars at every game. Experience the glitz of Lakers basketball, see championship banners from Kobe to Magic, and feel the energy of LA\'s most glamorous venue.' },
    { name: 'TD Garden, Boston', fact: 'Displays 17 Celtics championship banners, more than any other NBA franchise, alongside 6 Bruins Stanley Cup banners. The original parquet floor is replicated in today\'s court design.', reason: 'Experience the storied rivalry between Celtics and Lakers in the arena where Bird, Russell, and Pierce created legends. Look up at 17 championship banners, appreciate the iconic parquet floor pattern, and feel the weight of basketball history.' },
    { name: 'Little Caesars Arena, Detroit', fact: 'Features a unique "gondola" seating section that hangs suspended over the playing surface, offering a view from directly above the action. The arena anchors Detroit\'s revitalized downtown district.', reason: 'Watch games from the unique suspended gondola section that offers views straight down onto the court. Experience the revitalized Detroit sports scene, explore the surrounding District Detroit, and see why this arena represents the city\'s comeback.' },
    { name: 'Fiserv Forum, Milwaukee', fact: 'The arena\'s design includes a massive outdoor plaza called the Deer District that opens directly into the bowl, creating a seamless indoor-outdoor experience. The 2021 NBA Finals packed 65,000 fans outside.', reason: 'Join the Deer District atmosphere where playoff crowds overflow into massive outdoor watch parties. Experience the energy that powered Giannis and the Bucks to their 2021 championship and feel what small-market passion really means.' },
  ],
  nhlStadiums: [
    { name: 'Bell Centre, Montreal', fact: 'The most legendary arena in hockey displays 24 Stanley Cup banners and retired numbers of icons like Maurice Richard and Jean Béliveau. The Canadiens are the most successful franchise in NHL history with the most devoted fans.', reason: 'Experience hockey\'s most storied franchise where fans still chant in French and the atmosphere is unmatched. Hear 21,000 fans sing "Ole Ole Ole," see the banners hanging from the rafters, and understand why Montreal is hockey\'s most sacred temple.' },
    { name: 'TD Garden, Boston', fact: 'Home to both Bruins (6 Cups) and Celtics (17 banners), the Garden displays more championship banners than any arena in America. The Bruins have retired 12 numbers, including Bobby Orr\'s number 4.', reason: 'Feel the intensity of Original Six hockey rivalry games in an arena dripping with championship history. Experience the Bruins\' blue-collar passion, see Bobby Orr\'s retired jersey, and understand why Boston fans are the most passionate in sports.' },
    { name: 'Madison Square Garden, NYC', fact: 'The Rangers are the only Original Six team playing in the same city since 1926, and MSG has hosted legends from Gretzky to Messier to Lundqvist. The arena\'s history spans hockey\'s entire modern era.', reason: 'Watch hockey where the Great One played and Mark Messier guaranteed a Game 6 victory in 1994. Experience the energy of Broadway on ice, hear the roar when Henrik Lundqvist\'s name echoes, and feel the weight of Rangers history.' },
    { name: 'Scotiabank Arena, Toronto', fact: 'The most valuable franchise in hockey plays in an arena where the upper deck is further from the ice than any other NHL venue, yet tickets remain the most expensive and hardest to get in the league.', reason: 'Experience the passion of Leafs Nation in hockey\'s most rabid market, where fans haven\'t seen a Cup since 1967 but still fill every seat. Feel the tension, the hope, and the historic weight of the most obsessive fanbase in sports.' },
    { name: 'T-Mobile Arena, Las Vegas', fact: 'The first major professional sports venue built on the Las Vegas Strip and home to the expansion Vegas Golden Knights, who reached the Stanley Cup Finals in their inaugural season, an unprecedented achievement.', reason: 'Watch hockey with Vegas showmanship, from the pregame Knight projection show to the castle-themed arena experience. See how Vegas reinvented hockey entertainment and brought championship-caliber hockey to the desert.' },
    { name: 'Climate Pledge Arena, Seattle', fact: 'The world\'s first zero-carbon certified arena was built by preserving the historic 1962 World\'s Fair roof while completely excavating underneath. The Kraken became Seattle\'s first NHL team in 2021.', reason: 'Watch the NHL\'s newest team in a renovated historic arena that leads sports sustainability. See the preserved 1962 roof, experience the Pacific Northwest hockey culture growing from scratch, and witness history being made.' },
    { name: 'United Center, Chicago', fact: 'The Blackhawks\' six Stanley Cup banners hang alongside Michael Jordan\'s retired jerseys, and the Chelsea Dagger goal song has become one of hockey\'s most recognizable celebrations.', reason: 'Hear the roar when Chelsea Dagger plays after goals, one of hockey\'s most electric traditions. Experience the Blackhawks\' passionate fanbase, see banners from their 2010s dynasty, and feel the Chicago sports energy.' },
  ],
  soccerStadiums: [
    { name: 'Camp Nou, Barcelona', fact: 'The largest stadium in Europe with 99,354 capacity is undergoing a massive renovation to reach 105,000 seats. The museum is Spain\'s most visited, attracting more tourists than the Prado.', reason: 'Feel the magic of "Més que un club" (More than a club) at FC Barcelona\'s legendary home. Walk through the museum displaying five Champions League trophies, sit in the presidential box, and understand why Barça represents Catalan identity.' },
    { name: 'Santiago Bernabéu, Madrid', fact: 'Real Madrid\'s home has undergone a €1 billion futuristic renovation with a retractable roof, 360-degree wraparound screen, and underground pitch storage system. The club has won a record 15 Champions League titles.', reason: 'Visit the legendary home of the most decorated club in European football history. Tour the trophy room displaying 15 Champions League titles, walk onto the pitch, and experience the "Hala Madrid" atmosphere that has intimidated opponents for decades.' },
    { name: 'Old Trafford, Manchester', fact: 'Known as the "Theatre of Dreams" since 1910, the stadium was rebuilt after being bombed in WWII and has hosted legends from George Best to Cristiano Ronaldo. The statue of Sir Matt Busby greets visitors.', reason: 'Experience Premier League football at the most famous club ground in England. Walk through the Munich Tunnel honoring the 1958 tragedy, see the statue of Sir Alex Ferguson, and feel the history of 20 league titles and countless legends.' },
    { name: 'Anfield, Liverpool', fact: 'Before every home match, 54,000 fans sing "You\'ll Never Walk Alone" in unison, a tradition that has moved players and opponents to tears. The Kop end is considered the most atmospheric stand in world football.', reason: 'Stand in the Kop end for the most atmospheric experience in world football and sing the iconic anthem. Walk through the Shankly Gates, touch the "This Is Anfield" sign, and understand why Liverpool fans create football\'s most special atmosphere.' },
    { name: 'Allianz Arena, Munich', fact: 'The exterior is composed of 2,874 inflated panels that can display 16 million color combinations, glowing red for Bayern, blue for 1860 Munich, and white for Germany national team matches.', reason: 'See the stadium glow red on Bayern Munich match nights and experience German football culture at its finest. Tour the museum displaying countless Bundesliga titles, sit in the stands where Champions League finals have been decided.' },
    { name: 'San Siro, Milan', fact: 'The only major stadium shared by two fierce rivals: AC Milan and Inter Milan have played home games here since 1947. The towering spiral ramps and three-tier design make it one of football\'s most iconic structures.', reason: 'Watch the Derby della Madonnina, one of football\'s fiercest rivalries where the same stadium hosts both clubs. Climb the iconic spiral ramps, feel the intensity of Italian calcio, and see where European Cup finals have crowned champions.' },
    { name: 'Maracanã, Rio de Janeiro', fact: 'Once held nearly 200,000 fans for the 1950 World Cup final. Brazil\'s traumatic loss to Uruguay remains known as the "Maracanazo." The stadium has hosted two World Cup finals and witnessed Pelé\'s 1,000th goal.', reason: 'Experience Brazilian football passion in the stadium where Pelé became a god and heartbreak still echoes from 1950. Feel the samba drums, see the footprints of legends in concrete, and understand why football is Brazil\'s religion.' },
    { name: 'Wembley Stadium, London', fact: 'The iconic arch is visible from 13 miles away and stands 133m tall, taller than the Statue of Liberty. The new stadium (opened 2007) replaced the original where England won the 1966 World Cup.', reason: 'Watch England play under the iconic arch in the home of football. The sport was invented in England and Wembley is its cathedral. Walk up Olympic Way, see the Bobby Moore statue, and experience football coming home.' },
  ],
  f1Tracks: [
    { name: 'Monaco Grand Prix', fact: 'The slowest F1 race due to tight street circuits averaging just 100 mph, yet the most prestigious on the calendar. Drivers navigate within inches of barriers, including the famous tunnel that emerges into bright Mediterranean sunshine.', reason: 'Watch the world\'s fastest cars thread through casino squares and past superyachts in the harbor. Experience the glamour of Monte Carlo, where movie stars mingle with royalty and champagne flows on every yacht deck overlooking the track.' },
    { name: 'Silverstone, UK', fact: 'The birthplace of Formula 1, where the first-ever championship race was held here on May 13, 1950. Built on a former WWII airfield, the track\'s original layout followed the perimeter runway and taxiways.', reason: 'Visit the birthplace of F1 and feel motorsport history seeping from every corner. Experience the legendary Maggots, Becketts, and Chapel complex, widely considered the best sequence of corners in motorsport, and join passionate British fans rain or shine.' },
    { name: 'Spa-Francorchamps, Belgium', fact: 'Home to Eau Rouge/Raidillon, the most famous corner sequence in motorsport, a blind uphill left-right-left taken at over 180 mph that separates the brave from the legendary. The track\'s weather can be sunny on one section and raining on another.', reason: 'Experience one of the fastest and most dramatic tracks in the world through the forests of the Ardennes. Camp trackside with devoted fans from across Europe, watch cars disappear into the forest at Eau Rouge, and feel why drivers call this their favorite circuit.' },
    { name: 'Monza, Italy', fact: 'The fastest track on the F1 calendar where cars reach speeds over 230 mph on the long straights. The Tifosi (Ferrari fans) are legendary: when Ferrari wins, the entire grandstand erupts in a sea of red smoke flares and tears of joy.', reason: 'Feel the passion of the Tifosi supporting Ferrari in the Temple of Speed where motorsport is religion. Stand at the historic banking from the 1950s oval track, watch cars scream past at record speeds, and witness the most passionate fans in racing.' },
    { name: 'Suzuka, Japan', fact: 'The only figure-8 circuit on the F1 calendar, where cars pass over the track via a bridge at the crossover point. Built by Honda in 1962, Suzuka features corners named by designer John Hugenholtz that test every skill a driver possesses.', reason: 'See the unique crossover bridge and experience the devoted Japanese fans who camp overnight to claim viewing spots. Marvel at the technical 130R corner, appreciate the fan culture that turns the grandstands into coordinated art displays, and witness F1\'s most dedicated audience.' },
    { name: 'Singapore Grand Prix', fact: 'The first-ever F1 night race, illuminated by over 1,500 lighting projectors that turn the Marina Bay Street Circuit into a glittering spectacle. The tropical humidity and 2-hour race duration make this one of the most physically demanding races.', reason: 'Watch cars race through illuminated city streets past the stunning Marina Bay Sands and Singapore Flyer. Experience the unique atmosphere of F1 under lights, with the city skyline as your backdrop and world-class entertainment between sessions.' },
    { name: 'Circuit of the Americas, USA', fact: 'Turn 1 is a blind, 133-foot climb to the apex, the largest elevation change of any corner in F1, where drivers arrive at 200 mph with no visibility of the exit. The track was specifically designed to create challenging corners from F1\'s greatest circuits.', reason: 'Experience F1\'s impressive American home with Austin\'s legendary music and food scene. See the tower overlooking Turn 1, experience the atmosphere where American F1 fandom exploded, and stay for the post-race concerts that bring global superstars.' },
    { name: 'Las Vegas Strip Circuit', fact: 'Cars reach 212 mph racing past the famous casino hotels and the Sphere in what is essentially the world\'s most expensive street party. The race takes place at night to capture the iconic Las Vegas glow.', reason: 'See F1 cars race down the iconic Las Vegas Strip at night, past landmarks like the Bellagio fountains and Caesars Palace. Experience the ultimate fusion of motorsport spectacle and Vegas entertainment, where the casino lights illuminate the fastest show on Earth.' },
  ],
  marathons: [
    { name: 'Boston Marathon', fact: 'The world\'s oldest annual marathon (since 1897) is the only major that requires a qualifying time. You have to earn your spot. The point-to-point course is famously challenging, with the Newton Hills arriving when runners are most fatigued.', reason: 'Earn your way to the start line and tackle the legendary "Heartbreak Hill" around mile 20. Experience the electric energy of the Wellesley College "Scream Tunnel," run through history at the 2013 memorial, and cross the iconic finish on Boylston Street.' },
    { name: 'London Marathon', fact: 'The largest annual fundraising event in the world, having raised over £1 billion for charity since 1981. The course takes runners past some of London\'s most iconic landmarks, finishing in front of Buckingham Palace.', reason: 'Run past Big Ben, Tower Bridge, and along the Thames before finishing at Buckingham Palace. Experience the legendary British crowd support, high-five costumed charity runners, and join a race where everyday heroes run alongside world record chasers.' },
    { name: 'Berlin Marathon', fact: 'The world\'s fastest marathon course, where every men\'s world record since 2003 has been set. The flat, straight course through the unified city passes through the Brandenburg Gate in the final stretch.', reason: 'Chase a personal best on this famously flat course that has produced more world records than any other marathon. Run through history at Checkpoint Charlie and the Berlin Wall remnants, then finish triumphantly through the Brandenburg Gate.' },
    { name: 'Chicago Marathon', fact: 'A flat, fast course that winds through 29 diverse neighborhoods, offering a cultural tour of one of America\'s great cities. The course record is just seconds off the world record, making it a destination for elite runners.', reason: 'Experience incredible crowd support from Chicago\'s passionate neighborhoods, from Pilsen\'s mariachi bands to Boystown\'s dance music. Run along Lake Michigan, through the Loop, and finish in Grant Park with skyline views that make the pain worthwhile.' },
    { name: 'New York City Marathon', fact: 'The largest marathon in the world with over 50,000 runners crossing the finish line each year. The course traverses all five boroughs, starting on Staten Island and finishing in Central Park after crossing the Queensboro Bridge.', reason: 'Cross five boroughs and experience New York\'s incredible diversity, from Brooklyn\'s brownstones to Manhattan\'s skyscrapers. Feel the energy of two million spectators lining the course, run through Times Square in spirit, and finish in the heart of Central Park.' },
    { name: 'Tokyo Marathon', fact: 'One of the hardest marathons to enter with lottery odds around 10:1, yet runners who get in experience unmatched Japanese hospitality. The course passes the Imperial Palace, Tokyo Tower, and Senso-ji Temple.', reason: 'Experience unmatched Japanese organization where volunteers bow and courses are spotless. Run past the Imperial Palace and through Ginza, receive precise aid station service, and feel the respectful, encouraging energy of Tokyo\'s polite but passionate crowds.' },
    { name: 'Sydney Marathon', fact: 'The newest Abbott World Marathon Major and the only one that lets you run across a major harbor bridge. The course showcases Sydney\'s stunning harbor, with views of the Opera House and Harbour Bridge throughout.', reason: 'Cross the Sydney Harbour Bridge with the Opera House gleaming below, a view no other marathon offers. Run through the Royal Botanic Gardens, along the harborfront, and experience the newest World Major in one of the most beautiful cities on Earth.' },
  ],
  airports: [
    { name: 'Singapore Changi', fact: 'Consistently rated the world\'s best airport, featuring a 40-meter indoor waterfall (the world\'s tallest), a butterfly garden with 1,000 butterflies, and free movie theaters. Long layovers here are something travelers look forward to.', reason: 'Experience the world\'s best airport with amenities that rival theme parks. Ride the canopy bridge, relax in the rooftop pool, explore the forest valley, and discover why Changi sets the standard for what airports can be.' },
    { name: 'Tokyo Haneda', fact: 'One of the world\'s busiest airports with legendary punctuality where delays are measured in seconds, not minutes. The domestic terminals feature traditional Japanese gardens, ramen shops, and even a planetarium.', reason: 'See Japanese efficiency in action at the futuristic departure halls where every detail is perfected. Experience the incredible food options, relax in traditional gardens, and appreciate an airport that runs like clockwork.' },
    { name: 'Dubai International', fact: 'The busiest airport for international passengers in the world, with the largest duty-free shopping operation on Earth. Terminal 3 is the largest building in the world by floor space and serves exclusively Emirates passengers.', reason: 'Explore the world\'s largest duty-free shopping area and experience the opulence of Emirates\' Terminal 3. Freshen up in luxury lounges, sample cuisine from around the world, and see globalization in action at this crossroads of continents.' },
    { name: 'London Heathrow', fact: 'A plane takes off or lands every 45 seconds at peak times, making it one of the most complex airspace operations in the world. The airport has been continuously operating since 1946 and handles 80+ million passengers annually.', reason: 'Spot planes from around the world at Europe\'s busiest hub and experience the gateway to the UK. Watch the constant choreography of aircraft from every corner of the globe, explore duty-free shopping, and feel the energy of a truly global airport.' },
    { name: 'Denver International', fact: 'The largest airport in America by total area is surrounded by conspiracy theories, from the "Blue Mustang" sculpture with glowing red eyes (it killed its creator) to murals depicting apocalyptic scenes and alleged underground bunkers.', reason: 'See the controversial artwork including "Blucifer" the blue horse with demonic red eyes. Explore the tent-like roof designed to echo the Rocky Mountains, decode the mysterious dedication stone, and decide for yourself what lies beneath.' },
    { name: 'Hong Kong International', fact: 'Built on a completely artificial island created from reclaimed land, HKIA replaced the legendary Kai Tak Airport with its terrifying approach. The airport features an IMAX theater and the world\'s largest airport terminal building by floor area.', reason: 'Experience the stunning architecture of a megastructure built on an island that didn\'t exist 30 years ago. Watch planes from the observation deck, explore the massive terminals, and appreciate engineering that created land from sea.' },
    { name: 'Amsterdam Schiphol', fact: 'The only major airport with an annex of a world-class museum: the Rijksmuseum displays Dutch Golden Age paintings between gates. The airport sits 13 feet below sea level and is one of Europe\'s oldest commercial airports (1916).', reason: 'View world-class Rijksmuseum masterpieces while waiting for your flight, the only place to see Rembrandt between gates. Explore the tulip shop, appreciate Dutch design throughout, and experience Europe\'s most accessible major airport.' },
    { name: 'Incheon International', fact: 'Features a free Korean culture museum, traditional craft workshops, and live performances of traditional Korean music and dance throughout the day. The airport has won "Best Airport Worldwide" multiple times.', reason: 'Experience Korean culture without leaving the terminal. Try on hanbok, watch traditional performances, and learn crafts from masters. Relax in the spa, explore the museum, and understand why Incheon is Asia\'s most award-winning airport.' },
  ],
  skiResorts: [
    { name: 'Whistler Blackcomb, Canada', fact: 'The largest ski resort in North America spans 8,171 acres across two mountains connected by the record-breaking Peak 2 Peak Gondola. The resort hosted alpine events for the 2010 Winter Olympics and receives an average of 38 feet of snow annually.', reason: 'Ski the resort that hosted the 2010 Winter Olympics and ride the world\'s longest unsupported lift span. Experience the legendary Blackcomb Glacier, après-ski in the pedestrian village, and explore terrain for every skill level across two massive mountains.' },
    { name: 'Zermatt, Switzerland', fact: 'A car-free village accessible only by train, Zermatt offers views of the iconic Matterhorn from nearly every run. The resort connects to Cervinia in Italy, allowing you to ski two countries in one day.', reason: 'Ski with the most famous mountain silhouette in the world as your constant backdrop. Take the Matterhorn Glacier Paradise lift to Europe\'s highest lift-served skiing at 12,739 feet, then cross the border to lunch in Italy.' },
    { name: 'Chamonix, France', fact: 'Host of the first Winter Olympics in 1924 and birthplace of extreme skiing, Chamonix sits beneath Mont Blanc, Western Europe\'s highest peak. The Vallée Blanche is one of the world\'s longest off-piste descents at 20km.', reason: 'Experience legendary off-piste terrain and the alpine culture that invented modern skiing. Ski the Vallée Blanche descent down the Mer de Glace glacier, explore the high-altitude Grands Montets, and enjoy après-ski in this historic mountaineering capital.' },
    { name: 'Niseko, Japan', fact: 'Receives an average of 15 meters (50 feet) of powder annually, more consistent deep snow than almost anywhere else on Earth. The dry, cold air creates powder so light it\'s been trademarked as "Japow."', reason: 'Float through the lightest, driest powder snow on Earth that falls almost every night of the ski season. Experience Japan\'s unique ski culture with onsen hot springs après-ski, incredible Japanese cuisine, and tree runs through birch forests.' },
    { name: 'St. Anton, Austria', fact: 'The birthplace of alpine skiing and ski instruction. Hannes Schneider developed modern ski technique here in the 1920s. The resort is legendary for both its challenging terrain and its notoriously wild après-ski scene.', reason: 'Ski where the sport was invented and where the Arlberg ski school changed how the world learns to ski. Challenge yourself on steep off-piste terrain by day, then experience Austria\'s legendary après-ski culture at the infamous Mooserwirt.' },
    { name: 'Vail, Colorado', fact: 'The largest single-mountain ski resort in the United States covers 5,317 acres, including the famous Back Bowls, seven massive bowls of open powder terrain. The resort was founded by 10th Mountain Division veterans.', reason: 'Experience world-class skiing across terrain that takes days to fully explore. Discover the Back Bowls\' legendary powder, cruise immaculate groomers on the front side, and explore Vail Village\'s European-inspired architecture and dining.' },
    { name: 'Verbier, Switzerland', fact: 'Known for extreme off-piste terrain that hosts the Freeride World Tour\'s climactic Xtreme Verbier competition. The Four Valleys ski area connects 412km of runs across multiple resorts in the Swiss Alps.', reason: 'Challenge yourself on some of Europe\'s most technical and extreme freeride terrain. Watch where the Xtreme competition crowns champions, explore endless off-piste possibilities, and experience the cosmopolitan scene of Switzerland\'s most stylish resort.' },
    { name: 'Jackson Hole, Wyoming', fact: 'Corbet\'s Couloir is considered one of skiing\'s most terrifying drops, a mandatory 20-foot cliff entry into a steep, narrow chute. The resort\'s continuous vertical of 4,139 feet is among the largest in North America.', reason: 'Test your skills on legendary steep terrain where experts from around the world come to prove themselves. Drop into Corbet\'s Couloir, ski the massive vertical in the Hobacks, and experience authentic Western ski culture in this cowboy town.' },
  ],
  themeParks: [
    { name: 'Walt Disney World, Orlando', fact: 'The Most Magical Place on Earth covers 25,000 acres, roughly the size of San Francisco, with four theme parks, two water parks, and over 25 resort hotels. Disney World is so large it has its own government and fire department.', reason: 'Experience the magic across four distinct parks from the classic Magic Kingdom to the global showcase of EPCOT. Meet beloved characters, ride cutting-edge attractions like Rise of the Resistance, and create memories across dozens of world-class experiences.' },
    { name: 'Universal Studios Japan', fact: 'Home to the world\'s best-rated Wizarding World of Harry Potter, which was designed with input from J.K. Rowling herself. The Japanese attention to detail creates an immersion level that even exceeds the Orlando original.', reason: 'Enter the Wizarding World with Japanese attention to detail that elevates every magical moment. Sip warm Butterbeer in Hogsmeade, ride the groundbreaking Harry Potter and the Forbidden Journey, and experience Super Nintendo World\'s real-life Mario Kart.' },
    { name: 'Tokyo DisneySea', fact: 'Consistently rated the world\'s best theme park for theming and design, DisneySea cost $4 billion to build, the most expensive theme park ever constructed. Its seven "ports" create distinct atmospheres from Mediterranean harbors to volcanic mysteries.', reason: 'Experience Disney\'s most immersive and beautiful park, designed exclusively for Tokyo. Marvel at the erupting Mount Prometheus, sail through the steampunk adventure of Journey to the Center of the Earth, and discover why this park is considered the pinnacle of themed entertainment.' },
    { name: 'Europa-Park, Germany', fact: 'Germany\'s largest theme park was built by the Mack family, who have been building rides for over 240 years. What started as castle tours in 1975 has grown into one of the world\'s most celebrated parks with 15 European-themed lands.', reason: 'Explore Europe in miniature while riding world-class coasters designed by the Mack family\'s legendary engineering. Experience distinct national cultures in each land, ride Silver Star\'s 73-meter drop, and discover why this family park rivals Disney in guest satisfaction.' },
    { name: 'Universal Islands of Adventure', fact: 'Home to Hagrid\'s Magical Creatures Motorbike Adventure, which took 7 years to build and is considered the best theme park ride ever made. The park revolutionized themed entertainment when it opened in 1999.', reason: 'Experience the Wizarding World in Hogsmeade and ride the groundbreaking Hagrid\'s Motorbike Adventure through the Forbidden Forest. Explore Marvel Super Hero Island, plunge down Jurassic World\'s water ride, and discover why Islands pioneered modern themed entertainment.' },
    { name: 'Ferrari World, Abu Dhabi', fact: 'Home to Formula Rossa, the world\'s fastest roller coaster at 149 mph, so fast riders must wear goggles. The park sits under the largest space frame structure ever built, with a roof shaped like a Ferrari chassis.', reason: 'Feel F1 speeds on Formula Rossa as you accelerate 0-149 mph in 4.9 seconds. Explore the world\'s largest Ferrari showcase, ride simulators used by actual F1 teams, and experience the passion of the prancing horse in this automotive paradise.' },
    { name: 'Efteling, Netherlands', fact: 'One of the oldest theme parks in the world (opened 1952), Efteling began as a fairy tale forest and has evolved into a beloved destination with rides, shows, and enchanted forests. The Fairytale Forest features over 30 fairy tales brought to life.', reason: 'Step into a storybook at this enchanting Dutch park where fairy tales feel real. Wander through the magical Fairytale Forest, ride the scenic Droomvlucht (Dreamflight), and experience European charm that Disney itself has cited as inspiration.' },
    { name: 'Shanghai Disneyland', fact: 'Features the largest Disney castle ever built at 197 feet. The Enchanted Storybook Castle is designed to represent all Disney princesses. The TRON Lightcycle coaster premiered here years before opening in Orlando.', reason: 'See Disney reimagined with Chinese cultural influences and the most technologically advanced attractions. Experience TRON Lightcycle Power Run, explore the Pirates of the Caribbean ride that took 20 years to develop, and see how Disney adapted magic for a new audience.' },
  ],
  surfingReserves: [
    { name: 'Banzai Pipeline, Hawaii', fact: 'The most famous and dangerous wave in surfing breaks over a shallow reef just 3-5 feet below the surface, and wipeouts here can be fatal. Pipeline has killed more surfers than any other wave yet remains the ultimate proving ground for professionals.', reason: 'Witness the most famous wave in surfing where careers are made and legends are crowned. Watch from the beach as the world\'s best challenge barrels that can either make you a champion or put you in the hospital. Even spectating Pipeline is a bucket-list experience.' },
    { name: 'Malibu, California', fact: 'The "perfect wave" that helped birth modern surfing culture when introduced to California in the 1950s. Gidget and the Beach Boys immortalized Malibu, making surfing a cultural phenomenon that spread worldwide from these shores.', reason: 'Ride the wave where legends like Mickey Dora and the Z-Boys invented California surf culture. Paddle out at First Point where it all began, hang with the local crew, and understand why this point break defined what surfing could be.' },
    { name: 'Gold Coast, Australia', fact: 'Home to the Superbank, a man-made sand phenomenon where waves can peel for up to 2 kilometers when conditions align. The Gold Coast\'s 57km of coastline offers consistent surf year-round with something for every skill level.', reason: 'Surf the world-famous Superbank point break and experience waves that seemingly never end. Explore breaks from Snapper Rocks to Burleigh Heads, witness the Quiksilver Pro, and understand why Australia\'s Gold Coast is a surfer\'s paradise.' },
    { name: 'Ericeira, Portugal', fact: 'Europe\'s first World Surfing Reserve protects seven world-class waves along a single stretch of coastline. The fishing village has transformed into Europe\'s surfing capital while maintaining its authentic Portuguese character.', reason: 'Experience authentic Portuguese surf culture where fishermen and surfers share the same harbors. Surf seven distinct world-class breaks within kilometers, enjoy fresh-caught seafood, and discover why Europe\'s best surfers call this home.' },
    { name: 'Santa Cruz, California', fact: 'The first place on the US mainland where surfing was introduced (1885) and home to Steamer Lane, one of California\'s most iconic surf spots. The cliffs above the Lane offer perfect views of surfers charging the point.', reason: 'Visit Steamer Lane where California surf culture developed and the Santa Cruz Surfing Museum documents its history. Watch experienced locals charge the point from cliff-top viewing areas, then grab a burrito and explore this quintessential surf town.' },
    { name: 'Manly Beach, Australia', fact: 'Site of Australia\'s first surfing demonstrations in 1914 when Hawaiian Duke Kahanamoku rode waves here. Just a 30-minute ferry from Sydney Opera House, Manly offers world-class surfing within a major city.', reason: 'Surf one of Australia\'s most accessible urban beach breaks where the sport first came to Oz. Catch the ferry from Sydney Harbour, paddle out at the Queenscliff bombie, and experience how surfing seamlessly integrates with Australian city life.' },
    { name: 'Huanchaco, Peru', fact: 'Home to a 3,000-year-old surfing tradition where locals still ride waves on caballitos de totora, handwoven reed boats that may be the world\'s original surfcraft. The ancient Moche and Chimú civilizations surfed these same waves.', reason: 'See 3,000-year-old surfing tradition still practiced today by fishermen who ride reed boats through the waves. Learn from locals who\'ve refined their craft over millennia, eat fresh ceviche on the pier, and connect with surfing\'s ancient roots.' },
    { name: 'Guéthary, France', fact: 'Part of the Basque Country with big wave surfing at Parlementia reaching 25+ feet. The small fishing village transformed into a surf destination when French surfing pioneers discovered its powerful winter swells.', reason: 'Experience European big wave surfing and authentic Basque culture in a picturesque coastal village. Watch experts charge Parlementia\'s massive waves in winter, surf mellower beach breaks in summer, and enjoy the unique Basque culture that blends French and Spanish influences.' },
  ],
  weirdAmericana: [
    { name: 'Cadillac Ranch, Texas', fact: 'Ten Cadillacs buried nose-first in a wheat field have been continuously spray-painted by millions of visitors since 1974. The cars represent the tail fin era (1949-1963) and sit at the same angle as the Great Pyramid of Giza.', reason: 'Add your own layer of paint to this ever-evolving public art installation along Route 66. Bring your own spray cans, leave your mark on automotive history, and watch the cars transform daily as visitors from around the world create collaborative art.' },
    { name: 'World\'s Largest Ball of Twine, Kansas', fact: 'Over 40 feet in circumference and weighing 19,973 pounds, this ball of sisal twine was started by Frank Stoeber in 1953. Annual twine-a-thons add more length, and the ball continues to grow in its custom-built building.', reason: 'Witness Midwestern dedication taken to absurd extremes and add your own strand to history during community events. Marvel at one person\'s four-year obsession, explore the surrounding small-town museum, and understand the uniquely American drive to be the biggest.' },
    { name: 'Carhenge, Nebraska', fact: 'An exact replica of England\'s Stonehenge constructed from 39 vintage American automobiles spray-painted gray. Built by artist Jim Reinders in 1987 as a memorial to his father, it aligns with the summer solstice sunrise.', reason: 'See American ingenuity transform junkyard cars into prehistoric art in the Nebraska plains. Walk among the car-henges at summer solstice, explore the surrounding car art sculptures, and appreciate the peculiarly American urge to recreate ancient wonders with whatever\'s at hand.' },
    { name: 'Winchester Mystery House, California', fact: 'This mansion has stairs leading to ceilings, doors opening to walls, and windows overlooking other rooms, all built continuously for 38 years by Sarah Winchester, who believed construction would appease the ghosts of those killed by Winchester rifles.', reason: 'Explore 160 rooms of architectural madness built by a grieving widow who never stopped construction. Navigate stairways to nowhere, count the spider web motif appearing throughout, and feel the eeriness of a house designed to confuse spirits.' },
    { name: 'Wall Drug, South Dakota', fact: 'What started as free ice water for dusty travelers in 1931 has become a sprawling roadside empire. Signs advertising Wall Drug appear as far away as Antarctica, and the store now welcomes 2 million visitors annually.', reason: 'Experience the ultimate American roadside tourist trap that defined kitsch marketing. Count the hundreds of signs for hundreds of miles, grab that free ice water, explore the 76,000-square-foot complex, and buy souvenirs you never knew you needed.' },
    { name: 'International UFO Museum, New Mexico', fact: 'Located in Roswell, home of the famous 1947 alleged UFO crash that the government attributed to a "weather balloon." The museum presents evidence and lets visitors decide: was it aliens or the world\'s most elaborate cover-up?', reason: 'Dive into alien conspiracy theories and examine evidence from the world\'s most famous UFO incident. See debris replicas, read declassified documents, explore extraterrestrial exhibits, and decide for yourself what crashed in the New Mexico desert.' },
    { name: 'Salvation Mountain, California', fact: 'Leonard Knight spent 30 years building this painted desert mountain using adobe, straw, and over 100,000 gallons of donated paint. His simple message of "God Is Love" covers every inch of this folk art masterpiece.', reason: 'See Leonard Knight\'s colorful message of love rising from the California desert near the Salton Sea. Walk through the painted caves, climb the yellow brick road, and experience a visionary\'s three-decade labor of love before the desert reclaims it.' },
    { name: 'House on the Rock, Wisconsin', fact: 'Alex Jordan Jr. built this deranged dreamscape over 50 years, filling it with the world\'s largest carousel (269 animals, no horses), a 200-foot model sea creature, and collections too bizarre to categorize. Neil Gaiman featured it in "American Gods."', reason: 'Get lost in the most eccentric museum in America, where overwhelming excess is the point. Ride the world\'s largest carousel, gaze at the whale fighting a giant squid, play endless automated orchestras, and exit not quite sure what you just experienced.' },
    { name: 'Corn Palace, South Dakota', fact: 'The only palace in the world decorated with corn. Exterior murals made entirely from corn and grain are redesigned and reapplied every year. The building has served as the town\'s auditorium since 1892.', reason: 'See the world\'s only palace decorated with thousands of ears of corn in intricate designs that change annually. Watch artisans apply this year\'s corn mosaic, attend events in the auditorium, and appreciate the agricultural pride that keeps this tradition alive.' },
    { name: 'Mystery Spot, California', fact: 'This tourist attraction claims balls roll uphill and people change height due to gravitational anomalies. In reality, the tilted cabin creates optical illusions that fool your brain, but knowing the trick doesn\'t make it less fun.', reason: 'Experience mind-bending optical illusions in a tilted cabin that\'s delighted visitors since 1939. Lean at impossible angles, watch water "flow uphill," and appreciate this classic roadside attraction that reminds us our perception isn\'t always reality.' },
  ],
  euroFootballStadiums: [
    { name: 'Old Trafford, Manchester', fact: 'Known as the "Theatre of Dreams," Old Trafford has been home to Manchester United since 1910. The stadium was rebuilt after WWII bombing and has hosted legends from George Best to Cristiano Ronaldo.', reason: 'Experience the atmosphere where Manchester United became the most valuable football club in England. Walk through the Munich Tunnel, see Sir Alex Ferguson\'s statue, and feel the weight of 20 league titles.' },
    { name: 'Allianz Arena, Munich', fact: 'The exterior features 2,874 inflated panels that can display 16 million colors, glowing red for Bayern Munich matches. It\'s one of the most technologically advanced stadiums in the world.', reason: 'Watch Bayern Munich dominate the Bundesliga in a stadium that glows like a spaceship. Tour the museum, see countless trophies, and experience German football efficiency at its finest.' },
    { name: 'San Siro, Milan', fact: 'The only major stadium shared by two fierce rivals: AC Milan and Inter Milan. The towering spiral ramps and iconic three-tier design make it one of football\'s most recognizable structures.', reason: 'Experience the Derby della Madonnina atmosphere where the same stadium hosts two of Europe\'s most successful clubs. Climb the iconic ramps and feel the passion of Italian calcio.' },
  ],
  rugbyStadiums: [
    { name: 'Twickenham, London', fact: 'The home of English rugby and the largest dedicated rugby union stadium in the world with 82,000 capacity. Known as "HQ" or "Twickers," it has hosted Six Nations matches since 1910.', reason: 'Experience rugby at its spiritual home where England has played for over a century. Tour the World Rugby Museum, walk the hallowed turf, and feel why this ground is rugby\'s most iconic venue.' },
    { name: 'Millennium Stadium, Cardiff', fact: 'The first stadium in the UK with a fully retractable roof, creating an intimidating cauldron of Welsh passion. The roof takes 20 minutes to close and can withstand 130mph winds.', reason: 'Hear 74,500 Welsh fans sing "Bread of Heaven" before a Six Nations match. The atmosphere when Wales plays at home is considered the most passionate in world rugby.' },
    { name: 'Eden Park, Auckland', fact: 'New Zealand\'s largest stadium and the All Blacks\' fortress where they haven\'t lost since 1994. The ground has hosted two Rugby World Cup finals and countless Bledisloe Cup encounters.', reason: 'Visit the ground where the All Blacks are unbeatable and witness the haka performed by the world\'s greatest rugby team. No stadium on Earth has a better home winning record.' },
  ],
  cricketStadiums: [
    { name: 'Lord\'s, London', fact: 'Known as the "Home of Cricket," Lord\'s has hosted matches since 1814 and is owned by the Marylebone Cricket Club (MCC). The famous slope from one side to the other affects bowling strategy.', reason: 'Visit cricket\'s most sacred ground where the Laws of the Game were written. See the Ashes urn in the museum, walk through the Long Room, and experience cricket at its historic best.' },
    { name: 'Melbourne Cricket Ground', fact: 'The largest cricket stadium in the world with 100,024 capacity. The MCG has hosted the first-ever Test match (1877), AFL Grand Finals, and the 1956 and 2006 Olympic ceremonies.', reason: 'Experience the Boxing Day Test atmosphere with 90,000 fans creating one of sport\'s great traditions. The MCG is to Australian sport what Wembley is to English football.' },
    { name: 'Eden Gardens, Kolkata', fact: 'India\'s most iconic cricket ground can hold 66,000 passionate fans and has hosted some of cricket\'s most dramatic matches, including India\'s famous 2001 victory over Australia after following on.', reason: 'Feel the electricity of 66,000 Indian cricket fans creating an atmosphere unmatched anywhere in world sport. Eden Gardens turns cricket into a religious experience.' },
  ],
};

// Theme colors by category group
const themeColors: Record<CategoryGroup, string> = {
  // Fresh & Organic: Teal mixed with Emerald (richer than just green)
  nature: 'from-teal-50 to-emerald-100 dark:from-teal-950 dark:to-emerald-900',
  // Energetic & Cool: Sky mixed with Blue
  sports: 'from-sky-50 to-blue-100 dark:from-sky-950 dark:to-blue-900',
  // Creative & Premium: Violet mixed with Fuchsia (replaces the "muddy" Amber)
  culture: 'from-violet-50 to-fuchsia-50 dark:from-violet-950 dark:to-fuchsia-900',
  // Sophisticated & Clean: Slate mixed with Gray (matches your "Passport" brand)
  destinations: 'from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-800',
};

// Accent colors for buttons and highlights by group
const accentColors: Record<CategoryGroup, { bg: string; hover: string; challenge: string }> = {
  nature: {
    bg: 'bg-teal-600',
    hover: 'hover:bg-teal-700',
    challenge: 'bg-teal-800',
  },
  sports: {
    bg: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    challenge: 'bg-blue-800',
  },
  culture: {
    bg: 'bg-violet-600',
    hover: 'hover:bg-violet-700',
    challenge: 'bg-violet-800',
  },
  destinations: {
    bg: 'bg-slate-700',
    hover: 'hover:bg-slate-800',
    challenge: 'bg-slate-900',
  },
};

// Stat type for dynamic stats
interface CategoryStat {
  label: string;
  value: string | number;
  icon: string;
}

// Helper to generate dynamic stats based on category
function getCategoryStats(category: Category, items: CategoryItem[]): CategoryStat[] {
  const total = items.length;
  const stats: CategoryStat[] = [];

  // Category-specific stats
  if (category === 'fiveKPeaks') {
    const peaks = mountains.filter(m => m.elevation >= 5000);
    const totalElevation = peaks.reduce((acc, curr) => acc + curr.elevation, 0);
    const highest = Math.max(...peaks.map(m => m.elevation));

    stats.push({ label: 'Total Peaks', value: total, icon: '🏔️' });
    stats.push({ label: 'Combined Elevation', value: `${(totalElevation / 1000).toFixed(0)}km`, icon: '📐' });
    stats.push({ label: 'Highest Peak', value: `${highest.toLocaleString()}m`, icon: '⬆️' });
  } else if (category === 'fourteeners') {
    const peaks = mountains.filter(m => m.elevation >= 4267 && m.elevation < 5000 && m.countryCode === 'US');
    const totalElevation = peaks.reduce((acc, curr) => acc + curr.elevation, 0);
    const avgElevation = Math.round(totalElevation / peaks.length);

    stats.push({ label: 'Total 14ers', value: total, icon: '⛰️' });
    stats.push({ label: 'Avg Elevation', value: `${avgElevation.toLocaleString()}m`, icon: '📊' });
    stats.push({ label: 'Total Vertical', value: `${(totalElevation / 1000).toFixed(0)}km`, icon: '📐' });
  } else if (category === 'mlbStadiums') {
    const totalCapacity = mlbStadiums.reduce((acc, curr) => acc + curr.capacity, 0);
    const oldest = 'Fenway Park (1912)';

    stats.push({ label: 'Stadiums', value: total, icon: '⚾' });
    stats.push({ label: 'Total Capacity', value: `${(totalCapacity / 1000000).toFixed(1)}M`, icon: '👥' });
    stats.push({ label: 'Oldest Stadium', value: oldest, icon: '🏛️' });
  } else if (category === 'nflStadiums') {
    const totalCapacity = nflStadiums.reduce((acc, curr) => acc + curr.capacity, 0);

    stats.push({ label: 'Stadiums', value: total, icon: '🏈' });
    stats.push({ label: 'Total Capacity', value: `${(totalCapacity / 1000000).toFixed(1)}M`, icon: '👥' });
    stats.push({ label: 'Largest', value: 'AT&T Stadium', icon: '🏟️' });
  } else if (category === 'nbaStadiums') {
    const totalCapacity = nbaStadiums.reduce((acc, curr) => acc + curr.capacity, 0);

    stats.push({ label: 'Arenas', value: total, icon: '🏀' });
    stats.push({ label: 'Total Capacity', value: `${(totalCapacity / 1000).toFixed(0)}K`, icon: '👥' });
    stats.push({ label: 'Iconic Venue', value: 'MSG', icon: '🏟️' });
  } else if (category === 'nhlStadiums') {
    const totalCapacity = nhlStadiums.reduce((acc, curr) => acc + curr.capacity, 0);

    stats.push({ label: 'Arenas', value: total, icon: '🏒' });
    stats.push({ label: 'Total Capacity', value: `${(totalCapacity / 1000).toFixed(0)}K`, icon: '👥' });
    stats.push({ label: 'Most Cups', value: 'Bell Centre', icon: '🏆' });
  } else if (category === 'soccerStadiums') {
    const totalCapacity = soccerStadiums.reduce((acc, curr) => acc + curr.capacity, 0);

    stats.push({ label: 'Stadiums', value: total, icon: '⚽' });
    stats.push({ label: 'Total Capacity', value: `${(totalCapacity / 1000000).toFixed(1)}M`, icon: '👥' });
    stats.push({ label: 'Largest', value: 'Camp Nou', icon: '🏟️' });
  } else if (category === 'countries') {
    const continents = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Countries', value: total, icon: '🌍' });
    stats.push({ label: 'Continents', value: continents, icon: '🗺️' });
    stats.push({ label: 'UN Members', value: '193', icon: '🏛️' });
  } else if (category === 'states') {
    // Count only states + DC (51), not territories which are shown separately on the map
    const statesOnly = items.filter(i => i.group !== 'Territories').length;
    const regions = new Set(items.filter(i => i.group !== 'Territories').map(i => i.group)).size;
    stats.push({ label: 'States & DC', value: statesOnly, icon: '🇺🇸' });
    stats.push({ label: 'Regions', value: regions, icon: '🗺️' });
    stats.push({ label: 'Total Area', value: '3.8M mi²', icon: '📐' });
  } else if (category === 'nationalParks') {
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Parks', value: total, icon: '🏞️' });
    stats.push({ label: 'Regions', value: regions, icon: '🗺️' });
    stats.push({ label: 'Annual Visitors', value: '312M+', icon: '👥' });
  } else if (category === 'nationalMonuments') {
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Monuments', value: total, icon: '🗽' });
    stats.push({ label: 'Regions', value: regions, icon: '🗺️' });
    stats.push({ label: 'First (1906)', value: 'Devils Tower', icon: '🏛️' });
  } else if (category === 'stateParks') {
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'State Parks', value: total, icon: '🌲' });
    stats.push({ label: 'Regions', value: regions, icon: '🗺️' });
    stats.push({ label: 'All 50 States', value: '✓', icon: '✅' });
  } else if (category === 'museums') {
    const countries = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Museums', value: total, icon: '🎨' });
    stats.push({ label: 'Countries', value: countries, icon: '🌍' });
    stats.push({ label: 'Most Visited', value: 'Louvre', icon: '🏆' });
  } else if (category === 'f1Tracks') {
    const countries = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Circuits', value: total, icon: '🏎️' });
    stats.push({ label: 'Countries', value: countries, icon: '🌍' });
    stats.push({ label: 'Oldest', value: 'Monza (1922)', icon: '🏛️' });
  } else if (category === 'marathons') {
    const countries = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Majors', value: total, icon: '🏃' });
    stats.push({ label: 'Countries', value: countries, icon: '🌍' });
    stats.push({ label: 'Oldest', value: 'Boston (1897)', icon: '🏛️' });
  } else if (category === 'airports') {
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Airports', value: total, icon: '✈️' });
    stats.push({ label: 'Regions', value: regions, icon: '🌍' });
    stats.push({ label: 'Best Rated', value: 'Changi', icon: '🏆' });
  } else if (category === 'skiResorts') {
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Resorts', value: total, icon: '⛷️' });
    stats.push({ label: 'Regions', value: regions, icon: '🌍' });
    stats.push({ label: 'Largest', value: 'Whistler', icon: '🏔️' });
  } else if (category === 'themeParks') {
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Theme Parks', value: total, icon: '🎢' });
    stats.push({ label: 'Regions', value: regions, icon: '🌍' });
    stats.push({ label: 'Most Visited', value: 'Magic Kingdom', icon: '🏆' });
  } else if (category === 'surfingReserves') {
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Reserves', value: total, icon: '🌊' });
    stats.push({ label: 'Regions', value: regions, icon: '🌍' });
    stats.push({ label: 'Most Famous', value: 'Pipeline', icon: '🏆' });
  } else if (category === 'weirdAmericana') {
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Attractions', value: total, icon: '🗿' });
    stats.push({ label: 'Regions', value: regions, icon: '🗺️' });
    stats.push({ label: 'Most Iconic', value: 'Cadillac Ranch', icon: '🚗' });
  } else {
    // Default stats
    stats.push({ label: 'Total Locations', value: total, icon: '📍' });
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'Regions', value: regions, icon: '🗺️' });
  }

  return stats;
}

// Helper to get distribution by region/group
function getDistribution(items: CategoryItem[]): Record<string, number> {
  return items.reduce((acc, item) => {
    acc[item.group] = (acc[item.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// Helper to get the biggest region for challenge
function getBiggestRegion(distribution: Record<string, number>): [string, number] | null {
  const entries = Object.entries(distribution);
  if (entries.length === 0) return null;
  return entries.sort(([, a], [, b]) => b - a)[0];
}

// Challenge descriptions by category
const challengeDescriptions: Partial<Record<Category, (region: string, count: number) => string>> = {
  countries: (region, count) => `There are ${count} countries in ${region}. Can you visit them all?`,
  states: (region, count) => `The ${region} region has ${count} states. Complete the regional tour!`,
  nationalParks: (region, count) => `${region} has ${count} national parks to explore. Start your adventure!`,
  nationalMonuments: (region, count) => `Discover all ${count} national monuments in the ${region} region!`,
  stateParks: (region, count) => `The ${region} has ${count} state parks waiting for you!`,
  fiveKPeaks: (region, count) => `The ${region} has ${count} peaks over 5000m. Summit them all!`,
  fourteeners: (region, count) => `The ${region} has ${count} fourteeners. Bag them all!`,
  museums: (region, count) => `${region} has ${count} world-class museums to explore!`,
  mlbStadiums: (region, count) => `Visit all ${count} stadiums with ${region} teams!`,
  nflStadiums: (region, count) => `Catch a game at all ${count} ${region} venues!`,
  nbaStadiums: (region, count) => `Watch games at all ${count} ${region} arenas!`,
  nhlStadiums: (region, count) => `See hockey at all ${count} ${region} rinks!`,
  soccerStadiums: (region, count) => `${region} has ${count} legendary pitches to visit!`,
  f1Tracks: (region, count) => `${region} hosts ${count} Formula 1 races. See them all!`,
  marathons: (region, count) => `Run all ${count} majors in ${region}!`,
  airports: (region, count) => `${region} has ${count} major airports to travel through!`,
  skiResorts: (region, count) => `Conquer all ${count} ski resorts in ${region}!`,
  themeParks: (region, count) => `Experience all ${count} theme parks in ${region}!`,
  surfingReserves: (region, count) => `Ride the waves at all ${count} spots in ${region}!`,
  weirdAmericana: (region, count) => `Discover all ${count} quirky attractions in the ${region}!`,
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
    title: `Track ${label} Visited | See Every Place`,
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
  const faqs = categoryFAQs[category as Category] || [];
  const faqJsonLd = faqs.length > 0 ? generateFaqJsonLd(faqs) : null;
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(category as Category, label);

  // Get category group and theme
  const group = getGroupForCategory(category as Category);
  const gradientClass = themeColors[group];
  const accent = accentColors[group];

  // Fetch items for dynamic stats
  const items = await getCategoryItemsAsync(category as Category);
  const stats = getCategoryStats(category as Category, items);
  const distribution = getDistribution(items);
  const biggestRegion = getBiggestRegion(distribution);
  const challengeDesc = challengeDescriptions[category as Category];

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <Script
        id={`json-ld-${category}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* FAQ JSON-LD Schema for SEO */}
      {faqJsonLd && (
        <Script
          id={`faq-json-ld-${category}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* Breadcrumb JSON-LD Schema for SEO */}
      <Script
        id={`breadcrumb-json-ld-${category}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    <div className={`min-h-screen bg-gradient-to-b ${gradientClass} relative overflow-hidden`}>
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-none">
                SeeEvery<span className="text-primary">.</span>Place<span className="text-[10px] align-super text-muted-foreground">™</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <Button asChild size="sm">
            <Link href={`/?category=${category}`}>
              Start Tracking
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Visual Breadcrumb Navigation */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <li className="text-muted-foreground/60">/</li>
            <li className="text-foreground font-medium">{label}</li>
          </ol>
        </nav>

        <div className="text-center mb-12">
          <span className="text-6xl mb-4 block">{icon}</span>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Track {label} You&apos;ve Visited
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* By the Numbers Section */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-muted-foreground text-center mb-6">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className={`text-center ${index === stats.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">{stat.icon}</div>
                  <div className="text-xl md:text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <p className="text-muted-foreground text-xs md:text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Community Stats - Dynamic traveler statistics */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-muted-foreground text-center mb-6">Community Stats</h2>
          <Card>
            <CardContent className="p-6">
              <TravelerStats category={category as Category} />
            </CardContent>
          </Card>
        </section>

        {/* Active Challenges */}
        <section className="mb-12">
          <ChallengesCard filterCategory={category as Category} />
        </section>

        <div className="text-center">
          <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
            <Link href={`/?category=${category}`}>
              Start Tracking {label}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="mt-4 text-muted-foreground text-sm">
            Free to use, no account required
          </p>
        </div>

        {/* Distribution Visualizer */}
        <section className="my-12">
          <h3 className="font-bold text-center text-foreground mb-6">Breakdown by Region</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(distribution)
              .sort(([, a], [, b]) => b - a)
              .map(([region, count]) => (
                <Badge
                  key={region}
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  {region}: <span className="font-bold ml-1">{count}</span>
                </Badge>
              ))}
          </div>
        </section>

        {/* Browse by State - for state-filterable categories */}
        {stateFilterableCategories.includes(category as Category) && (
          <section className="my-12">
            <h3 className="font-bold text-center text-foreground mb-2">
              Browse {label} by State
            </h3>
            <p className="text-center text-muted-foreground text-sm mb-6">
              Click a state to see all {label.toLowerCase()} in that state
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {getStatesWithCounts(category as Category).slice(0, 20).map(({ code, name, count }) => (
                <Link
                  key={code}
                  href={`/track/${category}/${code.toLowerCase()}`}
                >
                  <Badge
                    variant="outline"
                    className="hover:bg-secondary hover:scale-105 transition-all cursor-pointer"
                  >
                    {name} <span className="text-muted-foreground font-normal ml-1">{count}</span>
                  </Badge>
                </Link>
              ))}
            </div>
            {getStatesWithCounts(category as Category).length > 20 && (
              <p className="text-center mt-4 text-sm text-muted-foreground">
                + {getStatesWithCounts(category as Category).length - 20} more states
              </p>
            )}
          </section>
        )}

        {/* Featured Challenge */}
        {biggestRegion && challengeDesc && (
          <section className="my-12">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
              <CardContent className="p-8 text-center">
                <h3 className="font-bold text-2xl mb-3">The {biggestRegion[0]} Challenge</h3>
                <p className="opacity-90 mb-6 text-lg">
                  {challengeDesc(biggestRegion[0], biggestRegion[1])}
                </p>
                <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  <Link href={`/?category=${category}`}>
                    View Checklist
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Examples Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            {label} to Explore
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Here are some amazing {label.toLowerCase()} to add to your bucket list
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {categoryExamples[category as Category]?.map((example, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-l-primary"
              >
                <CardContent className="p-5">
                  <h3 className="font-bold text-foreground text-lg mb-2">{example.name}</h3>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium text-foreground">Unique fact:</span>{' '}
                      {example.fact}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium text-primary">Why visit:</span>{' '}
                      {example.reason}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Common questions about tracking {label.toLowerCase()}
            </p>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="group">
                  <details>
                    <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between font-semibold text-foreground hover:bg-muted/50 rounded-xl transition-colors">
                      {faq.question}
                      <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Also Track
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories
              .filter((c) => c !== category)
              .slice(0, 4)
              .map((c) => (
                <Link key={c} href={`/track/${c}`}>
                  <Card className="hover:shadow-lg transition-all text-center h-full">
                    <CardContent className="p-4">
                      <span className="text-2xl block mb-2">{categoryIcons[c]}</span>
                      <span className="text-sm font-medium text-muted-foreground">{categoryLabels[c]}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-foreground transition-colors">Suggest</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>
    </div>
    </>
  );
}
