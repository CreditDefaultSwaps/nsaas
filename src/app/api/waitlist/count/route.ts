import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching waitlist count:', error);
      // Return fallback count if Supabase fails
      return NextResponse.json({ count: 247, fallback: true });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in waitlist count API:', error);
    // Return fallback count on any error
    return NextResponse.json({ count: 247, fallback: true });
  }
}
