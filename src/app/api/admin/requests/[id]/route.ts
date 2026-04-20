import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
// GET /api/admin/requests/[id] - fetch single feature with full details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    const { data: feature, error } = await supabaseAdmin
      .from('features')
      .select(`
        *,
        organizations(id, name, slug),
        repos(id, name, full_name),
        builds(id, status, started_at, completed_at, pr_number, commit_sha, agent_logs, created_at)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching feature:', error);
      throw new Error('Failed to fetch feature');
    }

    // Fetch user for this org
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, org_id')
      .eq('org_id', feature.org_id)
      .limit(1);

    if (usersError) {
      console.error('Error fetching user:', usersError);
    }

    return NextResponse.json({
      feature: {
        ...feature,
        user: users?.[0] || null,
      },
    });
  } catch (error: any) {
    console.error('GET /api/admin/requests/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch request' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PATCH /api/admin/requests/[id] - update feature and build status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    const body = await request.json();
    const {
      status,
      build_status,
      pr_url,
      deployed_url,
      agent_logs,
      started_at,
      completed_at,
      pr_number,
      commit_sha,
      morning_brief,
    } = body;

    // Update feature
    const featureUpdate: any = {};
    if (status) featureUpdate.status = status;
    if (pr_url) featureUpdate.pr_url = pr_url;

    if (Object.keys(featureUpdate).length > 0) {
      const { error: featureError } = await supabaseAdmin
        .from('features')
        .update(featureUpdate)
        .eq('id', id);

      if (featureError) {
        console.error('Error updating feature:', featureError);
        throw new Error('Failed to update feature');
      }
    }

    // Update or create build record
    if (build_status || agent_logs || started_at || completed_at || pr_number !== undefined || commit_sha || morning_brief) {
      // Check if build exists
      const { data: existingBuild } = await supabaseAdmin
        .from('builds')
        .select('id')
        .eq('feature_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const buildUpdate: any = {};
      if (build_status) buildUpdate.status = build_status;
      if (agent_logs !== undefined) buildUpdate.agent_logs = agent_logs;
      if (started_at !== undefined) buildUpdate.started_at = started_at;
      if (completed_at !== undefined) buildUpdate.completed_at = completed_at;
      if (pr_number !== undefined) buildUpdate.pr_number = pr_number;
      if (commit_sha !== undefined) buildUpdate.commit_sha = commit_sha;
      if (morning_brief !== undefined) buildUpdate.morning_brief = morning_brief;

      if (existingBuild) {
        const { error: buildError } = await supabaseAdmin
          .from('builds')
          .update(buildUpdate)
          .eq('id', existingBuild.id);

        if (buildError) {
          console.error('Error updating build:', buildError);
          throw new Error('Failed to update build');
        }
      } else {
        // Create new build
        const { error: buildError } = await supabaseAdmin
          .from('builds')
          .insert({
            feature_id: id,
            org_id: body.org_id,
            ...buildUpdate,
          });

        if (buildError) {
          console.error('Error creating build:', buildError);
          throw new Error('Failed to create build');
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PATCH /api/admin/requests/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update request' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
