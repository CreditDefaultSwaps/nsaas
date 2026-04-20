import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';

// GET /api/user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('GET /api/user error:', error);
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
