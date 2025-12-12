'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Loader2, Moon, Sun, ChevronUp } from 'lucide-react';

import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import AuthModal from '@/components/AuthModal';
import InstallPWA from '@/components/InstallPWA';
import { suggestionSchema, type SuggestionFormInput, type SuggestionFormData, toDbFormat } from '@/lib/validations/suggestion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

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

type SortOption = 'popular' | 'newest';

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
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const form = useForm<SuggestionFormInput, unknown, SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      title: '',
      description: '',
      examplePlaces: '',
      dataSource: '',
      email: '',
    },
  });

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
      const orderColumn = sortBy === 'popular' ? 'vote_count' : 'created_at';
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order(orderColumn, { ascending: false })
        .limit(100);

      if (error) throw error;
      setSuggestions(data || []);
    } catch {
      console.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, [supabase, sortBy]);

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

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return suggestions;
    const query = searchQuery.toLowerCase();
    return suggestions.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.description?.toLowerCase().includes(query) ||
      s.example_places?.toLowerCase().includes(query)
    );
  }, [suggestions, searchQuery]);

  const onSubmit = async (data: SuggestionFormData) => {
    setSubmitError(null);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toDbFormat(data)),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit suggestion');

      setSubmitted(true);
      form.reset();
      loadSuggestions();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit suggestion');
    }
  };

  const handleVote = async (suggestionId: string) => {
    if (!supabase) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const hasVoted = votedIds.has(suggestionId);

    // Optimistic update
    if (hasVoted) {
      setVotedIds(prev => {
        const next = new Set(prev);
        next.delete(suggestionId);
        return next;
      });
      setSuggestions(prev =>
        prev.map(s => s.id === suggestionId ? { ...s, vote_count: s.vote_count - 1 } : s)
      );
    } else {
      setVotedIds(prev => new Set(prev).add(suggestionId));
      setSuggestions(prev =>
        prev.map(s => s.id === suggestionId ? { ...s, vote_count: s.vote_count + 1 } : s)
      );
    }

    try {
      if (hasVoted) {
        const { error } = await supabase
          .from('suggestion_votes')
          .delete()
          .eq('suggestion_id', suggestionId)
          .eq('voter_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('suggestion_votes')
          .insert({ suggestion_id: suggestionId, voter_id: user.id });

        if (error) throw error;
      }
    } catch {
      // Rollback on error
      if (hasVoted) {
        setVotedIds(prev => new Set(prev).add(suggestionId));
        setSuggestions(prev =>
          prev.map(s => s.id === suggestionId ? { ...s, vote_count: s.vote_count + 1 } : s)
        );
      } else {
        setVotedIds(prev => {
          const next = new Set(prev);
          next.delete(suggestionId);
          return next;
        });
        setSuggestions(prev =>
          prev.map(s => s.id === suggestionId ? { ...s, vote_count: s.vote_count - 1 } : s)
        );
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">Implemented</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none dark:bg-blue-900/30 dark:text-blue-400">Approved</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500">Under Review</Badge>;
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
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button asChild>
              <Link href="/">Start Mapping</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-4">Suggest a Category</h1>
          <p className="text-xl text-primary-600 dark:text-primary-300 max-w-2xl mx-auto">
            Have an idea for a new travel category? Submit your suggestion and vote for others.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submission Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💡</span> Submit New Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-muted-foreground mb-4">
                    Your suggestion has been submitted and is now visible for voting.
                  </p>
                  <Button variant="link" onClick={() => setSubmitted(false)}>
                    Submit another suggestion
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Lighthouses, Breweries" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Why is this interesting?" className="resize-none" rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="examplePlaces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Example Places</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Cape Hatteras, Point Reyes" {...field} />
                          </FormControl>
                          <FormDescription>List a few notable examples</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dataSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Source (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Wikipedia list URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormDescription>We&apos;ll notify you when implemented</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {submitError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        {submitError}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Suggestion
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* Suggestions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">🗳️</span> Vote
              </h2>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'popular' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('popular')}
                >
                  Popular
                </Button>
                <Button
                  variant={sortBy === 'newest' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('newest')}
                >
                  Newest
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search suggestions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <div className="text-4xl mb-4">{searchQuery ? '🔍' : '📭'}</div>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `No suggestions matching "${searchQuery}"`
                    : 'No suggestions yet. Be the first!'
                  }
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredSuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="overflow-hidden">
                    <div className="flex">
                      {/* Vote Button */}
                      <button
                        onClick={() => handleVote(suggestion.id)}
                        className={`
                          w-16 flex flex-col items-center justify-center cursor-pointer transition-colors border-r
                          ${votedIds.has(suggestion.id)
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'bg-muted/30 hover:bg-muted text-muted-foreground'}
                        `}
                        aria-label={`${votedIds.has(suggestion.id) ? 'Remove vote from' : 'Vote for'} ${suggestion.title}`}
                        aria-pressed={votedIds.has(suggestion.id)}
                      >
                        <ChevronUp className={`w-6 h-6 ${votedIds.has(suggestion.id) ? 'stroke-[3px]' : ''}`} />
                        <span className="font-bold">{suggestion.vote_count}</span>
                      </button>

                      {/* Content */}
                      <div className="flex-1 p-4 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold truncate text-base">
                            {suggestion.title}
                          </h3>
                          {getStatusBadge(suggestion.status)}
                        </div>
                        {suggestion.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                            {suggestion.description}
                          </p>
                        )}
                        {suggestion.example_places && (
                          <p className="text-xs text-muted-foreground/80">
                            Examples: {suggestion.example_places}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-4 text-center">
              {user ? (
                'Click the arrow to vote. You can change your vote anytime.'
              ) : (
                <>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-primary hover:underline font-medium"
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
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: '1️⃣', title: 'Suggest', desc: 'Submit your category idea with examples.' },
            { icon: '2️⃣', title: 'Vote', desc: 'Vote for suggestions you want to track.' },
            { icon: '3️⃣', title: 'Track', desc: 'High-vote categories get built first.' }
          ].map((step) => (
            <Card key={step.title} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 border-none shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-primary transition-colors font-medium">Suggest</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      <InstallPWA />
    </div>
  );
}
