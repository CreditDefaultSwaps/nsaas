import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes('placeholder')) return null;
  return new Stripe(key, {
    apiVersion: '2025-02-24.acacia' as any,
  });
}

export async function POST(_request: NextRequest) {
  try {
    const user = await requireAuth();
    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json(
        { error: 'Billing not configured' },
        { status: 503 }
      );
    }

    const { data: waitlistEntry } = await supabaseAdmin
      .from('waitlist')
      .select('stripe_customer_id')
      .eq('email', user.email.toLowerCase())
      .single();

    if (!waitlistEntry?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No billing account found. Please contact support.' },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: waitlistEntry.stripe_customer_id,
      return_url: `${appUrl}/dashboard/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create portal session';
    console.error('POST /api/billing/portal error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
