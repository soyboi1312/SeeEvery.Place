/**
 * TanStack Query Provider
 * Provides React Query client to the application
 *
 * GC Time Strategy:
 * - Default: 30 minutes for user-specific data (activity feeds, profiles, etc.)
 * - Static geo data: Infinity (see useCategoryData in useMapData.ts)
 *
 * Query-specific overrides should be applied at the useQuery call site.
 * For example, frequently changing data like activity feeds may want shorter
 * gcTime, while static data like country lists should use gcTime: Infinity.
 */
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create a new QueryClient instance for each session
  // This prevents data from being shared between users/requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Default cache: 30 minutes for user-specific data
            // Override at query site for static data (gcTime: Infinity)
            // or frequently changing data (gcTime: 5 * 60 * 1000)
            gcTime: 30 * 60 * 1000,
            // Retry failed requests 3 times
            retry: 3,
            // Don't refetch on window focus by default
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
