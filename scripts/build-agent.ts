#!/usr/bin/env ts-node
/**
 * NSaaS Build Agent
 * 
 * Autonomous agent that:
 * 1. Polls /api/orchestrate for queued builds
 * 2. Clones repo with GitHub token
 * 3. Analyzes codebase structure
 * 4. Generates implementation plan using LLM
 * 5. Writes code changes
 * 6. Runs quality gates (TypeScript, ESLint, build, tests)
 * 7. Commits and pushes branch
 * 8. Creates PR via GitHub API
 * 9. Reports progress back to API
 */

import { execSync, spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const ORCHESTRATOR_URL = process.env.NSaaS_API_URL || 'http://localhost:3000';
const API_KEY = process.env.ORCHESTRATOR_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('Error: ORCHESTRATOR_API_KEY environment variable is required');
  process.exit(1);
}

interface BuildJob {
  id: string;
  feature: {
    id: string;
    title: string;
    description: string;
    branch_name: string;
  };
  repo: {
    id: string;
    full_name: string;
    default_branch: string;
  };
  token: string;
}

interface FileChange {
  path: string;
  content: string;
  action: 'create' | 'modify' | 'delete';
}

interface ImplementationPlan {
  summary: string;
  files: FileChange[];
}

// Poll for next queued build
async function pollForBuild(): Promise<BuildJob | null> {
  const res = await fetch(`${ORCHESTRATOR_URL}/api/orchestrate`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (!res.ok) {
    console.error('Failed to poll:', await res.text());
    return null;
  }

  const data = await res.json();
  return data.build || null;
}

// Report progress back to orchestrator
async function reportProgress(
  buildId: string,
  eventType: 'log' | 'status_change' | 'error' | 'completion',
  message: string,
  metadata?: Record<string, any>,
  status?: string
) {
  const res = await fetch(`${ORCHESTRATOR_URL}/api/orchestrate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      build_id: buildId,
      event_type: eventType,
      message,
      metadata: metadata || {},
      status,
    }),
  });

  if (!res.ok) {
    console.error('Failed to report progress:', await res.text());
  } else {
    console.log(`[${eventType}] ${message}`);
  }
}

// Clone repository to temp directory
async function cloneRepository(job: BuildJob, workDir: string): Promise<void> {
  const [owner, repo] = job.repo.full_name.split('/');
  const repoUrl = `https://x-access-token:${job.token}@github.com/${job.repo.full_name}.git`;
  
  execSync(`git clone --depth 1 --branch ${job.repo.default_branch} ${repoUrl} ${workDir}`, {
    stdio: 'pipe',
  });
}

// Analyze codebase structure
async function analyzeCodebase(workDir: string): Promise<string> {
  const structure: string[] = [];
  
  // Read key config files
  const configFiles = ['package.json', 'tsconfig.json', 'next.config.js', 'next.config.mjs', 'tailwind.config.ts'];
  for (const file of configFiles) {
    try {
      const content = await fs.readFile(join(workDir, file), 'utf-8');
      structure.push(`=== ${file} ===\n${content.slice(0, 2000)}\n`);
    } catch {
      // File doesn't exist, skip
    }
  }
  
  // Get directory structure
  try {
    const srcDir = join(workDir, 'src');
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    structure.push(`=== src/ directory structure ===\n${dirs.join(', ')}\n`);
    
    // Sample some existing files for patterns
    for (const dir of ['app', 'components', 'lib'].filter(d => dirs.includes(d))) {
      const dirPath = join(srcDir, dir);
      const files = await fs.readdir(dirPath);
      const sampleFiles = files.slice(0, 3);
      for (const file of sampleFiles) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const content = await fs.readFile(join(dirPath, file), 'utf-8');
          structure.push(`=== src/${dir}/${file} (sample) ===\n${content.slice(0, 1500)}\n`);
        }
      }
    }
  } catch {
    // src dir might not exist
  }
  
  return structure.join('\n');
}

// Generate implementation plan using Claude
async function generateImplementationPlan(
  featureTitle: string,
  featureDescription: string,
  codebaseAnalysis: string
): Promise<ImplementationPlan> {
  if (!ANTHROPIC_API_KEY) {
    // Fallback: generate a simple plan without AI
    return generateSimplePlan(featureTitle, featureDescription);
  }

  const prompt = `You are an expert software engineer. Given a feature request and codebase analysis, generate an implementation plan.

## Feature Request
Title: ${featureTitle}
Description: ${featureDescription}

## Codebase Analysis
${codebaseAnalysis}

## Instructions
Generate a JSON response with:
1. A brief summary of the implementation approach
2. An array of file changes needed

Each file change should have:
- path: relative path from project root (e.g., "src/app/about/page.tsx")
- content: the full file content
- action: "create" or "modify"

Respond ONLY with valid JSON in this format:
{
  "summary": "Brief implementation summary",
  "files": [
    {
      "path": "src/app/example/page.tsx",
      "content": "export default function...",
      "action": "create"
    }
  ]
}

Follow the existing code patterns in the codebase. Use TypeScript, proper imports, and match the existing style.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('Claude API error:', error);
    return generateSimplePlan(featureTitle, featureDescription);
  }

  const data = await res.json();
  const content = data.content?.[0]?.text || data.content;
  
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/```json\n?([\s\S]*?)```/) || content.match(/({[\s\S]*})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    const plan = JSON.parse(jsonStr);
    return plan;
  } catch (e) {
    console.error('Failed to parse Claude response:', e);
    return generateSimplePlan(featureTitle, featureDescription);
  }
}

// Simple fallback plan generator
function generateSimplePlan(title: string, description: string): ImplementationPlan {
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // Simple about page template
  if (title.toLowerCase().includes('about')) {
    return {
      summary: 'Create a simple About page',
      files: [
        {
          path: `src/app/${normalizedTitle}/page.tsx`,
          content: `export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
      <p className="text-lg text-gray-600 leading-relaxed">
        ${description}
      </p>
    </div>
  );
}`,
          action: 'create',
        },
      ],
    };
  }
  
  // Generic page template
  return {
    summary: `Create ${title} feature`,
    files: [
      {
        path: `src/app/${normalizedTitle}/page.tsx`,
        content: `export default function ${title.replace(/\s+/g, '')}Page() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">${title}</h1>
      <p className="text-lg text-gray-600 leading-relaxed">
        ${description}
      </p>
    </div>
  );
}`,
        action: 'create',
      },
    ],
  };
}

// Apply file changes to working directory
async function applyChanges(workDir: string, files: FileChange[]): Promise<void> {
  for (const file of files) {
    const filePath = join(workDir, file.path);
    const dir = filePath.substring(0, filePath.lastIndexOf('/'));
    
    if (file.action === 'delete') {
      try {
        await fs.unlink(filePath);
      } catch {
        // File might not exist
      }
    } else {
      // Ensure directory exists
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, file.content, 'utf-8');
    }
  }
}

// Run quality gates
interface QualityGateResult {
  passed: boolean;
  type: string;
  output: string;
}

async function runQualityGates(workDir: string): Promise<QualityGateResult[]> {
  const results: QualityGateResult[] = [];
  
  // TypeScript compilation check
  try {
    execSync('npx tsc --noEmit', { cwd: workDir, stdio: 'pipe' });
    results.push({ passed: true, type: 'typescript', output: 'TypeScript compilation successful' });
  } catch (error: any) {
    results.push({ passed: false, type: 'typescript', output: error.stdout?.toString() || error.message });
  }
  
  // ESLint check
  try {
    execSync('npx eslint . --ext .ts,.tsx --max-warnings 0', { cwd: workDir, stdio: 'pipe' });
    results.push({ passed: true, type: 'eslint', output: 'ESLint check passed' });
  } catch (error: any) {
    results.push({ passed: false, type: 'eslint', output: error.stdout?.toString() || error.message });
  }
  
  // Build verification
  try {
    execSync('npm run build', { cwd: workDir, stdio: 'pipe', timeout: 300000 });
    results.push({ passed: true, type: 'build', output: 'Build successful' });
  } catch (error: any) {
    results.push({ passed: false, type: 'build', output: error.stdout?.toString() || error.message });
  }
  
  // Test execution (if tests exist)
  try {
    const hasTests = await fs.access(join(workDir, 'src', '__tests__'))
      .then(() => true)
      .catch(() => false);
    
    if (hasTests) {
      execSync('npm test', { cwd: workDir, stdio: 'pipe', timeout: 120000 });
      results.push({ passed: true, type: 'tests', output: 'All tests passed' });
    } else {
      results.push({ passed: true, type: 'tests', output: 'No tests found (skipped)' });
    }
  } catch (error: any) {
    results.push({ passed: false, type: 'tests', output: error.stdout?.toString() || error.message });
  }
  
  return results;
}

// Commit and push changes
async function commitAndPush(workDir: string, branchName: string, featureTitle: string): Promise<string> {
  // Configure git
  execSync('git config user.email "nsaas-agent@example.com"', { cwd: workDir });
  execSync('git config user.name "NSaaS Agent"', { cwd: workDir });
  
  // Create and checkout branch
  execSync(`git checkout -b ${branchName}`, { cwd: workDir });
  
  // Stage all changes
  execSync('git add -A', { cwd: workDir });
  
  // Commit
  execSync(`git commit -m "feat: ${featureTitle}"`, { cwd: workDir });
  
  // Push
  execSync(`git push origin ${branchName}`, { cwd: workDir });
  
  // Get commit SHA
  const sha = execSync('git rev-parse HEAD', { cwd: workDir, encoding: 'utf-8' }).trim();
  return sha;
}

// Create pull request via GitHub API
async function createPullRequest(
  job: BuildJob,
  featureTitle: string,
  featureDescription: string
): Promise<{ number: number; url: string }> {
  const [owner, repo] = job.repo.full_name.split('/');
  
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${job.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `feat: ${featureTitle}`,
      body: `## Feature\n\n${featureDescription}\n\n---\n*Generated by NSaaS Agent*`,
      head: job.feature.branch_name,
      base: job.repo.default_branch,
    }),
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create PR: ${error}`);
  }
  
  const pr = await res.json();
  return { number: pr.number, url: pr.html_url };
}

// Main build processing function
async function processBuild(job: BuildJob): Promise<void> {
  const workDir = join(tmpdir(), `nsaas-build-${job.id}`);
  
  try {
    await reportProgress(job.id, 'status_change', 'Build started', {}, 'running');
    
    // 1. Clone repository
    await reportProgress(job.id, 'log', 'Cloning repository...');
    await cloneRepository(job, workDir);
    await reportProgress(job.id, 'log', `Repository cloned to ${workDir}`);
    
    // 2. Analyze codebase
    await reportProgress(job.id, 'log', 'Analyzing codebase structure...');
    const analysis = await analyzeCodebase(workDir);
    await reportProgress(job.id, 'log', 'Codebase analysis complete', { 
      files_analyzed: analysis.split('===').length - 1 
    });
    
    // 3. Generate implementation plan
    await reportProgress(job.id, 'log', 'Generating implementation plan...');
    const plan = await generateImplementationPlan(
      job.feature.title,
      job.feature.description,
      analysis
    );
    await reportProgress(job.id, 'log', `Plan generated: ${plan.summary}`, {
      summary: plan.summary,
      files_count: plan.files.length,
    });
    
    // 4. Apply changes
    await reportProgress(job.id, 'log', 'Applying code changes...');
    await applyChanges(workDir, plan.files);
    await reportProgress(job.id, 'log', `Applied ${plan.files.length} file changes`, {
      files: plan.files.map(f => ({ path: f.path, action: f.action })),
    });
    
    // 5. Run quality gates
    await reportProgress(job.id, 'log', 'Running quality gates...');
    const qualityResults = await runQualityGates(workDir);
    const allPassed = qualityResults.every(r => r.passed);
    
    for (const result of qualityResults) {
      await reportProgress(
        job.id,
        result.passed ? 'log' : 'error',
        `${result.type}: ${result.passed ? '✓' : '✗'} ${result.output.slice(0, 200)}`,
        { gate: result.type, passed: result.passed }
      );
    }
    
    if (!allPassed) {
      throw new Error('Quality gates failed. See logs for details.');
    }
    
    // 6. Commit and push
    await reportProgress(job.id, 'log', 'Committing and pushing changes...');
    const commitSha = await commitAndPush(workDir, job.feature.branch_name, job.feature.title);
    await reportProgress(job.id, 'log', `Changes pushed to branch ${job.feature.branch_name}`, {
      commit_sha: commitSha,
    });
    
    // 7. Create PR
    await reportProgress(job.id, 'log', 'Creating pull request...');
    const pr = await createPullRequest(job, job.feature.title, job.feature.description);
    await reportProgress(job.id, 'log', `Pull request created: #${pr.number}`, {
      pr_number: pr.number,
      pr_url: pr.url,
    });
    
    // 8. Complete
    await reportProgress(
      job.id,
      'completion',
      'Build completed successfully',
      { 
        pr_number: pr.number,
        pr_url: pr.url,
        commit_sha: commitSha,
        files_changed: plan.files.length,
      },
      'success'
    );
    
  } catch (error: any) {
    console.error('Build failed:', error);
    await reportProgress(
      job.id,
      'error',
      `Build failed: ${error.message}`,
      { error: error.message, stack: error.stack },
      'failed'
    );
  } finally {
    // Cleanup
    try {
      execSync(`rm -rf ${workDir}`);
    } catch {
      // Ignore cleanup errors
    }
  }
}

// Main loop
async function main() {
  console.log('🚀 NSaaS Build Agent starting...');
  console.log(`📡 Polling ${ORCHESTRATOR_URL}/api/orchestrate`);
  console.log(`🤖 AI Integration: ${ANTHROPIC_API_KEY ? 'ENABLED' : 'DISABLED (fallback mode)'}`);
  console.log('');
  
  while (true) {
    try {
      const job = await pollForBuild();
      
      if (job) {
        console.log(`\n📦 Found build job: ${job.feature.title}`);
        await processBuild(job);
        console.log('\n✅ Build complete. Polling for next job...\n');
      } else {
        // No jobs available, wait before polling again
        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('\n❌ Error in main loop:', error);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { pollForBuild, reportProgress, processBuild };
