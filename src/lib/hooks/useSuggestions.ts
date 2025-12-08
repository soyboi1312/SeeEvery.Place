/**
 * TanStack Query hooks for suggestions
 * Replaces manual useEffect data fetching with caching and optimistic updates
 */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { SuggestionFormData } from '@/lib/validations/suggestion';
import { toDbFormat } from '@/lib/validations/suggestion';

export interface Suggestion {
  id: string;
  title: string;
  description: string | null;
  example_places: string | null;
  data_source: string | null;
  status: 'pending' | 'approved' | 'implemented';
  vote_count: number;
  created_at: string;
}

// Query keys for cache management
export const suggestionKeys = {
  all: ['suggestions'] as const,
  votes: (userId: string) => ['suggestion-votes', userId] as const,
};

/**
 * Fetch all suggestions sorted by vote count
 */
export function useSuggestions() {
  return useQuery({
    queryKey: suggestionKeys.all,
    queryFn: async (): Promise<Suggestion[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('vote_count', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

/**
 * Fetch user's voted suggestion IDs
 */
export function useUserVotes(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? suggestionKeys.votes(userId) : ['suggestion-votes-disabled'],
    queryFn: async (): Promise<Set<string>> => {
      if (!userId) return new Set();

      const supabase = createClient();
      const { data, error } = await supabase
        .from('suggestion_votes')
        .select('suggestion_id')
        .eq('voter_id', userId);

      if (error) throw error;
      return new Set((data || []).map(v => v.suggestion_id));
    },
    enabled: !!userId,
  });
}

/**
 * Create a new suggestion
 */
export function useCreateSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SuggestionFormData) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('suggestions')
        .insert(toDbFormat(data));

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate suggestions query to refetch
      queryClient.invalidateQueries({ queryKey: suggestionKeys.all });
    },
  });
}

/**
 * Toggle vote on a suggestion (add/remove)
 */
export function useToggleVote(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ suggestionId, hasVoted }: { suggestionId: string; hasVoted: boolean }) => {
      if (!userId) throw new Error('Must be logged in to vote');

      const supabase = createClient();

      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from('suggestion_votes')
          .delete()
          .eq('suggestion_id', suggestionId)
          .eq('voter_id', userId);

        if (error) throw error;
        return { action: 'removed' as const, suggestionId };
      } else {
        // Add vote
        const { error } = await supabase
          .from('suggestion_votes')
          .insert({ suggestion_id: suggestionId, voter_id: userId });

        if (error) throw error;
        return { action: 'added' as const, suggestionId };
      }
    },
    // Optimistic update for better UX
    onMutate: async ({ suggestionId, hasVoted }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: suggestionKeys.all });
      if (userId) {
        await queryClient.cancelQueries({ queryKey: suggestionKeys.votes(userId) });
      }

      // Snapshot previous values
      const previousSuggestions = queryClient.getQueryData<Suggestion[]>(suggestionKeys.all);
      const previousVotes = userId
        ? queryClient.getQueryData<Set<string>>(suggestionKeys.votes(userId))
        : undefined;

      // Optimistically update suggestions
      queryClient.setQueryData<Suggestion[]>(suggestionKeys.all, (old) => {
        if (!old) return old;
        return old.map(s => {
          if (s.id === suggestionId) {
            return {
              ...s,
              vote_count: hasVoted ? s.vote_count - 1 : s.vote_count + 1,
            };
          }
          return s;
        });
      });

      // Optimistically update votes
      if (userId) {
        queryClient.setQueryData<Set<string>>(suggestionKeys.votes(userId), (old) => {
          const newSet = new Set(old);
          if (hasVoted) {
            newSet.delete(suggestionId);
          } else {
            newSet.add(suggestionId);
          }
          return newSet;
        });
      }

      return { previousSuggestions, previousVotes };
    },
    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousSuggestions) {
        queryClient.setQueryData(suggestionKeys.all, context.previousSuggestions);
      }
      if (context?.previousVotes && userId) {
        queryClient.setQueryData(suggestionKeys.votes(userId), context.previousVotes);
      }
    },
    // Refetch after mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: suggestionKeys.all });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: suggestionKeys.votes(userId) });
      }
    },
  });
}
