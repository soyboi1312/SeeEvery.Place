'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import AuthModal from '@/components/AuthModal';
import { suggestionSchema, type SuggestionFormInput, type SuggestionFormData, toDbFormat } from '@/lib/validations/suggestion';

interface Suggestion {
  id: string;
  title: string;
  description: string | null;
  example_places: string | null;
  data_source: string | null;
  status: 'pending' | 'approved' | 'implemented';
  vote_count: number;
  created_at: string;
}

export default function SuggestPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SuggestionFormInput, unknown, SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      title: '',
      description: '',
      examplePlaces: '',
      dataSource: '',
      email: '',
    },
  });

  // Create supabase client only on client side
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createClient();
  }, []);

  useEffect(() => {
    if (supabase) {
      setSupabaseReady(true);
    }
  }, [supabase]);

  const loadSuggestions = useCallback(async () => {
    if (!supabase) return;
    try {
      // Limit to top 100 suggestions to prevent performance issues at scale
      // Sorted by vote_count so users always see the most popular first
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('vote_count', { ascending: false })
        .limit(100);

      if (error) throw error;
      setSuggestions(data || []);
    } catch {
      console.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const loadVotes = useCallback(async () => {
    if (!supabase || !user) return;
    try {
      const { data } = await supabase
        .from('suggestion_votes')
        .select('suggestion_id')
        .eq('voter_id', user.id);

      if (data) {
        setVotedIds(new Set(data.map(v => v.suggestion_id)));
      }
    } catch {
      // Ignore errors for votes
    }
  }, [supabase, user]);

  useEffect(() => {
    if (supabaseReady) {
      loadSuggestions();
      loadVotes();
    }
  }, [supabaseReady, loadSuggestions, loadVotes]);

  const onSubmit = async (data: SuggestionFormData) => {
  if (!supabase) return;
  setSubmitError(null);

  try {
    const { error } = await supabase
      .from('suggestions')
      .insert(toDbFormat(data));

    if (error) throw error;

    setSubmitted(true);
    reset();

    // Reload suggestions to show the new one
    loadSuggestions();
  } catch (err) {
    setSubmitError(err instanceof Error ? err.message : 'Failed to submit suggestion');
  }
};

  const handleVote = async (suggestionId: string) => {
    if (!supabase) return;

    // Require authentication for voting
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const hasVoted = votedIds.has(suggestionId);

    try {
      if (hasVoted) {
        // Remove vote
        await supabase
          .from('suggestion_votes')
          .delete()
          .eq('suggestion_id', suggestionId)
          .eq('voter_id', user.id);

        setVotedIds(prev => {
          const next = new Set(prev);
          next.delete(suggestionId);
          return next;
        });
        setSuggestions(prev =>
          prev.map(s => s.id === suggestionId ? { ...s, vote_count: s.vote_count - 1 } : s)
        );
      } else {
        // Add vote
        await supabase
          .from('suggestion_votes')
          .insert({ suggestion_id: suggestionId, voter_id: user.id });

        setVotedIds(prev => new Set(prev).add(suggestionId));
        setSuggestions(prev =>
          prev.map(s => s.id === suggestionId ? { ...s, vote_count: s.vote_count + 1 } : s)
        );
      }
    } catch {
      // Ignore vote errors (likely duplicate)
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented':
        return <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">Implemented</span>;
      case 'approved':
        return <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">Approved</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">Under Review</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super">™</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
            >
              Start Mapping
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-4">Suggest a Category</h1>
          <p className="text-xl text-primary-600 dark:text-primary-300 max-w-2xl mx-auto">
            Have an idea for a new travel category? Submit your suggestion and vote for others.
            Categories with the most votes get prioritized!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submission Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-premium border border-black/5 dark:border-white/10">
            <h2 className="text-xl font-bold text-primary-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">💡</span> Submit New Category
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-2">Thank You!</h3>
                <p className="text-primary-600 dark:text-primary-300 mb-4">
                  Your suggestion has been submitted and is now visible for voting.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary-700 dark:text-primary-400 hover:underline font-medium"
                >
                  Submit another suggestion
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title')}
                    placeholder="e.g., Lighthouses, Breweries, Botanical Gardens"
                    maxLength={100}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.title
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register('description')}
                    placeholder="Why would this category be interesting for travelers?"
                    rows={3}
                    maxLength={500}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.description
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors resize-none`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="examplePlaces" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Example Places
                  </label>
                  <input
                    type="text"
                    id="examplePlaces"
                    {...register('examplePlaces')}
                    placeholder="e.g., Cape Hatteras, Portland Head Light, Point Reyes"
                    maxLength={300}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.examplePlaces
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                  />
                  {errors.examplePlaces && (
                    <p className="mt-1 text-sm text-red-500">{errors.examplePlaces.message}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    List a few notable examples that should be included
                  </p>
                </div>

                <div>
                  <label htmlFor="dataSource" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Source (optional)
                  </label>
                  <input
                    type="text"
                    id="dataSource"
                    {...register('dataSource')}
                    placeholder="e.g., Wikipedia list, official registry, API"
                    maxLength={200}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.dataSource
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                  />
                  {errors.dataSource && (
                    <p className="mt-1 text-sm text-red-500">{errors.dataSource.message}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Know where we can find a complete list with coordinates?
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    placeholder="your@email.com"
                    maxLength={100}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    We&apos;ll notify you when your category is implemented
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                </button>
              </form>
            )}
          </div>

          {/* Suggestions List */}
          <div>
            <h2 className="text-xl font-bold text-primary-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🗳️</span> Vote for Categories
            </h2>

            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Loading suggestions...
              </div>
            ) : suggestions.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-premium border border-black/5 dark:border-white/10 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-primary-600 dark:text-primary-300">
                  No suggestions yet. Be the first to suggest a category!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-premium border border-black/5 dark:border-white/10 flex gap-4"
                  >
                    {/* Vote Button */}
                    <button
                      onClick={() => handleVote(suggestion.id)}
                      className={`flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg transition-colors ${
                        votedIds.has(suggestion.id)
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      aria-label={`${votedIds.has(suggestion.id) ? 'Remove vote from' : 'Vote for'} ${suggestion.title}. Current votes: ${suggestion.vote_count}`}
                      aria-pressed={votedIds.has(suggestion.id)}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${votedIds.has(suggestion.id) ? 'scale-110' : ''}`}
                        fill={votedIds.has(suggestion.id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="font-bold text-lg">{suggestion.vote_count}</span>
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-primary-900 dark:text-white truncate">
                          {suggestion.title}
                        </h3>
                        {getStatusBadge(suggestion.status)}
                      </div>
                      {suggestion.description && (
                        <p className="text-sm text-primary-600 dark:text-primary-300 line-clamp-2">
                          {suggestion.description}
                        </p>
                      )}
                      {suggestion.example_places && (
                        <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                          Examples: {suggestion.example_places}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-primary-500 dark:text-primary-400 mt-4 text-center">
              {user ? (
                'Click the arrow to vote. You can change your vote anytime.'
              ) : (
                <>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-primary-700 dark:text-primary-300 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                  {' '}to vote for suggestions.
                </>
              )}
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800">
          <h2 className="text-xl font-bold text-primary-900 dark:text-white mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-bold text-primary-900 dark:text-white mb-2">Suggest</h3>
              <p className="text-sm text-primary-600 dark:text-primary-300">
                Submit your category idea with examples and any data sources you know of.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-bold text-primary-900 dark:text-white mb-2">Vote</h3>
              <p className="text-sm text-primary-600 dark:text-primary-300">
                Vote for suggestions you&apos;d like to see. The most popular rise to the top.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-bold text-primary-900 dark:text-white mb-2">Track</h3>
              <p className="text-sm text-primary-600 dark:text-primary-300">
                High-vote categories get implemented. Start tracking your new adventures!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">About</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors font-medium text-primary-700 dark:text-primary-400">Suggest</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
