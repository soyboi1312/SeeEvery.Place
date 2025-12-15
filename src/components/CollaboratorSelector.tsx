'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2, Users, UserPlus, X, Crown, Pencil, Eye } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { PROFILE_ICONS } from '@/components/ProfileIcons';
import { useAuth } from '@/lib/hooks/useAuth';
import { ItineraryCollaborator, CollaboratorRole } from '@/lib/types';

interface SearchUser {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  level: number;
}

interface CollaboratorSelectorProps {
  itineraryId: string;
  collaborators: ItineraryCollaborator[];
  isOwner: boolean;
  onCollaboratorAdded?: (collaborator: ItineraryCollaborator) => void;
  onCollaboratorRemoved?: (userId: string) => void;
  onRoleChanged?: (userId: string, role: CollaboratorRole) => void;
  className?: string;
}

const ROLE_ICONS: Record<CollaboratorRole, typeof Crown> = {
  owner: Crown,
  editor: Pencil,
  viewer: Eye,
};

const ROLE_LABELS: Record<CollaboratorRole, string> = {
  owner: 'Owner',
  editor: 'Editor',
  viewer: 'Viewer',
};

export function CollaboratorSelector({
  itineraryId,
  collaborators,
  isOwner,
  onCollaboratorAdded,
  onCollaboratorRemoved,
  onRoleChanged,
  className = '',
}: CollaboratorSelectorProps) {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  const collaboratorIds = new Set(collaborators.map(c => c.user_id));

  const searchUsers = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        // Filter out users who are already collaborators
        setSearchResults(
          data.users.filter((u: SearchUser) => !collaboratorIds.has(u.id))
        );
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  }, [collaboratorIds]);

  useEffect(() => {
    searchUsers(debouncedQuery);
  }, [debouncedQuery, searchUsers]);

  const handleInvite = async (user: SearchUser, role: CollaboratorRole = 'editor') => {
    setInviting(user.id);
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, role }),
      });

      if (response.ok) {
        const newCollaborator: ItineraryCollaborator = {
          user_id: user.id,
          username: user.username,
          full_name: user.fullName,
          avatar_url: user.avatarUrl,
          role,
          is_owner: false,
          created_at: new Date().toISOString(),
        };
        onCollaboratorAdded?.(newCollaborator);
        setSearchResults(prev => prev.filter(u => u.id !== user.id));
        setQuery('');
      }
    } catch (error) {
      console.error('Error inviting collaborator:', error);
    } finally {
      setInviting(null);
    }
  };

  const handleRemove = async (userId: string) => {
    setRemoving(userId);
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/collaborators`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        onCollaboratorRemoved?.(userId);
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: CollaboratorRole) => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });

      if (response.ok) {
        onRoleChanged?.(userId, newRole);
      }
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const renderAvatar = (avatarUrl: string | null | undefined, username: string) => {
    if (avatarUrl && PROFILE_ICONS[avatarUrl]) {
      const IconComponent = PROFILE_ICONS[avatarUrl];
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
          <IconComponent className="w-4 h-4" />
        </div>
      );
    }
    return (
      <Avatar className="w-8 h-8">
        {avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/')) && (
          <AvatarImage src={avatarUrl} />
        )}
        <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className={className}>
      {/* Current collaborators */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          Collaborators ({collaborators.length})
        </h4>

        <div className="space-y-2">
          {collaborators.map(collaborator => {
            const RoleIcon = ROLE_ICONS[collaborator.role];
            const isCurrentUser = collaborator.user_id === currentUser?.id;
            const canModify = isOwner && !collaborator.is_owner;

            return (
              <div
                key={collaborator.user_id}
                className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
              >
                {renderAvatar(collaborator.avatar_url, collaborator.username)}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    @{collaborator.username}
                    {isCurrentUser && (
                      <span className="text-slate-500 ml-1">(you)</span>
                    )}
                  </p>
                  {collaborator.full_name && (
                    <p className="text-xs text-slate-500 truncate">
                      {collaborator.full_name}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {canModify ? (
                    <Select
                      value={collaborator.role}
                      onValueChange={(value: CollaboratorRole) =>
                        handleRoleChange(collaborator.user_id, value)
                      }
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">
                          <span className="flex items-center gap-1">
                            <Pencil className="w-3 h-3" /> Editor
                          </span>
                        </SelectItem>
                        <SelectItem value="viewer">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Viewer
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <RoleIcon className="w-3 h-3" />
                      {ROLE_LABELS[collaborator.role]}
                    </Badge>
                  )}

                  {canModify && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
                      onClick={() => handleRemove(collaborator.user_id)}
                      disabled={removing === collaborator.user_id}
                    >
                      {removing === collaborator.user_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </Button>
                  )}

                  {/* Allow non-owners to remove themselves */}
                  {isCurrentUser && !collaborator.is_owner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
                      onClick={() => handleRemove(collaborator.user_id)}
                      disabled={removing === collaborator.user_id}
                    >
                      {removing === collaborator.user_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search to add new collaborators (only for owners) */}
      {isOwner && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Invite Collaborators
          </h4>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search users by username..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  {renderAvatar(user.avatarUrl, user.username)}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">@{user.username}</p>
                    {user.fullName && (
                      <p className="text-xs text-slate-500 truncate">
                        {user.fullName}
                      </p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleInvite(user)}
                    disabled={inviting === user.id}
                  >
                    {inviting === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Invite
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!loading && query.length >= 2 && searchResults.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-2">
              No users found
            </p>
          )}

          {query.length > 0 && query.length < 2 && (
            <p className="text-xs text-slate-500 text-center py-2">
              Enter at least 2 characters to search
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default CollaboratorSelector;
