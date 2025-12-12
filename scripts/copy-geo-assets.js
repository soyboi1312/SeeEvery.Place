#!/usr/bin/env node

/**
 * Copy geo assets from node_modules to public/geo directory.
 * Uses require.resolve to robustly find file paths regardless of
 * package manager hoisting behavior (npm, pnpm, yarn, etc.).
 */

const fs = require('fs');
const path = require('path');

const GEO_DIR = path.join(__dirname, '..', 'public', 'geo');

const ASSETS = [
  {
    // World map data (countries)
    source: 'world-atlas/countries-110m.json',
    dest: 'countries-110m.json',
  },
  {
    // US states map data
    source: 'us-atlas/states-10m.json',
    dest: 'states-10m.json',
  },
];

function copyAssets() {
  // Ensure the geo directory exists
  fs.mkdirSync(GEO_DIR, { recursive: true });

  for (const asset of ASSETS) {
    try {
      // Use require.resolve to find the actual path in node_modules
      // This works regardless of hoisting or symlink behavior
      const sourcePath = require.resolve(asset.source);
      const destPath = path.join(GEO_DIR, asset.dest);

      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${asset.source} -> public/geo/${asset.dest}`);
    } catch (error) {
      console.error(`Failed to copy ${asset.source}:`, error.message);
      // Don't fail the build - the files might be manually placed
    }
  }
}

copyAssets();
