import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

// GET /api/admin/requests - fetch all features with user + org info (admin only)
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    // Fetch all features with related data
    const { data: features, error } = await supabaseAdmin
      .from('features')
      .select(`
        *,
        organizations(id, name, slug),
        repos(id, name, full_name),
        builds(id, status, started_at, completed_at, pr_number, agent_logs)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin features:', error);
      throw new Error('Failed to fetch features');
    }

    // Fetch users separately and merge
    const orgIds = Array.from(new Set(features?.map(f => f.org_id) || []));
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, org_id')
      .in('org_id', orgIds);

    if (usersError) {
      console.error('Error fetching users:', usersError);
    }

    // Create a map of org_id -> user for quick lookup
    const userMap = new Map(users?.map(u => [u.org_id, u]) || []);

    // Merge user data into features
    const featuresWithUsers = features?.map(feature => ({
      ...feature,
      user: userMap.get(feature.org_id) || null,
    })) || [];

    return NextResponse.json({ features: featuresWithUsers });
  } catch (error: any) {
    console.error('GET /api/admin/requests error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch requests' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
