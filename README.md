# Night Shift - Ship While You Sleep

Your AI engineering team works while you sleep. Describe requests in plain English, wake up to shipped code.

## What is Night Shift?

Night Shift is an AI-powered development platform where you describe software requests in plain English and AI agents build them, test them, and open pull requests—all while you're sleeping.

## Features

- **Natural Language Requests** - Describe what you want, not how to build it
- **AI-Powered Development** - Agents analyze your codebase and implement requests
- **GitHub Integration** - Automatic branch creation, commits, and pull requests
- **Real-time Shift Tracking** - Watch agents work with live logs and status updates
- **Quality Gates** - TypeScript, ESLint, Build, and Test verification
- **Team Collaboration** - Multi-user support with organization management

## How It Works

1. **Make a Request** - Describe what you want in plain English
2. **Sleep Soundly** - Our AI agents analyze your codebase and implement the request
3. **Wake Up to Shipped Code** - Review the pull request and merge

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **GitHub Integration**: GitHub App (OAuth)
- **AI Agents**: Claude (Anthropic API) with fallback to templates

## Quick Start

### 1. Clone and Install

```bash
git clone <repo>
cd night-shift
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_ROLE_KEY=...

# GitHub App
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GITHUB_APP_WEBHOOK_SECRET=...

# Orchestrator API Key (for agent communication)
ORCHESTRATOR_API_KEY=your-secret-key

# Anthropic (optional, for AI generation)
ANTHROPIC_API_KEY=sk-ant-...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
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
# Terminal 1: Start the Next.js app
npm run dev

# Terminal 2: Start the build agent
npm run agent
```

## Usage

### Create a Request

1. Go to Dashboard → "New Request"
2. Select a connected repository
3. Describe your request (e.g., "Add an about page with company info")
4. Submit

### Watch the Night Shift

1. Click on the request to open the detail page
2. Watch live shift logs in real-time
3. See quality gate results (TypeScript, ESLint, Build, Tests)
4. When complete, click "View Pull Request" to review

### Agent Workflow

```
Request → Queued → Running → Quality Gates → PR Created
              ↑___________↓
                 (live logs)
```

## Architecture

### Database Schema

- **organizations** - Teams/companies
- **users** - Team members (linked to Clerk)
- **repos** - GitHub repositories
- **features** - Feature requests (now called "requests")
- **builds** - Agent shift jobs (now called "shifts")
- **build_events** - Real-time shift logs

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/features` | GET/POST | List/create requests |
| `/api/repos` | GET | List connected repos |
| `/api/builds` | GET/PATCH | List/update shifts |
| `/api/builds/logs` | GET | SSE stream for live logs |
| `/api/builds/events` | GET | Historical shift events |
| `/api/orchestrate` | GET/POST | Agent polling & reporting |
| `/api/webhooks/clerk` | POST | Clerk user sync |
| `/api/webhooks/github` | POST | GitHub events |

### Shift Flow

1. **User creates request** → Shift record created with `status: 'queued'`
2. **Agent polls** → `GET /api/orchestrate` returns next queued shift
3. **Branch created** → Orchestrate API creates branch, updates to `running`
4. **Agent works** →
   - Clones repository
   - Analyzes codebase structure
   - Generates implementation plan (Claude AI)
   - Writes code changes
   - Runs quality gates (TypeScript, ESLint, Build, Tests)
   - Commits and pushes
5. **PR created** → Agent creates PR via GitHub API
6. **Complete** → Agent reports `status: 'success'`

## Scripts

```bash
# Run the build agent
npm run agent

# Test agent integration
npm run agent:test

# TypeScript check
npm run typecheck

# Build for production
npm run build
```

## Project Structure

```
night-shift/
├── scripts/
│   ├── build-agent.ts      # Main agent script
│   └── test-agent.ts       # Agent test suite
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   ├── orchestrate/     # Agent polling endpoint
│   │   │   ├── builds/          # Shift management
│   │   │   │   ├── logs/        # SSE endpoint
│   │   │   │   └── events/      # Historical events
│   │   │   ├── features/        # Request CRUD
│   │   │   └── webhooks/        # Clerk & GitHub webhooks
│   │   └── dashboard/
│   │       ├── features/        # Requests
│   │       │   ├── new/         # Create request
│   │       │   └── [id]/        # Request detail (live logs)
│   │       ├── builds/          # Active shifts
│   │       └── repos/           # Repo management
│   ├── components/
│   │   ├── ui/               # UI components
│   │   ├── logo.tsx          # Night Shift logo
│   │   ├── stars-background.tsx  # Animated stars
│   │   └── icons.tsx         # Icon components
│   ├── lib/
│   │   ├── github.ts       # GitHub API helpers
│   │   ├── supabase.ts     # Supabase client
│   │   └── clerk.ts        # Auth helpers
│   └── types/
│       ├── database.ts     # Supabase types
│       └── index.ts        # App types
├── supabase/
│   └── schema.sql          # Database schema
└── AGENT_INTEGRATION.md    # Detailed agent docs
```

## Quality Gates

Every shift must pass:

1. **TypeScript Compilation** - `tsc --noEmit`
2. **ESLint** - `eslint . --ext .ts,.tsx`
3. **Build Verification** - `npm run build`
4. **Test Execution** - `npm test`

## Demo: "Add About Page"

1. Navigate to Dashboard → "New Request"
2. Select your repository
3. Title: "Add about page"
4. Description: "Create a simple about page with company information and team details"
5. Submit
6. The agent will:
   - Poll and pick up the queued shift
   - Clone your repository
   - Analyze existing page patterns
   - Generate `src/app/about/page.tsx`
   - Run all quality gates
   - Commit to `night-shift/add-about-page-{timestamp}`
   - Create a pull request
7. Watch the live logs on the request detail page
8. Click "View Pull Request" when complete

## Documentation

- [Agent Integration Guide](AGENT_INTEGRATION.md) - Detailed agent documentation

## License

MIT
