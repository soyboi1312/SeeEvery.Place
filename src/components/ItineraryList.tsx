'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Loader2, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { ItineraryCard } from './ItineraryCard';
import { Itinerary, ItineraryStatus, CreateItineraryInput } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';

interface ItineraryListProps {
  userId?: string;
  showCreateButton?: boolean;
  className?: string;
  limit?: number;
}

const EMPTY_FORM: CreateItineraryInput = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  is_public: false,
  status: 'draft',
};

export function ItineraryList({
  userId,
  showCreateButton = false,
  className = '',
  limit = 20,
}: ItineraryListProps) {
  const { user: currentUser } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  // Create/Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);
  const [formData, setFormData] = useState<CreateItineraryInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItinerary, setDeletingItinerary] = useState<Itinerary | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?.id;

  const fetchItineraries = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: currentOffset.toString(),
      });
      if (userId) {
        params.set('userId', userId);
      }

      const response = await fetch(`/api/itineraries?${params}`);

      if (!response.ok) throw new Error('Failed to fetch itineraries');

      const data = await response.json();

      if (reset) {
        setItineraries(data.itineraries);
        setOffset(limit);
      } else {
        setItineraries(prev => [...prev, ...data.itineraries]);
        setOffset(prev => prev + limit);
      }

      setHasMore(data.pagination.hasMore);
    } catch {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, [userId, limit, offset]);

  useEffect(() => {
    fetchItineraries(true);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchItineraries(false);
    }
  };

  const openCreateDialog = () => {
    setEditingItinerary(null);
    setFormData(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (itinerary: Itinerary) => {
    setEditingItinerary(itinerary);
    setFormData({
      title: itinerary.title,
      description: itinerary.description || '',
      start_date: itinerary.start_date || '',
      end_date: itinerary.end_date || '',
      is_public: itinerary.is_public,
      status: itinerary.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;

    setSaving(true);
    try {
      if (editingItinerary) {
        // Update existing
        const response = await fetch(`/api/itineraries/${editingItinerary.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to update trip');

        const { itinerary } = await response.json();
        setItineraries(prev =>
          prev.map(i => (i.id === itinerary.id ? { ...i, ...itinerary } : i))
        );
      } else {
        // Create new
        const response = await fetch('/api/itineraries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to create trip');

        // Refetch to get the new itinerary with all fields
        fetchItineraries(true);
      }

      setDialogOpen(false);
      setFormData(EMPTY_FORM);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (itinerary: Itinerary) => {
    setDeletingItinerary(itinerary);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItinerary) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/itineraries/${deletingItinerary.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete trip');

      setItineraries(prev => prev.filter(i => i.id !== deletingItinerary.id));
      setDeleteDialogOpen(false);
      setDeletingItinerary(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && itineraries.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 text-slate-500 ${className}`}>
        <p>{error}</p>
        <Button variant="outline" onClick={() => fetchItineraries(true)} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Create button for own profile */}
      {showCreateButton && isOwnProfile && (
        <Button onClick={openCreateDialog} className="mb-4 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Trip
        </Button>
      )}

      {/* Empty state */}
      {itineraries.length === 0 ? (
        <div className="text-center py-12">
          <Map className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
            {isOwnProfile ? 'No trips yet' : 'No public trips'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
            {isOwnProfile
              ? 'Create your first trip to start planning your adventures!'
              : 'This user hasn\'t shared any trips yet.'}
          </p>
          {isOwnProfile && (
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Trip
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Itineraries grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itineraries.map(itinerary => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                showOwner={!isOwnProfile}
                onEdit={isOwnProfile ? openEditDialog : undefined}
                onDelete={isOwnProfile ? openDeleteDialog : undefined}
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Load More
            </Button>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItinerary ? 'Edit Trip' : 'Create Trip'}</DialogTitle>
            <DialogDescription>
              {editingItinerary
                ? 'Update your trip details below.'
                : 'Plan your next adventure. Add places and invite friends to collaborate.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Road Trip 2025"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What's this trip about?"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ItineraryStatus) =>
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
              <div className="space-y-0.5">
                <Label htmlFor="is_public">Make Public</Label>
                <p className="text-xs text-slate-500">
                  Allow anyone to view this trip
                </p>
              </div>
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, is_public: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !formData.title.trim()}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editingItinerary ? 'Save Changes' : 'Create Trip'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingItinerary?.title}&quot;? This action
              cannot be undone and will remove all places and collaborators from this trip.
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

export default ItineraryList;
