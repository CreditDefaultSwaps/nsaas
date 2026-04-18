import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const featureId = searchParams.get('feature_id');

    let query = supabaseAdmin
      .from('builds')
      .select(`
        *,
        features(title)
      `)
      .eq('org_id', user.org_id)
      .order('created_at', { ascending: false });

    if (featureId) {
      query = query.eq('feature_id', featureId);
    }

    const { data: builds, error } = await query;

    if (error) throw error;

    return NextResponse.json({ builds: builds || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch builds' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { build_id, status, agent_logs, pr_number, commit_sha } = body;

    if (!build_id) {
      return NextResponse.json(
        { error: 'Missing build_id' },
        { status: 400 }
      );
    }

    // Verify build belongs to user's org
    const { data: existingBuild } = await supabaseAdmin
      .from('builds')
      .select('*')
      .eq('id', build_id)
      .eq('org_id', user.org_id)
      .single();

    if (!existingBuild) {
      return NextResponse.json(
        { error: 'Build not found or access denied' },
        { status: 404 }
      );
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (agent_logs !== undefined) updates.agent_logs = agent_logs;
    if (pr_number) updates.pr_number = pr_number;
    if (commit_sha) updates.commit_sha = commit_sha;

    if (status === 'running' && !existingBuild.started_at) {
      updates.started_at = new Date().toISOString();
    }

    if (['success', 'failed', 'cancelled'].includes(status)) {
      updates.completed_at = new Date().toISOString();
    }

    const { data: build, error } = await supabaseAdmin
      .from('builds')
      .update(updates)
      .eq('id', build_id)
      .select()
      .single();

    if (error) throw error;

    // Also update feature status
    if (status) {
      const featureStatus = status === 'running' ? 'building' : 
                           status === 'success' ? 'completed' :
                           status === 'failed' ? 'failed' : 'in_progress';
      
      await supabaseAdmin
        .from('features')
        .update({ status: featureStatus })
        .eq('id', existingBuild.feature_id);
    }

    return NextResponse.json({ build });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update build' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
