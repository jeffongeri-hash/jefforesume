export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      countdown_progress: {
        Row: {
          day_key: string
          id: string
          marked_at: string
        }
        Insert: {
          day_key: string
          id?: string
          marked_at?: string
        }
        Update: {
          day_key?: string
          id?: string
          marked_at?: string
        }
        Relationships: []
      }
      holdings: {
        Row: {
          asset_type: string | null
          average_cost: number
          created_at: string
          current_price: number | null
          id: string
          name: string
          notes: string | null
          sector: string | null
          shares: number
          symbol: string
          updated_at: string
        }
        Insert: {
          asset_type?: string | null
          average_cost: number
          created_at?: string
          current_price?: number | null
          id?: string
          name: string
          notes?: string | null
          sector?: string | null
          shares: number
          symbol: string
          updated_at?: string
        }
        Update: {
          asset_type?: string | null
          average_cost?: number
          created_at?: string
          current_price?: number | null
          id?: string
          name?: string
          notes?: string | null
          sector?: string | null
          shares?: number
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      pav_credential_files: {
        Row: {
          category: string
          expires_on: string | null
          file_name: string
          id: string
          label: string
          mime_type: string | null
          storage_path: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          category: string
          expires_on?: string | null
          file_name: string
          id?: string
          label: string
          mime_type?: string | null
          storage_path: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          category?: string
          expires_on?: string | null
          file_name?: string
          id?: string
          label?: string
          mime_type?: string | null
          storage_path?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pav_jobs: {
        Row: {
          external_id: string | null
          first_seen_at: string
          id: string
          is_local: boolean | null
          is_per_diem: boolean | null
          last_seen_at: string
          location: string | null
          notes: string | null
          organization: string | null
          pay_text: string | null
          posted_text: string | null
          raw: Json | null
          source_id: string | null
          source_name: string
          status: string
          title: string
          url: string
          user_id: string
        }
        Insert: {
          external_id?: string | null
          first_seen_at?: string
          id?: string
          is_local?: boolean | null
          is_per_diem?: boolean | null
          last_seen_at?: string
          location?: string | null
          notes?: string | null
          organization?: string | null
          pay_text?: string | null
          posted_text?: string | null
          raw?: Json | null
          source_id?: string | null
          source_name: string
          status?: string
          title: string
          url: string
          user_id: string
        }
        Update: {
          external_id?: string | null
          first_seen_at?: string
          id?: string
          is_local?: boolean | null
          is_per_diem?: boolean | null
          last_seen_at?: string
          location?: string | null
          notes?: string | null
          organization?: string | null
          pay_text?: string | null
          posted_text?: string | null
          raw?: Json | null
          source_id?: string | null
          source_name?: string
          status?: string
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pav_jobs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "pav_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      pav_licenses: {
        Row: {
          created_at: string
          expiration_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          kind: string
          name: string
          notes: string | null
          number: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          kind?: string
          name: string
          notes?: string | null
          number?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          kind?: string
          name?: string
          notes?: string | null
          number?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pav_profile: {
        Row: {
          acls_expiry: string | null
          bls_expiry: string | null
          credentials_suffix: string | null
          dea_number: string | null
          email: string | null
          full_name: string | null
          mailing_address: string | null
          malpractice_carrier: string | null
          malpractice_policy_number: string | null
          npi_number: string | null
          phone: string | null
          specialty: string | null
          state_license_number: string | null
          state_license_state: string | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          acls_expiry?: string | null
          bls_expiry?: string | null
          credentials_suffix?: string | null
          dea_number?: string | null
          email?: string | null
          full_name?: string | null
          mailing_address?: string | null
          malpractice_carrier?: string | null
          malpractice_policy_number?: string | null
          npi_number?: string | null
          phone?: string | null
          specialty?: string | null
          state_license_number?: string | null
          state_license_state?: string | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          acls_expiry?: string | null
          bls_expiry?: string | null
          credentials_suffix?: string | null
          dea_number?: string | null
          email?: string | null
          full_name?: string | null
          mailing_address?: string | null
          malpractice_carrier?: string | null
          malpractice_policy_number?: string | null
          npi_number?: string | null
          phone?: string | null
          specialty?: string | null
          state_license_number?: string | null
          state_license_state?: string | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      pav_references: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          notes: string | null
          organization: string | null
          phone: string | null
          relationship: string | null
          share_token: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          relationship?: string | null
          share_token?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          relationship?: string | null
          share_token?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pav_scrape_runs: {
        Row: {
          error: string | null
          finished_at: string | null
          id: string
          jobs_found: number | null
          jobs_new: number | null
          source_id: string | null
          source_name: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          error?: string | null
          finished_at?: string | null
          id?: string
          jobs_found?: number | null
          jobs_new?: number | null
          source_id?: string | null
          source_name: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          error?: string | null
          finished_at?: string | null
          id?: string
          jobs_found?: number | null
          jobs_new?: number | null
          source_id?: string | null
          source_name?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pav_scrape_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "pav_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      pav_sources: {
        Row: {
          active: boolean
          base_url: string
          category: string
          config: Json
          created_at: string
          id: string
          last_error: string | null
          last_scraped_at: string | null
          last_status: string | null
          name: string
          platform: string
          user_id: string
        }
        Insert: {
          active?: boolean
          base_url: string
          category: string
          config?: Json
          created_at?: string
          id?: string
          last_error?: string | null
          last_scraped_at?: string | null
          last_status?: string | null
          name: string
          platform: string
          user_id: string
        }
        Update: {
          active?: boolean
          base_url?: string
          category?: string
          config?: Json
          created_at?: string
          id?: string
          last_error?: string | null
          last_scraped_at?: string | null
          last_status?: string | null
          name?: string
          platform?: string
          user_id?: string
        }
        Relationships: []
      }
      schwab_tokens: {
        Row: {
          access_token: string
          account_hash: string | null
          created_at: string
          expires_at: string
          id: string
          refresh_token: string
          updated_at: string
        }
        Insert: {
          access_token: string
          account_hash?: string | null
          created_at?: string
          expires_at: string
          id?: string
          refresh_token: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          account_hash?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          price: number
          shares: number
          symbol: string
          total_value: number | null
          trade_date: string
          trade_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          price: number
          shares: number
          symbol: string
          total_value?: number | null
          trade_date: string
          trade_type: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          price?: number
          shares?: number
          symbol?: string
          total_value?: number | null
          trade_date?: string
          trade_type?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
