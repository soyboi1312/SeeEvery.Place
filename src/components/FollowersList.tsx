'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, UserPlus, UserMinus } from 'lucide-react';
import Link from 'next/link';
import { PROFILE_ICONS } from '@/components/ProfileIcons';
import { useAuth } from '@/lib/hooks/useAuth';

interface FollowUser {
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  followed_at: string;
  is_following?: boolean;
}

interface FollowersListProps {
  userId: string;
  type: 'followers' | 'following';
  className?: string;
  limit?: number;
  showFollowButtons?: boolean;
}

export function FollowersList({
  userId,
  type,
  className = '',
  limit = 20,
  showFollowButtons = false,
}: FollowersListProps) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  const fetchUsers = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      const response = await fetch(
        `/api/follows/${userId}?type=${type}&limit=${limit}&offset=${currentOffset}`
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      if (reset) {
        setUsers(data.data);
        setOffset(limit);
        // Initialize following states from the data
        const initialStates: Record<string, boolean> = {};
        data.data.forEach((user: FollowUser) => {
          if (user.is_following !== undefined) {
            initialStates[user.user_id] = user.is_following;
          }
        });
        setFollowingStates(initialStates);
      } else {
        setUsers(prev => [...prev, ...data.data]);
        setOffset(prev => prev + limit);
      }

      setHasMore(data.pagination.hasMore);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [userId, type, limit, offset]);

  useEffect(() => {
    fetchUsers(true);
  }, [userId, type]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchUsers(false);
    }
  };

  const handleFollowToggle = async (targetUserId: string) => {
    const isCurrentlyFollowing = followingStates[targetUserId];

    try {
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
      const response = await fetch('/api/follows', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId }),
      });

      if (response.ok) {
        setFollowingStates(prev => ({
          ...prev,
          [targetUserId]: !isCurrentlyFollowing,
        }));
      }
    } catch (error) {
      console.error('Follow toggle error:', error);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 text-slate-500 ${className}`}>
        <p>{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={`text-center py-8 text-slate-500 ${className}`}>
        <p>{type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.user_id}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {/* User avatar */}
            <Link href={`/u/${user.username}`} className="flex-shrink-0">
              {(() => {
                const avatarUrl = user.avatar_url;
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
                      alt={user.username}
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
            </Link>

            {/* User info */}
            <Link href={`/u/${user.username}`} className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user.full_name || user.username}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">@{user.username}</span>
                <Badge variant="outline" className="text-xs">
                  Lv {user.level}
                </Badge>
              </div>
            </Link>

            {/* Follow button - don't show for current user */}
            {showFollowButtons && currentUser?.id !== user.user_id && (
              <Button
                variant={followingStates[user.user_id] ? 'outline' : 'default'}
                size="sm"
                onClick={() => handleFollowToggle(user.user_id)}
              >
                {followingStates[user.user_id] ? (
                  <>
                    <UserMinus className="w-3.5 h-3.5 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Load More
        </Button>
      )}
    </div>
  );
}

export default FollowersList;
