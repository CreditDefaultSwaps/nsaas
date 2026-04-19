import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';
import { generateBranchName } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

// GET /api/features?id=xxx or /api/features
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const featureId = searchParams.get('id');

    // If ID is provided, fetch single feature
    if (featureId) {
      const { data: features, error } = await supabaseAdmin
        .from('features')
        .select(`
          *,
          repos(name, full_name)
        `)
        .eq('id', featureId)
        .eq('org_id', user.org_id);

      if (error) {
        console.error('Error fetching feature:', error);
        throw new Error('Failed to fetch feature');
      }

      return NextResponse.json({ features });
    }

    // Otherwise fetch all features
    const { data: features, error } = await supabaseAdmin
      .from('features')
      .select(`
        *,
        repos(name, full_name)
      `)
      .eq('org_id', user.org_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching features:', error);
      throw new Error('Failed to fetch features');
    }

    return NextResponse.json({ features: features || [] });
  } catch (error: any) {
    console.error('GET /api/features error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch features' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/features
export async function POST(request: NextRequest) {
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

    const { repo_id, title, description, priority = 'medium' } = body;

    // Validation
    if (!repo_id || typeof repo_id !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: repo_id' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Missing or invalid required field: title (min 3 characters)' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Missing or invalid required field: description (min 10 characters)' },
        { status: 400 }
      );
    }

    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
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
    const featureId = uuidv4();
    const { data: feature, error: featureError } = await supabaseAdmin
      .from('features')
      .insert({
        id: featureId,
        org_id: user.org_id,
        repo_id,
        title: title.trim(),
        description: description.trim(),
        priority,
        created_by: user.id,
        branch_name: branchName,
        status: 'pending',
      })
      .select()
      .single();

    if (featureError) {
      console.error('Error creating feature:', featureError);
      throw new Error('Failed to create feature');
    }

    // Create initial build record (queued)
    const buildId = uuidv4();
    const { error: buildError } = await supabaseAdmin
      .from('builds')
      .insert({
        id: buildId,
        feature_id: feature.id,
        org_id: user.org_id,
        status: 'queued',
      });

    if (buildError) {
      console.error('Error creating build:', buildError);
      // Don't fail the request, but log the error
    }

    return NextResponse.json({ feature }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/features error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create feature' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
