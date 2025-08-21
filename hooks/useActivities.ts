import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { queryKeys } from '../lib/queryClient';
import type { Database } from '../lib/supabaseClient';
import { useToast } from '../components/ToastProvider';

type Activity = Database['public']['Tables']['activities']['Row'];
type ActivityInsert = Database['public']['Tables']['activities']['Insert'];
type ActivityUpdate = Database['public']['Tables']['activities']['Update'];

interface UseActivitiesOptions {
  coupleId: string;
  filter?: 'all' | 'upcoming' | 'completed' | 'ideaBin';
  enabled?: boolean;
}

export const useActivities = ({ 
  coupleId, 
  filter = 'all',
  enabled = true 
}: UseActivitiesOptions) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: [...queryKeys.activitiesByCouple(coupleId), filter],
    queryFn: async (): Promise<Activity[]> => {
      let query = supabase
        .from('activities')
        .select('*')
        .eq('couple_id', coupleId);

      // Apply filters
      switch (filter) {
        case 'upcoming':
          query = query
            .eq('completed', false)
            .not('date', 'is', null)
            .gte('date', new Date().toISOString().split('T')[0]);
          break;
        case 'completed':
          query = query
            .eq('completed', true)
            .not('date', 'is', null);
          break;
        case 'ideaBin':
          query = query.is('date', null);
          break;
        case 'all':
        default:
          // No additional filters
          break;
      }

      const { data, error } = await query.order('date', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: enabled && !!coupleId,
    staleTime: 2 * 60 * 1000, // 2 minutes for activities
  });

  const addActivityMutation = useMutation({
    mutationFn: async (activityData: ActivityInsert): Promise<Activity> => {
      const { data, error } = await supabase
        .from('activities')
        .insert(activityData)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (newActivity) => {
      // Determine which filter this activity belongs to
      const activityFilter = newActivity.date ? 
        (newActivity.completed ? 'completed' : 'upcoming') : 'ideaBin';
      
      // Update the relevant filter query
      queryClient.setQueryData(
        [...queryKeys.activitiesByCouple(coupleId), activityFilter],
        (old: Activity[] | undefined) => {
          if (!old) return [newActivity];
          return [...old, newActivity].sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
        }
      );
      
      // Also update the 'all' filter
      queryClient.setQueryData(
        [...queryKeys.activitiesByCouple(coupleId), 'all'],
        (old: Activity[] | undefined) => {
          if (!old) return [newActivity];
          return [...old, newActivity].sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
        }
      );
      
      toast.success('Activity added successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add activity');
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: ActivityUpdate 
    }): Promise<Activity> => {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (updatedActivity) => {
      // Update all activity queries
      queryClient.setQueriesData(
        { queryKey: queryKeys.activitiesByCouple(coupleId) },
        (old: Activity[] | undefined) => {
          if (!old) return [updatedActivity];
          return old.map(activity => 
            activity.id === updatedActivity.id ? updatedActivity : activity
          ).sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
        }
      );
      
      toast.success('Activity updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update activity');
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, deletedId) => {
      // Update all activity queries
      queryClient.setQueriesData(
        { queryKey: queryKeys.activitiesByCouple(coupleId) },
        (old: Activity[] | undefined) => {
          if (!old) return old;
          return old.filter(activity => activity.id !== deletedId);
        }
      );
      
      toast.success('Activity deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete activity');
    },
  });

  const completeActivityMutation = useMutation({
    mutationFn: async ({ 
      id, 
      feeling 
    }: { 
      id: string; 
      feeling: string 
    }): Promise<Activity> => {
      const { data, error } = await supabase
        .from('activities')
        .update({ completed: true, feeling })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (completedActivity) => {
      // Update all activity queries
      queryClient.setQueriesData(
        { queryKey: queryKeys.activitiesByCouple(coupleId) },
        (old: Activity[] | undefined) => {
          if (!old) return [completedActivity];
          return old.map(activity => 
            activity.id === completedActivity.id ? completedActivity : activity
          ).sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
        }
      );
      
      toast.success('Activity completed!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to complete activity');
    },
  });

  return {
    // Query data
    activities: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Mutations
    addActivity: addActivityMutation.mutate,
    updateActivity: updateActivityMutation.mutate,
    deleteActivity: deleteActivityMutation.mutate,
    completeActivity: completeActivityMutation.mutate,
    
    // Mutation states
    isAdding: addActivityMutation.isPending,
    isUpdating: updateActivityMutation.isPending,
    isDeleting: deleteActivityMutation.isPending,
    isCompleting: completeActivityMutation.isPending,
    
    // Utilities
    refetch: query.refetch,
  };
};


