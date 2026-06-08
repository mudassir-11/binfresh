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
      bookings: {
        Row: {
          id: string
          customer_id: string
          plan_id: string
          service_date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          plan_id: string
          service_date: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          plan_id?: string
          service_date?: string
          status?: string
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          city: string
          zip_code: string
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          city: string
          zip_code: string
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          zip_code?: string
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          price: number
          frequency: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          frequency: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          frequency?: string
        }
      }
      service_jobs: {
        Row: {
          id: string
          customer_id: string
          job_date: string
          job_type: string | null
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          job_date: string
          job_type?: string | null
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          job_date?: string
          job_type?: string | null
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          customer_id: string
          plan_id: string
          status: string
          next_service_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          plan_id: string
          status?: string
          next_service_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          plan_id?: string
          status?: string
          next_service_date?: string | null
          created_at?: string
        }
      }
    }
  }
}
