import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/onboarding
// Saves workspace name from the onboarding wizard.
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { workspaceName } = await request.json();

    if (workspaceName && typeof workspaceName === 'string') {
      const trimmed = workspaceName.trim().slice(0, 100);
      const slug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      await supabaseAdmin
        .from('organizations')
        .update({ name: trimmed, slug, updated_at: new Date().toISOString() })
        .eq('id', (user as any).org_id);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('POST /api/onboarding error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save onboarding data' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
