'use client';

import { useState, useEffect, useCallback } from 'react';
import { Itinerary, Category, categoryLabels, categoryIcons } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Loader2,
  MapPin,
  Check,
} from 'lucide-react';

interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  placeId: string;
  placeName: string;
  onSuccess?: () => void;
}

export default function AddToTripModal({
  isOpen,
  onClose,
  category,
  placeId,
  placeName,
  onSuccess,
}: AddToTripModalProps) {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [addedTo, setAddedTo] = useState<Set<string>>(new Set());

  // New list form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch user's itineraries
  const fetchItineraries = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/itineraries');
      if (response.ok) {
        const data = await response.json();
        setItineraries(data.itineraries || []);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchItineraries();
      setAddedTo(new Set());
      setActiveTab('existing');
    }
  }, [isOpen, fetchItineraries]);

  // Add to existing itinerary
  const handleAddToItinerary = async (itineraryId: string) => {
    if (addedTo.has(itineraryId)) return;

    setIsAdding(itineraryId);
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
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error adding to itinerary:', error);
    } finally {
      setIsAdding(null);
    }
  };

  // Create new itinerary and add place
  const handleCreateAndAdd = async () => {
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      // Create the itinerary
      const createResponse = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || undefined,
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create itinerary');
      }

      const { itinerary } = await createResponse.json();

      // Add the place to the new itinerary
      const addResponse = await fetch(`/api/itineraries/${itinerary.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          place_id: placeId,
          place_name: placeName,
        }),
      });

      if (addResponse.ok) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Error creating itinerary:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Add to List
          </DialogTitle>
          <DialogDescription>
            Add this place to an existing list or create a new one.
          </DialogDescription>
        </DialogHeader>

        {/* Place Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
            {categoryIcons[category]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{placeName}</div>
            <div className="text-sm text-muted-foreground">{categoryLabels[category]}</div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'existing' | 'new')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing List</TabsTrigger>
            <TabsTrigger value="new">New List</TabsTrigger>
          </TabsList>

          {/* Existing Trips Tab */}
          <TabsContent value="existing" className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : itineraries.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 text-3xl">
                  🗺️
                </div>
                <h3 className="font-semibold mb-1">No lists yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first list to start tracking!
                </p>
                <Button onClick={() => setActiveTab('new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create List
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {itineraries.map((itinerary) => {
                  const isAdded = addedTo.has(itinerary.id);
                  const isCurrentlyAdding = isAdding === itinerary.id;

                  return (
                    <div
                      key={itinerary.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isAdded
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{itinerary.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {itinerary.item_count || 0} places
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isAdded ? 'secondary' : 'default'}
                        onClick={() => handleAddToItinerary(itinerary.id)}
                        disabled={isCurrentlyAdding || isAdded}
                      >
                        {isCurrentlyAdding ? (
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
          </TabsContent>

          {/* New List Tab */}
          <TabsContent value="new" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="list-title">List Name *</Label>
              <Input
                id="list-title"
                placeholder="e.g., National Parks Quest, Stadiums to Visit"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="list-description">Description (optional)</Label>
              <Textarea
                id="list-description"
                placeholder="What's this list about?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                maxLength={500}
                className="resize-none h-20"
              />
            </div>

            <DialogFooter>
              <Button
                onClick={handleCreateAndAdd}
                disabled={!newTitle.trim() || isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create List & Add Place
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
