import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { Category, categoryLabels, categoryIcons, CategoryGroup, getGroupForCategory } from '@/lib/types';
import Link from 'next/link';
import { getCategoryItemsAsync, CategoryItem } from '@/lib/categoryUtils';
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
    { question: 'How many US states are there to track?', answer: 'We track all 50 US states, Washington D.C., and 5 US territories (Puerto Rico, US Virgin Islands, Guam, American Samoa, and Northern Mariana Islands) - 56 total!' },
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

// Theme colors by category group
const themeColors: Record<CategoryGroup, string> = {
  nature: 'from-emerald-50 to-stone-100 dark:from-emerald-950 dark:to-stone-900',
  sports: 'from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900',
  culture: 'from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-900',
  destinations: 'from-sky-50 to-white dark:from-slate-900 dark:to-slate-800',
};

// Accent colors for buttons and highlights by group
const accentColors: Record<CategoryGroup, { bg: string; hover: string; challenge: string }> = {
  nature: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', challenge: 'bg-emerald-800' },
  sports: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', challenge: 'bg-indigo-800' },
  culture: { bg: 'bg-amber-600', hover: 'hover:bg-amber-700', challenge: 'bg-amber-800' },
  destinations: { bg: 'bg-primary-700', hover: 'hover:bg-primary-800', challenge: 'bg-primary-900' },
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
    const regions = new Set(items.map(i => i.group)).size;
    stats.push({ label: 'States & DC', value: total, icon: '🇺🇸' });
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
  const faqs = categoryFAQs[category as Category] || [];
  const faqJsonLd = faqs.length > 0 ? generateFaqJsonLd(faqs) : null;

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
    <div className={`min-h-screen bg-gradient-to-b ${gradientClass}`}>
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
            className={`px-4 py-2 ${accent.bg} ${accent.hover} text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm`}
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

        {/* By the Numbers Section */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-300 text-center mb-6">By the Numbers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10 text-center">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-2xl font-bold text-primary-900 dark:text-white mb-1">{stat.value}</div>
                <p className="text-primary-600 dark:text-primary-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link
            href={`/?category=${category}`}
            className={`inline-flex items-center gap-2 px-8 py-4 ${accent.bg} ${accent.hover} text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all`}
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

        {/* Distribution Visualizer */}
        <section className="my-12">
          <h3 className="font-bold text-center text-primary-900 dark:text-white mb-6">Breakdown by Region</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(distribution)
              .sort(([, a], [, b]) => b - a)
              .map(([region, count]) => (
                <div
                  key={region}
                  className="bg-white/70 dark:bg-slate-800/70 px-4 py-2 rounded-full text-sm font-medium border border-black/5 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  {region}: <span className="font-bold text-primary-700 dark:text-primary-300">{count}</span>
                </div>
              ))}
          </div>
        </section>

        {/* Browse by State - for state-filterable categories */}
        {stateFilterableCategories.includes(category as Category) && (
          <section className="my-12">
            <h3 className="font-bold text-center text-primary-900 dark:text-white mb-2">
              Browse {label} by State
            </h3>
            <p className="text-center text-primary-500 dark:text-primary-400 text-sm mb-6">
              Click a state to see all {label.toLowerCase()} in that state
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {getStatesWithCounts(category as Category).slice(0, 20).map(({ code, name, count }) => (
                <Link
                  key={code}
                  href={`/track/${category}/${code.toLowerCase()}`}
                  className="bg-white/70 dark:bg-slate-800/70 px-3 py-1.5 rounded-full text-sm font-medium border border-black/5 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all"
                >
                  {name} <span className="text-primary-500 dark:text-primary-400">({count})</span>
                </Link>
              ))}
            </div>
            {getStatesWithCounts(category as Category).length > 20 && (
              <p className="text-center mt-4 text-sm text-primary-500 dark:text-primary-400">
                + {getStatesWithCounts(category as Category).length - 20} more states
              </p>
            )}
          </section>
        )}

        {/* Featured Challenge */}
        {biggestRegion && challengeDesc && (
          <section className="my-12">
            <div className={`${accent.challenge} text-white rounded-xl p-8 text-center`}>
              <h3 className="font-bold text-2xl mb-3">The {biggestRegion[0]} Challenge</h3>
              <p className="opacity-90 mb-6 text-lg">
                {challengeDesc(biggestRegion[0], biggestRegion[1])}
              </p>
              <Link
                href={`/?category=${category}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors"
              >
                View Checklist
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        )}

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

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-primary-600 dark:text-primary-300 text-center mb-8">
              Common questions about tracking {label.toLowerCase()}
            </p>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-premium border border-black/5 dark:border-white/10 group"
                >
                  <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between font-semibold text-primary-900 dark:text-white hover:bg-primary-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                    {faq.question}
                    <svg
                      className="w-5 h-5 text-primary-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-primary-600 dark:text-primary-300">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

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
            <Link href="/suggest" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Suggest</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>
    </div>
    </>
  );
}
