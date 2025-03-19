import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default configuration for all queries
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      staleTime: 1000 * 60 * 30, // Data is fresh for 30 minutes (extended from 5)
      retry: 1, // Only retry failed queries once
      gcTime: 1000 * 60 * 60, // Cache data for 60 minutes (extended from 30)
      refetchOnMount: false, // Don't refetch when component mounts
    },
  },
}); 