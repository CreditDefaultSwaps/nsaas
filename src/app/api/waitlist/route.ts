import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const waitlistSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  companyName: z.string().optional(),
  email: z.string().email('Valid email is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = waitlistSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .insert({
        first_name: validated.firstName,
        last_name: validated.lastName,
        company_name: validated.companyName || null,
        email: validated.email.toLowerCase(),
        status: 'pending',
        source: 'website',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You\'re already on the waitlist!' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'You\'re on the list. We\'ll be in touch soon.',
      data 
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
