export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      waitlist: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          company_name: string | null;
          email: string;
          status: 'pending' | 'approved' | 'invited' | 'paid';
          source: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          company_name?: string | null;
          email: string;
          status?: 'pending' | 'approved' | 'invited' | 'paid';
          source?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          company_name?: string | null;
          email?: string;
          status?: 'pending' | 'approved' | 'invited' | 'paid';
          source?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          github_app_installation_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          github_app_installation_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          github_app_installation_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          org_id: string;
          role: 'admin' | 'member';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          org_id: string;
          role?: 'admin' | 'member';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          org_id?: string;
          role?: 'admin' | 'member';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          }
        ];
      };
      repos: {
        Row: {
          id: string;
          org_id: string;
          github_repo_id: number;
          full_name: string;
          name: string;
          default_branch: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          github_repo_id: number;
          full_name: string;
          name: string;
          default_branch?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          github_repo_id?: number;
          full_name?: string;
          name?: string;
          default_branch?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'repos_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          }
        ];
      };
      features: {
        Row: {
          id: string;
          org_id: string;
          repo_id: string;
          title: string;
          description: string;
          status: 'pending' | 'in_progress' | 'building' | 'testing' | 'completed' | 'failed';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          created_by: string;
          pr_url: string | null;
          branch_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          repo_id: string;
          title: string;
          description: string;
          status?: 'pending' | 'in_progress' | 'building' | 'testing' | 'completed' | 'failed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          created_by: string;
          pr_url?: string | null;
          branch_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          repo_id?: string;
          title?: string;
          description?: string;
          status?: 'pending' | 'in_progress' | 'building' | 'testing' | 'completed' | 'failed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          created_by?: string;
          pr_url?: string | null;
          branch_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'features_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'features_repo_id_fkey';
            columns: ['repo_id'];
            isOneToOne: false;
            referencedRelation: 'repos';
            referencedColumns: ['id'];
          }
        ];
      };
      builds: {
        Row: {
          id: string;
          feature_id: string;
          org_id: string;
          status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          agent_id: string | null;
          agent_logs: string | null;
          pr_number: number | null;
          commit_sha: string | null;
        };
        Insert: {
          id?: string;
          feature_id: string;
          org_id: string;
          status?: 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          agent_id?: string | null;
          agent_logs?: string | null;
          pr_number?: number | null;
          commit_sha?: string | null;
        };
        Update: {
          id?: string;
          feature_id?: string;
          org_id?: string;
          status?: 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          agent_id?: string | null;
          agent_logs?: string | null;
          pr_number?: number | null;
          commit_sha?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'builds_feature_id_fkey';
            columns: ['feature_id'];
            isOneToOne: false;
            referencedRelation: 'features';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'builds_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          }
        ];
      };
      build_events: {
        Row: {
          id: string;
          build_id: string;
          event_type: 'log' | 'status_change' | 'error' | 'completion';
          message: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          build_id: string;
          event_type: 'log' | 'status_change' | 'error' | 'completion';
          message: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          build_id?: string;
          event_type?: 'log' | 'status_change' | 'error' | 'completion';
          message?: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'build_events_build_id_fkey';
            columns: ['build_id'];
            isOneToOne: false;
            referencedRelation: 'builds';
            referencedColumns: ['id'];
          }
        ];
      };
      integration_waitlist: {
        Row: {
          id: string;
          email: string;
          notified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          notified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          notified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
