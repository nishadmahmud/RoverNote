export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      journeys: {
        Row: {
          body: string | null
          country: string | null
          created_at: string | null
          end_date: string | null
          id: string
          image_path: string | null
          image_url: string | null
          is_public: boolean | null
          likes_count: number | null
          location: string | null
          start_date: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          country?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          is_public?: boolean | null
          likes_count?: number | null
          location?: string | null
          start_date?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          country?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          is_public?: boolean | null
          likes_count?: number | null
          location?: string | null
          start_date?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          location: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
          location?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          location?: string | null
          updated_at?: string | null
        }
        Relationships: []
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

// Helper types
export type Journey = Database['public']['Tables']['journeys']['Row']
export type JourneyInsert = Database['public']['Tables']['journeys']['Insert']
export type JourneyUpdate = Database['public']['Tables']['journeys']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Extended journey with profile info for community view
export type JourneyWithProfile = Journey & {
  profiles: Pick<Profile, 'display_name' | 'avatar_url'> | null
}
