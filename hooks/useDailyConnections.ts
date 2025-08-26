import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { queryKeys } from '../lib/queryClient';
import type { Database } from '../lib/supabaseClient';
import { useToast } from '../components/ToastProvider';
import { config } from '../lib/config';
import { GoogleGenAI } from '@google/genai';

type DailyConnection = Database['public']['Tables']['daily_connections']['Row'];
type DailyConnectionInsert = Database['public']['Tables']['daily_connections']['Insert'];
type DailyConnectionUpdate = Database['public']['Tables']['daily_connections']['Update'];

interface UseDailyConnectionsOptions {
  coupleId: string;
  enabled?: boolean;
}

export const useDailyConnections = ({ 
  coupleId, 
  enabled = true 
}: UseDailyConnectionsOptions) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: queryKeys.dailyConnectionsByCouple(coupleId),
    queryFn: async (): Promise<DailyConnection[]> => {
      const { data, error } = await supabase
        .from('daily_connections')
        .select('*')
        .eq('couple_id', coupleId)
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: enabled && !!coupleId,
    staleTime: 1 * 60 * 1000, // 1 minute for daily connections
  });

  const getTodayConnection = useQuery({
    queryKey: queryKeys.dailyConnectionByDate(coupleId, new Date().toISOString().split('T')[0]),
    queryFn: async (): Promise<DailyConnection | null> => {
      const todayStr = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_connections')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('date', todayStr)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: enabled && !!coupleId,
    staleTime: 30 * 1000, // 30 seconds for today's connection
  });

  const createTodayConnectionMutation = useMutation({
    mutationFn: async (): Promise<DailyConnection> => {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Generate AI question if available
      let question = "What's one small moment from today you want to remember?";
      try {
        if (config.gemini.apiKey) {
          const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });
          const prompt = "Generate a single, warm and gentle question for a couple to ask each other to connect. The question should be under 20 words and encourage sharing a feeling or a small story.";
          const response = await ai.models.generateContent({ 
            model: 'gemini-2.5-flash', 
            contents: prompt 
          });
          question = response.text;
        }
      } catch (err) {
        console.error("Error fetching Gemini question, using fallback.", err);
      }

      const connectionData: DailyConnectionInsert = {
        couple_id: coupleId,
        date: todayStr,
        question,
        answers: {},
      };

      const { data, error } = await supabase
        .from('daily_connections')
        .insert(connectionData)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (newConnection) => {
      // Update today's connection
      queryClient.setQueryData(
        queryKeys.dailyConnectionByDate(coupleId, newConnection.date),
        newConnection
      );
      
      // Update the list
      queryClient.setQueryData(
        queryKeys.dailyConnectionsByCouple(coupleId),
        (old: DailyConnection[] | undefined) => {
          if (!old) return [newConnection];
          return [newConnection, ...old];
        }
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create today\'s connection');
    },
  });

  const updateConnectionMutation = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: DailyConnectionUpdate 
    }): Promise<DailyConnection> => {
      const { data, error } = await supabase
        .from('daily_connections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (updatedConnection) => {
      // Update today's connection if it's the same
      queryClient.setQueryData(
        queryKeys.dailyConnectionByDate(coupleId, updatedConnection.date),
        updatedConnection
      );
      
      // Update the list
      queryClient.setQueriesData(
        { queryKey: queryKeys.dailyConnectionsByCouple(coupleId) },
        (old: DailyConnection[] | undefined) => {
          if (!old) return [updatedConnection];
          return old.map(conn => 
            conn.id === updatedConnection.id ? updatedConnection : conn
          );
        }
      );
      
      toast.success('Answer submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update connection');
    },
  });

  const submitAnswer = async (answer: string, userId: string) => {
    let todayConnection = getTodayConnection.data;
    
    if (!todayConnection) {
      // Create today's connection first
      const newConnection = await createTodayConnectionMutation.mutateAsync();
      todayConnection = newConnection;
    }

    if (!todayConnection) {
      throw new Error('Failed to create today\'s connection');
    }

    const currentAnswers = (todayConnection.answers as Record<string, string>) || {};
    const newAnswers = { ...currentAnswers };
    
    newAnswers[userId] = answer;

    await updateConnectionMutation.mutateAsync({
      id: todayConnection.id,
      updates: { answers: newAnswers }
    });
  };

  return {
    // Query data
    connections: query.data || [],
    todayConnection: getTodayConnection.data,
    isLoading: query.isLoading || getTodayConnection.isLoading,
    isError: query.isError || getTodayConnection.isError,
    error: query.error || getTodayConnection.error,
    
    // Mutations
    createTodayConnection: createTodayConnectionMutation.mutate,
    updateConnection: updateConnectionMutation.mutate,
    submitAnswer,
    
    // Mutation states
    isCreating: createTodayConnectionMutation.isPending,
    isUpdating: updateConnectionMutation.isPending,
    
    // Utilities
    refetch: query.refetch,
    refetchToday: getTodayConnection.refetch,
  };
};





