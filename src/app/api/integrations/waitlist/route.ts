import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const integrationWaitlistSchema = z.object({
  email: z.string().email('Valid email is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = integrationWaitlistSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from('integration_waitlist')
      .insert({
        email: validated.email.toLowerCase(),
        notified: false,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You\'re already on the list! We\'ll notify you soon.' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'You\'re on the list! We\'ll email you when Slack and Discord integrations are ready.',
      data 
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Integration waitlist error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
