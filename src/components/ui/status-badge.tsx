import { cn } from '@/lib/utils';
import { Badge } from './badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'; label: string; dot?: string }> = {
  // Request statuses (rebranded from feature)
  pending: { variant: 'secondary', label: 'Queued', dot: 'bg-zinc-500' },
  in_progress: { variant: 'warning', label: 'In Progress', dot: 'bg-amber-400' },
  building: { variant: 'warning', label: 'Building', dot: 'bg-neon-cyan animate-pulse' },
  testing: { variant: 'warning', label: 'Testing', dot: 'bg-neon-purple' },
  completed: { variant: 'success', label: 'Shipped', dot: 'bg-emerald-400' },
  failed: { variant: 'destructive', label: 'Failed', dot: 'bg-rose-400' },
  
  // Shift statuses (rebranded from build)
  queued: { variant: 'secondary', label: 'Queued', dot: 'bg-zinc-500' },
  running: { variant: 'warning', label: 'Running', dot: 'bg-neon-cyan animate-pulse' },
  success: { variant: 'success', label: 'Shipped', dot: 'bg-emerald-400' },
  cancelled: { variant: 'secondary', label: 'Cancelled', dot: 'bg-zinc-500' },
  
  // Priority
  low: { variant: 'secondary', label: 'Low' },
  medium: { variant: 'outline', label: 'Medium' },
  high: { variant: 'warning', label: 'High' },
  urgent: { variant: 'destructive', label: 'Urgent' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { variant: 'default', label: status };
  
  return (
    <Badge variant={config.variant} className={cn('flex items-center gap-1.5', className)}>
      {config.dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      )}
      <span className="capitalize">{config.label}</span>
    </Badge>
  );
}
