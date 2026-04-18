-- NSaaS Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  github_app_installation_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (linked to Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repos table (GitHub repos)
CREATE TABLE repos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  github_repo_id BIGINT NOT NULL,
  full_name TEXT NOT NULL,
  name TEXT NOT NULL,
  default_branch TEXT DEFAULT 'main',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, github_repo_id)
);

-- Features table (feature requests)
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  repo_id UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'building', 'testing', 'completed', 'failed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_by UUID NOT NULL REFERENCES users(id),
  pr_url TEXT,
  branch_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Builds table (agent builds)
CREATE TABLE builds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'success', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  agent_id TEXT,
  agent_logs TEXT,
  pr_number INTEGER,
  commit_sha TEXT
);

-- Build events table (real-time logs)
CREATE TABLE build_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  build_id UUID NOT NULL REFERENCES builds(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('log', 'status_change', 'error', 'completion')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_repos_org_id ON repos(org_id);
CREATE INDEX idx_features_org_id ON features(org_id);
CREATE INDEX idx_features_repo_id ON features(repo_id);
CREATE INDEX idx_features_status ON features(status);
CREATE INDEX idx_builds_feature_id ON builds(feature_id);
CREATE INDEX idx_builds_org_id ON builds(org_id);
CREATE INDEX idx_build_events_build_id ON build_events(build_id);

-- Row Level Security (RLS) policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_events ENABLE ROW LEVEL SECURITY;

-- Organizations: users can view their own org
CREATE POLICY org_select ON organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::text)
  );

-- Users: users can view users in their org
CREATE POLICY users_select ON users
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::text)
  );

-- Repos: users can view repos in their org
CREATE POLICY repos_select ON repos
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::text)
  );

-- Features: users can CRUD features in their org
CREATE POLICY features_all ON features
  FOR ALL USING (
    org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::text)
  );

-- Builds: users can view builds in their org
CREATE POLICY builds_all ON builds
  FOR ALL USING (
    org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::text)
  );

-- Build events: users can view events for builds in their org
CREATE POLICY build_events_select ON build_events
  FOR SELECT USING (
    build_id IN (
      SELECT b.id FROM builds b
      JOIN features f ON b.feature_id = f.id
      WHERE f.org_id IN (SELECT org_id FROM users WHERE clerk_id = auth.uid()::text)
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_repos_updated_at BEFORE UPDATE ON repos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
