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
  organizations?: Organization;
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

export type FeatureStatus = 'pending' | 'in_progress' | 'building' | 'testing' | 'completed' | 'failed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Feature {
  id: string;
  org_id: string;
  repo_id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  priority: Priority;
  created_by: string;
  pr_url?: string | null;
  branch_name?: string | null;
  created_at: string;
  updated_at: string;
  repos?: {
    name: string;
    full_name: string;
  };
}

export type BuildStatus = 'queued' | 'running' | 'success' | 'failed' | 'cancelled';

export interface Build {
  id: string;
  feature_id: string;
  org_id: string;
  status: BuildStatus;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  agent_id?: string | null;
  agent_logs?: string | null;
  pr_number?: number | null;
  commit_sha?: string | null;
  deployed_url?: string | null;
  features?: {
    title: string;
  };
}

export type BuildEventType = 'log' | 'status_change' | 'error' | 'completion';

export interface BuildEvent {
  id: string;
  build_id: string;
  event_type: BuildEventType;
  message: string;
  metadata?: Record<string, any> | null;
  created_at: string;
}

export interface CreateFeatureRequest {
  repo_id: string;
  title: string;
  description: string;
  priority?: Priority;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface FeatureListResponse {
  features: Feature[];
}

export interface FeatureResponse {
  feature: Feature;
}

export interface RepoListResponse {
  repos: Repo[];
}

export interface BuildListResponse {
  builds: Build[];
}

export interface BuildResponse {
  build: Build;
}

export interface BuildEventListResponse {
  events: BuildEvent[];
}
