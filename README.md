# NSaaS - Natural Language → Working Software

An AI-powered development platform where you describe features in plain English and AI agents build them, test them, and open pull requests.

## Features

- **Natural Language Feature Requests** - Describe what you want, not how to build it
- **AI-Powered Development** - Agents analyze your codebase and implement features
- **GitHub Integration** - Automatic branch creation, commits, and pull requests
- **Real-time Build Tracking** - Watch agents work with live logs and status updates
- **Team Collaboration** - Multi-user support with organization management

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **GitHub Integration**: GitHub App (OAuth)
- **AI Agents**: OpenClaw subagents (Week 4 integration)

## Quick Start

### 1. Clone and Install

```bash
git clone <repo>
cd nsaas
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the schema from `supabase/schema.sql` in the SQL Editor
3. Copy your project URL and service role key to `.env.local`

### 4. Clerk Setup

1. Create a Clerk application at https://clerk.dev
2. Configure the webhook endpoint: `/api/webhooks/clerk`
3. Copy publishable key, secret key, and webhook secret to `.env.local`

### 5. GitHub App Setup

1. Create a GitHub App at Settings → Developer settings → GitHub Apps
2. Set callback URL to `{APP_URL}/api/auth/github/callback`
3. Enable webhook and set URL to `{APP_URL}/api/webhooks/github`
4. Required permissions:
   - Repository contents (read/write)
   - Pull requests (read/write)
   - Metadata (read)
5. Generate and download private key
6. Copy App ID, private key, and webhook secret to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

## Architecture

### Database Schema

- **organizations** - Teams/companies
- **users** - Team members (linked to Clerk)
- **repos** - GitHub repositories
- **features** - Feature requests
- **builds** - Agent build jobs
- **build_events** - Real-time build logs

### API Endpoints

- `POST /api/features` - Create feature request
- `GET /api/features` - List features
- `GET /api/repos` - List connected repos
- `GET /api/builds` - List builds
- `PATCH /api/builds` - Update build status
- `GET /api/orchestrate` - Agent polling endpoint
- `POST /api/orchestrate` - Agent progress reporting
- `POST /api/webhooks/clerk` - Clerk user sync
- `POST /api/webhooks/github` - GitHub events

### Build Flow

1. User creates feature request → Build queued
2. Agent polls `/api/orchestrate` for work
3. Agent creates branch and implements feature
4. Agent pushes commits and opens PR
5. Agent reports progress via `/api/orchestrate`
6. User reviews PR and merges

## Week 4: Agent Integration

The build orchestration skeleton is in place. Week 4 deliverables:

- [ ] Agent polling loop implementation
- [ ] Code analysis and planning
- [ ] File modification engine
- [ ] Test execution
- [ ] PR creation and linking
- [ ] Error handling and retries

## License

MIT
