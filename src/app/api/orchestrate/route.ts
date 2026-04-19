import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getInstallationToken, createBranch } from '@/lib/github';

// This endpoint is called by the build orchestrator to get the next queued build
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  // Simple API key auth for orchestrator
  if (authHeader !== `Bearer ${process.env.ORCHESTRATOR_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get next queued build
    const { data: build, error } = await supabaseAdmin
      .from('builds')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error || !build) {
      return NextResponse.json({ build: null });
    }

    // Get related data
    const { data: feature } = await supabaseAdmin
      .from('features')
      .select('*')
      .eq('id', build.feature_id)
      .single();

    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('github_app_installation_id')
      .eq('id', build.org_id)
      .single();

    const { data: repo } = await supabaseAdmin
      .from('repos')
      .select('*')
      .eq('id', feature?.repo_id || '')
      .single();

    if (!feature || !org || !repo) {
      return NextResponse.json(
        { error: 'Missing related data' },
        { status: 400 }
      );
    }

    // Get GitHub token
    const installationId = org.github_app_installation_id;
    if (!installationId) {
      return NextResponse.json(
        { error: 'GitHub app not installed' },
        { status: 400 }
      );
    }

    const token = await getInstallationToken(parseInt(installationId));

    // Create branch
    const [owner, repoName] = repo.full_name.split('/');
    await createBranch(
      parseInt(installationId),
      owner,
      repoName,
      repo.default_branch,
      feature.branch_name || ''
    );

    // Update build status
    await supabaseAdmin
      .from('builds')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .eq('id', build.id);

    // Create build event
    await supabaseAdmin
      .from('build_events')
      .insert({
        build_id: build.id,
        event_type: 'status_change',
        message: 'Build started - branch created',
      });

    return NextResponse.json({
      build: {
        id: build.id,
        feature: {
          id: feature.id,
          title: feature.title,
          description: feature.description,
          branch_name: feature.branch_name || '',
        },
        repo: {
          id: repo.id,
          full_name: repo.full_name,
          default_branch: repo.default_branch,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Error getting next build:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// This endpoint is called by agents to report progress
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.ORCHESTRATOR_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { build_id, event_type, message, metadata, status } = body;

    if (!build_id || !event_type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create build event
    await supabaseAdmin
      .from('build_events')
      .insert({
        build_id,
        event_type,
        message,
        metadata: metadata || {},
      });

    // Update build status if provided
    if (status) {
      const updates: { status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled'; completed_at?: string } = { 
        status: status as 'queued' | 'running' | 'success' | 'failed' | 'cancelled'
      };
      if (['success', 'failed', 'cancelled'].includes(status)) {
        updates.completed_at = new Date().toISOString();
      }

      await supabaseAdmin
        .from('builds')
        .update(updates)
        .eq('id', build_id);

      // Update feature status
      const { data: build } = await supabaseAdmin
        .from('builds')
        .select('feature_id')
        .eq('id', build_id)
        .single();

      if (build) {
        const featureStatus = status === 'running' ? 'building' : 
                             status === 'success' ? 'completed' :
                             status === 'failed' ? 'failed' : 'in_progress';
        
        await supabaseAdmin
          .from('features')
          .update({ status: featureStatus })
          .eq('id', build.feature_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error reporting build progress:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
