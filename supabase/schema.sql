-- NSaaS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  github_app_installation_id BIGINT,
  stripe_customer_id TEXT,
  plan TEXT DEFAULT 'free', -- free, starter, pro, enterprise
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  clerk_id TEXT UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin', -- admin, member, viewer
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connected Repositories
CREATE TABLE repos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  github_repo_id BIGINT UNIQUE,
  full_name TEXT NOT NULL, -- owner/repo
  name TEXT NOT NULL,
  description TEXT,
  default_branch TEXT DEFAULT 'main',
  private BOOLEAN DEFAULT FALSE,
  tech_stack JSONB DEFAULT '{}',
  connected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Requests
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  repo_id UUID REFERENCES repos(id) ON DELETE SET NULL,
  requested_by UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  priority TEXT DEFAULT 'p1', -- p0, p1, p2
  status TEXT DEFAULT 'pending', -- pending, queued, building, review, completed, failed, cancelled
  parsed_spec JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  queued_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Build Runs
CREATE TABLE builds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL DEFAULT 'night-shift-dev',
  status TEXT DEFAULT 'queued', -- queued, running, success, failed, cancelled
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  cost_usd DECIMAL(10,4),
  pr_url TEXT,
  pr_number INTEGER,
  commit_sha TEXT,
  branch_name TEXT,
  agent_logs TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Build Events (for live dashboard)
CREATE TABLE build_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  build_id UUID REFERENCES builds(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their org" ON organizations
  FOR SELECT USING (id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT));

CREATE POLICY "Users can view org users" ON users
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT));

CREATE POLICY "Users can view org repos" ON repos
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT));

CREATE POLICY "Users can insert org repos" ON repos
  FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT));

CREATE POLICY "Users can view org features" ON features
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT));

CREATE POLICY "Users can insert org features" ON features
  FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT));

CREATE POLICY "Users can update org features" ON features
  FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT));

CREATE POLICY "Users can view org builds" ON builds
  FOR SELECT USING (org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT));

CREATE POLICY "Users can update org builds" ON builds
  FOR UPDATE USING (org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT));

CREATE POLICY "Users can view org build events" ON build_events
  FOR SELECT USING (build_id IN (
    SELECT id FROM builds WHERE org_id IN (
      SELECT org_id FROM users WHERE clerk_id = auth.uid()::TEXT
    )
  ));

-- Indexes
CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_users_clerk ON users(clerk_id);
CREATE INDEX idx_repos_org ON repos(org_id);
CREATE INDEX idx_features_org ON features(org_id);
CREATE INDEX idx_features_repo ON features(repo_id);
CREATE INDEX idx_features_status ON features(status);
CREATE INDEX idx_builds_feature ON builds(feature_id);
CREATE INDEX idx_builds_org ON builds(org_id);
CREATE INDEX idx_build_events_build ON build_events(build_id);
CREATE INDEX idx_build_events_created ON build_events(created_at);

-- Insert demo data
INSERT INTO organizations (id, name, slug, plan) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Demo Org', 'demo-org', 'starter')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, org_id, clerk_id, email, full_name, role) VALUES 
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'demo-user', 'demo@nsaas.dev', 'Demo User', 'admin')
ON CONFLICT DO NOTHING;
