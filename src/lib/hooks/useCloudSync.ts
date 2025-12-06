'use client';

import { useEffect, useRef, useState } from 'react';
import { UserSelections } from '@/lib/types';
import { loadFromCloud, mergeSelectionsFromCloud, syncToCloud } from '@/lib/sync';
import type { User } from '@supabase/supabase-js';

interface UseCloudSyncOptions {
  user: User | null;
  selections: UserSelections;
  setSelections: (selections: UserSelections | ((prev: UserSelections) => UserSelections)) => void;
  isLoaded: boolean;
}

interface UseCloudSyncReturn {
  isSyncing: boolean;
}

/**
 * Custom hook for managing cloud synchronization of user selections.
 * Handles initial sync on login, debounced sync on changes, and cleanup on logout.
 */
export function useCloudSync({
  user,
  selections,
  setSelections,
  isLoaded,
}: UseCloudSyncOptions): UseCloudSyncReturn {
  const [isSyncing, setIsSyncing] = useState(false);

  // Track which user we've synced for to prevent duplicate syncs
  const lastSyncedUserId = useRef<string | null>(null);
  // Track if initial sync is complete
  const initialSyncComplete = useRef(false);
  // Track last synced data to prevent unnecessary syncs when content hasn't changed
  const lastSyncedData = useRef<string | null>(null);

  // Reset state when user logs out
  useEffect(() => {
    if (!user) {
      lastSyncedUserId.current = null;
      initialSyncComplete.current = false;
      lastSyncedData.current = null;
    }
  }, [user]);

  // Cloud sync: fetch and merge when user signs in
  useEffect(() => {
    // Wait for local data to load first
    if (!isLoaded) return;

    // No user = no cloud sync needed
    if (!user) {
      return;
    }

    // Skip if we've already synced for this user
    if (lastSyncedUserId.current === user.id) return;

    const performInitialSync = async () => {
      setIsSyncing(true);

      try {
        const cloudData = await loadFromCloud();

        if (cloudData) {
          // Merge local + cloud data (local takes precedence for conflicts)
          const merged = await mergeSelectionsFromCloud(selections, cloudData);
          setSelections(merged);
          // Push merged result back to cloud
          await syncToCloud(merged);
        } else {
          // No cloud data exists, push local data to cloud
          await syncToCloud(selections);
        }

        // Mark this user as synced and record the synced data
        lastSyncedUserId.current = user.id;
        initialSyncComplete.current = true;
        lastSyncedData.current = JSON.stringify(selections);
      } catch (error) {
        console.error('Cloud sync failed:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    performInitialSync();
    // Note: we intentionally exclude `selections` from deps to only run on user change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isLoaded, setSelections]);

  // Debounced sync to cloud when selections change (after initial sync)
  useEffect(() => {
    // Only sync if user is logged in, data is loaded, and initial sync is done
    if (!user || !isLoaded || !initialSyncComplete.current) return;

    // Serialize current selections for comparison
    const currentData = JSON.stringify(selections);

    // Skip sync if data hasn't actually changed (prevents unnecessary network calls
    // when setSelections creates new object references with same content)
    if (lastSyncedData.current === currentData) return;

    const debounceSync = setTimeout(() => {
      syncToCloud(selections)
        .then(() => {
          // Update last synced data after successful sync
          lastSyncedData.current = currentData;
        })
        .catch(err => console.error('Failed to sync changes to cloud:', err));
    }, 2000); // 2 second debounce

    return () => clearTimeout(debounceSync);
  }, [selections, user, isLoaded]);

  return { isSyncing };
}
