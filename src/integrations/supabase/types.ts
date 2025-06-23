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
      ai_analysis: {
        Row: {
          analysis_result: Json
          analysis_type: string
          confidence_score: number | null
          created_at: string | null
          id: string
          model_used: string
          processing_time_ms: number | null
          scanned_email_id: string
        }
        Insert: {
          analysis_result: Json
          analysis_type: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          model_used: string
          processing_time_ms?: number | null
          scanned_email_id: string
        }
        Update: {
          analysis_result?: Json
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          model_used?: string
          processing_time_ms?: number | null
          scanned_email_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_scanned_email_id_fkey"
            columns: ["scanned_email_id"]
            isOneToOne: false
            referencedRelation: "scanned_emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_accounts: {
        Row: {
          access_token_encrypted: string | null
          created_at: string | null
          email_address: string
          id: string
          is_active: boolean | null
          last_sync: string | null
          provider: string
          refresh_token_encrypted: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          created_at?: string | null
          email_address: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider: string
          refresh_token_encrypted?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          created_at?: string | null
          email_address?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider?: string
          refresh_token_encrypted?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scanned_emails: {
        Row: {
          content: string | null
          created_at: string | null
          email_account_id: string
          flagged_keywords: string[] | null
          headers: Json | null
          id: string
          message_id: string
          recipient: string | null
          risk_level: Database["public"]["Enums"]["email_risk_level"] | null
          risk_score: number | null
          scan_details: Json | null
          scan_status: Database["public"]["Enums"]["scan_status"] | null
          scanned_at: string | null
          sender: string
          subject: string | null
          suspicious_links: string[] | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          email_account_id: string
          flagged_keywords?: string[] | null
          headers?: Json | null
          id?: string
          message_id: string
          recipient?: string | null
          risk_level?: Database["public"]["Enums"]["email_risk_level"] | null
          risk_score?: number | null
          scan_details?: Json | null
          scan_status?: Database["public"]["Enums"]["scan_status"] | null
          scanned_at?: string | null
          sender: string
          subject?: string | null
          suspicious_links?: string[] | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          email_account_id?: string
          flagged_keywords?: string[] | null
          headers?: Json | null
          id?: string
          message_id?: string
          recipient?: string | null
          risk_level?: Database["public"]["Enums"]["email_risk_level"] | null
          risk_score?: number | null
          scan_details?: Json | null
          scan_status?: Database["public"]["Enums"]["scan_status"] | null
          scanned_at?: string | null
          sender?: string
          subject?: string | null
          suspicious_links?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scanned_emails_email_account_id_fkey"
            columns: ["email_account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      threat_patterns: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          pattern_data: Json
          pattern_type: string
          severity: Database["public"]["Enums"]["email_risk_level"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pattern_data: Json
          pattern_type: string
          severity: Database["public"]["Enums"]["email_risk_level"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pattern_data?: Json
          pattern_type?: string
          severity?: Database["public"]["Enums"]["email_risk_level"]
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
      email_risk_level: "safe" | "low" | "medium" | "high" | "critical"
      scan_status: "pending" | "scanning" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      email_risk_level: ["safe", "low", "medium", "high", "critical"],
      scan_status: ["pending", "scanning", "completed", "failed"],
    },
  },
} as const
