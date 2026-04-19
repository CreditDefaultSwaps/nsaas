# NSaaS Build Agent Integration

## Overview

The NSaaS Build Agent is an autonomous system that:
1. Polls for queued feature builds
2. Clones the target repository
3. Analyzes the codebase structure
4. Generates implementation plans using AI (Claude)
5. Writes code changes
6. Runs quality gates (TypeScript, ESLint, Build, Tests)
7. Commits and pushes to a branch
8. Creates a pull request
9. Reports real-time progress

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Dashboard │────▶│  /api/features│────▶│   Supabase  │
│  (User UI)  │     │   (Create)    │     │  (Database) │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
┌─────────────┐     ┌──────────────┐           │
│   Feature   │◀────│  /api/orchestrate│◀──────┘
│ Detail Page │     │   (Poll/Report) │
│ (Live Logs) │     └───────┬──────┘
└─────────────┘             │
                            ▼
                     ┌──────────────┐
                     │  Build Agent │
                     │  (scripts/   │
                     │ build-agent.ts│
                     └──────────────┘
```

## Components

### 1. Build Agent (`scripts/build-agent.ts`)

The main agent script that runs continuously, polling for work:

```bash
# Run the agent
npm run agent

# Or with environment variables
NSaaS_API_URL=http://localhost:3000 \
ORCHESTRATOR_API_KEY=your-key \
ANTHROPIC_API_KEY=your-claude-key \
npm run agent
```

**Key Functions:**
- `pollForBuild()` - Polls `/api/orchestrate` for queued builds
- `processBuild()` - Main workflow orchestrator
- `cloneRepository()` - Clones repo with GitHub token
- `analyzeCodebase()` - Reads package.json, tsconfig, samples files
- `generateImplementationPlan()` - Uses Claude to plan implementation
- `applyChanges()` - Writes files to working directory
- `runQualityGates()` - Runs TypeScript, ESLint, Build, Tests
- `commitAndPush()` - Creates branch, commits, pushes
- `createPullRequest()` - Creates PR via GitHub API
- `reportProgress()` - Reports events back to API

### 2. Orchestrate API (`/api/orchestrate`)

**GET** - Agent polls for next queued build
```typescript
// Response
{
  build: {
    id: string;
    feature: { id, title, description, branch_name };
    repo: { id, full_name, default_branch };
    token: string; // GitHub installation token
  }
}
```

**POST** - Agent reports progress
```typescript
// Request
{
  build_id: string;
  event_type: 'log' | 'status_change' | 'error' | 'completion';
  message: string;
  metadata?: Record<string, any>;
  status?: 'running' | 'success' | 'failed' | 'cancelled';
}
```

### 3. Build Logs SSE (`/api/builds/logs?build_id=xxx`)

Server-Sent Events endpoint for real-time build logs:

```typescript
const eventSource = new EventSource('/api/builds/logs?build_id=xxx');

eventSource.addEventListener('log', (e) => {
  const event = JSON.parse(e.data);
  console.log(event.message);
});

eventSource.addEventListener('completion', (e) => {
  // Build complete
});
```

### 4. Feature Detail Page (`/dashboard/features/[id]`)

Displays:
- Feature info (title, description, status)
- Build status card with live indicator
- Real-time build logs (terminal-style)
- PR link when complete

## Quality Gates

The agent runs these checks before committing:

1. **TypeScript Compilation** (`tsc --noEmit`)
2. **ESLint** (`eslint . --ext .ts,.tsx`)
3. **Build Verification** (`npm run build`)
4. **Test Execution** (`npm test`)

All gates must pass for the build to succeed.

## Environment Variables

```bash
# Required
ORCHESTRATOR_API_KEY=secret-key-for-agent-auth
GITHUB_APP_ID=your-github-app-id
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."

# Optional (for AI generation)
ANTHROPIC_API_KEY=your-claude-api-key

# App
NSaaS_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Database Schema

### builds
```sql
id UUID PRIMARY KEY
feature_id UUID REFERENCES features(id)
org_id UUID REFERENCES organizations(id)
status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled'
started_at TIMESTAMP
completed_at TIMESTAMP
pr_number INTEGER
commit_sha TEXT
```

### build_events
```sql
id UUID PRIMARY KEY
build_id UUID REFERENCES builds(id)
event_type: 'log' | 'status_change' | 'error' | 'completion'
message TEXT
metadata JSONB
created_at TIMESTAMP
```

## Workflow

1. **User creates feature** → Dashboard calls `POST /api/features`
2. **Auto-create build** → Feature API creates `builds` record with `status: 'queued'`
3. **Agent polls** → Agent calls `GET /api/orchestrate`, gets build
4. **Branch created** → Orchestrate API creates branch, updates status to `running`
5. **Agent builds** → Clones, analyzes, generates code, runs quality gates
6. **Progress reported** → Agent calls `POST /api/orchestrate` with events
7. **Real-time updates** → Dashboard receives SSE events, updates UI
8. **PR created** → Agent pushes branch, creates PR via GitHub API
9. **Build complete** → Agent reports `status: 'success'`, feature updated

## Testing

```bash
# Run agent tests
npx ts-node scripts/test-agent.ts

# Run TypeScript check
npm run typecheck

# Run build
npm run build
```

## Demo: "Add About Page"

1. Go to Dashboard → New Feature
2. Select a repository
3. Title: "Add about page"
4. Description: "Create a simple about page with company info"
5. Submit
6. Agent will:
   - Poll and pick up the build
   - Clone the repo
   - Analyze existing page structure
   - Generate `src/app/about/page.tsx`
   - Run quality gates
   - Commit and push to `nsaas/add-about-page-{timestamp}`
   - Create PR
7. Watch live logs on feature detail page
8. Click "View Pull Request" when done

## Future Enhancements

- [ ] Webhook trigger instead of polling
- [ ] Multi-agent parallel builds
- [ ] Caching for faster clones
- [ ] Incremental builds
- [ ] Custom quality gate configuration
- [ ] Build artifacts storage
- [ ] Rollback capability
