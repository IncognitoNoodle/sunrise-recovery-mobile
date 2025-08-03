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
      profiles: {
        Row: {
          id: string
          full_name: string
          sobriety_start_date: string
          interest_tags: string[]
          profile_image_url: string | null
          is_active: boolean
          role: 'user' | 'admin'
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          sobriety_start_date: string
          interest_tags?: string[]
          profile_image_url?: string | null
          is_active?: boolean
          role?: 'user' | 'admin'
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          sobriety_start_date?: string
          interest_tags?: string[]
          profile_image_url?: string | null
          is_active?: boolean
          role?: 'user' | 'admin'
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          category: 'coping' | 'coach-tips' | 'mindfulness' | 'motivation' | 'education'
          duration: number
          thumbnail_url: string
          video_url: string
          is_published: boolean
          created_by: string
          view_count: number
          tags: string[]
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: 'coping' | 'coach-tips' | 'mindfulness' | 'motivation' | 'education'
          duration: number
          thumbnail_url: string
          video_url: string
          is_published?: boolean
          created_by: string
          view_count?: number
          tags?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: 'coping' | 'coach-tips' | 'mindfulness' | 'motivation' | 'education'
          duration?: number
          thumbnail_url?: string
          video_url?: string
          is_published?: boolean
          created_by?: string
          view_count?: number
          tags?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      admin_posts: {
        Row: {
          id: string
          title: string
          content: string
          type: 'announcement' | 'motivational' | 'event' | 'tip'
          is_published: boolean
          created_by: string
          expires_at: string | null
          priority: 'low' | 'medium' | 'high'
          target_audience: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type: 'announcement' | 'motivational' | 'event' | 'tip'
          is_published?: boolean
          created_by: string
          expires_at?: string | null
          priority?: 'low' | 'medium' | 'high'
          target_audience?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: 'announcement' | 'motivational' | 'event' | 'tip'
          is_published?: boolean
          created_by?: string
          expires_at?: string | null
          priority?: 'low' | 'medium' | 'high'
          target_audience?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          date: string
          sobriety_days: number
          mood: number | null
          check_in_completed: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          sobriety_days: number
          mood?: number | null
          check_in_completed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          sobriety_days?: number
          mood?: number | null
          check_in_completed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          video_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          created_at?: string
        }
      }
      user_watch_history: {
        Row: {
          id: string
          user_id: string
          video_id: string
          watched_at: string
          watch_duration: number
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          watched_at?: string
          watch_duration: number
          completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          watched_at?: string
          watch_duration?: number
          completed?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type aliases for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Video = Database['public']['Tables']['videos']['Row']
export type AdminPost = Database['public']['Tables']['admin_posts']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type UserFavorite = Database['public']['Tables']['user_favorites']['Row']
export type UserWatchHistory = Database['public']['Tables']['user_watch_history']['Row']

export type CreateProfile = Database['public']['Tables']['profiles']['Insert']
export type CreateVideo = Database['public']['Tables']['videos']['Insert']
export type CreateAdminPost = Database['public']['Tables']['admin_posts']['Insert']
export type CreateUserProgress = Database['public']['Tables']['user_progress']['Insert']
export type CreateUserFavorite = Database['public']['Tables']['user_favorites']['Insert']
export type CreateUserWatchHistory = Database['public']['Tables']['user_watch_history']['Insert']

export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdateVideo = Database['public']['Tables']['videos']['Update']
export type UpdateAdminPost = Database['public']['Tables']['admin_posts']['Update']
export type UpdateUserProgress = Database['public']['Tables']['user_progress']['Update']