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
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function TripsPage() {
  const router = useRouter();
  const { user, signOut, isAdmin } = useAuth();
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

  // Group trips by year for timeline view
  const tripsByYear = useMemo(() => {
    const grouped: Record<string, Itinerary[]> = {};
    const now = new Date();

    itineraries.forEach((trip) => {
      // Use start_date if available, otherwise use created_at
      const dateStr = trip.start_date || trip.created_at;
      const date = dateStr ? new Date(dateStr) : now;
      const year = date.getFullYear().toString();

      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(trip);
    });

    // Sort years in descending order (most recent first)
    const sortedYears = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

    // Sort trips within each year by date (most recent first)
    sortedYears.forEach((year) => {
      grouped[year].sort((a, b) => {
        const dateA = new Date(a.start_date || a.created_at || 0);
        const dateB = new Date(b.start_date || b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      });
    });

    return { grouped, sortedYears };
  }, [itineraries]);

  // Calculate trip statistics
  const tripStats = useMemo(() => {
    const total = itineraries.length;
    const upcoming = itineraries.filter((t) => {
      if (!t.start_date) return false;
      return new Date(t.start_date) > new Date();
    }).length;
    const past = total - upcoming;
    const placesCount = itineraries.reduce((acc, t) => acc + (t.item_count || 0), 0);

    return { total, upcoming, past, placesCount };
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

        {/* Stats Summary */}
        {!isLoading && itineraries.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{tripStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Trips</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{tripStats.past}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{tripStats.upcoming}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{tripStats.placesCount}</div>
                <div className="text-sm text-muted-foreground">Places</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trips Timeline */}
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
              <h2 className="text-xl font-bold mb-2">Start Your Journey</h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first trip to start building your travel timeline. Every adventure adds to your story.
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />

            {/* Years and Trips */}
            <div className="space-y-8">
              {tripsByYear.sortedYears.map((year, yearIndex) => (
                <div key={year} className="relative">
                  {/* Year Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative z-10 w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                      <span className="text-xs sm:text-lg">{year}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{year}</h2>
                        <span className="text-sm text-muted-foreground">
                          {tripsByYear.grouped[year].length} {tripsByYear.grouped[year].length === 1 ? 'trip' : 'trips'}
                        </span>
                      </div>
                      {yearIndex === 0 && parseInt(year) === new Date().getFullYear() && (
                        <div className="flex items-center gap-1 text-sm text-purple-500">
                          <Sparkles className="w-3 h-3" />
                          <span>Current Year</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trips for this year */}
                  <div className="ml-12 sm:ml-20 space-y-4">
                    {tripsByYear.grouped[year].map((itinerary, tripIndex) => (
                      <div key={itinerary.id} className="relative">
                        {/* Connector dot */}
                        <div className="absolute -left-[2.15rem] sm:-left-[3.15rem] top-6 w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-800 border-2 border-purple-500" />

                        {/* Trip Card */}
                        <ItineraryCard
                          itinerary={itinerary}
                          showOwner={itinerary.owner_id !== user?.id}
                        />

                        {/* Gap indicator between trips */}
                        {tripIndex < tripsByYear.grouped[year].length - 1 && (
                          <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
                            {/* Could show time between trips here */}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Year gap indicator */}
                  {yearIndex < tripsByYear.sortedYears.length - 1 && (
                    <div className="ml-12 sm:ml-20 py-4 text-center">
                      <span className="text-xs text-muted-foreground/50 italic">
                        {parseInt(year) - parseInt(tripsByYear.sortedYears[yearIndex + 1])} year{parseInt(year) - parseInt(tripsByYear.sortedYears[yearIndex + 1]) > 1 ? 's' : ''} between
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* End of timeline marker */}
            <div className="flex items-center gap-4 mt-8">
              <div className="relative z-10 w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Your journey continues...</p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={() => setShowCreateDialog(true)}
                >
                  Plan your next adventure →
                </Button>
              </div>
            </div>
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
