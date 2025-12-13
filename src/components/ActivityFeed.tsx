'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  MapPin,
  Trophy,
  TrendingUp,
  Target,
  Loader2,
  RefreshCw,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface ActivityUser {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  level: number;
}

interface ActivityData {
  category: string | null;
  placeId: string | null;
  placeName: string | null;
  achievementId: string | null;
  achievementName: string | null;
  oldLevel: number | null;
  newLevel: number | null;
  challengeName: string | null;
  xpEarned: number | null;
}

interface FeedActivity {
  id: string;
  user: ActivityUser;
  type: string;
  data: ActivityData;
  createdAt: string;
}

interface ActivityFeedProps {
  className?: string;
  defaultType?: 'friends' | 'global';
  showTabs?: boolean;
  limit?: number;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'visit':
      return <MapPin className="w-4 h-4 text-blue-500" />;
    case 'achievement':
      return <Trophy className="w-4 h-4 text-yellow-500" />;
    case 'level_up':
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'challenge_complete':
      return <Target className="w-4 h-4 text-purple-500" />;
    default:
      return <Activity className="w-4 h-4 text-slate-500" />;
  }
}

function getActivityMessage(activity: FeedActivity): string {
  const { type, data, user } = activity;
  const name = user.fullName || user.username;

  switch (type) {
    case 'visit':
      return `${name} visited ${data.placeName || 'a place'}`;
    case 'achievement':
      return `${name} unlocked "${data.achievementName}"`;
    case 'level_up':
      return `${name} reached Level ${data.newLevel}!`;
    case 'challenge_complete':
      return `${name} completed "${data.challengeName}"`;
    case 'started_tracking':
      return `${name} started tracking ${data.category}`;
    default:
      return `${name} did something`;
  }
}

function formatCategory(category: string | null): string {
  if (!category) return '';
  // Convert camelCase to Title Case with spaces
  return category
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export function ActivityFeed({
  className = '',
  defaultType = 'global',
  showTabs = true,
  limit = 20,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'friends' | 'global'>(defaultType);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchActivities = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      const response = await fetch(
        `/api/feed?type=${feedType}&limit=${limit}&offset=${currentOffset}`
      );

      if (response.status === 401 && feedType === 'friends') {
        setError('Sign in to see your friends\' activity');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      if (reset) {
        setActivities(data.activities);
        setOffset(limit);
      } else {
        setActivities(prev => [...prev, ...data.activities]);
        setOffset(prev => prev + limit);
      }

      setHasMore(data.pagination.hasMore);
    } catch {
      setError('Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  }, [feedType, limit, offset]);

  useEffect(() => {
    fetchActivities(true);
  }, [feedType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchActivities(false);
    }
  };

  const handleRefresh = () => {
    fetchActivities(true);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-blue-500" />
            Activity Feed
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        {showTabs && (
          <Tabs value={feedType} onValueChange={(v) => setFeedType(v as 'friends' | 'global')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="global">Discover</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && activities.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-slate-500">
            <p>{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="mb-2">No activity yet</p>
            {feedType === 'friends' && (
              <p className="text-sm">Follow some travelers to see their updates!</p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {/* User avatar */}
                  <Link href={`/u/${activity.user.username}`} className="flex-shrink-0">
                    {activity.user.avatarUrl ? (
                      <img
                        src={activity.user.avatarUrl}
                        alt={activity.user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </Link>

                  {/* Activity content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.type)}
                      <p className="text-sm font-medium truncate">
                        {getActivityMessage(activity)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      {activity.data.category && (
                        <Badge variant="secondary" className="text-xs">
                          {formatCategory(activity.data.category)}
                        </Badge>
                      )}
                      {activity.data.xpEarned && activity.data.xpEarned > 0 && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          +{activity.data.xpEarned} XP
                        </Badge>
                      )}
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Level badge */}
                  <Badge variant="outline" className="flex-shrink-0 text-xs">
                    Lv {activity.user.level}
                  </Badge>
                </div>
              ))}
            </div>

            {hasMore && (
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

export default ActivityFeed;
