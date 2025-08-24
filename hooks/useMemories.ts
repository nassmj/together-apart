import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { queryKeys } from '../lib/queryClient';
import type { Database } from '../lib/supabaseClient';
import { useToast } from '../components/ToastProvider';

type Memory = Database['public']['Tables']['memories']['Row'];
type MemoryInsert = Database['public']['Tables']['memories']['Insert'];
type MemoryUpdate = Database['public']['Tables']['memories']['Update'];

interface UseMemoriesOptions {
  coupleId: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

interface PaginatedMemories {
  data: Memory[];
  hasMore: boolean;
  total: number;
}

const MEMORIES_PER_PAGE = 20;

export const useMemories = ({ 
  coupleId, 
  page = 1, 
  pageSize = MEMORIES_PER_PAGE,
  enabled = true 
}: UseMemoriesOptions) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: [...queryKeys.memoriesByCouple(coupleId), page, pageSize],
    queryFn: async (): Promise<PaginatedMemories> => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('memories')
        .select('*', { count: 'exact' })
        .eq('couple_id', coupleId)
        .order('date', { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: data || [],
        hasMore: (data?.length || 0) === pageSize,
        total: count || 0,
      };
    },
    enabled: enabled && !!coupleId,
    staleTime: 2 * 60 * 1000, // 2 minutes for memories
  });

  const addMemoryMutation = useMutation({
    mutationFn: async (memoryData: MemoryInsert): Promise<Memory> => {
      const { data, error } = await supabase
        .from('memories')
        .insert(memoryData)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (newMemory) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        [...queryKeys.memoriesByCouple(coupleId), 1, pageSize],
        (old: PaginatedMemories | undefined) => {
          if (!old) return { data: [newMemory], hasMore: false, total: 1 };
          return {
            ...old,
            data: [newMemory, ...old.data.slice(0, -1)],
            total: old.total + 1,
          };
        }
      );
      
      // Invalidate all memory queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.memoriesByCouple(coupleId) });
      toast.success('Memory added successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add memory');
    },
  });

  const updateMemoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MemoryUpdate }): Promise<Memory> => {
      const { data, error } = await supabase
        .from('memories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (updatedMemory) => {
      // Update all memory queries that contain this memory
      queryClient.setQueriesData(
        { queryKey: queryKeys.memoriesByCouple(coupleId) },
        (old: PaginatedMemories | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map(memory => 
              memory.id === updatedMemory.id ? updatedMemory : memory
            ),
          };
        }
      );
      toast.success('Memory updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update memory');
    },
  });

  const deleteMemoryMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, deletedId) => {
      // Update all memory queries to remove the deleted memory
      queryClient.setQueriesData(
        { queryKey: queryKeys.memoriesByCouple(coupleId) },
        (old: PaginatedMemories | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter(memory => memory.id !== deletedId),
            total: Math.max(0, old.total - 1),
          };
        }
      );
      toast.success('Memory deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete memory');
    },
  });

  const loadMore = () => {
    if (query.data?.hasMore) {
      // This would trigger a new query with the next page
      // Implementation depends on your pagination strategy
    }
  };

  return {
    // Query data
    memories: query.data?.data || [],
    hasMore: query.data?.hasMore || false,
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Mutations
    addMemory: addMemoryMutation.mutate,
    updateMemory: updateMemoryMutation.mutate,
    deleteMemory: deleteMemoryMutation.mutate,
    
    // Mutation states
    isAdding: addMemoryMutation.isPending,
    isUpdating: updateMemoryMutation.isPending,
    isDeleting: deleteMemoryMutation.isPending,
    
    // Utilities
    loadMore,
    refetch: query.refetch,
  };
};



