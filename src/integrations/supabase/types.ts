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
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          entity: string
          entity_id: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          entity: string
          entity_id: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          entity?: string
          entity_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logs: {
        Row: {
          body: string | null
          created_at: string
          created_by: string | null
          entry_type: string | null
          id: string
          project_id: string
          title: string | null
          todo_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          created_by?: string | null
          entry_type?: string | null
          id?: string
          project_id: string
          title?: string | null
          todo_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          created_by?: string | null
          entry_type?: string | null
          id?: string
          project_id?: string
          title?: string | null
          todo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "to_dos"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_reports: {
        Row: {
          created_at: string
          created_by: string | null
          detail: string | null
          id: string
          reason_id: string | null
          review_comment: string | null
          review_status: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          todo_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          detail?: string | null
          id?: string
          reason_id?: string | null
          review_comment?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status: string
          todo_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          detail?: string | null
          id?: string
          reason_id?: string | null
          review_comment?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          todo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "execution_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_reports_reason_id_fkey"
            columns: ["reason_id"]
            isOneToOne: false
            referencedRelation: "reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_reports_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "to_dos"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          created_at: string | null
          id: string
          log_id: string | null
          project_id: string
          todo_id: string | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          log_id?: string | null
          project_id: string
          todo_id?: string | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          log_id?: string | null
          project_id?: string
          todo_id?: string | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "to_dos"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          added_at: string | null
          project_id: string
          role_in_project: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          project_id: string
          role_in_project?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          project_id?: string
          role_in_project?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          external_ref: string | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          external_ref?: string | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          external_ref?: string | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      reasons: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          label: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          label: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          label?: string
        }
        Relationships: []
      }
      to_do_assignees: {
        Row: {
          added_at: string | null
          role: string | null
          to_do_id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          role?: string | null
          to_do_id: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          role?: string | null
          to_do_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "to_do_assignees_to_do_id_fkey"
            columns: ["to_do_id"]
            isOneToOne: false
            referencedRelation: "to_dos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "to_do_assignees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      to_dos: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          due_date: string | null
          id: string
          notes: string | null
          priority: string | null
          project_id: string
          status: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          project_id: string
          status?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          project_id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "to_dos_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "to_dos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "to_dos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      v_daily_log_feed: {
        Row: {
          body: string | null
          created_by: string | null
          detail: string | null
          entry_date: string | null
          entry_id: string | null
          kind: string | null
          media_count: number | null
          project_id: string | null
          reason_label: string | null
          review_comment: string | null
          review_status: string | null
          status: string | null
          title: string | null
          todo_title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_project_member: {
        Args: { p: string }
        Returns: boolean
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
