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
      ai_model_usage: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          error_message: string | null
          id: string
          input_tokens: number | null
          model_name: string
          output_tokens: number | null
          query_domain: string | null
          query_type: string | null
          response_time_ms: number | null
          success: boolean | null
          thinking_budget: number | null
          thread_id: string | null
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          model_name: string
          output_tokens?: number | null
          query_domain?: string | null
          query_type?: string | null
          response_time_ms?: number | null
          success?: boolean | null
          thinking_budget?: number | null
          thread_id?: string | null
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          model_name?: string
          output_tokens?: number | null
          query_domain?: string | null
          query_type?: string | null
          response_time_ms?: number | null
          success?: boolean | null
          thinking_budget?: number | null
          thread_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      form_analytics: {
        Row: {
          created_at: string | null
          event_type: string
          form_id: string | null
          id: string
          ip_address: unknown | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_analytics_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_responses: {
        Row: {
          form_id: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          respondent_email: string | null
          respondent_name: string | null
          response_data: Json
          submitted_at: string | null
          user_agent: string | null
        }
        Insert: {
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          respondent_email?: string | null
          respondent_name?: string | null
          response_data?: Json
          submitted_at?: string | null
          user_agent?: string | null
        }
        Update: {
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          respondent_email?: string | null
          respondent_name?: string | null
          response_data?: Json
          submitted_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_templates: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          questions: Json
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          questions?: Json
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          questions?: Json
        }
        Relationships: []
      }
      forms: {
        Row: {
          branding: Json | null
          created_at: string | null
          custom_alias: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          questions: Json
          settings: Json | null
          template_type: string | null
          title: string
          token: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          branding?: Json | null
          created_at?: string | null
          custom_alias?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json
          settings?: Json | null
          template_type?: string | null
          title: string
          token?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          branding?: Json | null
          created_at?: string | null
          custom_alias?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json
          settings?: Json | null
          template_type?: string | null
          title?: string
          token?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_form_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'] 