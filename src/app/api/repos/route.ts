import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await requireAuth();

    const { data: repos, error } = await supabaseAdmin
      .from('repos')
      .select('*')
      .eq('org_id', user.org_id)
      .eq('is_active', true)
      .order('full_name');

    if (error) throw error;

    return NextResponse.json({ repos: repos || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repos' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
