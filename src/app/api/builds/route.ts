import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';
import { Database } from '@/types/database';

type BuildUpdate = Database['public']['Tables']['builds']['Update'];
type FeatureStatus = Database['public']['Tables']['features']['Update']['status'];

// GET /api/builds?feature_id=xxx or /api/builds
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
      .eq('org_id', (user as any).org_id)
      .order('created_at', { ascending: false });

    if (featureId) {
      query = query.eq('feature_id', featureId);
    }

    const { data: builds, error } = await query;

    if (error) {
      console.error('Error fetching builds:', error);
      throw new Error('Failed to fetch builds');
    }

    return NextResponse.json({ builds: builds || [] });
  } catch (error: any) {
    console.error('GET /api/builds error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch builds' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PATCH /api/builds
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { build_id, status, agent_logs, pr_number, commit_sha } = body;

    if (!build_id || typeof build_id !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: build_id' },
        { status: 400 }
      );
    }

    // Verify build belongs to user's org
    const { data: existingBuild, error: fetchError } = await supabaseAdmin
      .from('builds')
      .select('*')
      .eq('id', build_id)
      .eq('org_id', (user as any).org_id)
      .single();

    if (fetchError || !existingBuild) {
      return NextResponse.json(
        { error: 'Build not found or access denied' },
        { status: 404 }
      );
    }

    const updates: BuildUpdate = {};
    
    if (status) {
      const validStatuses = ['queued', 'running', 'success', 'failed', 'cancelled'] as const;
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      updates.status = status;
    }
    
    if (agent_logs !== undefined) updates.agent_logs = agent_logs;
    if (pr_number !== undefined) updates.pr_number = pr_number;
    if (commit_sha !== undefined) updates.commit_sha = commit_sha;

    if (status === 'running' && !existingBuild.started_at) {
      updates.started_at = new Date().toISOString();
    }

    if (['success', 'failed', 'cancelled'].includes(status)) {
      updates.completed_at = new Date().toISOString();
    }

    const { data: build, error: updateError } = await supabaseAdmin
      .from('builds')
      .update(updates)
      .eq('id', build_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating build:', updateError);
      throw new Error('Failed to update build');
    }

    // Also update feature status
    if (status) {
      const featureStatusMap: Record<string, FeatureStatus> = {
        running: 'building',
        success: 'completed',
        failed: 'failed',
        cancelled: 'failed',
        queued: 'pending',
      };
      
      const featureStatus = featureStatusMap[status];
      if (featureStatus) {
        await supabaseAdmin
          .from('features')
          .update({ status: featureStatus })
          .eq('id', existingBuild.feature_id);
      }
    }

    return NextResponse.json({ build });
  } catch (error: any) {
    console.error('PATCH /api/builds error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update build' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
