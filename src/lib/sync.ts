import { createClient } from '@/lib/supabase/client';
import { UserSelections, emptySelections, Selection } from '@/lib/types';

// Retention period for deleted items (7 days in milliseconds)
const DELETED_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

export async function syncToCloud(selections: UserSelections): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

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
  const merged: UserSelections = { ...emptySelections };
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
