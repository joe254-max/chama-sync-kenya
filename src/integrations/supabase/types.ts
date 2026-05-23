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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      advances: {
        Row: {
          amount: number
          created_at: string
          id: string
          installment_number: number
          member_id: string
          session_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          installment_number?: number
          member_id: string
          session_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          installment_number?: number
          member_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advances_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advances_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "meeting_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chama_officers: {
        Row: {
          chama_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          chama_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          chama_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chama_officers_chama_id_fkey"
            columns: ["chama_id"]
            isOneToOne: false
            referencedRelation: "chamas"
            referencedColumns: ["id"]
          },
        ]
      }
      chamas: {
        Row: {
          bank_account_number: string | null
          bank_name: string | null
          created_at: string
          id: string
          is_archived: boolean
          name: string
          officer_name: string | null
          organization_id: string | null
          project_name: string | null
        }
        Insert: {
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          name: string
          officer_name?: string | null
          organization_id?: string | null
          project_name?: string | null
        }
        Update: {
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          name?: string
          officer_name?: string | null
          organization_id?: string | null
          project_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chamas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      loans_given: {
        Row: {
          amount: number
          created_at: string
          id: string
          member_id: string
          session_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          member_id: string
          session_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          member_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_given_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_given_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "meeting_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_sessions: {
        Row: {
          auditor_comment: string | null
          bus_no: string | null
          chama_id: string
          created_at: string
          created_by: string | null
          elder: string | null
          field_officer: string | null
          id: string
          is_locked: boolean
          meeting_date: string
          meeting_number: number | null
          notes: string | null
          submitted_at: string | null
          time: string | null
          venue: string | null
          zona: string | null
          zona_ward: string | null
        }
        Insert: {
          auditor_comment?: string | null
          bus_no?: string | null
          chama_id: string
          created_at?: string
          created_by?: string | null
          elder?: string | null
          field_officer?: string | null
          id?: string
          is_locked?: boolean
          meeting_date: string
          meeting_number?: number | null
          notes?: string | null
          submitted_at?: string | null
          time?: string | null
          venue?: string | null
          zona?: string | null
          zona_ward?: string | null
        }
        Update: {
          auditor_comment?: string | null
          bus_no?: string | null
          chama_id?: string
          created_at?: string
          created_by?: string | null
          elder?: string | null
          field_officer?: string | null
          id?: string
          is_locked?: boolean
          meeting_date?: string
          meeting_number?: number | null
          notes?: string | null
          submitted_at?: string | null
          time?: string | null
          venue?: string | null
          zona?: string | null
          zona_ward?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_sessions_chama_id_fkey"
            columns: ["chama_id"]
            isOneToOne: false
            referencedRelation: "chamas"
            referencedColumns: ["id"]
          },
        ]
      }
      member_records: {
        Row: {
          created_at: string
          id: string
          loan_balance_bf: number
          loan_cf: number | null
          loan_interest: number
          member_id: string
          notes: string | null
          principal: number
          savings_shares_bf: number
          savings_shares_cf: number | null
          session_id: string
          shares_this_month: number
          total_repaid: number
          welfare: number
        }
        Insert: {
          created_at?: string
          id?: string
          loan_balance_bf?: number
          loan_cf?: number | null
          loan_interest?: number
          member_id: string
          notes?: string | null
          principal?: number
          savings_shares_bf?: number
          savings_shares_cf?: number | null
          session_id: string
          shares_this_month?: number
          total_repaid?: number
          welfare?: number
        }
        Update: {
          created_at?: string
          id?: string
          loan_balance_bf?: number
          loan_cf?: number | null
          loan_interest?: number
          member_id?: string
          notes?: string | null
          principal?: number
          savings_shares_bf?: number
          savings_shares_cf?: number | null
          session_id?: string
          shares_this_month?: number
          total_repaid?: number
          welfare?: number
        }
        Relationships: [
          {
            foreignKeyName: "member_records_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "meeting_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          chama_id: string
          created_at: string
          date_joined: string
          full_name: string
          id: string
          id_number: string | null
          is_active: boolean
          member_number: string | null
          phone_number: string | null
          photo_url: string | null
          user_id: string | null
        }
        Insert: {
          chama_id: string
          created_at?: string
          date_joined?: string
          full_name: string
          id?: string
          id_number?: string | null
          is_active?: boolean
          member_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          user_id?: string | null
        }
        Update: {
          chama_id?: string
          created_at?: string
          date_joined?: string
          full_name?: string
          id?: string
          id_number?: string | null
          is_active?: boolean
          member_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_chama_id_fkey"
            columns: ["chama_id"]
            isOneToOne: false
            referencedRelation: "chamas"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          county: string | null
          created_at: string
          id: string
          name: string
          town: string | null
        }
        Insert: {
          county?: string | null
          created_at?: string
          id?: string
          name: string
          town?: string | null
        }
        Update: {
          county?: string | null
          created_at?: string
          id?: string
          name?: string
          town?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      session_summary: {
        Row: {
          advance: number
          advance_paid: number
          balance_od: number | null
          bank_withdrawal: number
          created_at: string
          fines_and_charges: number
          grand_total_c: number | null
          grand_total_d: number | null
          id: string
          loan_form: number
          loans: number
          od_paid: number
          others: number
          others_d: number
          overdraft_bf: number
          pass_books: number
          pass_books_d: number
          prev_banking: number
          principal_withdrawals: number
          service_fee: number
          session_id: string
          total_banking: number
          total_in_bank: number
          total_overdraft: number
          total_repaid: number
          transfer: number
          welfare: number
          welfare_risk: number
        }
        Insert: {
          advance?: number
          advance_paid?: number
          balance_od?: number | null
          bank_withdrawal?: number
          created_at?: string
          fines_and_charges?: number
          grand_total_c?: number | null
          grand_total_d?: number | null
          id?: string
          loan_form?: number
          loans?: number
          od_paid?: number
          others?: number
          others_d?: number
          overdraft_bf?: number
          pass_books?: number
          pass_books_d?: number
          prev_banking?: number
          principal_withdrawals?: number
          service_fee?: number
          session_id: string
          total_banking?: number
          total_in_bank?: number
          total_overdraft?: number
          total_repaid?: number
          transfer?: number
          welfare?: number
          welfare_risk?: number
        }
        Update: {
          advance?: number
          advance_paid?: number
          balance_od?: number | null
          bank_withdrawal?: number
          created_at?: string
          fines_and_charges?: number
          grand_total_c?: number | null
          grand_total_d?: number | null
          id?: string
          loan_form?: number
          loans?: number
          od_paid?: number
          others?: number
          others_d?: number
          overdraft_bf?: number
          pass_books?: number
          pass_books_d?: number
          prev_banking?: number
          principal_withdrawals?: number
          service_fee?: number
          session_id?: string
          total_banking?: number
          total_in_bank?: number
          total_overdraft?: number
          total_repaid?: number
          transfer?: number
          welfare?: number
          welfare_risk?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_summary_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "meeting_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_session: {
        Args: { _session_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_chama_officer: {
        Args: { _chama_id: string; _user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      session_is_locked: { Args: { _session_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "officer" | "member"
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
    Enums: {
      app_role: ["super_admin", "officer", "member"],
    },
  },
} as const
