'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { createClient } from '@/lib/supabase/client';

export interface Suggestion {
  id: string;
  title: string;
  description: string | null;
  example_places: string | null;
  data_source: string | null;
  submitter_email: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  vote_count: number;
  created_at: string;
  updated_at: string;
}

type SuggestionStatus = 'pending' | 'approved' | 'rejected' | 'implemented';

interface AdminSuggestionsClientProps {
  initialSuggestions: Suggestion[];
}

export default function AdminSuggestionsClient({ initialSuggestions }: AdminSuggestionsClientProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<SuggestionStatus | 'all'>('all');
  const [suggestionToDelete, setSuggestionToDelete] = useState<Suggestion | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Create supabase client only on client side for mutations
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createClient();
  }, []);

  const updateStatus = async (id: string, newStatus: SuggestionStatus) => {
    if (!supabase) return;
    setUpdating(id);
    setError(null);

    try {
      const { error } = await supabase
        .from('suggestions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setSuggestions(prev =>
        prev.map(s => s.id === id ? { ...s, status: newStatus } : s)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const deleteSuggestion = async () => {
    if (!supabase || !suggestionToDelete) return;
    setDeleting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('suggestions')
        .delete()
        .eq('id', suggestionToDelete.id);

      if (error) throw error;

      setSuggestions(prev => prev.filter(s => s.id !== suggestionToDelete.id));
      setSuggestionToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete suggestion');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'approved':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const filteredSuggestions = filterStatus === 'all'
    ? suggestions
    : suggestions.filter(s => s.status === filterStatus);

  const statusCounts = {
    all: suggestions.length,
    pending: suggestions.filter(s => s.status === 'pending').length,
    approved: suggestions.filter(s => s.status === 'approved').length,
    rejected: suggestions.filter(s => s.status === 'rejected').length,
    implemented: suggestions.filter(s => s.status === 'implemented').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super text-primary-400">TM</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase">
                Admin Panel
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
              href="/admin/analytics"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
            >
              Analytics
            </Link>
            <Link
              href="/suggest"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
            >
              View Public Page
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">Manage Suggestions</h1>
          <p className="text-primary-600 dark:text-primary-300">
            Review and update the status of category suggestions.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected', 'implemented'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>

        {/* Suggestions Table */}
        {filteredSuggestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-premium border border-black/5 dark:border-white/10 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-primary-600 dark:text-primary-300">
              No suggestions found{filterStatus !== 'all' ? ` with status "${filterStatus}"` : ''}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-premium border border-black/5 dark:border-white/10"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold text-lg text-primary-900 dark:text-white">
                        {suggestion.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(suggestion.status)}`}>
                        {suggestion.status}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {suggestion.vote_count} vote{suggestion.vote_count !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {suggestion.description && (
                      <p className="text-primary-600 dark:text-primary-300 mb-2">
                        {suggestion.description}
                      </p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      {suggestion.example_places && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Examples:</span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">{suggestion.example_places}</span>
                        </div>
                      )}
                      {suggestion.data_source && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Data Source:</span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">{suggestion.data_source}</span>
                        </div>
                      )}
                      {suggestion.submitter_email && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>{' '}
                          <a href={`mailto:${suggestion.submitter_email}`} className="text-primary-700 dark:text-primary-400 hover:underline">
                            {suggestion.submitter_email}
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Submitted:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(suggestion.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex flex-wrap lg:flex-col gap-2 lg:min-w-[140px]">
                    {(['pending', 'approved', 'rejected', 'implemented'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(suggestion.id, status)}
                        disabled={updating === suggestion.id || suggestion.status === status}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          suggestion.status === status
                            ? getStatusColor(status)
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {updating === suggestion.id ? '...' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                    <button
                      onClick={() => setSuggestionToDelete(suggestion)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <p>Admin Panel - See Every Place</p>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      {suggestionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
              Delete Suggestion
            </h3>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              Are you sure you want to delete &quot;{suggestionToDelete.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSuggestionToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-100 dark:bg-slate-700 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteSuggestion}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
