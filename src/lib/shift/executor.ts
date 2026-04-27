/**
 * Shift Execution Engine
 * Orchestrates the build → commit → PR flow for a feature/shift request.
 * Called when a build status changes to "building".
 */

import { supabaseAdmin } from '@/lib/supabase';
import { createBranch, createCommit, createPullRequest } from '@/lib/github/git-operations';

export interface ShiftExecutionContext {
  buildId: string;
  featureId: string;
  orgId: string;
  repoFullName: string;
  installationId: number;
  baseBranch: string;
  featureTitle: string;
  featureDescription: string;
}

export interface ShiftExecutionResult {
  success: boolean;
  branchName: string;
  commitSha?: string;
  commitUrl?: string;
  prNumber?: number;
  prUrl?: string;
  logs: string[];
  error?: string;
}

/** Build the shift execution context from a build record */
export async function buildExecutionContext(buildId: string): Promise<ShiftExecutionContext | null> {
  // Get build record
  const { data: build, error: buildError } = await supabaseAdmin
    .from('builds')
    .select('*')
    .eq('id', buildId)
    .single();

  if (buildError || !build) {
    console.error('Build not found:', buildError);
    return null;
  }

  // Get feature
  const { data: feature, error: featureError } = await supabaseAdmin
    .from('features')
    .select('*')
    .eq('id', build.feature_id)
    .single();

  if (featureError || !feature) {
    console.error('Feature not found:', featureError);
    return null;
  }

  // Get repo
  const { data: repo, error: repoError } = await supabaseAdmin
    .from('repos')
    .select('*')
    .eq('id', feature.repo_id)
    .single();

  if (repoError || !repo) {
    console.error('Repo not found:', repoError);
    return null;
  }

  // Get org for installation ID
  const { data: org, error: orgError } = await supabaseAdmin
    .from('organizations')
    .select('github_app_installation_id')
    .eq('id', build.org_id)
    .single();

  if (orgError || !org?.github_app_installation_id) {
    console.error('Org or installation ID not found:', orgError);
    return null;
  }

  return {
    buildId: build.id,
    featureId: feature.id,
    orgId: build.org_id,
    repoFullName: repo.full_name,
    installationId: parseInt(org.github_app_installation_id, 10),
    baseBranch: repo.default_branch || 'main',
    featureTitle: feature.title,
    featureDescription: feature.description,
  };
}

/** Log a message to the build_events table */
async function logEvent(buildId: string, message: string, metadata?: Record<string, unknown>) {
  await supabaseAdmin.from('build_events').insert({
    build_id: buildId,
    event_type: 'log',
    message,
    metadata: (metadata || {}) as any,
  } as any);
}

/** Execute the full shift: branch → build → commit → PR */
export async function executeShift(ctx: ShiftExecutionContext): Promise<ShiftExecutionResult> {
  const logs: string[] = [];
  const [owner, repo] = ctx.repoFullName.split('/');
  const branchName = `night-shift/${ctx.buildId}`;

  try {
    // ── 1. Create branch ─────────────────────────────────────────────────────
    await logEvent(ctx.buildId, `📤 Creating branch: ${branchName}`);
    logs.push(`Creating branch: ${branchName}`);

    const branch = await createBranch(
      ctx.installationId,
      owner,
      repo,
      ctx.baseBranch,
      branchName
    );

    await logEvent(ctx.buildId, `✅ Branch created: ${branch.ref}`, {
      branch_name: branchName,
      branch_sha: branch.sha,
    });
    logs.push(`Branch created: ${branch.ref}`);

    // Update feature with branch name
    await supabaseAdmin
      .from('features')
      .update({ branch_name: branchName })
      .eq('id', ctx.featureId);

    // ── 2. Run build process (simulated for now; replace with real agent) ────
    await logEvent(ctx.buildId, `🔨 Running build process...`);
    logs.push('Running build process...');

    // TODO: Replace with actual agent execution
    // For now, simulate a successful build with a placeholder file
    const buildFiles = [
      {
        path: `night-shift/${ctx.buildId}/README.md`,
        content: `# Night Shift: ${ctx.featureTitle}\n\n${ctx.featureDescription}\n\n---\nBuild ID: ${ctx.buildId}\n`,
      },
    ];

    await logEvent(ctx.buildId, `✅ Build completed — ${buildFiles.length} file(s) ready to commit`);
    logs.push(`Build completed — ${buildFiles.length} file(s) ready`);

    // ── 3. Commit files ──────────────────────────────────────────────────────
    await logEvent(ctx.buildId, `📤 Committing ${buildFiles.length} file(s) to ${branchName}`);
    logs.push(`Committing files to ${branchName}`);

    const commit = await createCommit(
      ctx.installationId,
      owner,
      repo,
      branchName,
      buildFiles,
      `feat: ${ctx.featureTitle}\n\n${ctx.featureDescription}\n\nShift: ${ctx.buildId}`
    );

    await logEvent(ctx.buildId, `✅ Commit created: ${commit.sha.slice(0, 7)}`, {
      commit_sha: commit.sha,
      commit_url: commit.html_url,
    });
    logs.push(`Commit created: ${commit.sha.slice(0, 7)}`);

    // Update build with commit SHA
    await supabaseAdmin
      .from('builds')
      .update({ commit_sha: commit.sha })
      .eq('id', ctx.buildId);

    // ── 4. Create PR ─────────────────────────────────────────────────────────
    await logEvent(ctx.buildId, `📤 Opening pull request...`);
    logs.push('Opening pull request...');

    const pr = await createPullRequest(
      ctx.installationId,
      owner,
      repo,
      branchName,
      ctx.baseBranch,
      `feat: ${ctx.featureTitle}`,
      `## ${ctx.featureTitle}\n\n${ctx.featureDescription}\n\n---\n**Shift ID:** ${ctx.buildId}\n**Branch:** \`${branchName}\``
    );

    await logEvent(ctx.buildId, `✅ PR #${pr.number} opened: ${pr.html_url}`, {
      pr_number: pr.number,
      pr_url: pr.html_url,
    });
    logs.push(`PR #${pr.number} opened: ${pr.html_url}`);

    // Update feature and build with PR info
    await supabaseAdmin
      .from('features')
      .update({
        pr_url: pr.html_url,
        github_pr_url: pr.html_url,
        github_branch: branchName,
        github_repo: ctx.repoFullName,
      })
      .eq('id', ctx.featureId);

    await supabaseAdmin
      .from('builds')
      .update({
        pr_number: pr.number,
        status: 'success',
        github_branch: branchName,
        github_commit_url: commit.html_url,
        github_pr_url: pr.html_url,
      })
      .eq('id', ctx.buildId);

    return {
      success: true,
      branchName,
      commitSha: commit.sha,
      commitUrl: commit.html_url,
      prNumber: pr.number,
      prUrl: pr.html_url,
      logs,
    };
  } catch (error: any) {
    const errMsg = error.message || String(error);
    await logEvent(ctx.buildId, `✗ Shift execution failed: ${errMsg}`, { error: errMsg });
    logs.push(`Shift execution failed: ${errMsg}`);

    // Mark build as failed
    await supabaseAdmin
      .from('builds')
      .update({ status: 'failed' })
      .eq('id', ctx.buildId);

    return {
      success: false,
      branchName,
      logs,
      error: errMsg,
    };
  }
}
