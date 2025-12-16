#!/usr/bin/env node
/**
 * Export category data to JSON files for better service worker caching.
 *
 * This script extracts data arrays from TypeScript modules and writes them
 * to public/data/categories/*.json. These JSON files are then fetched by
 * loadWithJsonFallback() in categoryUtils.ts instead of bundled in JavaScript.
 *
 * Benefits:
 * - Service worker can cache JSON files independently of JS bundle
 * - JSON is smaller than equivalent JS module (no export boilerplate)
 * - Reduces initial JavaScript bundle size (improves FCP/LCP)
 *
 * Run: node scripts/export-category-data.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'public', 'data', 'categories');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function exportData() {
  console.log('Exporting category data to JSON...\n');

  // Import data modules dynamically
  const exports = [
    { name: 'worldCities', module: '../src/data/worldCities.ts', key: 'worldCities' },
    { name: 'usCities', module: '../src/data/usCities.ts', key: 'usCities' },
    { name: 'airports', module: '../src/data/airports.ts', key: 'airports' },
    { name: 'nationalParks', module: '../src/data/nationalParks.ts', key: 'nationalParks' },
    { name: 'nationalMonuments', module: '../src/data/nationalMonuments.ts', key: 'nationalMonuments' },
    { name: 'stateParks', module: '../src/data/stateParks.ts', key: 'stateParks' },
    { name: 'museums', module: '../src/data/museums.ts', key: 'museums' },
    { name: 'skiResorts', module: '../src/data/skiResorts.ts', key: 'skiResorts' },
    { name: 'themeParks', module: '../src/data/themeParks.ts', key: 'themeParks' },
    { name: 'weirdAmericana', module: '../src/data/weirdAmericana.ts', key: 'weirdAmericana' },
  ];

  for (const { name, module: modulePath, key } of exports) {
    try {
      const mod = await import(modulePath);
      const data = mod[key];

      if (!data || !Array.isArray(data)) {
        console.log(`⚠️  ${name}: No array data found with key '${key}'`);
        continue;
      }

      const outputPath = path.join(outputDir, `${name}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 0)); // Minified JSON

      const stats = fs.statSync(outputPath);
      console.log(`✅ ${name}.json (${data.length} items, ${(stats.size / 1024).toFixed(1)}KB)`);
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  console.log('\nDone! JSON files written to public/data/categories/');
}

exportData().catch(console.error);
