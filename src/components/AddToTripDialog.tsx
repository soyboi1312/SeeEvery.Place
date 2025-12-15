'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2, Map, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Itinerary, Category } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';

interface AddToTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  placeId: string;
  placeName: string;
}

export function AddToTripDialog({
  open,
  onOpenChange,
  category,
  placeId,
  placeName,
}: AddToTripDialogProps) {
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [addedTo, setAddedTo] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchItineraries();
    }
  }, [open, user]);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/itineraries?limit=50');
      if (response.ok) {
        const data = await response.json();
        setItineraries(data.itineraries || []);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTrip = async (itineraryId: string) => {
    setAdding(itineraryId);
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          place_id: placeId,
          place_name: placeName,
        }),
      });

      if (response.ok) {
        setAddedTo(prev => new Set([...prev, itineraryId]));
      }
    } catch (error) {
      console.error('Error adding to trip:', error);
    } finally {
      setAdding(null);
    }
  };

  const handleCreateTrip = async () => {
    if (!newTripTitle.trim()) return;

    setCreating(true);
    try {
      // Create the trip
      const createResponse = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTripTitle.trim(),
          status: 'draft',
        }),
      });

      if (createResponse.ok) {
        const { itinerary } = await createResponse.json();

        // Add the place to the new trip
        await fetch(`/api/itineraries/${itinerary.id}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category,
            place_id: placeId,
            place_name: placeName,
          }),
        });

        // Refresh the list
        await fetchItineraries();
        setAddedTo(prev => new Set([...prev, itinerary.id]));
        setNewTripTitle('');
        setShowCreate(false);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Sign in Required</DialogTitle>
            <DialogDescription>
              Please sign in to add places to your trips.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add to Trip</DialogTitle>
          <DialogDescription>
            Add &quot;{placeName}&quot; to one of your trips.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : itineraries.length === 0 && !showCreate ? (
            <div className="text-center py-6">
              <Map className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 mb-4">
                You don&apos;t have any trips yet.
              </p>
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Trip
              </Button>
            </div>
          ) : (
            <>
              {/* Trip list */}
              {itineraries.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {itineraries.map(itinerary => {
                    const isAdded = addedTo.has(itinerary.id);
                    const isAdding = adding === itinerary.id;

                    return (
                      <div
                        key={itinerary.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {itinerary.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {itinerary.item_count || 0} places
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={isAdded ? 'outline' : 'default'}
                          onClick={() => handleAddToTrip(itinerary.id)}
                          disabled={isAdding || isAdded}
                          className={isAdded ? 'text-green-600 border-green-300' : ''}
                        >
                          {isAdding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isAdded ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Create new trip section */}
              {showCreate ? (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-2">
                    <Label htmlFor="new-trip-title">New Trip Name</Label>
                    <Input
                      id="new-trip-title"
                      placeholder="e.g., Summer Road Trip 2025"
                      value={newTripTitle}
                      onChange={e => setNewTripTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newTripTitle.trim()) {
                          handleCreateTrip();
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCreate(false);
                        setNewTripTitle('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateTrip}
                      disabled={creating || !newTripTitle.trim()}
                    >
                      {creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Create & Add
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Trip
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddToTripDialog;
