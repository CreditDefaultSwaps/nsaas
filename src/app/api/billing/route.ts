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

function getPlanFromAmount(amount: number): { name: string; planKey: string } {
  if (amount >= 49900) return { name: 'Agency', planKey: 'agency' };
  if (amount >= 14900) return { name: 'Pro', planKey: 'pro' };
  if (amount >= 4900) return { name: 'Starter', planKey: 'starter' };
  return { name: 'Free', planKey: 'free' };
}

function getMaxShifts(planKey: string): number {
  const limits: Record<string, number> = {
    free: 0,
    starter: 5,
    pro: 20,
    agency: -1,
  };
  return limits[planKey] ?? 0;
}

async function countShiftsThisMonth(orgId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabaseAdmin
    .from('builds')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .gte('created_at', startOfMonth.toISOString());

  return count ?? 0;
}

export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth();
    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json({
        plan: { name: 'Free', price: 0, interval: 'month', status: 'active', planKey: 'free' },
        subscription: null,
        usage: { shiftsThisMonth: 0, maxShifts: 0 },
        invoices: [],
      });
    }

    const { data: waitlistEntry } = await supabaseAdmin
      .from('waitlist')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('email', user.email.toLowerCase())
      .single();

    if (!waitlistEntry?.stripe_customer_id) {
      const shiftsThisMonth = await countShiftsThisMonth(user.org_id);
      return NextResponse.json({
        plan: { name: 'Free', price: 0, interval: 'month', status: 'active', planKey: 'free' },
        subscription: null,
        usage: { shiftsThisMonth, maxShifts: 0 },
        invoices: [],
      });
    }

    const customerId = waitlistEntry.stripe_customer_id;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
    });

    const subscription = subscriptions.data[0] ?? null;

    let planInfo = {
      name: 'Starter',
      price: 4900,
      interval: 'month',
      status: 'active',
      planKey: 'starter',
    };

    if (subscription) {
      const item = subscription.items.data[0];
      const amount = item?.price?.unit_amount ?? 4900;
      const interval = item?.price?.recurring?.interval ?? 'month';
      const { name, planKey } = getPlanFromAmount(amount);
      planInfo = { name, price: amount, interval, status: subscription.status, planKey };
    }

    const invoicesResponse = await stripe.invoices.list({
      customer: customerId,
      limit: 10,
    });

    const invoices = invoicesResponse.data.map((inv) => ({
      id: inv.id,
      date: new Date(inv.created * 1000).toISOString(),
      amount: inv.amount_paid,
      status: inv.status ?? 'unknown',
      pdf: inv.invoice_pdf ?? null,
    }));

    const shiftsThisMonth = await countShiftsThisMonth(user.org_id);

    return NextResponse.json({
      plan: planInfo,
      subscription: subscription
        ? {
            id: subscription.id,
            currentPeriodEnd: new Date(((subscription as any).current_period_end ?? 0) * 1000).toISOString(),
            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end ?? false,
          }
        : null,
      usage: {
        shiftsThisMonth,
        maxShifts: getMaxShifts(planInfo.planKey),
      },
      invoices,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch billing data';
    console.error('GET /api/billing error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
