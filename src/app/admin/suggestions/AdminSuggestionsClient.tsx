'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { categoryLabels, ALL_CATEGORIES, Category } from '@/lib/types';

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

interface ConvertForm {
  category: Category | '';
  name: string;
  lat: string;
  lng: string;
  website: string;
  state: string;
  country: string;
  description: string;
}

export default function AdminSuggestionsClient({ initialSuggestions }: AdminSuggestionsClientProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<SuggestionStatus | 'all'>('all');
  const [suggestionToDelete, setSuggestionToDelete] = useState<Suggestion | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Convert to Place state
  const [suggestionToConvert, setSuggestionToConvert] = useState<Suggestion | null>(null);
  const [convertForm, setConvertForm] = useState<ConvertForm>({
    category: '',
    name: '',
    lat: '',
    lng: '',
    website: '',
    state: '',
    country: '',
    description: '',
  });
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

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

  const openConvertModal = (suggestion: Suggestion) => {
    setSuggestionToConvert(suggestion);
    setConvertForm({
      category: '',
      name: suggestion.title,
      lat: '',
      lng: '',
      website: suggestion.data_source || '',
      state: '',
      country: '',
      description: suggestion.description || '',
    });
    setConvertError(null);
  };

  const handleConvert = async () => {
    if (!suggestionToConvert) return;
    if (!convertForm.category || !convertForm.name) {
      setConvertError('Category and name are required');
      return;
    }

    setConverting(true);
    setConvertError(null);

    try {
      const response = await fetch('/api/admin/custom-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: convertForm.category,
          name: convertForm.name,
          lat: convertForm.lat ? parseFloat(convertForm.lat) : null,
          lng: convertForm.lng ? parseFloat(convertForm.lng) : null,
          website: convertForm.website || null,
          state: convertForm.state || null,
          country: convertForm.country || null,
          description: convertForm.description || null,
          suggestionId: suggestionToConvert.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create place');
      }

      // Update the suggestion status locally
      setSuggestions(prev =>
        prev.map(s => s.id === suggestionToConvert.id ? { ...s, status: 'implemented' as const } : s)
      );

      setSuggestionToConvert(null);
    } catch (err) {
      setConvertError(err instanceof Error ? err.message : 'Failed to convert suggestion');
    } finally {
      setConverting(false);
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
                    {(suggestion.status === 'approved' || suggestion.status === 'pending') && (
                      <button
                        onClick={() => openConvertModal(suggestion)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Convert
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

      {/* Convert to Place Modal */}
      {suggestionToConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full p-6 my-8">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
              Convert to Place
            </h3>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              Create a new place entry from &quot;{suggestionToConvert.title}&quot;. This will mark the suggestion as implemented.
            </p>

            {convertError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {convertError}
              </div>
            )}

            {/* Source Suggestion Info */}
            <div className="mb-4 p-3 bg-primary-50 dark:bg-slate-700/50 rounded-lg text-sm">
              <p className="font-medium text-primary-700 dark:text-primary-300">Original Suggestion:</p>
              <p className="text-primary-600 dark:text-primary-400 mt-1">{suggestionToConvert.description}</p>
              {suggestionToConvert.example_places && (
                <p className="text-primary-500 dark:text-primary-400 mt-1 text-xs">
                  Examples: {suggestionToConvert.example_places}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Category *
                </label>
                <select
                  value={convertForm.category}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, category: e.target.value as Category }))}
                  className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a category...</option>
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={convertForm.name}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Place name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  value={convertForm.lat}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, lat: e.target.value }))}
                  className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  placeholder="e.g., 37.7749"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  value={convertForm.lng}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, lng: e.target.value }))}
                  className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  placeholder="e.g., -122.4194"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  State/Region
                </label>
                <input
                  type="text"
                  value={convertForm.state}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., California"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={convertForm.country}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., United States"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={convertForm.website}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Description
                </label>
                <textarea
                  value={convertForm.description}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Brief description of the place..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSuggestionToConvert(null)}
                disabled={converting}
                className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-100 dark:bg-slate-700 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConvert}
                disabled={converting || !convertForm.category || !convertForm.name}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {converting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Place...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Create Place
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
