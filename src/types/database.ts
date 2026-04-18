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
  };
}
