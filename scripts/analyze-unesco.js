const data = require("../public/data/unesco-sites.json");
const sites = data.sites;

const noCoords = sites.filter(s => s.lat === undefined || s.lng === undefined);
const noCountry = sites.filter(s => !s.country);
const noType = sites.filter(s => !s.type);
const noCountryCode = sites.filter(s => !s.countryCode);
const noRegion = sites.filter(s => !s.region);

console.log("Total sites:", sites.length);
console.log("Missing coords:", noCoords.length);
console.log("Missing country:", noCountry.length);
console.log("Missing countryCode:", noCountryCode.length);
console.log("Missing type:", noType.length);
console.log("Missing region:", noRegion.length);
console.log();

console.log("Sample sites with missing coords (first 3):");
noCoords.slice(0, 3).forEach(s => console.log(JSON.stringify(s, null, 2)));
console.log();

console.log("Sample complete site:");
const complete = sites.find(s => s.lat !== undefined && s.country && s.type);
console.log(JSON.stringify(complete, null, 2));
console.log();

// Check types distribution
const types = {};
sites.forEach(s => {
  const t = s.type || 'Unknown';
  types[t] = (types[t] || 0) + 1;
});
console.log("Types distribution:", types);

// Check region distribution
const regions = {};
sites.forEach(s => {
  const r = s.region || 'Unknown';
  regions[r] = (regions[r] || 0) + 1;
});
console.log("Region distribution:", regions);
