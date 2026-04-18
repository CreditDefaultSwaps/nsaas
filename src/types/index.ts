// NSaaS Core Types

export interface Organization {
  id: string;
  name: string;
  slug: string;
  github_app_installation_id?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  org_id: string;
  role: 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export interface Repo {
  id: string;
  org_id: string;
  github_repo_id: number;
  full_name: string;
  name: string;
  default_branch: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feature {
  id: string;
  org_id: string;
  repo_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'building' | 'testing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_by: string;
  pr_url?: string;
  branch_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Build {
  id: string;
  feature_id: string;
  org_id: string;
  status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  created_at: string;
  agent_id?: string;
  agent_logs?: string;
  pr_number?: number;
  commit_sha?: string;
}

export interface BuildEvent {
  id: string;
  build_id: string;
  event_type: 'log' | 'status_change' | 'error' | 'completion';
  message: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CreateFeatureRequest {
  repo_id: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}
