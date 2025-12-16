'use client';

import { useState, useMemo } from 'react';
import { Itinerary, ItineraryItem, ItineraryCollaborator, categoryLabels, categoryIcons } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CollaboratorSelector from './CollaboratorSelector';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MapPin,
  Globe,
  Lock,
  Pencil,
  Trash2,
  MoreVertical,
  StickyNote,
  Loader2,
  Share2,
  Link as LinkIcon,
  Check,
  Target,
} from 'lucide-react';

interface ItineraryViewProps {
  itinerary: Itinerary;
  items: ItineraryItem[];
  collaborators: ItineraryCollaborator[];
  currentUserId?: string;
  onUpdateItinerary: (data: Partial<Itinerary>) => Promise<void>;
  onDeleteItinerary: () => Promise<void>;
  onUpdateItem: (itemId: string, data: { notes?: string; day_number?: number; sort_order?: number }) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onAddCollaborator: (userId: string, role: 'editor' | 'viewer') => Promise<void>;
  onRemoveCollaborator: (userId: string) => Promise<void>;
  onUpdateCollaboratorRole: (userId: string, role: 'editor' | 'viewer') => Promise<void>;
  isLoading?: boolean;
}

export default function ItineraryView({
  itinerary,
  items,
  collaborators,
  currentUserId,
  onUpdateItinerary,
  onDeleteItinerary,
  onUpdateItem,
  onDeleteItem,
  onAddCollaborator,
  onRemoveCollaborator,
  onUpdateCollaboratorRole,
  isLoading = false,
}: ItineraryViewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(itinerary.title);
  const [editDescription, setEditDescription] = useState(itinerary.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemNotes, setEditItemNotes] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const isOwner = itinerary.owner_id === currentUserId;
  const canEdit = isOwner || itinerary.user_role === 'editor';

  // Sort items by sort_order
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.sort_order - b.sort_order);
  }, [items]);

  const handleSaveDetails = async () => {
    setIsSaving(true);
    try {
      await onUpdateItinerary({
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublic = async () => {
    await onUpdateItinerary({ is_public: !itinerary.is_public });
  };

  const handleSaveItemNotes = async () => {
    if (!editingItemId) return;
    await onUpdateItem(editingItemId, { notes: editItemNotes });
    setEditingItemId(null);
    setEditItemNotes('');
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/trips/${itinerary.id}`;
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              {isEditingTitle ? (
                <div className="space-y-3">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="List title"
                    className="text-xl font-bold"
                    maxLength={100}
                  />
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="resize-none"
                    maxLength={500}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveDetails} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingTitle(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl">{itinerary.title}</CardTitle>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsEditingTitle(true)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {itinerary.description && (
                    <p className="text-muted-foreground mb-3">{itinerary.description}</p>
                  )}
                </>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">{items.length} {items.length === 1 ? 'place' : 'places'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Visibility Badge */}
              <Badge
                variant="secondary"
                className={`gap-1 ${
                  itinerary.is_public
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                }`}
              >
                {itinerary.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {itinerary.is_public ? 'Public' : 'Private'}
              </Badge>

              {/* Share Button */}
              {itinerary.is_public && (
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </>
                  )}
                </Button>
              )}

              {/* Collaborators */}
              {canEdit && (
                <CollaboratorSelector
                  itineraryId={itinerary.id}
                  collaborators={collaborators}
                  ownerId={itinerary.owner_id}
                  ownerUsername={itinerary.owner_username}
                  ownerAvatarUrl={itinerary.owner_avatar_url}
                  isOwner={isOwner}
                  onAddCollaborator={onAddCollaborator}
                  onRemoveCollaborator={onRemoveCollaborator}
                  onUpdateRole={onUpdateCollaboratorRole}
                />
              )}

              {/* More Actions */}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleTogglePublic}>
                      {itinerary.is_public ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 mr-2" />
                          Make Public
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete List
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this list?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &quot;{itinerary.title}&quot; and all its places.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={onDeleteItinerary}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Places Checklist */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-1">No places yet</h3>
            <p className="text-sm text-muted-foreground">
              Start adding places to your list from the tracking pages!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Checklist ({items.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sortedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                canEdit={canEdit}
                onEdit={() => {
                  setEditingItemId(item.id);
                  setEditItemNotes(item.notes || '');
                }}
                onDelete={() => onDeleteItem(item.id)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Edit Item Notes Dialog */}
      <Dialog open={!!editingItemId} onOpenChange={(open) => !open && setEditingItemId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogDescription>
              Add personal notes about this place.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editItemNotes}
            onChange={(e) => setEditItemNotes(e.target.value)}
            placeholder="Add notes about this place..."
            className="resize-none h-32"
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground text-right">
            {editItemNotes.length}/500
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingItemId(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItemNotes}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Item Row Component
interface ItemRowProps {
  item: ItineraryItem;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function ItemRow({ item, canEdit, onEdit, onDelete }: ItemRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl shrink-0">
        {categoryIcons[item.category]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.place_name}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{categoryLabels[item.category]}</span>
          {item.notes && (
            <span className="flex items-center gap-1">
              <StickyNote className="w-3 h-3" />
              <span className="truncate max-w-[150px]">{item.notes}</span>
            </span>
          )}
        </div>
      </div>
      {canEdit && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <StickyNote className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove from list?</AlertDialogTitle>
                <AlertDialogDescription>
                  Remove &quot;{item.place_name}&quot; from this list?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
