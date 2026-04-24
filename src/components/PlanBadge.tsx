import { cn } from '@/lib/utils';

export type PlanKey = 'free' | 'starter' | 'pro' | 'agency';

interface PlanBadgeProps {
  plan: PlanKey;
  className?: string;
}

const planConfig: Record<PlanKey, { label: string; className: string }> = {
  free: {
    label: 'Free',
    className: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  },
  starter: {
    label: 'Starter',
    className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  },
  pro: {
    label: 'Pro',
    className: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  },
  agency: {
    label: 'Agency',
    className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
};

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const config = planConfig[plan];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
