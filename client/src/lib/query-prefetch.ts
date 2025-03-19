import { queryClient } from './react-query';

export const prefetchEssentialData = async () => {
  console.log('Prefetching essential data...');
  
  try {
    // Dynamically import APIs to avoid circular dependencies
    const { courseAPI, teamAPI, videoAPI } = await import('../services/api');

    // Prefetch courses
    await queryClient.prefetchQuery({
      queryKey: ['courses-list'],
      queryFn: async () => {
        console.log('Prefetching courses...');
        const response = await courseAPI.getAll();
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
      staleTime: Infinity,
    });

    // Prefetch team members
    await queryClient.prefetchQuery({
      queryKey: ['team-members', 'team'],
      queryFn: async () => {
        console.log('Prefetching team members...');
        const response = await teamAPI.getAll({ type: 'team' });
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
      staleTime: Infinity,
    });

    // Prefetch featured videos
    const videoOptions = { limit: 3, featured: true };
    await queryClient.prefetchQuery({
      queryKey: ['videos-list', JSON.stringify(videoOptions)],
      queryFn: async () => {
        console.log('Prefetching videos...');
        const response = await videoAPI.getAll({
          limit: videoOptions.limit,
          filters: {
            isActive: true,
            featured: true
          }
        });
        
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
      staleTime: Infinity,
    });

    console.log('Essential data prefetched successfully');
  } catch (error) {
    console.error('Error prefetching essential data:', error);
  }
};

// Function to handle cache persistence
export const setupCachePersistence = () => {
  // Save cache to sessionStorage when tab/window is closed
  window.addEventListener('beforeunload', () => {
    try {
      const queryCache = queryClient.getQueryCache().getAll();
      const serializedCache = JSON.stringify(
        queryCache.map(query => ({
          queryKey: query.queryKey,
          data: query.state.data
        }))
      );
      sessionStorage.setItem('reactQueryCache', serializedCache);
    } catch (error) {
      console.error('Error saving query cache:', error);
    }
  });

  // Restore cache from sessionStorage
  try {
    const serializedCache = sessionStorage.getItem('reactQueryCache');
    if (serializedCache) {
      const queries = JSON.parse(serializedCache);
      queries.forEach((query: any) => {
        queryClient.setQueryData(query.queryKey, query.data);
      });
      console.log('Restored React Query cache from sessionStorage');
    }
  } catch (error) {
    console.error('Error restoring query cache:', error);
  }
}; 