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

    // Alert Alex via Telegram
    try {
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      if (telegramBotToken && telegramChatId) {
        const alertMessage = [
          '🚀 *New NightShift Waitlist Signup*',
          '',
          `👤 *Name:* ${validated.firstName} ${validated.lastName}`,
          validated.companyName ? `🏢 *Company:* ${validated.companyName}` : '',
          `📧 *Email:* ${validated.email.toLowerCase()}`,
          '',
          '*Suggested outreach:*',
          `Hey ${validated.firstName}, saw you joined the NightShift waitlist — I'm Alex, the founder. Quick question: what's the first thing you'd want to build? I'm onboarding the first few users personally and want to make sure your first shift ships something meaningful.`,
        ].filter(Boolean).join('\n');

        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: alertMessage,
            parse_mode: 'Markdown',
          }),
        });
      }
    } catch (alertErr) {
      // Don't fail the request if alert fails
      console.error('Telegram alert failed:', alertErr);
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
