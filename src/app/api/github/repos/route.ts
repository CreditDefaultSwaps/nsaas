/**
 * List Available Repositories API
 * GET: Returns repos accessible via the org's GitHub App installation
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';
import { listInstallationRepos } from '@/lib/github/repositories';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const orgId = (user as any).org_id;

    // Get org's GitHub App installation ID
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('github_app_installation_id')
      .eq('id', orgId)
      .single();

    if (orgError || !org?.github_app_installation_id) {
      return NextResponse.json(
        { error: 'GitHub App not installed for this organization' },
        { status: 400 }
      );
    }

    const installationId = parseInt(org.github_app_installation_id, 10);

    // List repos from GitHub
    const repos = await listInstallationRepos(installationId);

    return NextResponse.json({ repos });
  } catch (error: any) {
    console.error('GET /api/github/repos error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list repositories' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
