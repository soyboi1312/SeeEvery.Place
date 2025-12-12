'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { categoryLabels, ALL_CATEGORIES, Category } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, CheckCircle, AlertTriangle, XCircle, FileWarning, Pencil, Trash2, Loader2 } from 'lucide-react';

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
  hasOverride?: boolean;
}

interface PlaceOverride {
  id: string;
  category: string;
  place_id: string;
  overrides: {
    name?: string;
    lat?: number;
    lng?: number;
    website?: string;
    state?: string;
    country?: string;
    region?: string;
  };
  notes?: string;
  updated_by: string;
  updated_at: string;
}

interface ValidationIssue {
  type: 'duplicate_id' | 'missing_coords' | 'invalid_url' | 'missing_name';
  category: Category;
  id: string;
  name: string;
  details: string;
}

type Tab = 'browser' | 'validation' | 'overrides';

export default function DataHealthPage() {
  const [activeTab, setActiveTab] = useState<Tab>('browser');
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [validating, setValidating] = useState(false);

  // Overrides state
  const [overrides, setOverrides] = useState<PlaceOverride[]>([]);
  const [loadingOverrides, setLoadingOverrides] = useState(true);

  // Edit modal state
  const [editingPlace, setEditingPlace] = useState<PlaceData | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    lat: '',
    lng: '',
    website: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Delete confirmation state
  const [deleteOverride, setDeleteOverride] = useState<PlaceOverride | null>(null);

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

  // Load overrides
  useEffect(() => {
    async function loadOverrides() {
      setLoadingOverrides(true);
      try {
        const response = await fetch('/api/admin/places');
        if (response.ok) {
          const data = await response.json();
          setOverrides(data.overrides || []);
        }
      } catch (error) {
        console.error('Failed to load overrides:', error);
      } finally {
        setLoadingOverrides(false);
      }
    }
    loadOverrides();
  }, []);

  // Apply overrides to places
  const applyOverrides = useCallback((place: PlaceData): PlaceData => {
    const override = overrides.find(
      o => o.category === place.category && o.place_id === place.id
    );
    if (!override) return place;
    return {
      ...place,
      ...override.overrides,
      hasOverride: true,
    };
  }, [overrides]);

  // Open edit modal
  const handleEditPlace = (place: PlaceData) => {
    const override = overrides.find(
      o => o.category === place.category && o.place_id === place.id
    );
    setEditingPlace(place);
    setEditForm({
      name: override?.overrides.name || place.name,
      lat: (override?.overrides.lat ?? place.lat)?.toString() || '',
      lng: (override?.overrides.lng ?? place.lng)?.toString() || '',
      website: override?.overrides.website || place.website || '',
      notes: override?.notes || '',
    });
    setSaveError(null);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingPlace) return;
    setSaving(true);
    setSaveError(null);

    try {
      const overrideData: Record<string, string | number | undefined> = {};

      if (editForm.name !== editingPlace.name) {
        overrideData.name = editForm.name;
      }
      if (editForm.lat && parseFloat(editForm.lat) !== editingPlace.lat) {
        overrideData.lat = parseFloat(editForm.lat);
      }
      if (editForm.lng && parseFloat(editForm.lng) !== editingPlace.lng) {
        overrideData.lng = parseFloat(editForm.lng);
      }
      if (editForm.website !== (editingPlace.website || '')) {
        overrideData.website = editForm.website || undefined;
      }

      const response = await fetch('/api/admin/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: editingPlace.category,
          placeId: editingPlace.id,
          overrides: overrideData,
          notes: editForm.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      const data = await response.json();

      // Update local overrides
      setOverrides(prev => {
        const existing = prev.findIndex(
          o => o.category === editingPlace.category && o.place_id === editingPlace.id
        );
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = data.override;
          return updated;
        }
        return [...prev, data.override];
      });

      setEditingPlace(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Delete override
  const handleConfirmDeleteOverride = async () => {
    if (!deleteOverride) return;

    try {
      const response = await fetch('/api/admin/places', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: deleteOverride.category,
          placeId: deleteOverride.place_id,
        }),
      });

      if (response.ok) {
        setOverrides(prev => prev.filter(o => o.id !== deleteOverride.id));
      }
    } catch (error) {
      console.error('Failed to delete override:', error);
    } finally {
      setDeleteOverride(null);
    }
  };

  // Export issues to CSV
  const exportIssuesToCSV = () => {
    if (validationIssues.length === 0) return;

    const headers = ['Type', 'Category', 'ID', 'Name', 'Details'];
    const rows = validationIssues.map(issue => [
      issue.type,
      categoryLabels[issue.category],
      issue.id,
      issue.name,
      issue.details,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-issues-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  // Filtered and sorted places (with overrides applied)
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const placeWithOverride = applyOverrides(place);
      const matchesSearch = searchTerm === '' ||
        placeWithOverride.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        placeWithOverride.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || placeWithOverride.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).map(applyOverrides);
  }, [places, searchTerm, selectedCategory, applyOverrides]);

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

  const issueTypeConfig: Record<ValidationIssue['type'], { label: string; variant: 'destructive' | 'warning' | 'secondary' }> = {
    duplicate_id: { label: 'Duplicate ID', variant: 'destructive' },
    missing_coords: { label: 'Missing Coordinates', variant: 'warning' },
    invalid_url: { label: 'Invalid URL', variant: 'warning' },
    missing_name: { label: 'Missing Name', variant: 'secondary' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Data Health</h1>
        <p className="text-muted-foreground">
          Browse all places and validate data integrity across {places.length.toLocaleString()} entries.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="mb-6">
        <TabsList>
          <TabsTrigger value="browser">Place Browser</TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            Validation
            {validationIssues.length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                {validationIssues.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="overrides" className="flex items-center gap-2">
            Overrides
            {overrides.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {overrides.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Place Browser Tab */}
          {activeTab === 'browser' && (
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by ID or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => setSelectedCategory(value as Category | 'all')}
                    >
                      <SelectTrigger className="w-full sm:w-[250px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories ({categoryCounts.all})</SelectItem>
                        {ALL_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {categoryLabels[cat]} ({categoryCounts[cat] || 0})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>
                    Showing {filteredPlaces.length.toLocaleString()} of {places.length.toLocaleString()} places
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Coordinates</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPlaces.slice(0, 500).map((place, idx) => (
                          <TableRow
                            key={`${place.category}-${place.id}-${idx}`}
                            className={place.hasOverride ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                          >
                            <TableCell>
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                {place.id}
                              </code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {place.name}
                                {place.hasOverride && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5">
                                    modified
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{categoryLabels[place.category]}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {place.state || place.country || place.region || '-'}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {place.lat !== undefined && place.lng !== undefined
                                ? `${place.lat.toFixed(2)}, ${place.lng.toFixed(2)}`
                                : '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditPlace(place)}
                                title="Edit place"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredPlaces.length > 500 && (
                      <div className="p-4 text-center text-sm text-muted-foreground border-t">
                        Showing first 500 results. Use search to narrow down.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Validation Tab */}
          {activeTab === 'validation' && (
            <div className="space-y-6">
              {/* Run Validation Button */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-muted-foreground">
                  {validationIssues.length === 0
                    ? 'Run validation to check for data issues.'
                    : `Found ${validationIssues.length} issue${validationIssues.length !== 1 ? 's' : ''}.`}
                </p>
                <div className="flex gap-2">
                  {validationIssues.length > 0 && (
                    <Button variant="outline" onClick={exportIssuesToCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                  <Button onClick={runValidation} disabled={validating}>
                    {validating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Run Validation
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Issue Summary Cards */}
              {validationIssues.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-red-700 dark:text-red-300">Duplicate IDs</span>
                      </div>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300">{issueCounts.duplicate_id}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm text-amber-700 dark:text-amber-300">Missing Coords</span>
                      </div>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{issueCounts.missing_coords}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm text-orange-700 dark:text-orange-300">Invalid URLs</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{issueCounts.invalid_url}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FileWarning className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm text-purple-700 dark:text-purple-300">Missing Names</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{issueCounts.missing_name}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Issues List */}
              {validationIssues.length > 0 && (
                <Card>
                  <CardContent className="p-0">
                    <div className="max-h-[500px] overflow-y-auto divide-y">
                      {validationIssues.map((issue, idx) => (
                        <div key={idx} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <Badge variant={issueTypeConfig[issue.type].variant}>
                              {issueTypeConfig[issue.type].label}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">
                                {issue.name}
                                <code className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                  {issue.id}
                                </code>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {categoryLabels[issue.category]} - {issue.details}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {validationIssues.length === 0 && !validating && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-muted-foreground">
                      Click &ldquo;Run Validation&rdquo; to check for data integrity issues.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Overrides Tab */}
          {activeTab === 'overrides' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Overrides</CardTitle>
                  <CardDescription>
                    Custom edits applied to static place data. Overrides are stored in the database and merged with source data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingOverrides ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : overrides.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Pencil className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p>No overrides yet. Edit a place in the Place Browser to create an override.</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {overrides.map((override) => (
                        <div key={override.id} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                  {override.place_id}
                                </code>
                                <Badge variant="outline">
                                  {categoryLabels[override.category as Category] || override.category}
                                </Badge>
                              </div>
                              <div className="mt-2 text-sm text-muted-foreground">
                                <p className="font-medium text-foreground">Changes:</p>
                                <ul className="list-disc list-inside ml-2 text-xs mt-1">
                                  {Object.entries(override.overrides).map(([key, value]) => (
                                    <li key={key}>
                                      <span className="font-medium">{key}:</span> {String(value)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {override.notes && (
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                  Note: {override.notes}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                Updated by {override.updated_by} on {new Date(override.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteOverride(override)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Remove override"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Edit Place Dialog */}
      <Dialog open={!!editingPlace} onOpenChange={(open) => !open && setEditingPlace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Place</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  {editingPlace?.id}
                </code>
                <Badge variant="outline">
                  {editingPlace && categoryLabels[editingPlace.category]}
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>

          {saveError && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {saveError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Place name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-lat">Latitude</Label>
                <Input
                  id="edit-lat"
                  value={editForm.lat}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lat: e.target.value }))}
                  placeholder="e.g., 37.7749"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="edit-lng">Longitude</Label>
                <Input
                  id="edit-lng"
                  value={editForm.lng}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lng: e.target.value }))}
                  placeholder="e.g., -122.4194"
                  className="font-mono"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-website">Website URL</Label>
              <Input
                id="edit-website"
                type="url"
                value={editForm.website}
                onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes (optional)</Label>
              <Textarea
                id="edit-notes"
                value={editForm.notes}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                placeholder="Why this change was made..."
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Changes are saved as overrides. Original source data remains unchanged.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlace(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Override'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Override Confirmation */}
      <AlertDialog open={!!deleteOverride} onOpenChange={(open) => !open && setDeleteOverride(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Override</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this override? The place will revert to its original data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteOverride} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
