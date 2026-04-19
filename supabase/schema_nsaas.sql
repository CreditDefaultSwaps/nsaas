-- NSaaS Schema for existing Supabase project
-- Run this in Supabase SQL Editor

-- Create schema for NSaaS (isolated from lifeos tables)
create schema if not exists nsaas;

-- Organizations (tenants)
create table nsaas.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  github_app_installation_id bigint,
  stripe_customer_id text,
  plan text default 'free', -- free, starter, pro, enterprise
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Users
create table nsaas.users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references nsaas.organizations(id) on delete cascade,
  clerk_id text unique,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'admin', -- admin, member, viewer
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Connected Repositories
create table nsaas.repos (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references nsaas.organizations(id) on delete cascade,
  github_repo_id bigint unique,
  full_name text not null, -- owner/repo
  name text not null,
  description text,
  default_branch text default 'main',
  private boolean default false,
  tech_stack jsonb default '{}', -- detected: {framework: 'nextjs', language: 'typescript'}
  connected_at timestamptz default now()
);

-- Feature Requests
create table nsaas.features (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references nsaas.organizations(id) on delete cascade,
  repo_id uuid references nsaas.repos(id) on delete set null,
  requested_by uuid references nsaas.users(id),
  title text not null,
  description text not null,
  attachments jsonb default '[]',
  priority text default 'p1', -- p0, p1, p2
  status text default 'pending', -- pending, queued, building, review, completed, failed, cancelled
  parsed_spec jsonb, -- structured output from LLM
  created_at timestamptz default now(),
  queued_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz
);

-- Build Runs
create table nsaas.builds (
  id uuid primary key default gen_random_uuid(),
  feature_id uuid references nsaas.features(id) on delete cascade,
  org_id uuid references nsaas.organizations(id) on delete cascade,
  agent_name text not null default 'night-shift-dev',
  status text default 'queued', -- queued, running, success, failed, cancelled
  started_at timestamptz,
  completed_at timestamptz,
  duration_ms integer,
  cost_usd decimal(10,4),
  pr_url text,
  pr_number integer,
  commit_sha text,
  branch_name text,
  agent_logs text,
  metadata jsonb default '{}', -- files changed, lines added, tests generated
  created_at timestamptz default now()
);

-- Build Events (for live dashboard)
create table nsaas.build_events (
  id uuid primary key default gen_random_uuid(),
  build_id uuid references nsaas.builds(id) on delete cascade,
  event_type text not null, -- started, file_created, test_passed, failed, etc.
  message text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Enable RLS
alter table nsaas.organizations enable row level security;
alter table nsaas.users enable row level security;
alter table nsaas.repos enable row level security;
alter table nsaas.features enable row level security;
alter table nsaas.builds enable row level security;
alter table nsaas.build_events enable row level security;

-- RLS Policies
-- Organizations: users can view their own org
CREATE POLICY "Users can view their org" ON nsaas.organizations
  FOR SELECT USING (id IN (
    SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
  ));

-- Users: users can view users in their org
CREATE POLICY "Users can view org users" ON nsaas.users
  FOR SELECT USING (org_id IN (
    SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
  ));

-- Repos: users can view repos in their org
CREATE POLICY "Users can view org repos" ON nsaas.repos
  FOR SELECT USING (org_id IN (
    SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
  ));

CREATE POLICY "Users can insert org repos" ON nsaas.repos
  FOR INSERT WITH CHECK (org_id IN (
    SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
  ));

-- Features: users can CRUD features in their org
CREATE POLICY "Users can view org features" ON nsaas.features
  FOR SELECT USING (org_id IN (
    SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
  ));

CREATE POLICY "Users can insert org features" ON nsaas.features
  FOR INSERT WITH CHECK (org_id IN (
    SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
  ));

CREATE POLICY "Users can update org features" ON nsaas.features
  FOR UPDATE USING (org_id IN (
    SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
  ));

-- Builds: users can view builds in their org
CREATE POLICY "Users can view org builds" ON nsaas.builds
  FOR SELECT USING (org_id IN (
    SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
  ));

CREATE POLICY "Users can update org builds" ON nsaas.builds
  FOR UPDATE USING (org_id IN (
    SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
  ));

-- Build Events: users can view events for their org's builds
CREATE POLICY "Users can view org build events" ON nsaas.build_events
  FOR SELECT USING (build_id IN (
    SELECT id FROM nsaas.builds WHERE org_id IN (
      SELECT org_id FROM nsaas.users WHERE clerk_id = auth.uid()::text
    )
  ));

-- Indexes for performance
CREATE INDEX idx_users_org ON nsaas.users(org_id);
CREATE INDEX idx_users_clerk ON nsaas.users(clerk_id);
CREATE INDEX idx_repos_org ON nsaas.repos(org_id);
CREATE INDEX idx_features_org ON nsaas.features(org_id);
CREATE INDEX idx_features_repo ON nsaas.features(repo_id);
CREATE INDEX idx_features_status ON nsaas.features(status);
CREATE INDEX idx_builds_feature ON nsaas.builds(feature_id);
CREATE INDEX idx_builds_org ON nsaas.builds(org_id);
CREATE INDEX idx_build_events_build ON nsaas.build_events(build_id);
CREATE INDEX idx_build_events_created ON nsaas.build_events(created_at);

-- Insert demo org for testing
INSERT INTO nsaas.organizations (id, name, slug, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Org', 'demo-org', 'starter')
ON CONFLICT DO NOTHING;

-- Insert demo user for testing
INSERT INTO nsaas.users (id, org_id, clerk_id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'demo-user', 'demo@example.com', 'Demo User', 'admin')
ON CONFLICT DO NOTHING;
