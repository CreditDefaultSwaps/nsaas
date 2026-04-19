import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  children: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <select
            className={cn(
              'flex h-10 w-full appearance-none rounded-lg border bg-white/5 px-3 py-2',
              'text-sm text-white',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/50 focus-visible:border-neon-cyan/50',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              error ? 'border-rose-500 focus-visible:ring-rose-500' : 'border-white/10 hover:border-white/20',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {error && (
          <p className="mt-1 text-xs text-rose-400">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <option className={cn('bg-night-800 text-white', className)} {...props}>
      {children}
    </option>
  );
}

export { Select, SelectItem };
