'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PlanBadge } from '@/components/PlanBadge';
import type { PlanKey } from '@/components/PlanBadge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  ExternalLink,
  Check,
  ChevronRight,
  RefreshCw,
} from '@/components/icons';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BillingPlan {
  name: string;
  price: number;
  interval: string;
  status: string;
  planKey: string;
}

interface BillingSubscription {
  id: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface BillingInvoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  pdf: string | null;
}

interface BillingData {
  plan: BillingPlan;
  subscription: BillingSubscription | null;
  usage: { shiftsThisMonth: number; maxShifts: number };
  invoices: BillingInvoice[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

interface PlanTier {
  key: PlanKey;
  name: string;
  price: number;
  shifts: string;
  repos: string;
  priorityQueue: boolean;
  slack: boolean;
  dedicatedAgent: boolean;
  support: string;
}

const PLAN_TIERS: PlanTier[] = [
  {
    key: 'starter',
    name: 'Starter',
    price: 49,
    shifts: '5',
    repos: '1',
    priorityQueue: false,
    slack: false,
    dedicatedAgent: false,
    support: 'Email',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 149,
    shifts: '20',
    repos: '5',
    priorityQueue: true,
    slack: true,
    dedicatedAgent: false,
    support: 'Priority',
  },
  {
    key: 'agency',
    name: 'Agency',
    price: 499,
    shifts: 'Unlimited',
    repos: 'Unlimited',
    priorityQueue: true,
    slack: true,
    dedicatedAgent: true,
    support: 'White-glove',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatAmount(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function statusBadgeVariant(
  status: string
): 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (status) {
    case 'active':
      return 'success';
    case 'past_due':
      return 'warning';
    case 'canceled':
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function subscriptionStatusLabel(status: string): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'past_due':
      return 'Past Due';
    case 'canceled':
    case 'cancelled':
      return 'Cancelled';
    case 'trialing':
      return 'Trial';
    case 'unpaid':
      return 'Unpaid';
    default:
      return status;
  }
}

function invoiceStatusVariant(
  status: string
): 'success' | 'warning' | 'secondary' {
  switch (status) {
    case 'paid':
      return 'success';
    case 'open':
      return 'warning';
    default:
      return 'secondary';
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureCheck({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-zinc-300 text-sm">{value}</span>;
  }
  if (value) {
    return <Check className="h-4 w-4 text-neon-cyan mx-auto" />;
  }
  return <span className="text-zinc-600 text-sm">—</span>;
}

function UsageBar({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  if (max === -1) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Shifts run this month</span>
          <span className="text-white font-medium">{current} / Unlimited</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-neon-cyan to-cyan-400 rounded-full" />
        </div>
      </div>
    );
  }

  if (max === 0) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Shifts run this month</span>
          <span className="text-zinc-400">{current} (Free plan)</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-0" />
        </div>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((current / max) * 100));
  const isNearLimit = pct >= 80;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">Shifts run this month</span>
        <span className={cn('font-medium', isNearLimit ? 'text-amber-400' : 'text-white')}>
          {current} / {max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isNearLimit
              ? 'bg-gradient-to-r from-amber-500 to-amber-400'
              : 'bg-gradient-to-r from-neon-cyan to-cyan-400'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500">{pct}% of monthly quota used</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BillingPage() {
  const { data, error, isLoading, mutate } = useSWR<BillingData>(
    '/api/billing',
    fetcher
  );
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        setPortalError(json.error ?? 'Failed to open billing portal');
        return;
      }
      window.location.href = json.url;
    } catch {
      setPortalError('Failed to open billing portal. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <Card className="p-6">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Failed to load billing data</p>
              <p className="text-sm text-zinc-400 mt-0.5">
                {error.message ?? 'Something went wrong. Please try again.'}
              </p>
            </div>
            <button
              onClick={() => mutate()}
              className="ml-auto flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const plan = data?.plan;
  const subscription = data?.subscription;
  const usage = data?.usage;
  const invoices = data?.invoices ?? [];
  const planKey = (plan?.planKey ?? 'free') as PlanKey;

  return (
    <div className="space-y-8">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          {isLoading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <PlanBadge plan={planKey} />
          )}
        </div>
        {subscription?.cancelAtPeriodEnd && (
          <Badge variant="warning" className="text-xs">
            Cancels {formatDate(subscription.currentPeriodEnd)}
          </Badge>
        )}
      </div>

      {/* ── Top grid: Current Plan + Usage ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <Badge variant={statusBadgeVariant(plan?.status ?? 'active')}>
                  {subscriptionStatusLabel(plan?.status ?? 'active')}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      {plan?.price === 0
                        ? 'Free'
                        : formatAmount(plan?.price ?? 4900)}
                    </span>
                    {(plan?.price ?? 0) > 0 && (
                      <span className="text-zinc-400 text-sm">
                        / {plan?.interval ?? 'month'}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm mt-1">{plan?.name} plan</p>
                </div>

                {subscription && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Next renewal</span>
                      <span className="text-zinc-300">
                        {formatDate(subscription.currentPeriodEnd)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Subscription ID</span>
                      <span className="text-zinc-500 font-mono text-xs truncate max-w-[140px]">
                        {subscription.id}
                      </span>
                    </div>
                  </div>
                )}

                {portalError && (
                  <p className="text-xs text-rose-400">{portalError}</p>
                )}

                {plan?.price === 0 ? (
                  <p className="text-sm text-zinc-500">
                    Upgrade to unlock more shifts and features.
                  </p>
                ) : (
                  <Button
                    onClick={handleManageBilling}
                    isLoading={portalLoading}
                    variant="outline"
                    className="w-full"
                  >
                    Manage Billing
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Night Shifts consumed in the current billing cycle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : (
              <>
                <UsageBar
                  current={usage?.shiftsThisMonth ?? 0}
                  max={usage?.maxShifts ?? 0}
                />
                {(usage?.maxShifts ?? 0) > 0 &&
                  (usage?.maxShifts ?? 0) !== -1 && (
                    <div className="flex justify-between text-sm border-t border-white/5 pt-4">
                      <span className="text-zinc-400">Estimated cost</span>
                      <span className="text-white font-medium">
                        {formatAmount(plan?.price ?? 0)}
                      </span>
                    </div>
                  )}
                {(usage?.maxShifts ?? 0) === 0 && (
                  <p className="text-sm text-zinc-500">
                    Upgrade your plan to start running Night Shifts.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Plan Comparison ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
          <CardDescription>Compare plans and upgrade when you need more</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 pr-4 text-zinc-400 font-medium w-40">Features</th>
                  {PLAN_TIERS.map((tier) => (
                    <th key={tier.key} className="text-center py-3 px-4">
                      <div
                        className={cn(
                          'rounded-lg p-3 space-y-1',
                          tier.key === planKey
                            ? 'bg-neon-cyan/10 border border-neon-cyan/30'
                            : 'bg-white/5 border border-white/10'
                        )}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={cn(
                              'font-semibold',
                              tier.key === planKey ? 'text-neon-cyan' : 'text-white'
                            )}
                          >
                            {tier.name}
                          </span>
                          {tier.key === planKey && (
                            <span className="text-xs bg-neon-cyan/20 text-neon-cyan rounded-full px-2 py-0.5">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-white font-bold">
                          ${tier.price}
                          <span className="text-zinc-400 text-xs font-normal">/mo</span>
                        </div>
                        {tier.key !== planKey && (
                          <UpgradeButton
                            currentPlanKey={planKey}
                            targetTier={tier}
                            onManageBilling={handleManageBilling}
                            portalLoading={portalLoading}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { label: 'Shifts / month', key: 'shifts' as const },
                  { label: 'Repositories', key: 'repos' as const },
                  { label: 'Priority queue', key: 'priorityQueue' as const },
                  { label: 'Slack notifications', key: 'slack' as const },
                  { label: 'Dedicated agent', key: 'dedicatedAgent' as const },
                  { label: 'Support', key: 'support' as const },
                ].map((row) => (
                  <tr key={row.key} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4 text-zinc-400">{row.label}</td>
                    {PLAN_TIERS.map((tier) => (
                      <td
                        key={tier.key}
                        className={cn(
                          'py-3 px-4 text-center',
                          tier.key === planKey ? 'bg-neon-cyan/5' : ''
                        )}
                      >
                        <FeatureCheck value={tier[row.key] as boolean | string} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-4">
            {PLAN_TIERS.map((tier) => (
              <div
                key={tier.key}
                className={cn(
                  'rounded-lg border p-4 space-y-3',
                  tier.key === planKey
                    ? 'border-neon-cyan/30 bg-neon-cyan/5'
                    : 'border-white/10 bg-white/5'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('font-semibold', tier.key === planKey ? 'text-neon-cyan' : 'text-white')}>
                      {tier.name}
                    </span>
                    {tier.key === planKey && (
                      <span className="text-xs bg-neon-cyan/20 text-neon-cyan rounded-full px-2 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-white">
                    ${tier.price}
                    <span className="text-zinc-400 text-xs font-normal">/mo</span>
                  </span>
                </div>
                <div className="space-y-1.5 text-sm">
                  {[
                    { label: 'Shifts / month', value: tier.shifts },
                    { label: 'Repositories', value: tier.repos },
                    { label: 'Priority queue', value: tier.priorityQueue ? '✓' : '—' },
                    { label: 'Slack notifications', value: tier.slack ? '✓' : '—' },
                    { label: 'Dedicated agent', value: tier.dedicatedAgent ? '✓' : '—' },
                    { label: 'Support', value: tier.support },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-zinc-400">{label}</span>
                      <span className={cn(
                        value === '✓' ? 'text-neon-cyan' : value === '—' ? 'text-zinc-600' : 'text-zinc-300'
                      )}>{value}</span>
                    </div>
                  ))}
                </div>
                {tier.key !== planKey && (
                  <UpgradeButton
                    currentPlanKey={planKey}
                    targetTier={tier}
                    onManageBilling={handleManageBilling}
                    portalLoading={portalLoading}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Invoices ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Your payment history</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-zinc-500 text-sm">No invoices yet.</p>
              {planKey === 'free' && (
                <p className="text-zinc-600 text-xs mt-1">
                  Invoices will appear here once you subscribe.
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between py-3 hover:bg-white/3 -mx-6 px-6 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-zinc-300 w-28 shrink-0">
                      {formatDate(inv.date)}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {formatAmount(inv.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={invoiceStatusVariant(inv.status)}>
                      {inv.status === 'paid' ? 'Paid' : inv.status === 'open' ? 'Open' : inv.status}
                    </Badge>
                    {inv.pdf ? (
                      <a
                        href={inv.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-neon-cyan transition-colors"
                      >
                        PDF
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-600">No PDF</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Danger Zone ──────────────────────────────────────────────── */}
      {subscription && !subscription.cancelAtPeriodEnd && (
        <Card className="border-rose-500/20">
          <CardHeader>
            <CardTitle className="text-rose-400">Danger Zone</CardTitle>
            <CardDescription>
              These actions are irreversible. Please be certain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Cancel subscription</p>
                <p className="text-sm text-zinc-400 mt-0.5">
                  Your plan will remain active until the end of the current billing period.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleManageBilling}
                isLoading={portalLoading}
              >
                Cancel plan
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── UpgradeButton ────────────────────────────────────────────────────────────

function UpgradeButton({
  currentPlanKey,
  targetTier,
  onManageBilling,
  portalLoading,
}: {
  currentPlanKey: PlanKey;
  targetTier: PlanTier;
  onManageBilling: () => void;
  portalLoading: boolean;
}) {
  const planOrder: PlanKey[] = ['free', 'starter', 'pro', 'agency'];
  const isUpgrade = planOrder.indexOf(targetTier.key) > planOrder.indexOf(currentPlanKey);
  const isDowngrade = planOrder.indexOf(targetTier.key) < planOrder.indexOf(currentPlanKey);

  if (isUpgrade) {
    return (
      <Button
        size="sm"
        className="w-full text-xs h-7 mt-1"
        onClick={onManageBilling}
        isLoading={portalLoading}
      >
        Upgrade
      </Button>
    );
  }

  if (isDowngrade) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="w-full text-xs h-7 mt-1 text-zinc-500"
        onClick={onManageBilling}
        isLoading={portalLoading}
      >
        Downgrade
      </Button>
    );
  }

  return null;
}
