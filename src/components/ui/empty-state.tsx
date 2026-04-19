import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Moon } from '@/components/icons';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-12',
        'rounded-xl glass border-dashed border-white/10',
        className
      )}
    >
      {icon && (
        <div className="mb-4 rounded-full bg-neon-purple/10 p-4 border border-neon-purple/20">
          <div className="text-neon-purple">{icon}</div>
        </div>
      )}
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-400">{description}</p>
      {action && (
        <Button
          className="mt-6 gap-2"
          onClick={action.onClick}
        >
          <Moon className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}
