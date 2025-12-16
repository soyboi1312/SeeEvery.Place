'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Itinerary } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { ItineraryCard } from '@/components/itineraries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Loader2,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function TripsPage() {
  const router = useRouter();
  const { user, signOut, isAdmin, username } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // New trip form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchItineraries = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

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
  }, [user]);

  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  const handleCreateTrip = async () => {
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || undefined,
          start_date: newStartDate || undefined,
          end_date: newEndDate || undefined,
        }),
      });

      if (response.ok) {
        const { itinerary } = await response.json();
        router.push(`/trips/${itinerary.id}`);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewStartDate('');
    setNewEndDate('');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Header
          onSignIn={() => setShowAuthModal(true)}
          onSignOut={signOut}
          isSignedIn={false}
          username={username}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          isAdmin={isAdmin}
          syncStatus="idle"
        />

        <main className="flex-grow flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mx-auto mb-6 text-4xl">
                🗺️
              </div>
              <h1 className="text-2xl font-bold mb-2">Plan Your Adventures</h1>
              <p className="text-muted-foreground mb-6">
                Create collaborative trip itineraries, share with friends, and plan your next adventure together.
              </p>
              <Button onClick={() => setShowAuthModal(true)} size="lg">
                Sign in to Get Started
              </Button>
            </CardContent>
          </Card>
        </main>

        <Footer user={user} onSignIn={() => setShowAuthModal(true)} />

        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Header
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={signOut}
        isSignedIn={!!user}
        userEmail={user?.email}
        username={username}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAdmin={isAdmin}
        syncStatus="idle"
      />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-grow w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
            <p className="text-muted-foreground mt-1">
              Plan and organize your travel adventures
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Trip
          </Button>
        </div>

        {/* Trips List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : itineraries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mx-auto mb-6 text-4xl">
                🌍
              </div>
              <h2 className="text-xl font-bold mb-2">No trips yet</h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first trip to start planning your next adventure. Add places, invite friends, and share your itinerary.
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {itineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                showOwner={itinerary.owner_id !== user?.id}
              />
            ))}
          </div>
        )}
      </main>

      <Footer user={user} onSignIn={() => setShowAuthModal(true)} />

      {/* Create Trip Dialog */}
      <Dialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Create New Trip
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trip-title">Trip Name *</Label>
              <Input
                id="trip-title"
                placeholder="e.g., Summer 2025 Road Trip"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trip-description">Description (optional)</Label>
              <Textarea
                id="trip-description"
                placeholder="What's this trip about?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                maxLength={500}
                className="resize-none h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  min={newStartDate}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTrip} disabled={!newTitle.trim() || isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Trip
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
