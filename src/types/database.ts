export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export enum UserRole {
  Admin = 'admin',
  Trainer = 'trainer',
  Member = 'member',
  Waiting = 'waiting',
}

export enum AttendanceStatus {
  Confirmed = 'confirmed',
  Declined = 'declined',
  Maybe = 'maybe',
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: UserRole
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: UserRole
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: UserRole
          updated_at?: string | null
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string | null
        }
      }
      group_members: {
        Row: {
          user_id: string
          group_id: string
        }
        Insert: {
          user_id: string
          group_id: string
        }
        Update: {
          user_id?: string
          group_id?: string
        }
      }
      training_templates: {
        Row: {
          id: string
          group_id: string | null
          day_of_week: number | null
          start_time: string
          location: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          group_id?: string | null
          day_of_week?: number | null
          start_time: string
          location?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          group_id?: string | null
          day_of_week?: number | null
          start_time?: string
          location?: string | null
          created_at?: string | null
        }
      }
      trainings: {
        Row: {
          id: string
          template_id: string | null
          date: string
          topic: string | null
          trainer_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          template_id?: string | null
          date: string
          topic?: string | null
          trainer_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          template_id?: string | null
          date?: string
          topic?: string | null
          trainer_id?: string | null
          created_at?: string | null
        }
      }
      attendance: {
        Row: {
          training_id: string
          user_id: string
          status: AttendanceStatus
          updated_at: string | null
        }
        Insert: {
          training_id: string
          user_id: string
          status: AttendanceStatus
          updated_at?: string | null
        }
        Update: {
          training_id?: string
          user_id?: string
          status?: AttendanceStatus
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      attendance_status: AttendanceStatus
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type TrainingTemplate = Database['public']['Tables']['training_templates']['Row']
export type Training = Database['public']['Tables']['trainings']['Row']
export type Attendance = Database['public']['Tables']['attendance']['Row']
