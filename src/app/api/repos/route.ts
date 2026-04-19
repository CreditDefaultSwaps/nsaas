import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/repos
export async function GET() {
  try {
    const user = await requireAuth();

    const { data: repos, error } = await supabaseAdmin
      .from('repos')
      .select('*')
      .eq('org_id', user.org_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching repos:', error);
      throw new Error('Failed to fetch repositories');
    }

    return NextResponse.json({ repos: repos || [] });
  } catch (error: any) {
    console.error('GET /api/repos error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repositories' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
