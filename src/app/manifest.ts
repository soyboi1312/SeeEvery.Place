// src/app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'See Every Place',
    short_name: 'SeeEveryPlace',
    description: 'Track your world travels and bucket list. Map countries, states, national parks, stadiums, and more.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    categories: ['travel', 'lifestyle', 'entertainment'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/files/fav/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/files/fav/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/files/fav/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/files/fav/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Countries',
        short_name: 'Countries',
        description: 'Track visited countries',
        url: '/?category=countries',
        icons: [{ src: '/files/fav/favicon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'US States',
        short_name: 'States',
        description: 'Track US states visited',
        url: '/?category=usStates',
        icons: [{ src: '/files/fav/favicon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'National Parks',
        short_name: 'Parks',
        description: 'Track national parks',
        url: '/?category=usNationalParks',
        icons: [{ src: '/files/fav/favicon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'My Profile',
        short_name: 'Profile',
        description: 'View your travel profile',
        url: '/settings',
        icons: [{ src: '/files/fav/favicon-96x96.png', sizes: '96x96' }],
      },
    ],
    screenshots: [
      // Wide (desktop) screenshots
      {
        src: '/files/screenshots/desktop-map.png',
        sizes: '1280x800',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Interactive world map showing visited countries',
      },
      // Narrow (mobile) screenshots - need 3+ for Chrome Rich Install UI
      {
        src: '/files/screenshots/mobile-map.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Track your visited countries on the go',
      },
      {
        src: '/files/screenshots/mobile-achievements.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Earn achievements as you explore the world',
      },
      {
        src: '/files/screenshots/mobile-parks.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Track national parks and bucket list destinations',
      },
    ],
  }
}
