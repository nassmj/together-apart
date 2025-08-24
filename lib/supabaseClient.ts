

import { createClient } from '@supabase/supabase-js'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          category: string | null
          completed: boolean
          couple_id: string
          created_at: string
          date: string | null
          description: string | null
          feeling: string | null
          id: string
          image_url: string | null
          location: string | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean
          couple_id: string
          created_at?: string
          date?: string | null
          description?: string | null
          feeling?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean
          couple_id?: string
          created_at?: string
          date?: string | null
          description?: string | null
          feeling?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_couple_id_fkey"
            columns: ["couple_id"]
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      couples: {
        Row: {
          created_at: string
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "couples_user1_id_fkey"
            columns: ["user1_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couples_user2_id_fkey"
            columns: ["user2_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_connections: {
        Row: {
          id: string
          created_at: string
          couple_id: string
          date: string
          question: string
          answers: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          couple_id: string
          date: string
          question: string
          answers?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          couple_id?: string
          date?: string
          question?: string
          answers?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_connections_couple_id_fkey"
            columns: ["couple_id"]
            referencedRelation: "couples"
            referencedColumns: ["id"]
          }
        ]
      }
      discoveries: {
        Row: {
          address: string | null
          artist: string | null
          author: string | null
          category: Database["public"]["Enums"]["discovery_category"]
          couple_id: string
          created_at: string
          director: string | null
          id: string
          image_url: string | null
          name: string | null
          note: string | null
          sender_id: string
          title: string | null
          url: string | null
          year: number | null
        }
        Insert: {
          address?: string | null
          artist?: string | null
          author?: string | null
          category: Database["public"]["Enums"]["discovery_category"]
          couple_id: string
          created_at?: string
          director?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          note?: string | null
          sender_id: string
          title?: string | null
          url?: string | null
          year?: number | null
        }
        Update: {
          address?: string | null
          artist?: string | null
          author?: string | null
          category?: Database["public"]["Enums"]["discovery_category"]
          couple_id?: string
          created_at?: string
          director?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          note?: string | null
          sender_id?: string
          title?: string | null
          url?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discoveries_couple_id_fkey"
            columns: ["couple_id"]
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discoveries_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invites: {
        Row: {
          code: string
          created_at: string
          id: string
          inviter_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          inviter_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          inviter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_inviter_id_fkey"
            columns: ["inviter_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      memories: {
        Row: {
          couple_id: string
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_couple_id_fkey"
            columns: ["couple_id"]
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quests: {
        Row: {
          category: string
          completed_this_week: string[] | null
          couple_id: string
          created_at: string
          description: string | null
          end_date: string | null
          frequency: Database["public"]["Enums"]["quest_frequency"] | null
          id: string
          last_completed_date: string | null
          restrictions: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["quest_status"]
          streak: number | null
          title: string
          type: Database["public"]["Enums"]["quest_type"]
          user_id: string
          weekly_goal: number | null
        }
        Insert: {
          category: string
          completed_this_week?: string[] | null
          couple_id: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["quest_frequency"] | null
          id?: string
          last_completed_date?: string | null
          restrictions?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["quest_status"]
          streak?: number | null
          title: string
          type: Database["public"]["Enums"]["quest_type"]
          user_id: string
          weekly_goal?: number | null
        }
        Update: {
          category?: string
          completed_this_week?: string[] | null
          couple_id?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["quest_frequency"] | null
          id?: string
          last_completed_date?: string | null
          restrictions?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["quest_status"]
          streak?: number | null
          title?: string
          type?: Database["public"]["Enums"]["quest_type"]
          user_id?: string
          weekly_goal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quests_couple_id_fkey"
            columns: ["couple_id"]
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invite: {
        Args: {
          invite_code: string
        }
        Returns: undefined
      }
    }
    Enums: {
      discovery_category: "Music" | "Movie" | "Book" | "Place" | "Link"
      quest_frequency: "daily" | "weekly"
      quest_status: "in-progress" | "available" | "completed"
      quest_type: "challenge" | "routine"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Direct Supabase configuration to ensure it works
const supabaseUrl = 'https://bbjaadyoxeiodxyhsgzu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiamFhZHlveGVpb2R4eWhzZ3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MTE2NjgsImV4cCI6MjA3MTM4NzY2OH0.t9mbqPZzoySneVbL1vrEtRHB2aedDSMmeRmsNw90HKg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)