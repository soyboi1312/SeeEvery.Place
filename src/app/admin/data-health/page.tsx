'use client';

import { useState, useEffect, useMemo } from 'react';
import { categoryLabels, ALL_CATEGORIES, Category } from '@/lib/types';

interface PlaceData {
  id: string;
  name: string;
  category: Category;
  lat?: number;
  lng?: number;
  website?: string;
  state?: string;
  country?: string;
  region?: string;
}

interface ValidationIssue {
  type: 'duplicate_id' | 'missing_coords' | 'invalid_url' | 'missing_name';
  category: Category;
  id: string;
  name: string;
  details: string;
}

type Tab = 'browser' | 'validation';

export default function DataHealthPage() {
  const [activeTab, setActiveTab] = useState<Tab>('browser');
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [validating, setValidating] = useState(false);

  // Load all data on mount
  useEffect(() => {
    async function loadAllData() {
      setLoading(true);
      const allPlaces: PlaceData[] = [];

      try {
        // Load each category dynamically
        for (const category of ALL_CATEGORIES) {
          try {
            const data = await loadCategoryData(category);
            const transformed = data.map(item => transformItem(item, category));
            allPlaces.push(...transformed);
          } catch (err) {
            console.error(`Failed to load ${category}:`, err);
          }
        }

        setPlaces(allPlaces);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transformItem(item: any, category: Category): PlaceData {
    return {
      id: item.id || item.code || '',
      name: item.name || '',
      category,
      lat: item.lat,
      lng: item.lng,
      website: item.website,
      state: item.state,
      country: item.country,
      region: item.region || item.continent,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function loadCategoryData(category: Category): Promise<any[]> {
    switch (category) {
      case 'countries':
        return (await import('@/data/countries')).countries;
      case 'states':
        return (await import('@/data/usStates')).usStates;
      case 'nationalParks':
        return (await import('@/data/nationalParks')).nationalParks;
      case 'nationalMonuments':
        return (await import('@/data/nationalMonuments')).nationalMonuments;
      case 'stateParks':
        return (await import('@/data/stateParks')).stateParks;
      case 'fiveKPeaks':
        return (await import('@/data/mountains')).get5000mPeaks();
      case 'fourteeners':
        return (await import('@/data/mountains')).getUS14ers();
      case 'museums':
        return (await import('@/data/museums')).museums;
      case 'mlbStadiums':
        return (await import('@/data/stadiums')).getMlbStadiums();
      case 'nflStadiums':
        return (await import('@/data/stadiums')).getNflStadiums();
      case 'nbaStadiums':
        return (await import('@/data/stadiums')).getNbaStadiums();
      case 'nhlStadiums':
        return (await import('@/data/stadiums')).getNhlStadiums();
      case 'soccerStadiums':
        return (await import('@/data/stadiums')).getSoccerStadiums();
      case 'f1Tracks':
        return (await import('@/data/f1Tracks')).f1Tracks;
      case 'marathons':
        return (await import('@/data/marathons')).marathons;
      case 'airports':
        return (await import('@/data/airports')).airports;
      case 'skiResorts':
        return (await import('@/data/skiResorts')).skiResorts;
      case 'themeParks':
        return (await import('@/data/themeParks')).themeParks;
      case 'surfingReserves':
        return (await import('@/data/surfingReserves')).surfingReserves;
      case 'weirdAmericana':
        return (await import('@/data/weirdAmericana')).weirdAmericana;
      default:
        return [];
    }
  }

  // Run validation
  const runValidation = async () => {
    setValidating(true);
    const issues: ValidationIssue[] = [];

    // Check for duplicate IDs across all categories
    const idMap = new Map<string, { category: Category; name: string }[]>();
    for (const place of places) {
      const existing = idMap.get(place.id) || [];
      existing.push({ category: place.category, name: place.name });
      idMap.set(place.id, existing);
    }

    for (const [id, entries] of idMap) {
      if (entries.length > 1) {
        for (const entry of entries) {
          issues.push({
            type: 'duplicate_id',
            category: entry.category,
            id,
            name: entry.name,
            details: `ID "${id}" appears in ${entries.length} places: ${entries.map(e => categoryLabels[e.category]).join(', ')}`,
          });
        }
      }
    }

    // Check for missing coordinates and invalid URLs
    for (const place of places) {
      // Missing name
      if (!place.name || place.name.trim() === '') {
        issues.push({
          type: 'missing_name',
          category: place.category,
          id: place.id,
          name: '(empty name)',
          details: `Place has no name defined`,
        });
      }

      // Missing coordinates (skip countries and states which might not have coords)
      if (place.category !== 'countries' && place.category !== 'states') {
        if (place.lat === undefined || place.lng === undefined ||
            isNaN(place.lat) || isNaN(place.lng)) {
          issues.push({
            type: 'missing_coords',
            category: place.category,
            id: place.id,
            name: place.name,
            details: `Missing or invalid coordinates (lat: ${place.lat}, lng: ${place.lng})`,
          });
        }
      }

      // Invalid URL
      if (place.website) {
        try {
          new URL(place.website);
        } catch {
          issues.push({
            type: 'invalid_url',
            category: place.category,
            id: place.id,
            name: place.name,
            details: `Invalid URL: "${place.website}"`,
          });
        }
      }
    }

    setValidationIssues(issues);
    setValidating(false);
  };

  // Filtered and sorted places
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch = searchTerm === '' ||
        place.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [places, searchTerm, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: places.length };
    for (const category of ALL_CATEGORIES) {
      counts[category] = places.filter(p => p.category === category).length;
    }
    return counts;
  }, [places]);

  // Issue counts by type
  const issueCounts = useMemo(() => {
    return {
      duplicate_id: validationIssues.filter(i => i.type === 'duplicate_id').length,
      missing_coords: validationIssues.filter(i => i.type === 'missing_coords').length,
      invalid_url: validationIssues.filter(i => i.type === 'invalid_url').length,
      missing_name: validationIssues.filter(i => i.type === 'missing_name').length,
    };
  }, [validationIssues]);

  const issueTypeLabels: Record<ValidationIssue['type'], { label: string; color: string }> = {
    duplicate_id: { label: 'Duplicate ID', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    missing_coords: { label: 'Missing Coordinates', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    invalid_url: { label: 'Invalid URL', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
    missing_name: { label: 'Missing Name', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">Data Health</h1>
          <p className="text-primary-600 dark:text-primary-300">
            Browse all places and validate data integrity across {places.length.toLocaleString()} entries.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('browser')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'browser'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-slate-600'
            }`}
          >
            Place Browser
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'validation'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-slate-600'
            }`}
          >
            Validation
            {validationIssues.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">
                {validationIssues.length}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
          </div>
        ) : (
          <>
            {/* Place Browser Tab */}
            {activeTab === 'browser' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search by ID or name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                        className="w-full sm:w-auto px-4 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="all">All Categories ({categoryCounts.all})</option>
                        {ALL_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>
                            {categoryLabels[cat]} ({categoryCounts[cat] || 0})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-black/5 dark:border-white/10">
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Showing {filteredPlaces.length.toLocaleString()} of {places.length.toLocaleString()} places
                    </p>
                  </div>
                  <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-primary-50 dark:bg-slate-700/50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                            Coordinates
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary-100 dark:divide-slate-700">
                        {filteredPlaces.slice(0, 500).map((place, idx) => (
                          <tr key={`${place.category}-${place.id}-${idx}`} className="hover:bg-primary-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-4 py-3">
                              <code className="text-xs bg-primary-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-primary-700 dark:text-primary-300">
                                {place.id}
                              </code>
                            </td>
                            <td className="px-4 py-3 text-sm text-primary-900 dark:text-white">
                              {place.name}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300">
                                {categoryLabels[place.category]}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-primary-600 dark:text-primary-400">
                              {place.state || place.country || place.region || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-primary-500 dark:text-primary-400">
                              {place.lat !== undefined && place.lng !== undefined
                                ? `${place.lat.toFixed(2)}, ${place.lng.toFixed(2)}`
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredPlaces.length > 500 && (
                      <div className="p-4 text-center text-sm text-primary-500 dark:text-primary-400 border-t border-primary-100 dark:border-slate-700">
                        Showing first 500 results. Use search to narrow down.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Validation Tab */}
            {activeTab === 'validation' && (
              <div className="space-y-6">
                {/* Run Validation Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-600 dark:text-primary-300">
                      {validationIssues.length === 0
                        ? 'Run validation to check for data issues.'
                        : `Found ${validationIssues.length} issue${validationIssues.length !== 1 ? 's' : ''}.`}
                    </p>
                  </div>
                  <button
                    onClick={runValidation}
                    disabled={validating}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {validating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Validating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Run Validation
                      </>
                    )}
                  </button>
                </div>

                {/* Issue Summary Cards */}
                {validationIssues.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl ${issueTypeLabels.duplicate_id.color}`}>
                      <p className="text-2xl font-bold">{issueCounts.duplicate_id}</p>
                      <p className="text-sm">Duplicate IDs</p>
                    </div>
                    <div className={`p-4 rounded-xl ${issueTypeLabels.missing_coords.color}`}>
                      <p className="text-2xl font-bold">{issueCounts.missing_coords}</p>
                      <p className="text-sm">Missing Coords</p>
                    </div>
                    <div className={`p-4 rounded-xl ${issueTypeLabels.invalid_url.color}`}>
                      <p className="text-2xl font-bold">{issueCounts.invalid_url}</p>
                      <p className="text-sm">Invalid URLs</p>
                    </div>
                    <div className={`p-4 rounded-xl ${issueTypeLabels.missing_name.color}`}>
                      <p className="text-2xl font-bold">{issueCounts.missing_name}</p>
                      <p className="text-sm">Missing Names</p>
                    </div>
                  </div>
                )}

                {/* Issues List */}
                {validationIssues.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
                    <div className="max-h-[500px] overflow-y-auto divide-y divide-primary-100 dark:divide-slate-700">
                      {validationIssues.map((issue, idx) => (
                        <div key={idx} className="p-4 hover:bg-primary-50 dark:hover:bg-slate-700/30 transition-colors">
                          <div className="flex items-start gap-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${issueTypeLabels[issue.type].color}`}>
                              {issueTypeLabels[issue.type].label}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary-900 dark:text-white">
                                {issue.name}
                                <code className="ml-2 text-xs bg-primary-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-primary-600 dark:text-primary-400">
                                  {issue.id}
                                </code>
                              </p>
                              <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                                {categoryLabels[issue.category]} - {issue.details}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationIssues.length === 0 && !validating && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-primary-600 dark:text-primary-300">
                      Click &ldquo;Run Validation&rdquo; to check for data integrity issues.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
    </div>
  );
}
