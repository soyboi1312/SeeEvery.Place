#!/usr/bin/env node
/**
 * PWA Screenshot Generator
 *
 * Generates screenshots for the PWA manifest Rich Install UI.
 * Requires: npm install puppeteer (dev dependency)
 *
 * Usage:
 *   node scripts/generate-screenshots.js [base-url]
 *
 * Examples:
 *   node scripts/generate-screenshots.js                    # Uses localhost:3000
 *   node scripts/generate-screenshots.js https://seeevery.place
 */

const fs = require('fs');
const path = require('path');

// Check if puppeteer is available
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Puppeteer not installed - Manual Screenshot Instructions      ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  To auto-generate screenshots, install puppeteer:              ║
║    npm install -D puppeteer                                    ║
║                                                                ║
║  Or create screenshots manually:                               ║
║                                                                ║
║  MOBILE (750x1334):                                            ║
║  1. Open Chrome DevTools (F12)                                 ║
║  2. Toggle device toolbar (Ctrl+Shift+M)                       ║
║  3. Select "iPhone SE" or set custom: 375x667 @ 2x DPR         ║
║  4. Navigate to each page and take screenshots:                ║
║     - / (main map view)        → mobile-map.png                ║
║     - /achievements            → mobile-achievements.png       ║
║     - /?category=usNationalParks → mobile-parks.png            ║
║                                                                ║
║  DESKTOP (1280x800):                                           ║
║  1. Resize browser to 1280x800                                 ║
║  2. Take screenshot of main map → desktop-map.png              ║
║                                                                ║
║  Save all images to: public/files/screenshots/                 ║
╚════════════════════════════════════════════════════════════════╝
`);
  process.exit(0);
}

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '../public/files/screenshots');

const screenshots = [
  // Desktop
  {
    name: 'desktop-map.png',
    url: '/',
    viewport: { width: 1280, height: 800, deviceScaleFactor: 1 },
    waitFor: 2000, // Wait for map to render
  },
  // Mobile
  {
    name: 'mobile-map.png',
    url: '/',
    viewport: { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true },
    waitFor: 2000,
  },
  {
    name: 'mobile-achievements.png',
    url: '/achievements',
    viewport: { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true },
    waitFor: 1500,
  },
  {
    name: 'mobile-parks.png',
    url: '/?category=usNationalParks',
    viewport: { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true },
    waitFor: 2000,
  },
];

async function generateScreenshots() {
  console.log('🚀 Starting PWA screenshot generation...');
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Output: ${OUTPUT_DIR}\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const shot of screenshots) {
      const page = await browser.newPage();

      // Set viewport
      await page.setViewport(shot.viewport);

      // Navigate to page
      const fullUrl = `${BASE_URL}${shot.url}`;
      console.log(`📸 Capturing: ${shot.name}`);
      console.log(`   URL: ${fullUrl}`);
      console.log(`   Size: ${shot.viewport.width}x${shot.viewport.height} @ ${shot.viewport.deviceScaleFactor}x`);

      await page.goto(fullUrl, { waitUntil: 'networkidle2' });

      // Wait for dynamic content
      await new Promise(resolve => setTimeout(resolve, shot.waitFor));

      // Take screenshot
      const outputPath = path.join(OUTPUT_DIR, shot.name);
      await page.screenshot({
        path: outputPath,
        type: 'png',
        fullPage: false,
      });

      console.log(`   ✓ Saved: ${outputPath}\n`);
      await page.close();
    }

    console.log('✅ All screenshots generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the screenshots in public/files/screenshots/');
    console.log('2. Optionally optimize with: npx @squoosh/cli --webp public/files/screenshots/*.png');
    console.log('3. Commit and deploy');

  } finally {
    await browser.close();
  }
}

generateScreenshots().catch(err => {
  console.error('❌ Error generating screenshots:', err);
  process.exit(1);
});
