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
  // Merge strategy: combine unique selections, preferring visited over bucket list
  const merged: UserSelections = { ...emptySelections };

  const categories = Object.keys(localSelections) as (keyof UserSelections)[];

  for (const category of categories) {
    const localItems = localSelections[category];
    const cloudItems = cloudSelections[category];

    // Create a map of all items
    const itemMap = new Map<string, { id: string; status: 'visited' | 'bucketList' | 'unvisited' }>();

    // Add cloud items first
    for (const item of cloudItems) {
      itemMap.set(item.id, item);
    }

    // Add/override with local items (local takes precedence for conflicts)
    for (const item of localItems) {
      const existing = itemMap.get(item.id);
      if (!existing) {
        itemMap.set(item.id, item);
      } else {
        // If local is visited, it takes precedence
        if (item.status === 'visited' || existing.status !== 'visited') {
          itemMap.set(item.id, item);
        }
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
