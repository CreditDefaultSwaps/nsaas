'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

export function Logo({ className, size = 'md', showText = true, animated = true }: LogoProps) {
  const sizes = {
    sm: { container: 'h-8 w-8', text: 'text-lg', icon: 'h-5 w-5' },
    md: { container: 'h-10 w-10', text: 'text-xl', icon: 'h-6 w-6' },
    lg: { container: 'h-14 w-14', text: 'text-3xl', icon: 'h-8 w-8' },
    xl: { container: 'h-20 w-20', text: 'text-5xl', icon: 'h-12 w-12' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Premium Satellite Icon */}
      <div 
        className={cn(
          'relative flex items-center justify-center rounded-2xl',
          'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
          'border border-slate-700/50',
          'shadow-2xl shadow-cyan-500/20',
          animated && 'group cursor-pointer',
          s.container
        )}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Animated ring */}
        {animated && (
          <div className="absolute inset-0 rounded-2xl border border-cyan-500/30 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
        )}
        
        {/* Satellite SVG */}
        <svg 
          className={cn('relative z-10 text-cyan-400', s.icon)} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Satellite body */}
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
          
          {/* Solar panels */}
          <path d="M3 11h6M15 11h6" strokeOpacity="0.6" />
          <path d="M3 13h6M15 13h6" strokeOpacity="0.6" />
          
          {/* Antenna */}
          <path d="M12 3v6M12 15v6" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
          
          {/* Signal waves */}
          <path d="M12 21c2 0 3-1 3-3" strokeOpacity="0.4" />
          <path d="M12 21c-2 0-3-1-3-3" strokeOpacity="0.4" />
          
          {/* Orbit lines */}
          <ellipse cx="12" cy="12" rx="10" ry="3" strokeOpacity="0.2" transform="rotate(-45 12 12)" />
        </svg>

        {/* Status dot */}
        <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900">
          {animated && <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />}
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold tracking-tight text-white', s.text)}>
            Night Shift
          </span>
          <span className="text-[10px] font-medium tracking-[0.2em] text-slate-400 uppercase">
            Autonomous Engineering
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoWordmark({ className, size = 'lg' }: { className?: string; size?: 'md' | 'lg' | 'xl' }) {
  const sizes = {
    md: { container: 'h-12 w-12', text: 'text-2xl', subtext: 'text-xs' },
    lg: { container: 'h-16 w-16', text: 'text-4xl', subtext: 'text-sm' },
    xl: { container: 'h-24 w-24', text: 'text-6xl', subtext: 'text-base' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Premium Satellite Icon */}
      <div 
        className={cn(
          'relative flex items-center justify-center rounded-3xl',
          'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
          'border border-slate-700/50',
          'shadow-2xl shadow-cyan-500/30',
          s.container
        )}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 blur-xl opacity-50" />
        
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-3xl border border-cyan-500/20 animate-ping opacity-30" style={{ animationDuration: '3s' }} />
        
        {/* Satellite SVG */}
        <svg 
          className={cn('relative z-10 text-cyan-400', size === 'xl' ? 'h-14 w-14' : size === 'lg' ? 'h-10 w-10' : 'h-7 w-7')} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
          <path d="M3 11h6M15 11h6" strokeOpacity="0.6" />
          <path d="M3 13h6M15 13h6" strokeOpacity="0.6" />
          <path d="M12 3v6M12 15v6" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
          <path d="M12 21c2 0 3-1 3-3" strokeOpacity="0.4" />
          <path d="M12 21c-2 0-3-1-3-3" strokeOpacity="0.4" />
          <ellipse cx="12" cy="12" rx="10" ry="3" strokeOpacity="0.2" transform="rotate(-45 12 12)" />
        </svg>

        {/* Status dot */}
        <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900">
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className={cn('font-bold tracking-tight text-white', s.text)}>
          Night Shift
        </span>
        <span className={cn('font-medium tracking-[0.15em] text-cyan-400/80 uppercase', s.subtext)}>
          Ship While You Sleep
        </span>
      </div>
    </div>
  );
}

export function LogoIcon({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <div 
      className={cn(
        'relative flex items-center justify-center rounded-2xl',
        'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        'border border-slate-700/50',
        'shadow-xl shadow-cyan-500/20',
        className
      )}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20" />
      
      <svg 
        className="relative z-10 text-cyan-400"
        style={{ width: size * 0.6, height: size * 0.6 }}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path d="M3 11h6M15 11h6" strokeOpacity="0.6" />
        <path d="M3 13h6M15 13h6" strokeOpacity="0.6" />
        <path d="M12 3v6M12 15v6" />
        <circle cx="12" cy="3" r="1" fill="currentColor" />
        <path d="M12 21c2 0 3-1 3-3" strokeOpacity="0.4" />
        <path d="M12 21c-2 0-3-1-3-3" strokeOpacity="0.4" />
        <ellipse cx="12" cy="12" rx="10" ry="3" strokeOpacity="0.2" transform="rotate(-45 12 12)" />
      </svg>

      <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900">
        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />
      </div>
    </div>
  );
}
