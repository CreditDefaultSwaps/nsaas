/**
 * Repository Connection API
 * POST: Connect a repo to a feature (shift request)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';
import { validateRepoAccess } from '@/lib/github/repositories';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const orgId = (user as any).org_id;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { featureId, repoFullName, installationId } = body;

    if (!featureId || !repoFullName || !installationId) {
      return NextResponse.json(
        { error: 'Missing required fields: featureId, repoFullName, installationId' },
        { status: 400 }
      );
    }

    // Verify the feature belongs to the user's org
    const { data: feature, error: featureError } = await supabaseAdmin
      .from('features')
      .select('*')
      .eq('id', featureId)
      .eq('org_id', orgId)
      .single();

    if (featureError || !feature) {
      return NextResponse.json(
        { error: 'Feature not found or access denied' },
        { status: 404 }
      );
    }

    // Verify the org has the given installation ID
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('github_app_installation_id')
      .eq('id', orgId)
      .single();

    if (!org || org.github_app_installation_id !== installationId.toString()) {
      return NextResponse.json(
        { error: 'Invalid installation ID for this organization' },
        { status: 403 }
      );
    }

    // Validate repo access via GitHub App
    const hasAccess = await validateRepoAccess(installationId, repoFullName);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Repository not accessible via GitHub App installation' },
        { status: 403 }
      );
    }

    // Find or create the repo record
    const { data: existingRepo } = await supabaseAdmin
      .from('repos')
      .select('*')
      .eq('org_id', orgId)
      .eq('full_name', repoFullName)
      .single();

    let repoId = existingRepo?.id;

    if (!repoId) {
      // Fetch repo details from GitHub to create record
      const { Octokit } = await import('@octokit/rest');
      const { getInstallationToken } = await import('@/lib/github/auth');
      const token = await getInstallationToken(installationId);
      const octokit = new Octokit({ auth: token });

      const [owner, name] = repoFullName.split('/');
      const { data: ghRepo } = await octokit.repos.get({ owner, repo: name });

      const { data: newRepo, error: repoInsertError } = await supabaseAdmin
        .from('repos')
        .insert({
          org_id: orgId,
          github_repo_id: ghRepo.id,
          full_name: ghRepo.full_name,
          name: ghRepo.name,
          default_branch: ghRepo.default_branch || 'main',
          is_active: true,
        })
        .select()
        .single();

      if (repoInsertError || !newRepo) {
        return NextResponse.json(
          { error: 'Failed to create repo record' },
          { status: 500 }
        );
      }

      repoId = newRepo.id;
    }

    // Update the feature with repo connection
    const { error: updateError } = await supabaseAdmin
      .from('features')
      .update({
        repo_id: repoId,
        // Also store GitHub metadata directly on feature for quick access
      })
      .eq('id', featureId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update feature' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      feature_id: featureId,
      repo_id: repoId,
      repo_full_name: repoFullName,
      installation_id: installationId,
    });
  } catch (error: any) {
    console.error('POST /api/github/connect error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to connect repository' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
