import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default configuration for all queries
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      retry: 1, // Only retry failed queries once
      gcTime: 1000 * 60 * 30, // Cache data for 30 minutes (previously called cacheTime)
    },
  },
}); 