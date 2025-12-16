'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Itinerary, ItineraryItem, ItineraryCollaborator } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { ItineraryView } from '@/components/itineraries';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ tripId: string }>;
}

export default function TripDetailPage({ params }: PageProps) {
  const { tripId } = use(params);
  const router = useRouter();
  const { user, signOut, isAdmin, username } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [collaborators, setCollaborators] = useState<ItineraryCollaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItinerary = useCallback(async () => {
    try {
      const [itineraryRes, itemsRes, collaboratorsRes] = await Promise.all([
        fetch(`/api/itineraries/${tripId}`),
        fetch(`/api/itineraries/${tripId}/items`),
        fetch(`/api/itineraries/${tripId}/collaborators`),
      ]);

      if (!itineraryRes.ok) {
        if (itineraryRes.status === 404) {
          setError('List not found');
        } else {
          setError('Failed to load list');
        }
        return;
      }

      const itineraryData = await itineraryRes.json();
      const itemsData = await itemsRes.json();
      const collaboratorsData = await collaboratorsRes.json();

      setItinerary(itineraryData.itinerary);
      setItems(itemsData.items || []);
      setCollaborators(collaboratorsData.collaborators || []);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      setError('Failed to load list');
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchItinerary();
  }, [fetchItinerary]);

  const handleUpdateItinerary = async (data: Partial<Itinerary>) => {
    const response = await fetch(`/api/itineraries/${tripId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const { itinerary: updated } = await response.json();
      setItinerary((prev) => prev ? { ...prev, ...updated } : null);
    }
  };

  const handleDeleteItinerary = async () => {
    const response = await fetch(`/api/itineraries/${tripId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      router.push('/trips');
    }
  };

  const handleUpdateItem = async (
    itemId: string,
    data: { notes?: string; day_number?: number; sort_order?: number }
  ) => {
    const response = await fetch(`/api/itineraries/${tripId}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const { item: updated } = await response.json();
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, ...updated } : item))
      );
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const response = await fetch(`/api/itineraries/${tripId}/items/${itemId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const handleAddCollaborator = async (userId: string, role: 'editor' | 'viewer') => {
    const response = await fetch(`/api/itineraries/${tripId}/collaborators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });

    if (response.ok) {
      // Refetch collaborators to get full user info
      const collaboratorsRes = await fetch(`/api/itineraries/${tripId}/collaborators`);
      if (collaboratorsRes.ok) {
        const data = await collaboratorsRes.json();
        setCollaborators(data.collaborators || []);
      }
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    const response = await fetch(`/api/itineraries/${tripId}/collaborators`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      setCollaborators((prev) => prev.filter((c) => c.user_id !== userId));
    }
  };

  const handleUpdateCollaboratorRole = async (userId: string, role: 'editor' | 'viewer') => {
    const response = await fetch(`/api/itineraries/${tripId}/collaborators`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });

    if (response.ok) {
      setCollaborators((prev) =>
        prev.map((c) => (c.user_id === userId ? { ...c, role } : c))
      );
    }
  };

  if (isLoading) {
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
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  if (error || !itinerary) {
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
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6 text-4xl">
              🔍
            </div>
            <h1 className="text-2xl font-bold mb-2">{error || 'List not found'}</h1>
            <p className="text-muted-foreground mb-6">
              This list may have been deleted or you don&apos;t have access to it.
            </p>
            <Button asChild>
              <Link href="/trips">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lists
              </Link>
            </Button>
          </div>
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
        {/* Back Link */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2 -ml-2">
            <Link href="/trips">
              <ArrowLeft className="w-4 h-4" />
              All Lists
            </Link>
          </Button>
        </div>

        <ItineraryView
          itinerary={itinerary}
          items={items}
          collaborators={collaborators}
          currentUserId={user?.id}
          onUpdateItinerary={handleUpdateItinerary}
          onDeleteItinerary={handleDeleteItinerary}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onAddCollaborator={handleAddCollaborator}
          onRemoveCollaborator={handleRemoveCollaborator}
          onUpdateCollaboratorRole={handleUpdateCollaboratorRole}
        />
      </main>

      <Footer user={user} onSignIn={() => setShowAuthModal(true)} />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
