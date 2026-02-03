/**
 * Generate /public/data/categories/unescoSites.json from the full UNESCO dataset.
 * Fills in missing data from the curated unescoSites.ts where possible.
 */
const fs = require('fs');
const path = require('path');

// Load full dataset
const fullData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../public/data/unesco-sites.json'), 'utf-8')
);

// Load curated data (parse the TS file manually to extract data)
const curatedFile = fs.readFileSync(
  path.join(__dirname, '../src/data/unescoSites.ts'), 'utf-8'
);

// Parse curated sites from TS file - extract each object
const curatedMap = new Map();
const objRegex = /\{\s*id:\s*"([^"]+)"[^}]+\}/g;
let match;
while ((match = objRegex.exec(curatedFile)) !== null) {
  const objStr = match[0];
  // Extract fields
  const getId = objStr.match(/id:\s*"([^"]+)"/);
  const getName = objStr.match(/name:\s*"([^"]+)"/);
  const getCountry = objStr.match(/country:\s*"([^"]+)"/);
  const getCountryCode = objStr.match(/countryCode:\s*"([^"]+)"/);
  const getType = objStr.match(/type:\s*"([^"]+)"/);
  const getLat = objStr.match(/lat:\s*([-\d.]+)/);
  const getLng = objStr.match(/lng:\s*([-\d.]+)/);
  const getUnescoId = objStr.match(/unescoId:\s*(\d+)/);
  const getYear = objStr.match(/year:\s*(\d+)/);

  if (getId) {
    curatedMap.set(getId[1], {
      id: getId[1],
      name: getName ? getName[1] : null,
      country: getCountry ? getCountry[1] : null,
      countryCode: getCountryCode ? getCountryCode[1] : null,
      type: getType ? getType[1] : null,
      lat: getLat ? parseFloat(getLat[1]) : null,
      lng: getLng ? parseFloat(getLng[1]) : null,
      unescoId: getUnescoId ? parseInt(getUnescoId[1]) : null,
      year: getYear ? parseInt(getYear[1]) : null,
    });
  }
}

// Also create a map by unescoId for matching
const curatedByUnescoId = new Map();
for (const [, site] of curatedMap) {
  if (site.unescoId) {
    curatedByUnescoId.set(site.unescoId, site);
  }
}

console.log(`Full dataset: ${fullData.sites.length} sites`);
console.log(`Curated dataset: ${curatedMap.size} sites`);

// Merge data
let filled = 0;
let filledCoords = 0;
const categorySites = fullData.sites.map(site => {
  // Try to find matching curated site
  const curated = curatedMap.get(site.id) || curatedByUnescoId.get(site.unescoId);

  const result = {
    id: site.id,
    name: site.name,
    unescoId: site.unescoId,
  };

  // Country
  if (site.country) {
    result.country = site.country;
  } else if (curated && curated.country) {
    result.country = curated.country;
    filled++;
  }

  // Country code
  if (site.countryCode) {
    result.countryCode = site.countryCode;
  } else if (curated && curated.countryCode) {
    result.countryCode = curated.countryCode;
  }

  // Type
  if (site.type) {
    result.type = site.type;
  } else if (curated && curated.type) {
    result.type = curated.type;
  }

  // Region
  if (site.region) {
    result.region = site.region;
  }

  // Coordinates
  if (site.lat !== undefined && site.lng !== undefined) {
    result.lat = site.lat;
    result.lng = site.lng;
  } else if (curated && curated.lat !== null && curated.lng !== null) {
    result.lat = curated.lat;
    result.lng = curated.lng;
    filledCoords++;
  }

  // Year from curated
  if (curated && curated.year) {
    result.year = curated.year;
  }

  return result;
});

console.log(`Filled country from curated: ${filled}`);
console.log(`Filled coords from curated: ${filledCoords}`);

// Stats
const withCoords = categorySites.filter(s => s.lat !== undefined);
const withCountry = categorySites.filter(s => s.country);
const withType = categorySites.filter(s => s.type);
console.log(`\nFinal stats:`);
console.log(`Total: ${categorySites.length}`);
console.log(`With coordinates: ${withCoords.length}`);
console.log(`With country: ${withCountry.length}`);
console.log(`With type: ${withType.length}`);

// Write the categories JSON
const outputPath = path.join(__dirname, '../public/data/categories/unescoSites.json');
fs.writeFileSync(outputPath, JSON.stringify(categorySites, null, 2));
console.log(`\nWritten to: ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
