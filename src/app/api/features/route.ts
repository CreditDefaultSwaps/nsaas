import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';
import { generateBranchName } from '@/lib/github';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const user = await requireAuth();

    const { data: features, error } = await supabaseAdmin
      .from('features')
      .select(`
        *,
        repos(name, full_name)
      `)
      .eq('org_id', user.org_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ features });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch features' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { repo_id, title, description, priority = 'medium' } = body;

    if (!repo_id || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: repo_id, title, description' },
        { status: 400 }
      );
    }

    // Verify repo belongs to user's org
    const { data: repo, error: repoError } = await supabaseAdmin
      .from('repos')
      .select('*')
      .eq('id', repo_id)
      .eq('org_id', user.org_id)
      .single();

    if (repoError || !repo) {
      return NextResponse.json(
        { error: 'Repository not found or access denied' },
        { status: 404 }
      );
    }

    // Generate branch name
    const branchName = generateBranchName(title);

    // Create feature
    const { data: feature, error: featureError } = await supabaseAdmin
      .from('features')
      .insert({
        id: uuidv4(),
        org_id: user.org_id,
        repo_id,
        title,
        description,
        priority,
        created_by: user.id,
        branch_name: branchName,
        status: 'pending',
      })
      .select()
      .single();

    if (featureError) throw featureError;

    // Create initial build record (queued)
    const { error: buildError } = await supabaseAdmin
      .from('builds')
      .insert({
        id: uuidv4(),
        feature_id: feature.id,
        org_id: user.org_id,
        status: 'queued',
      });

    if (buildError) throw buildError;

    return NextResponse.json({ feature }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating feature:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create feature' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
