/**
 * Reserved usernames that cannot be used for user profiles.
 *
 * These are reserved because they could:
 * 1. Conflict with application routes
 * 2. Cause confusion with system functionality
 * 3. Be used for impersonation or phishing
 *
 * This list is shared between frontend (for instant validation feedback)
 * and backend (for authoritative enforcement).
 *
 * NOTE: As the application grows, consider migrating this to a database table
 * for easier management without deployments.
 */
export const RESERVED_USERNAMES = new Set([
  // Route segments - would conflict with app routing
  'admin', 'api', 'auth', 'login', 'logout', 'signup', 'register',
  'settings', 'profile', 'dashboard', 'edit', 'new', 'create',

  // File extensions / formats - could cause URL confusion
  'json', 'xml', 'rss', 'atom', 'sitemap', 'robots',

  // Common reserved words - could cause system confusion
  'null', 'undefined', 'true', 'false', 'system', 'support',
  'help', 'about', 'contact', 'privacy', 'terms', 'legal',

  // App-specific routes
  'map', 'maps', 'share', 'explore', 'discover', 'search',
  'suggestions', 'suggest', 'feedback', 'report',

  // Additional reserved words for safety
  'moderator', 'mod', 'staff', 'official', 'verified',
  'security', 'info', 'news', 'blog', 'status',
  'account', 'billing', 'subscribe', 'unsubscribe',
]);

/**
 * Check if a username is reserved (case-insensitive).
 */
export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}
