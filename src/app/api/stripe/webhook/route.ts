import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const email = session.customer_email;
      const firstName = session.metadata?.firstName;
      const lastName = session.metadata?.lastName;
      const companyName = session.metadata?.companyName;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      if (!email || !firstName || !lastName) {
        console.error('Missing required metadata in checkout session');
        return NextResponse.json(
          { error: 'Missing required data' },
          { status: 400 }
        );
      }

      // Check if waitlist entry exists
      const { data: existingEntry } = await supabaseAdmin
        .from('waitlist')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existingEntry) {
        // Update existing waitlist entry to paid
        await supabaseAdmin
          .from('waitlist')
          .update({
            status: 'paid',
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingEntry.id);
      } else {
        // Create new waitlist entry with paid status
        await supabaseAdmin
          .from('waitlist')
          .insert({
            first_name: firstName,
            last_name: lastName,
            company_name: companyName || null,
            email: email.toLowerCase(),
            status: 'paid',
            source: 'website_stripe',
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
          });
      }

      // Create organization
      const slug = companyName 
        ? companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/[^a-z0-9]+/g, '-');

      const { data: org, error: orgError } = await supabaseAdmin
        .from('organizations')
        .insert({
          name: companyName || `${firstName} ${lastName}`,
          slug: `${slug}-${Date.now().toString(36)}`,
        })
        .select()
        .single();

      if (orgError) {
        console.error('Failed to create organization:', orgError);
        return NextResponse.json(
          { error: 'Failed to create organization' },
          { status: 500 }
        );
      }

      // Create user in the organization
      const { error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          email: email.toLowerCase(),
          full_name: `${firstName} ${lastName}`,
          org_id: org.id,
          role: 'admin',
          clerk_id: `stripe_${stripeCustomerId}`, // Placeholder until they sign up with Clerk
        });

      if (userError) {
        console.error('Failed to create user:', userError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      console.log(`Successfully processed payment for ${email}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
