'use client';

import { useState, useCallback } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { ItineraryCollaborator } from '@/lib/types';
import { PROFILE_ICONS } from '@/components/ProfileIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  UserPlus,
  Loader2,
  X,
  Crown,
  Pencil,
  Eye,
} from 'lucide-react';

interface SearchResult {
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_following: boolean;
}

interface CollaboratorSelectorProps {
  itineraryId: string;
  collaborators: ItineraryCollaborator[];
  ownerId: string;
  ownerUsername?: string;
  ownerAvatarUrl?: string;
  isOwner: boolean;
  onAddCollaborator: (userId: string, role: 'editor' | 'viewer') => Promise<void>;
  onRemoveCollaborator: (userId: string) => Promise<void>;
  onUpdateRole: (userId: string, role: 'editor' | 'viewer') => Promise<void>;
}

export default function CollaboratorSelector({
  collaborators,
  ownerId,
  ownerUsername,
  ownerAvatarUrl,
  isOwner,
  onAddCollaborator,
  onRemoveCollaborator,
  onUpdateRole,
}: CollaboratorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'editor' | 'viewer'>('editor');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Search for users
  const searchUsers = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        // Filter out owner and existing collaborators
        const existingIds = new Set([ownerId, ...collaborators.map(c => c.user_id)]);
        const filtered = (data.users || []).filter(
          (user: SearchResult) => !existingIds.has(user.user_id)
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  }, [ownerId, collaborators]);

  // Trigger search when debounced query changes
  useState(() => {
    searchUsers(debouncedSearch);
  });

  const handleAddCollaborator = async (user: SearchResult) => {
    setIsAdding(user.user_id);
    try {
      await onAddCollaborator(user.user_id, selectedRole);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding collaborator:', error);
    } finally {
      setIsAdding(null);
    }
  };

  const OwnerIcon = ownerAvatarUrl && PROFILE_ICONS[ownerAvatarUrl]
    ? PROFILE_ICONS[ownerAvatarUrl]
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlus className="w-4 h-4" />
          Collaborators ({collaborators.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trip Collaborators</DialogTitle>
        </DialogHeader>

        {/* Owner */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Owner</h4>
          <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white">
              {OwnerIcon ? (
                <OwnerIcon className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{ownerUsername?.[0]?.toUpperCase() || '?'}</span>
              )}
            </div>
            <div className="flex-1">
              <span className="font-medium">@{ownerUsername || 'Unknown'}</span>
            </div>
            <Badge className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100">
              <Crown className="w-3 h-3" />
              Owner
            </Badge>
          </div>
        </div>

        {/* Existing Collaborators */}
        {collaborators.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Collaborators ({collaborators.length})
            </h4>
            <div className="space-y-2">
              {collaborators.map((collaborator) => {
                const CollabIcon = collaborator.avatar_url && PROFILE_ICONS[collaborator.avatar_url]
                  ? PROFILE_ICONS[collaborator.avatar_url]
                  : null;

                return (
                  <div
                    key={collaborator.user_id}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      {CollabIcon ? (
                        <CollabIcon className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold">{collaborator.username[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">@{collaborator.username}</div>
                      {collaborator.full_name && (
                        <div className="text-sm text-muted-foreground truncate">
                          {collaborator.full_name}
                        </div>
                      )}
                    </div>
                    {isOwner ? (
                      <>
                        <Select
                          value={collaborator.role}
                          onValueChange={(value: 'editor' | 'viewer') =>
                            onUpdateRole(collaborator.user_id, value)
                          }
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">
                              <div className="flex items-center gap-1.5">
                                <Pencil className="w-3 h-3" />
                                Editor
                              </div>
                            </SelectItem>
                            <SelectItem value="viewer">
                              <div className="flex items-center gap-1.5">
                                <Eye className="w-3 h-3" />
                                Viewer
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onRemoveCollaborator(collaborator.user_id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        {collaborator.role === 'editor' ? (
                          <>
                            <Pencil className="w-3 h-3" />
                            Editor
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            Viewer
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add New Collaborator (Owner Only) */}
        {isOwner && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Add Collaborator</h4>

            {/* Role Selection */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Add as:</span>
              <Select
                value={selectedRole}
                onValueChange={(value: 'editor' | 'viewer') => setSelectedRole(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-1.5">
                      <Pencil className="w-3 h-3" />
                      Editor
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3 h-3" />
                      Viewer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
                className="pl-9"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-lg divide-y max-h-48 overflow-y-auto">
                {searchResults.map((user) => {
                  const UserIcon = user.avatar_url && PROFILE_ICONS[user.avatar_url]
                    ? PROFILE_ICONS[user.avatar_url]
                    : null;

                  return (
                    <div
                      key={user.user_id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        {UserIcon ? (
                          <UserIcon className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-semibold">{user.username[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">@{user.username}</div>
                        {user.full_name && (
                          <div className="text-xs text-muted-foreground truncate">
                            {user.full_name}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddCollaborator(user)}
                        disabled={isAdding === user.user_id}
                      >
                        {isAdding === user.user_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2 text-center py-4">
                No users found matching &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
