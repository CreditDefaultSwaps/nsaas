import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/builds/events?build_id=xxx
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const buildId = searchParams.get('build_id');

    if (!buildId) {
      return NextResponse.json(
        { error: 'Missing required parameter: build_id' },
        { status: 400 }
      );
    }

    // Verify build belongs to user's org
    const { data: build, error: buildError } = await supabaseAdmin
      .from('builds')
      .select('id, org_id')
      .eq('id', buildId)
      .single();

    if (buildError || !build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    if (build.org_id !== user.org_id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Fetch events
    const { data: events, error } = await supabaseAdmin
      .from('build_events')
      .select('*')
      .eq('build_id', buildId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching build events:', error);
      throw new Error('Failed to fetch build events');
    }

    return NextResponse.json({ events: events || [] });
  } catch (error: any) {
    console.error('GET /api/builds/events error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
