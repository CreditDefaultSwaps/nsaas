-- GitHub Integration Migration
-- Adds columns to features and builds for real GitHub integration tracking

-- Add GitHub metadata to features (shift requests)
ALTER TABLE features
  ADD COLUMN IF NOT EXISTS github_repo TEXT,
  ADD COLUMN IF NOT EXISTS github_installation_id BIGINT,
  ADD COLUMN IF NOT EXISTS github_branch TEXT,
  ADD COLUMN IF NOT EXISTS github_pr_url TEXT;

-- Add GitHub metadata to builds for real URLs
ALTER TABLE builds
  ADD COLUMN IF NOT EXISTS github_branch TEXT,
  ADD COLUMN IF NOT EXISTS github_commit_url TEXT,
  ADD COLUMN IF NOT EXISTS github_pr_url TEXT;

-- Update existing indexes
CREATE INDEX IF NOT EXISTS idx_features_github_repo ON features(github_repo);
CREATE INDEX IF NOT EXISTS idx_features_github_pr_url ON features(github_pr_url);
CREATE INDEX IF NOT EXISTS idx_builds_github_branch ON builds(github_branch);
