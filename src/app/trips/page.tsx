'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Sparkles,
  Target,
} from 'lucide-react';

export default function TripsPage() {
  const router = useRouter();
  const { user, signOut, isAdmin, username } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // New list form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Calculate list statistics
  const listStats = useMemo(() => {
    const total = itineraries.length;
    const placesCount = itineraries.reduce((acc, t) => acc + (t.item_count || 0), 0);
    const sharedCount = itineraries.filter((t) => (t.collaborator_count || 0) > 0).length;

    return { total, placesCount, sharedCount };
  }, [itineraries]);

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
              <h1 className="text-2xl font-bold mb-2">Track Your Quests</h1>
              <p className="text-muted-foreground mb-6">
                Create custom place lists to track your adventures. Share with friends and conquer them together.
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
            <h1 className="text-3xl font-bold text-foreground">My Lists</h1>
            <p className="text-muted-foreground mt-1">
              Create and track your place collections
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New List
          </Button>
        </div>

        {/* Stats Summary */}
        {!isLoading && itineraries.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{listStats.total}</div>
                <div className="text-sm text-muted-foreground">Lists</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{listStats.placesCount}</div>
                <div className="text-sm text-muted-foreground">Places</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{listStats.sharedCount}</div>
                <div className="text-sm text-muted-foreground">Shared</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lists Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : itineraries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-purple-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Start Your Quest</h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first list to start tracking places. Build a bucket list, plan a road trip route, or collect stadiums to visit.
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First List
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

      {/* Create List Dialog */}
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
              <Target className="w-5 h-5 text-primary" />
              Create New List
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
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
                  Create List
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
