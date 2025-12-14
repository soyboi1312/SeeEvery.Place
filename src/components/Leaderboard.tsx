'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Medal,
  Crown,
  Loader2,
  User,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { PROFILE_ICONS } from '@/components/ProfileIcons';

interface LeaderboardUser {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  level: number;
  followerCount?: number;
}

interface LeaderboardEntry {
  rank: number;
  user: LeaderboardUser;
  xp: number;
  isCurrentUser: boolean;
}

interface CurrentUserRank {
  rank: number;
  totalPlayers: number;
  percentile: number;
}

interface LeaderboardProps {
  className?: string;
  defaultType?: 'global' | 'friends';
  defaultPeriod?: 'all_time' | 'monthly' | 'weekly';
  showPeriodTabs?: boolean;
  showTypeTabs?: boolean;
  limit?: number;
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-slate-400" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return null;
  }
}

function getRankStyle(rank: number, isCurrentUser: boolean): string {
  if (isCurrentUser) {
    return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
  }
  switch (rank) {
    case 1:
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    case 2:
      return 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700';
    case 3:
      return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    default:
      return 'bg-white dark:bg-slate-800/30 border-slate-100 dark:border-slate-800';
  }
}

export function Leaderboard({
  className = '',
  defaultType = 'global',
  defaultPeriod = 'all_time',
  showPeriodTabs = true,
  showTypeTabs = true,
  limit = 50,
}: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'global' | 'friends'>(defaultType);
  const [period, setPeriod] = useState<'all_time' | 'monthly' | 'weekly'>(defaultPeriod);
  const [currentUserRank, setCurrentUserRank] = useState<CurrentUserRank | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchLeaderboard = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      const response = await fetch(
        `/api/leaderboard?type=${type}&period=${period}&limit=${limit}&offset=${currentOffset}`
      );

      if (response.status === 401 && type === 'friends') {
        setError('Sign in to see your friends leaderboard');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      if (reset) {
        setEntries(data.leaderboard);
        setOffset(limit);
      } else {
        setEntries(prev => [...prev, ...data.leaderboard]);
        setOffset(prev => prev + limit);
      }

      setCurrentUserRank(data.currentUserRank);
      setHasMore(data.pagination?.hasMore ?? false);
    } catch {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [type, period, limit, offset]);

  useEffect(() => {
    fetchLeaderboard(true);
  }, [type, period]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchLeaderboard(false);
    }
  };

  const periodLabels: Record<string, string> = {
    all_time: 'All Time',
    monthly: 'This Month',
    weekly: 'This Week',
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Leaderboard
        </CardTitle>

        {showTypeTabs && (
          <Tabs value={type} onValueChange={(v) => setType(v as 'global' | 'friends')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="global" className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Global
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Friends
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {showPeriodTabs && (
          <Tabs value={period} onValueChange={(v) => setPeriod(v as 'all_time' | 'monthly' | 'weekly')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all_time">All Time</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Current user's rank summary */}
        {currentUserRank && type === 'global' && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Your Rank</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">#{currentUserRank.rank}</Badge>
                <span className="text-xs text-slate-500">
                  Top {currentUserRank.percentile}% of {currentUserRank.totalPlayers} players
                </span>
              </div>
            </div>
          </div>
        )}

        {loading && entries.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-slate-500">
            <p>{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="mb-2">No entries yet</p>
            {period !== 'all_time' && (
              <p className="text-sm">No XP earned {periodLabels[period].toLowerCase()}</p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {entries.map((entry) => (
                <Link
                  key={entry.user.id}
                  href={`/u/${entry.user.username}`}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors hover:opacity-90 ${getRankStyle(entry.rank, entry.isCurrentUser)}`}
                >
                  {/* Rank */}
                  <div className="w-8 flex items-center justify-center">
                    {getRankIcon(entry.rank) || (
                      <span className="text-sm font-bold text-slate-400">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* User avatar */}
                  {(() => {
                    const avatarUrl = entry.user.avatarUrl;
                    // Check if avatarUrl is a profile icon name
                    if (avatarUrl && PROFILE_ICONS[avatarUrl]) {
                      const IconComponent = PROFILE_ICONS[avatarUrl];
                      return (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                          <IconComponent className="w-5 h-5" />
                        </div>
                      );
                    }
                    // Check if it's a URL (for backwards compatibility)
                    if (avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/'))) {
                      return (
                        <img
                          src={avatarUrl}
                          alt={entry.user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      );
                    }
                    // Default fallback
                    return (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                    );
                  })()}

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {entry.user.fullName || entry.user.username}
                      {entry.isCurrentUser && (
                        <span className="text-blue-500 ml-1">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">@{entry.user.username}</p>
                  </div>

                  {/* XP and Level */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm">{entry.xp.toLocaleString()} XP</p>
                    <Badge variant="outline" className="text-xs">
                      Lv {entry.user.level}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && type === 'global' && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Load More
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default Leaderboard;
