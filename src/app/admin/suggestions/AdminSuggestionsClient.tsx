'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { categoryLabels, ALL_CATEGORIES, Category } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Rocket,
  Trash2,
  MapPin,
  Loader2,
  ThumbsUp,
  Mail,
  Calendar,
  Link as LinkIcon,
} from 'lucide-react';

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

const statusConfig: Record<SuggestionStatus, { variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info'; icon: typeof Clock; label: string }> = {
  pending: { variant: 'secondary', icon: Clock, label: 'Pending' },
  approved: { variant: 'info', icon: CheckCircle, label: 'Approved' },
  rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
  implemented: { variant: 'success', icon: Rocket, label: 'Implemented' },
};

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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Suggestions</h1>
        <p className="text-muted-foreground">
          Review and manage category suggestions from users.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {/* Status Filter Tabs */}
      <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({statusCounts.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
          <TabsTrigger value="implemented">Implemented ({statusCounts.implemented})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Suggestions List */}
      {filteredSuggestions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-muted-foreground">
              No suggestions found{filterStatus !== 'all' ? ` with status "${filterStatus}"` : ''}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => {
            const config = statusConfig[suggestion.status];
            const StatusIcon = config.icon;

            return (
              <Card key={suggestion.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                        <Badge variant={config.variant}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {suggestion.vote_count} vote{suggestion.vote_count !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(suggestion.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>

                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={updating === suggestion.id}>
                          {updating === suggestion.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => updateStatus(suggestion.id, 'pending')}
                          disabled={suggestion.status === 'pending'}
                        >
                          <Clock className="mr-2 h-4 w-4" /> Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(suggestion.id, 'approved')}
                          disabled={suggestion.status === 'approved'}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Approved
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(suggestion.id, 'rejected')}
                          disabled={suggestion.status === 'rejected'}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Rejected
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(suggestion.id, 'implemented')}
                          disabled={suggestion.status === 'implemented'}
                        >
                          <Rocket className="mr-2 h-4 w-4" /> Implemented
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {(suggestion.status === 'approved' || suggestion.status === 'pending') && (
                          <DropdownMenuItem onClick={() => openConvertModal(suggestion)}>
                            <MapPin className="mr-2 h-4 w-4" /> Convert to Place
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => setSuggestionToDelete(suggestion)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {suggestion.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description}
                    </p>
                  )}

                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    {suggestion.example_places && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">
                          <span className="font-medium">Examples:</span> {suggestion.example_places}
                        </span>
                      </div>
                    )}
                    {suggestion.data_source && (
                      <div className="flex items-start gap-2">
                        <LinkIcon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">
                          <span className="font-medium">Source:</span> {suggestion.data_source}
                        </span>
                      </div>
                    )}
                    {suggestion.submitter_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                        <a href={`mailto:${suggestion.submitter_email}`} className="text-primary hover:underline">
                          {suggestion.submitter_email}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!suggestionToDelete} onOpenChange={(open) => !open && setSuggestionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Suggestion?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{suggestionToDelete?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteSuggestion}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Convert to Place Dialog */}
      <Dialog open={!!suggestionToConvert} onOpenChange={(open) => !open && setSuggestionToConvert(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Convert to Place</DialogTitle>
            <DialogDescription>
              Create a new place entry from &quot;{suggestionToConvert?.title}&quot;. This will mark the suggestion as implemented.
            </DialogDescription>
          </DialogHeader>

          {convertError && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {convertError}
            </div>
          )}

          {/* Source Info */}
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-1">Original Suggestion:</p>
            <p className="text-muted-foreground">{suggestionToConvert?.description}</p>
            {suggestionToConvert?.example_places && (
              <p className="text-xs text-muted-foreground mt-1">
                Examples: {suggestionToConvert.example_places}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Category *</Label>
              <Select
                value={convertForm.category}
                onValueChange={(value) => setConvertForm(prev => ({ ...prev, category: value as Category }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Name *</Label>
              <Input
                value={convertForm.name}
                onChange={(e) => setConvertForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Place name"
              />
            </div>

            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                value={convertForm.lat}
                onChange={(e) => setConvertForm(prev => ({ ...prev, lat: e.target.value }))}
                placeholder="e.g., 37.7749"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                value={convertForm.lng}
                onChange={(e) => setConvertForm(prev => ({ ...prev, lng: e.target.value }))}
                placeholder="e.g., -122.4194"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>State/Region</Label>
              <Input
                value={convertForm.state}
                onChange={(e) => setConvertForm(prev => ({ ...prev, state: e.target.value }))}
                placeholder="e.g., California"
              />
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <Input
                value={convertForm.country}
                onChange={(e) => setConvertForm(prev => ({ ...prev, country: e.target.value }))}
                placeholder="e.g., United States"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Website URL</Label>
              <Input
                type="url"
                value={convertForm.website}
                onChange={(e) => setConvertForm(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea
                value={convertForm.description}
                onChange={(e) => setConvertForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the place..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSuggestionToConvert(null)} disabled={converting}>
              Cancel
            </Button>
            <Button onClick={handleConvert} disabled={converting || !convertForm.category || !convertForm.name}>
              {converting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <MapPin className="mr-2 h-4 w-4" />
              Create Place
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
