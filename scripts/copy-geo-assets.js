#!/usr/bin/env node

/**
 * Copy geo assets from node_modules to public/geo directory.
 * Fixed to reliably locate package roots and fail on error.
 */

const fs = require('fs');
const path = require('path');

const GEO_DIR = path.join(__dirname, '..', 'public', 'geo');

const ASSETS = [
  {
    packageName: 'world-atlas',
    fileName: 'countries-110m.json',
  },
  {
    packageName: 'us-atlas',
    fileName: 'states-10m.json',
  },
];

/**
 * Find a package in node_modules by walking up the directory tree.
 * This handles npm, pnpm, and yarn hoisting behaviors.
 */
function findPackagePath(packageName) {
  let currentDir = __dirname;

  // Walk up the directory tree looking for node_modules containing the package
  while (currentDir !== path.dirname(currentDir)) {
    const nodeModulesPath = path.join(currentDir, 'node_modules', packageName);
    if (fs.existsSync(nodeModulesPath)) {
      return nodeModulesPath;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

function copyAssets() {
  // Ensure the geo directory exists
  fs.mkdirSync(GEO_DIR, { recursive: true });

  for (const asset of ASSETS) {
    try {
      // Find the package directory
      const packagePath = findPackagePath(asset.packageName);

      if (!packagePath) {
        throw new Error(`Could not find package ${asset.packageName} in node_modules`);
      }

      // Construct the source path
      const sourcePath = path.join(packagePath, asset.fileName);
      const destPath = path.join(GEO_DIR, asset.fileName);

      // Verify source exists before copying
      if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source file not found: ${sourcePath}`);
      }

      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${asset.packageName}/${asset.fileName} -> public/geo/${asset.fileName}`);
    } catch (error) {
      console.error(`Failed to copy ${asset.fileName} from ${asset.packageName}:`);
      console.error(error.message);
      // Exit with error code 1 to FAIL the build intentionally
      process.exit(1);
    }
  }
}

copyAssets();
