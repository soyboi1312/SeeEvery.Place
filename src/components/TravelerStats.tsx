'use client';

import { useEffect, useState } from 'react';
import { Users, TrendingUp, Heart } from 'lucide-react';
import { Category } from '@/lib/types';

interface PlaceStat {
  placeId: string;
  visitCount: number;
  bucketListCount: number;
  visitPercentage: number;
}

interface TravelerStatsData {
  totalUsersTracking: number;
  placeStats: PlaceStat[];
}

interface TravelerStatsProps {
  category: Category;
  placeId?: string; // Optional: show stats for a specific place
  className?: string;
}

/**
 * Displays community statistics for a category or specific place
 * e.g., "X% of SeeEveryPlace users have visited this"
 */
export function TravelerStats({ category, placeId, className = '' }: TravelerStatsProps) {
  const [stats, setStats] = useState<TravelerStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/stats/${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [category]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
      </div>
    );
  }

  if (error || !stats) {
    return null; // Fail silently for better UX
  }

  // If no stats yet, show a placeholder encouraging message
  if (stats.totalUsersTracking === 0) {
    return (
      <div className={`text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 ${className}`}>
        <Users className="w-4 h-4" />
        <span>Be among the first to track this category!</span>
      </div>
    );
  }

  // If specific place requested, find its stats
  if (placeId) {
    const placeStat = stats.placeStats.find(s => s.placeId === placeId);
    if (!placeStat) {
      return (
        <div className={`text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 ${className}`}>
          <TrendingUp className="w-4 h-4" />
          <span>Be the first to visit!</span>
        </div>
      );
    }

    return (
      <div className={`flex flex-wrap gap-4 text-sm ${className}`}>
        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
          <Users className="w-4 h-4" />
          <span>
            <strong>{placeStat.visitPercentage}%</strong> of travelers have visited
          </span>
        </div>
        {placeStat.bucketListCount > 0 && (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Heart className="w-4 h-4" />
            <span>
              <strong>{placeStat.bucketListCount}</strong> have this on their bucket list
            </span>
          </div>
        )}
      </div>
    );
  }

  // Category-level stats
  const topPlaces = stats.placeStats.slice(0, 3);
  const avgVisitPercentage = stats.placeStats.length > 0
    ? Math.round(stats.placeStats.reduce((sum, p) => sum + p.visitPercentage, 0) / stats.placeStats.length)
    : 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <Users className="w-4 h-4 text-green-500" />
        <span>
          <strong>{stats.totalUsersTracking.toLocaleString()}</strong> travelers are tracking this category
        </span>
      </div>

      {topPlaces.length > 0 && (
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">Most visited:</span>{' '}
          {topPlaces.map((p, i) => (
            <span key={p.placeId}>
              {p.placeId} ({p.visitPercentage}%)
              {i < topPlaces.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Inline version for use within item lists
 */
export function TravelerStatsInline({ category, placeId }: { category: Category; placeId: string }) {
  const [visitPercentage, setVisitPercentage] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/stats/${category}`);
        if (!response.ok) return;
        const data: TravelerStatsData = await response.json();
        const placeStat = data.placeStats.find(s => s.placeId === placeId);
        if (placeStat) {
          setVisitPercentage(placeStat.visitPercentage);
        }
      } catch {
        // Fail silently
      }
    }

    fetchStats();
  }, [category, placeId]);

  if (visitPercentage === null) return null;

  return (
    <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
      ({visitPercentage}% visited)
    </span>
  );
}

export default TravelerStats;
