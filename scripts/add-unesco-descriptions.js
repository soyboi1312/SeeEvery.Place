/**
 * Add UNESCO site descriptions to the main descriptions.json file
 */
const fs = require('fs');
const path = require('path');

// Load existing descriptions
const descriptionsPath = path.join(__dirname, '../public/data/descriptions.json');
const descriptions = JSON.parse(fs.readFileSync(descriptionsPath, 'utf-8'));

// Load UNESCO data with descriptions
const unescoPath = path.join(__dirname, '../public/data/unesco-sites.json');
const unescoData = JSON.parse(fs.readFileSync(unescoPath, 'utf-8'));

console.log(`Existing descriptions: ${Object.keys(descriptions).length}`);
console.log(`UNESCO sites: ${unescoData.sites.length}`);

let added = 0;
let skipped = 0;

// Add UNESCO descriptions
for (const site of unescoData.sites) {
  if (site.description && site.description.trim()) {
    if (!descriptions[site.id]) {
      descriptions[site.id] = site.description;
      added++;
    } else {
      skipped++;
    }
  }
}

console.log(`Added: ${added}`);
console.log(`Skipped (already exists): ${skipped}`);
console.log(`Total descriptions now: ${Object.keys(descriptions).length}`);

// Write back sorted by key for consistency
const sorted = Object.fromEntries(
  Object.entries(descriptions).sort(([a], [b]) => a.localeCompare(b))
);

fs.writeFileSync(descriptionsPath, JSON.stringify(sorted, null, 2));
console.log(`\nWritten to: ${descriptionsPath}`);
