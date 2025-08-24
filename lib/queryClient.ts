import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time before inactive queries are garbage collected
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (but only if data is stale)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // User and partner data
  user: ['user'] as const,
  partner: ['partner'] as const,
  couple: ['couple'] as const,
  
  // Memories
  memories: ['memories'] as const,
  memoriesByCouple: (coupleId: string) => [...queryKeys.memories, coupleId] as const,
  
  // Activities
  activities: ['activities'] as const,
  activitiesByCouple: (coupleId: string) => [...queryKeys.activities, coupleId] as const,
  
  // Quests
  quests: ['quests'] as const,
  questsByCouple: (coupleId: string) => [...queryKeys.quests, coupleId] as const,
  
  // Daily connections
  dailyConnections: ['dailyConnections'] as const,
  dailyConnectionsByCouple: (coupleId: string) => [...queryKeys.dailyConnections, coupleId] as const,
  dailyConnectionByDate: (coupleId: string, date: string) => 
    [...queryKeys.dailyConnections, coupleId, date] as const,
  
  // Discoveries
  discoveries: ['discoveries'] as const,
  discoveriesByCouple: (coupleId: string) => [...queryKeys.discoveries, coupleId] as const,
  
  // Invites
  invites: ['invites'] as const,
  invitesByUser: (userId: string) => [...queryKeys.invites, userId] as const,
} as const;



