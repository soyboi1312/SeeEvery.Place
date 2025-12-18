'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FollowButton } from '@/components/FollowButton';
import { Search, Loader2, Users } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { AvatarDisplay } from '@/components/ui/AvatarDisplay';
import { useAuth } from '@/lib/hooks/useAuth';

interface SearchUser {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  level: number;
  totalXp: number;
  followerCount: number;
  isFollowing: boolean;
}

export function UserSearch() {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const searchUsers = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setUsers([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchUsers(debouncedQuery);
  }, [debouncedQuery, searchUsers]);

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? {
              ...user,
              isFollowing,
              followerCount: user.followerCount + (isFollowing ? 1 : -1),
            }
          : user
      )
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && hasSearched && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No users found</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Link
                  href={`/u/${user.username}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <AvatarDisplay
                    avatarUrl={user.avatarUrl}
                    username={user.username}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">@{user.username}</p>
                    {user.fullName && (
                      <p className="text-sm text-muted-foreground truncate">
                        {user.fullName}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Level {user.level}</span>
                      <span>•</span>
                      <span>{user.followerCount} followers</span>
                    </div>
                  </div>
                </Link>
                <FollowButton
                  userId={user.id}
                  currentUserId={currentUser?.id}
                  initialIsFollowing={user.isFollowing}
                  onFollowChange={(isFollowing) =>
                    handleFollowChange(user.id, isFollowing)
                  }
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}

        {!hasSearched && !loading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Enter at least 2 characters to search
          </p>
        )}
      </CardContent>
    </Card>
  );
}
