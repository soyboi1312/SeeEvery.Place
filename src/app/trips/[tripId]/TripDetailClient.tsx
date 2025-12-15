'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Lock,
  Globe,
  Share2,
  Settings,
  Pencil,
  Trash2,
  Loader2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CollaboratorSelector } from '@/components/CollaboratorSelector';
import { PROFILE_ICONS } from '@/components/ProfileIcons';
import { User } from 'lucide-react';
import {
  Itinerary,
  ItineraryItem,
  ItineraryCollaborator,
  ItineraryStatus,
  categoryLabels,
  categoryIcons,
  CollaboratorRole,
} from '@/lib/types';

interface TripDetailClientProps {
  itinerary: Itinerary;
  initialItems: ItineraryItem[];
  initialCollaborators: ItineraryCollaborator[];
  currentUserId?: string;
}

const STATUS_STYLES: Record<ItineraryStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  planned: { label: 'Planned', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
};

function formatDateRange(startDate?: string | null, endDate?: string | null): string {
  if (!startDate && !endDate) return '';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  if (startDate) return `Starting ${formatDate(startDate)}`;
  if (endDate) return `Until ${formatDate(endDate)}`;
  return '';
}

export default function TripDetailClient({
  itinerary: initialItinerary,
  initialItems,
  initialCollaborators,
  currentUserId,
}: TripDetailClientProps) {
  const router = useRouter();
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [items, setItems] = useState(initialItems);
  const [collaborators, setCollaborators] = useState(initialCollaborators);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [collaboratorsDialogOpen, setCollaboratorsDialogOpen] = useState(false);

  // Form state for edit
  const [editForm, setEditForm] = useState({
    title: itinerary.title,
    description: itinerary.description || '',
    start_date: itinerary.start_date || '',
    end_date: itinerary.end_date || '',
    is_public: itinerary.is_public,
    status: itinerary.status,
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canEdit = itinerary.can_edit;
  const isOwner = itinerary.is_owner;
  const statusStyle = STATUS_STYLES[itinerary.status];
  const dateRange = formatDateRange(itinerary.start_date, itinerary.end_date);

  // Group items by day
  const itemsByDay = useMemo(() => {
    const grouped: Record<number | 'unassigned', ItineraryItem[]> = { unassigned: [] };
    items.forEach(item => {
      const day = item.day_number ?? 'unassigned';
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(item);
    });
    return grouped;
  }, [items]);

  const dayNumbers = Object.keys(itemsByDay)
    .filter(k => k !== 'unassigned')
    .map(Number)
    .sort((a, b) => a - b);

  const renderOwnerAvatar = () => {
    const avatarUrl = itinerary.owner_avatar_url;
    if (avatarUrl && PROFILE_ICONS[avatarUrl]) {
      const IconComponent = PROFILE_ICONS[avatarUrl];
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
          <IconComponent className="w-4 h-4" />
        </div>
      );
    }
    if (avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/'))) {
      return (
        <img
          src={avatarUrl}
          alt={itinerary.owner_username || 'Owner'}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
        <User className="w-4 h-4 text-slate-400" />
      </div>
    );
  };

  const handleSave = async () => {
    if (!editForm.title.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/itineraries/${itinerary.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const { itinerary: updated } = await response.json();
        setItinerary(prev => ({ ...prev, ...updated }));
        setEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/itineraries/${itinerary.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/track');
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItem(itemId);
    try {
      const response = await fetch(`/api/itineraries/${itinerary.id}/items`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId }),
      });

      if (response.ok) {
        setItems(prev => prev.filter(i => i.id !== itemId));
      }
    } catch (error) {
      console.error('Remove item error:', error);
    } finally {
      setRemovingItem(null);
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/trips/${itinerary.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: 'twitter' | 'bluesky' | 'whatsapp') => {
    const url = `${window.location.origin}/trips/${itinerary.id}`;
    const text = encodeURIComponent(`Check out my trip plan: ${itinerary.title}`);
    const encodedUrl = encodeURIComponent(url);

    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      bluesky: `https://bsky.app/intent/compose?text=${text}%20${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
    };

    window.open(links[platform], '_blank');
  };

  const handleCollaboratorAdded = (collaborator: ItineraryCollaborator) => {
    setCollaborators(prev => [...prev, collaborator]);
  };

  const handleCollaboratorRemoved = (userId: string) => {
    setCollaborators(prev => prev.filter(c => c.user_id !== userId));
    // If user removed themselves, redirect
    if (userId === currentUserId) {
      router.push('/track');
    }
  };

  const handleRoleChanged = (userId: string, role: CollaboratorRole) => {
    setCollaborators(prev =>
      prev.map(c => (c.user_id === userId ? { ...c, role } : c))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/track">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold truncate">{itinerary.title}</h1>
                  {itinerary.is_public ? (
                    <Globe className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Link
                    href={`/u/${itinerary.owner_username}`}
                    className="hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    @{itinerary.owner_username}
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>

              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCollaboratorsDialogOpen(true)}>
                      <Users className="w-4 h-4 mr-2" />
                      Manage Collaborators
                    </DropdownMenuItem>
                    {isOwner && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteDialogOpen(true)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Trip
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Trip info card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-sm">
          {itinerary.description && (
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {itinerary.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className={statusStyle.className}>
              {statusStyle.label}
            </Badge>

            {dateRange && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{dateRange}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="w-4 h-4" />
              <span>{items.length} places</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Users className="w-4 h-4" />
              <span>{collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Owner info */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Link href={`/u/${itinerary.owner_username}`} className="flex items-center gap-2">
              {renderOwnerAvatar()}
              <div>
                <p className="text-sm font-medium">
                  {itinerary.owner_full_name || `@${itinerary.owner_username}`}
                </p>
                {itinerary.owner_full_name && (
                  <p className="text-xs text-slate-500">@{itinerary.owner_username}</p>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Places */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map" disabled>Map View (Coming Soon)</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {items.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-sm">
                <MapPin className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                  No places added yet
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  {canEdit
                    ? 'Start adding places from the tracking page to build your trip itinerary.'
                    : 'This trip doesn\'t have any places yet.'}
                </p>
                {canEdit && (
                  <Button asChild>
                    <Link href="/track">Browse Places</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Unassigned items first */}
                {itemsByDay.unassigned.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-3">
                      Unscheduled Places
                    </h3>
                    <div className="space-y-2">
                      {itemsByDay.unassigned.map(item => (
                        <ItemRow
                          key={item.id}
                          item={item}
                          canEdit={canEdit ?? false}
                          removing={removingItem === item.id}
                          onRemove={() => handleRemoveItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Grouped by day */}
                {dayNumbers.map(day => (
                  <div
                    key={day}
                    className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
                  >
                    <h3 className="text-sm font-medium text-slate-500 mb-3">
                      Day {day}
                    </h3>
                    <div className="space-y-2">
                      {itemsByDay[day].map(item => (
                        <ItemRow
                          key={item.id}
                          item={item}
                          canEdit={canEdit ?? false}
                          removing={removingItem === item.id}
                          onRemove={() => handleRemoveItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>Update your trip details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start">Start Date</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={editForm.start_date}
                  onChange={e => setEditForm(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end">End Date</Label>
                <Input
                  id="edit-end"
                  type="date"
                  value={editForm.end_date}
                  onChange={e => setEditForm(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value: ItineraryStatus) =>
                  setEditForm(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="edit-public">Make Public</Label>
                <p className="text-xs text-slate-500">Allow anyone to view this trip</p>
              </div>
              <Switch
                id="edit-public"
                checked={editForm.is_public}
                onCheckedChange={checked =>
                  setEditForm(prev => ({ ...prev, is_public: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !editForm.title.trim()}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Share Trip</DialogTitle>
            <DialogDescription>
              {itinerary.is_public
                ? 'Share this trip with friends.'
                : 'This trip is private. Make it public to share with others.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Copy link */}
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/trips/${itinerary.id}`}
                className="flex-1"
              />
              <Button variant="outline" onClick={copyLink}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* Social share buttons */}
            {itinerary.is_public && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => shareToSocial('twitter')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => shareToSocial('bluesky')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bluesky
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => shareToSocial('whatsapp')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Collaborators Dialog */}
      <Dialog open={collaboratorsDialogOpen} onOpenChange={setCollaboratorsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Collaborators</DialogTitle>
            <DialogDescription>
              Invite friends to help plan this trip.
            </DialogDescription>
          </DialogHeader>

          <CollaboratorSelector
            itineraryId={itinerary.id}
            collaborators={collaborators}
            isOwner={isOwner ?? false}
            onCollaboratorAdded={handleCollaboratorAdded}
            onCollaboratorRemoved={handleCollaboratorRemoved}
            onRoleChanged={handleRoleChanged}
            className="py-4"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{itinerary.title}&quot;? This action cannot
              be undone and will remove all places and collaborators.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Item row component
function ItemRow({
  item,
  canEdit,
  removing,
  onRemove,
}: {
  item: ItineraryItem;
  canEdit: boolean;
  removing: boolean;
  onRemove: () => void;
}) {
  const icon = categoryIcons[item.category];
  const label = categoryLabels[item.category];

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 group">
      <span className="text-xl flex-shrink-0">{icon}</span>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.place_name}</p>
        <p className="text-xs text-slate-500">{label}</p>
        {item.notes && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            {item.notes}
          </p>
        )}
      </div>

      {canEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-slate-400 hover:text-red-500"
          onClick={onRemove}
          disabled={removing}
        >
          {removing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
}
