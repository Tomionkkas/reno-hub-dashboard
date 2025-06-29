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
      calcreno_projects: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          end_date: string | null
          id: string
          is_completed: boolean | null
          is_pinned: boolean | null
          local_id: string | null
          metadata: Json | null
          name: string
          start_date: string | null
          status: string | null
          total_area: number | null
          total_budget: number | null
          total_cost: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_completed?: boolean | null
          is_pinned?: boolean | null
          local_id?: string | null
          metadata?: Json | null
          name: string
          start_date?: string | null
          status?: string | null
          total_area?: number | null
          total_budget?: number | null
          total_cost?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_completed?: boolean | null
          is_pinned?: boolean | null
          local_id?: string | null
          metadata?: Json | null
          name?: string
          start_date?: string | null
          status?: string | null
          total_area?: number | null
          total_budget?: number | null
          total_cost?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      calcreno_room_elements: {
        Row: {
          created_at: string | null
          height: number
          id: string
          local_id: string | null
          position: number
          room_id: string | null
          type: string
          updated_at: string | null
          wall: number
          width: number
        }
        Insert: {
          created_at?: string | null
          height: number
          id?: string
          local_id?: string | null
          position: number
          room_id?: string | null
          type: string
          updated_at?: string | null
          wall: number
          width: number
        }
        Update: {
          created_at?: string | null
          height?: number
          id?: string
          local_id?: string | null
          position?: number
          room_id?: string | null
          type?: string
          updated_at?: string | null
          wall?: number
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "calcreno_room_elements_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "calcreno_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      calcreno_rooms: {
        Row: {
          area: number | null
          corner: string | null
          created_at: string | null
          dimensions: Json | null
          id: string
          local_id: string | null
          metadata: Json | null
          name: string
          project_id: string | null
          shape: string | null
          updated_at: string | null
        }
        Insert: {
          area?: number | null
          corner?: string | null
          created_at?: string | null
          dimensions?: Json | null
          id?: string
          local_id?: string | null
          metadata?: Json | null
          name: string
          project_id?: string | null
          shape?: string | null
          updated_at?: string | null
        }
        Update: {
          area?: number | null
          corner?: string | null
          created_at?: string | null
          dimensions?: Json | null
          id?: string
          local_id?: string | null
          metadata?: Json | null
          name?: string
          project_id?: string | null
          shape?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calcreno_rooms_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "calcreno_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_app_notifications: {
        Row: {
          action_url: string | null
          calcreno_project_id: string | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          priority: string | null
          project_id: string
          project_name: string | null
          read_at: string | null
          source_app: string
          target_app: string
          title: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          calcreno_project_id?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          priority?: string | null
          project_id: string
          project_name?: string | null
          read_at?: string | null
          source_app: string
          target_app: string
          title: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          calcreno_project_id?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          priority?: string | null
          project_id?: string
          project_name?: string | null
          read_at?: string | null
          source_app?: string
          target_app?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      custom_field_definitions: {
        Row: {
          created_at: string
          default_value: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          field_type: Database["public"]["Enums"]["field_type"]
          id: string
          is_required: boolean | null
          name: string
          options: Json | null
          position: number | null
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_value?: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          field_type: Database["public"]["Enums"]["field_type"]
          id?: string
          is_required?: boolean | null
          name: string
          options?: Json | null
          position?: number | null
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_value?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          field_type?: Database["public"]["Enums"]["field_type"]
          id?: string
          is_required?: boolean | null
          name?: string
          options?: Json | null
          position?: number | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_field_definitions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_field_values: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          field_definition_id: string
          id: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          field_definition_id: string
          id?: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          field_definition_id?: string
          id?: string
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "custom_field_values_field_definition_id_fkey"
            columns: ["field_definition_id"]
            isOneToOne: false
            referencedRelation: "custom_field_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          file_type: string | null
          id: string
          name: string
          path: string
          project_id: string | null
          size: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_type?: string | null
          id?: string
          name: string
          path: string
          project_id?: string | null
          size?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_type?: string | null
          id?: string
          name?: string
          path?: string
          project_id?: string | null
          size?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          project_id: string | null
          read: boolean | null
          task_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string | null
          user_id: string
          workflow_execution_id: string | null
          workflow_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          project_id?: string | null
          read?: boolean | null
          task_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
          user_id: string
          workflow_execution_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          project_id?: string | null
          read?: boolean | null
          task_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
          user_id?: string
          workflow_execution_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_workflow_execution_id_fkey"
            columns: ["workflow_execution_id"]
            isOneToOne: false
            referencedRelation: "workflow_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          expertise: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          expertise?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          expertise?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_assignments: {
        Row: {
          assigned_at: string | null
          profile_id: string
          project_id: string
        }
        Insert: {
          assigned_at?: string | null
          profile_id: string
          project_id: string
        }
        Update: {
          assigned_at?: string | null
          profile_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_links: {
        Row: {
          calcreno_project_id: string | null
          created_at: string | null
          id: string
          renotimeline_project_id: string | null
          user_id: string | null
        }
        Insert: {
          calcreno_project_id?: string | null
          created_at?: string | null
          id?: string
          renotimeline_project_id?: string | null
          user_id?: string | null
        }
        Update: {
          calcreno_project_id?: string | null
          created_at?: string | null
          id?: string
          renotimeline_project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_links_calcreno_project_id_fkey"
            columns: ["calcreno_project_id"]
            isOneToOne: false
            referencedRelation: "calcreno_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          owner_id: string
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner_id?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner_id?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string
          id: string
          message: string | null
          reminder_time: string
          reminder_type: string
          sent: boolean
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          reminder_time: string
          reminder_type: string
          sent?: boolean
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          reminder_time?: string
          reminder_type?: string
          sent?: boolean
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subtasks: {
        Row: {
          assigned_to: string | null
          completed: boolean
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          parent_task_id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_system_comment: boolean | null
          metadata: Json | null
          task_id: string | null
          updated_at: string | null
          user_id: string | null
          workflow_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_system_comment?: boolean | null
          metadata?: Json | null
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_system_comment?: boolean | null
          metadata?: Json | null
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          end_time: string | null
          estimated_hours: number | null
          id: string
          is_all_day: boolean | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          project_id: string
          start_date: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          end_time?: string | null
          estimated_hours?: number | null
          id?: string
          is_all_day?: boolean | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          project_id: string
          start_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          end_time?: string | null
          estimated_hours?: number | null
          id?: string
          is_all_day?: boolean | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          project_id?: string
          start_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          platform: string | null
          push_token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          platform?: string | null
          push_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          platform?: string | null
          push_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_push_tokens: {
        Row: {
          app_name: string
          created_at: string | null
          device_name: string | null
          id: string
          is_active: boolean | null
          platform: string
          push_token: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          app_name: string
          created_at?: string | null
          device_name?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          push_token: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          app_name?: string
          created_at?: string | null
          device_name?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          push_token?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          project_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_definitions: {
        Row: {
          actions: Json
          conditions: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          last_executed: string | null
          name: string
          project_id: string
          trigger_config: Json | null
          trigger_type: Database["public"]["Enums"]["workflow_trigger_type"]
          updated_at: string | null
        }
        Insert: {
          actions?: Json
          conditions?: Json | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          name: string
          project_id: string
          trigger_config?: Json | null
          trigger_type: Database["public"]["Enums"]["workflow_trigger_type"]
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          conditions?: Json | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          name?: string
          project_id?: string
          trigger_config?: Json | null
          trigger_type?: Database["public"]["Enums"]["workflow_trigger_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_definitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_definitions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          error_message: string | null
          executed_actions: Json | null
          execution_time: string | null
          id: string
          status: Database["public"]["Enums"]["workflow_execution_status"]
          trigger_data: Json
          workflow_id: string
        }
        Insert: {
          error_message?: string | null
          executed_actions?: Json | null
          execution_time?: string | null
          id?: string
          status?: Database["public"]["Enums"]["workflow_execution_status"]
          trigger_data?: Json
          workflow_id: string
        }
        Update: {
          error_message?: string | null
          executed_actions?: Json | null
          execution_time?: string | null
          id?: string
          status?: Database["public"]["Enums"]["workflow_execution_status"]
          trigger_data?: Json
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_new_project: {
        Args: {
          p_name: string
          p_description?: string
          p_start_date?: string
          p_end_date?: string
          p_budget?: number
        }
        Returns: string
      }
      create_project_with_owner: {
        Args: {
          name: string
          description: string
          start_date: string
          end_date: string
          budget: number
          organization_id: string
        }
        Returns: string
      }
      create_renotimeline_project: {
        Args: {
          project_name: string
          project_description?: string
          project_start_date?: string
          project_end_date?: string
          project_budget?: number
          project_owner_id?: string
        }
        Returns: string
      }
      get_project_id_from_path: {
        Args: { path_text: string }
        Returns: string
      }
      has_project_role: {
        Args: {
          _user_id: string
          _project_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_project_member: {
        Args: { p_project_id: string; p_profile_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "member" | "viewer"
      entity_type: "task" | "project"
      field_type:
        | "text"
        | "textarea"
        | "number"
        | "date"
        | "datetime"
        | "select"
        | "multi_select"
        | "boolean"
        | "url"
        | "email"
      notification_type:
        | "deadline"
        | "overdue"
        | "completed"
        | "system"
        | "workflow_executed"
        | "workflow_failed"
        | "automated_action"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "review" | "done"
      workflow_execution_status: "success" | "failed" | "partial"
      workflow_trigger_type:
        | "task_status_changed"
        | "task_created"
        | "task_assigned"
        | "due_date_approaching"
        | "custom_field_changed"
        | "file_uploaded"
        | "comment_added"
        | "project_status_changed"
        | "team_member_added"
        | "scheduled"
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
      app_role: ["owner", "admin", "member", "viewer"],
      entity_type: ["task", "project"],
      field_type: [
        "text",
        "textarea",
        "number",
        "date",
        "datetime",
        "select",
        "multi_select",
        "boolean",
        "url",
        "email",
      ],
      notification_type: [
        "deadline",
        "overdue",
        "completed",
        "system",
        "workflow_executed",
        "workflow_failed",
        "automated_action",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "review", "done"],
      workflow_execution_status: ["success", "failed", "partial"],
      workflow_trigger_type: [
        "task_status_changed",
        "task_created",
        "task_assigned",
        "due_date_approaching",
        "custom_field_changed",
        "file_uploaded",
        "comment_added",
        "project_status_changed",
        "team_member_added",
        "scheduled",
      ],
    },
  },
} as const
