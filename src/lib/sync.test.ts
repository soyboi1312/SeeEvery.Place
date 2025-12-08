/**
 * Tests for sync.ts utility functions
 * Tests the critical mergeSelectionsFromCloud function
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mergeSelectionsFromCloud } from './sync';
import { UserSelections, emptySelections } from './types';

// Mock the supabase client
vi.mock('./supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: vi.fn(),
  })),
}));

describe('mergeSelectionsFromCloud', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  it('should return merged selections when both local and cloud have data', async () => {
    const localSelections: UserSelections = {
      ...emptySelections,
      countries: [
        { id: 'US', status: 'visited', updatedAt: 1000 },
        { id: 'CA', status: 'bucketList', updatedAt: 2000 },
      ],
    };

    const cloudSelections: UserSelections = {
      ...emptySelections,
      countries: [
        { id: 'US', status: 'bucketList', updatedAt: 500 }, // Older - local wins
        { id: 'MX', status: 'visited', updatedAt: 3000 }, // Only in cloud
      ],
    };

    const result = await mergeSelectionsFromCloud(localSelections, cloudSelections);

    // US should be 'visited' (local is newer)
    const us = result.countries.find(c => c.id === 'US');
    expect(us?.status).toBe('visited');

    // CA should be in result (only in local)
    const ca = result.countries.find(c => c.id === 'CA');
    expect(ca?.status).toBe('bucketList');

    // MX should be in result (only in cloud)
    const mx = result.countries.find(c => c.id === 'MX');
    expect(mx?.status).toBe('visited');
  });

  it('should prefer cloud data when cloud timestamp is newer', async () => {
    const localSelections: UserSelections = {
      ...emptySelections,
      states: [
        { id: 'CA', status: 'visited', updatedAt: 1000 },
      ],
    };

    const cloudSelections: UserSelections = {
      ...emptySelections,
      states: [
        { id: 'CA', status: 'bucketList', updatedAt: 2000 }, // Newer - cloud wins
      ],
    };

    const result = await mergeSelectionsFromCloud(localSelections, cloudSelections);

    const ca = result.states.find(s => s.id === 'CA');
    expect(ca?.status).toBe('bucketList');
  });

  it('should handle empty local selections', async () => {
    const cloudSelections: UserSelections = {
      ...emptySelections,
      countries: [
        { id: 'FR', status: 'visited', updatedAt: 1000 },
      ],
    };

    const result = await mergeSelectionsFromCloud(emptySelections, cloudSelections);

    expect(result.countries).toHaveLength(1);
    expect(result.countries[0].id).toBe('FR');
  });

  it('should handle empty cloud selections', async () => {
    const localSelections: UserSelections = {
      ...emptySelections,
      countries: [
        { id: 'JP', status: 'visited', updatedAt: 1000 },
      ],
    };

    const result = await mergeSelectionsFromCloud(localSelections, emptySelections);

    expect(result.countries).toHaveLength(1);
    expect(result.countries[0].id).toBe('JP');
  });

  it('should preserve items only in local selections', async () => {
    const localSelections: UserSelections = {
      ...emptySelections,
      nationalParks: [
        { id: 'yellowstone', status: 'visited', updatedAt: 1000 },
        { id: 'yosemite', status: 'bucketList', updatedAt: 2000 },
      ],
    };

    const cloudSelections: UserSelections = {
      ...emptySelections,
      nationalParks: [],
    };

    const result = await mergeSelectionsFromCloud(localSelections, cloudSelections);

    expect(result.nationalParks).toHaveLength(2);
  });

  it('should preserve items only in cloud selections', async () => {
    const localSelections: UserSelections = {
      ...emptySelections,
      museums: [],
    };

    const cloudSelections: UserSelections = {
      ...emptySelections,
      museums: [
        { id: 'louvre', status: 'visited', updatedAt: 1000 },
      ],
    };

    const result = await mergeSelectionsFromCloud(localSelections, cloudSelections);

    expect(result.museums).toHaveLength(1);
    expect(result.museums[0].id).toBe('louvre');
  });

  it('should remove old deleted items past retention period', async () => {
    const now = Date.now();
    const eightDaysAgo = now - 8 * 24 * 60 * 60 * 1000; // 8 days ago
    const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000; // 3 days ago

    const localSelections: UserSelections = {
      ...emptySelections,
      countries: [
        { id: 'old-deleted', status: 'unvisited', updatedAt: eightDaysAgo, deleted: true }, // Should be removed
        { id: 'recent-deleted', status: 'unvisited', updatedAt: threeDaysAgo, deleted: true }, // Should be kept
        { id: 'normal', status: 'visited', updatedAt: now },
      ],
    };

    const result = await mergeSelectionsFromCloud(localSelections, emptySelections);

    // Old deleted item should be removed
    expect(result.countries.find(c => c.id === 'old-deleted')).toBeUndefined();

    // Recent deleted item should be kept
    expect(result.countries.find(c => c.id === 'recent-deleted')).toBeDefined();

    // Normal item should be kept
    expect(result.countries.find(c => c.id === 'normal')).toBeDefined();
  });

  it('should handle items without timestamps', async () => {
    const localSelections: UserSelections = {
      ...emptySelections,
      states: [
        { id: 'NY', status: 'visited' }, // No timestamp
      ],
    };

    const cloudSelections: UserSelections = {
      ...emptySelections,
      states: [
        { id: 'NY', status: 'bucketList', updatedAt: 1000 }, // Has timestamp - should win
      ],
    };

    const result = await mergeSelectionsFromCloud(localSelections, cloudSelections);

    const ny = result.states.find(s => s.id === 'NY');
    expect(ny?.status).toBe('bucketList');
  });
});
