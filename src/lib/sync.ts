import { createClient } from '@/lib/supabase/client';
import { UserSelections, emptySelections } from '@/lib/types';

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
  // Merge strategy: LOCAL is the source of truth
  // - Items in local stay as-is (including deletions)
  // - Items ONLY in cloud get added (synced from other devices)
  // - This prevents "zombie" data where deleted items reappear
  const merged: UserSelections = { ...emptySelections };

  const categories = Object.keys(localSelections) as (keyof UserSelections)[];

  for (const category of categories) {
    const localItems = localSelections[category] || [];
    const cloudItems = cloudSelections[category] || [];

    // Start with local items as the base (preserves deletions)
    const localIds = new Set(localItems.map(item => item.id));
    const itemMap = new Map<string, { id: string; status: 'visited' | 'bucketList' | 'unvisited' }>();

    // Add all local items first (local is truth)
    for (const item of localItems) {
      itemMap.set(item.id, item);
    }

    // Only add cloud items that DON'T exist locally
    // (these are new items from other devices)
    for (const item of cloudItems) {
      if (!localIds.has(item.id)) {
        itemMap.set(item.id, item);
      }
    }

    merged[category] = Array.from(itemMap.values());
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
