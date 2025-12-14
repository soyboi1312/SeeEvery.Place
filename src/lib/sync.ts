import { createClient } from '@/lib/supabase/client';
import { UserSelections, emptySelections, Selection } from '@/lib/types';
import {
  ACHIEVEMENTS,
  calculateTotalXp,
  calculateLevel,
  isAchievementUnlocked,
  getCategoryStats,
} from '@/lib/achievements';

// Retention period for deleted items (365 days in milliseconds)
// Using a long retention prevents "zombie items" from being revived when a device
// syncs after the tombstone has been garbage collected from the cloud.
// Since the data payload is small (just IDs and status), this is acceptable.
//
// SCALABILITY NOTE: The selections column stores all user data as a single JSON blob.
// This approach is simple and works well for typical usage (hundreds of items), but:
// - Monitor blob sizes in production if users track thousands of locations
// - If blob sizes exceed ~100KB, consider migrating to a relational user_visits table
// - The blob grows slowly with tombstones (deleted items) until DELETED_RETENTION_MS expires
const DELETED_RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

export async function syncToCloud(selections: UserSelections): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // 1. Sync selections
  const { error } = await supabase
    .from('user_selections')
    .upsert({
      user_id: user.id,
      selections: selections,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    });

  if (error) {
    console.error('Failed to sync to cloud:', error);
    return false;
  }

  // 2. Sync total XP to profile
  // This ensures the level and leaderboard are always up to date
  // The database trigger 'on_xp_change' will automatically recalculate the 'level' column
  try {
    const totalXp = calculateTotalXp(selections);
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        total_xp: totalXp,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Failed to sync profile XP:', profileError);
      // We don't return false here because the main data (selections) was synced successfully
    }
  } catch (err) {
    console.error('Error calculating or syncing XP:', err);
  }

  // 3. Sync achievements based on current selections
  // This runs in the background and doesn't block the main sync
  syncAchievementsToCloud(selections).catch(err => {
    console.error('Failed to sync achievements:', err);
  });

  return true;
}

export async function loadFromCloud(): Promise<UserSelections | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_selections')
    .select('selections')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No data found, return empty
      return emptySelections;
    }
    console.error('Failed to load from cloud:', error);
    return null;
  }

  return data?.selections as UserSelections || emptySelections;
}

export async function mergeSelectionsFromCloud(
  localSelections: UserSelections,
  cloudSelections: UserSelections
): Promise<UserSelections> {
  // Merge strategy: Use timestamps for conflict resolution
  // - Compare updatedAt timestamps to determine which version is newer
  // - Respect deleted flags - a newer deletion should not be overwritten by old data
  // - Clean up old deleted items past retention period
  
  // Create a fresh object structure to avoid mutating global emptySelections
  const merged = {} as UserSelections;
  const now = Date.now();

  const categories = Object.keys(localSelections) as (keyof UserSelections)[];

  for (const category of categories) {
    const localItems = localSelections[category] || [];
    const cloudItems = cloudSelections[category] || [];

    // Create a map to merge items by ID, using timestamps for conflict resolution
    const itemMap = new Map<string, Selection>();

    // Add all local items first
    for (const item of localItems) {
      itemMap.set(item.id, item);
    }

    // Merge cloud items, using timestamp to determine winner
    for (const cloudItem of cloudItems) {
      const localItem = itemMap.get(cloudItem.id);

      if (!localItem) {
        // Item only exists in cloud - add it (new from other device)
        itemMap.set(cloudItem.id, cloudItem);
      } else {
        // Item exists in both - compare timestamps
        const localTime = localItem.updatedAt || 0;
        const cloudTime = cloudItem.updatedAt || 0;

        if (cloudTime > localTime) {
          // Cloud is newer - use cloud version
          itemMap.set(cloudItem.id, cloudItem);
        }
        // Otherwise keep local (already in map)
      }
    }

    // Convert map to array and clean up old deleted items
    const mergedItems: Selection[] = [];
    for (const item of itemMap.values()) {
      // Skip items that have been deleted for longer than retention period
      if (item.deleted && item.updatedAt && (now - item.updatedAt) > DELETED_RETENTION_MS) {
        continue;
      }
      mergedItems.push(item);
    }

    merged[category] = mergedItems;
  }

  return merged;
}

export async function deleteCloudData(): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('user_selections')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to delete cloud data:', error);
    return false;
  }

  return true;
}

/**
 * Syncs unlocked achievements to the database.
 * Calculates which achievements are unlocked based on current selections
 * and inserts any new ones that aren't already stored.
 */
export async function syncAchievementsToCloud(selections: UserSelections): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  try {
    // Calculate current level for level-based achievements
    const totalXp = calculateTotalXp(selections);
    const currentLevel = calculateLevel(totalXp);

    // Get all achievements that should be unlocked
    const unlockedAchievements = ACHIEVEMENTS.filter(achievement =>
      isAchievementUnlocked(achievement, selections, currentLevel)
    );

    if (unlockedAchievements.length === 0) {
      return true; // Nothing to sync
    }

    // Get existing achievements from database
    const { data: existingAchievements, error: fetchError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user.id);

    if (fetchError) {
      console.error('Failed to fetch existing achievements:', fetchError);
      return false;
    }

    const existingIds = new Set((existingAchievements || []).map(a => a.achievement_id));

    // Filter to only new achievements
    const newAchievements = unlockedAchievements.filter(a => !existingIds.has(a.id));

    if (newAchievements.length === 0) {
      return true; // All achievements already synced
    }

    // Prepare achievement records for insertion
    const achievementRecords = newAchievements.map(achievement => {
      // Get progress snapshot for category-specific achievements
      let progressSnapshot = null;
      if (achievement.category !== 'global') {
        const stats = getCategoryStats(selections, achievement.category);
        progressSnapshot = {
          visited: stats.visited,
          total: stats.total,
          percentage: stats.percentage,
        };
      }

      return {
        user_id: user.id,
        achievement_id: achievement.id,
        category: achievement.category === 'global' ? null : achievement.category,
        progress_snapshot: progressSnapshot,
        unlocked_at: new Date().toISOString(),
      };
    });

    // Insert new achievements
    const { error: insertError } = await supabase
      .from('user_achievements')
      .insert(achievementRecords);

    if (insertError) {
      console.error('Failed to insert achievements:', insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to sync achievements:', error);
    return false;
  }
}
