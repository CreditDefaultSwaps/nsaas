-- Integration Waitlist table for Slack/Discord notifications
CREATE TABLE IF NOT EXISTS integration_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE integration_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public waitlist)
CREATE POLICY "Anyone can join integration waitlist" ON integration_waitlist
  FOR INSERT WITH CHECK (true);

-- Only service role can view/update
CREATE POLICY "Service role can view integration waitlist" ON integration_waitlist
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update integration waitlist" ON integration_waitlist
  FOR UPDATE USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX idx_integration_waitlist_email ON integration_waitlist(email);
CREATE INDEX idx_integration_waitlist_notified ON integration_waitlist(notified);
CREATE INDEX idx_integration_waitlist_created ON integration_waitlist(created_at);
