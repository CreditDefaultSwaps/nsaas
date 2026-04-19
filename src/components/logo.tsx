'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

export function Logo({ className, size = 'md', showText = true, animated = true }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sizes = {
    sm: { container: 'h-8 w-8', text: 'text-lg', icon: 'h-5 w-5' },
    md: { container: 'h-10 w-10', text: 'text-xl', icon: 'h-6 w-6' },
    lg: { container: 'h-14 w-14', text: 'text-3xl', icon: 'h-8 w-8' },
    xl: { container: 'h-20 w-20', text: 'text-5xl', icon: 'h-12 w-12' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Premium Satellite Icon with 3D tilt */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-2xl',
          'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
          'border border-slate-700/50',
          'shadow-2xl shadow-cyan-500/20',
          animated && 'group cursor-pointer',
          s.container
        )}
        style={{
          perspective: '600px',
          transform: isHovered ? 'perspective(600px) rotateY(15deg) rotateX(-5deg)' : 'perspective(600px) rotateY(0deg) rotateX(0deg)',
          transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isMounted
            ? '0 0 15px rgba(34,211,238,0.3), 0 0 30px rgba(34,211,238,0.15)'
            : '0 0 15px rgba(34,211,238,0.3)',
          animation: isMounted ? 'glowPulse 3s ease-in-out infinite' : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* CSS keyframes for animations */}
        <style jsx>{`
          @keyframes glowPulse {
            0%, 100% {
              box-shadow: 0 0 15px rgba(34, 211, 238, 0.3), 0 0 30px rgba(34, 211, 238, 0.1);
            }
            50% {
              box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), 0 0 50px rgba(34, 211, 238, 0.2);
            }
          }
          @keyframes drawOrbit {
            from {
              stroke-dashoffset: 60;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(4px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(-4px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0);
            }
            70% {
              transform: scale(1.2);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>

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
          {/* Orbit lines - draws itself first */}
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="3"
            strokeOpacity="0.3"
            transform="rotate(-45 12 12)"
            strokeDasharray="60"
            strokeDashoffset={isMounted ? 0 : 60}
            style={{
              animation: isMounted ? 'drawOrbit 600ms ease-out forwards' : 'none',
            }}
          />

          {/* Satellite body - fades in with scale */}
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              transform: isMounted ? 'scale(1)' : 'scale(0.8)',
              transformOrigin: '12px 12px',
              animation: isMounted ? 'fadeInScale 400ms ease-out 200ms forwards' : 'none',
            }}
          >
            <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
          </g>

          {/* Solar panels - slide in from center outward */}
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              animation: isMounted ? 'slideInLeft 300ms ease-out 400ms forwards' : 'none',
            }}
          >
            <path d="M3 11h6" strokeOpacity="0.6" />
            <path d="M3 13h6" strokeOpacity="0.6" />
          </g>
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              animation: isMounted ? 'slideInRight 300ms ease-out 400ms forwards' : 'none',
            }}
          >
            <path d="M15 11h6" strokeOpacity="0.6" />
            <path d="M15 13h6" strokeOpacity="0.6" />
          </g>

          {/* Antenna - fades in with body */}
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              animation: isMounted ? 'fadeInScale 400ms ease-out 300ms forwards' : 'none',
            }}
          >
            <path d="M12 3v6M12 15v6" />
            <circle cx="12" cy="3" r="1" fill="currentColor" />
          </g>

          {/* Signal waves */}
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              animation: isMounted ? 'fadeInScale 400ms ease-out 500ms forwards' : 'none',
            }}
          >
            <path d="M12 21c2 0 3-1 3-3" strokeOpacity="0.4" />
            <path d="M12 21c-2 0-3-1-3-3" strokeOpacity="0.4" />
          </g>
        </svg>

        {/* Status dot - fades in last with pop */}
        <div
          className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"
          style={{
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? 'scale(1)' : 'scale(0)',
            animation: isMounted ? 'popIn 300ms ease-out 600ms forwards' : 'none',
          }}
        >
          {animated && <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />}
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold tracking-tight', s.text)}>
            <span className="text-white">Night</span>
            <span
              className="bg-gradient-to-r from-purple-400 via-purple-500 to-violet-500 bg-clip-text text-transparent"
            >
              Shift
            </span>
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
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sizes = {
    md: { container: 'h-12 w-12', text: 'text-2xl', subtext: 'text-xs' },
    lg: { container: 'h-16 w-16', text: 'text-4xl', subtext: 'text-sm' },
    xl: { container: 'h-24 w-24', text: 'text-6xl', subtext: 'text-base' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Premium Satellite Icon with 3D tilt */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-3xl',
          'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
          'border border-slate-700/50',
          'shadow-2xl shadow-cyan-500/30',
          s.container
        )}
        style={{
          perspective: '600px',
          transform: isHovered ? 'perspective(600px) rotateY(15deg) rotateX(-5deg)' : 'perspective(600px) rotateY(0deg) rotateX(0deg)',
          transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isMounted
            ? '0 0 15px rgba(34,211,238,0.3), 0 0 30px rgba(34,211,238,0.15)'
            : '0 0 15px rgba(34,211,238,0.3)',
          animation: isMounted ? 'glowPulse 3s ease-in-out infinite' : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <style jsx>{`
          @keyframes glowPulse {
            0%, 100% {
              box-shadow: 0 0 15px rgba(34, 211, 238, 0.3), 0 0 30px rgba(34, 211, 238, 0.1);
            }
            50% {
              box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), 0 0 50px rgba(34, 211, 238, 0.2);
            }
          }
          @keyframes drawOrbit {
            from {
              stroke-dashoffset: 60;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(4px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(-4px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0);
            }
            70% {
              transform: scale(1.2);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>

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
          {/* Orbit lines - draws itself first */}
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="3"
            strokeOpacity="0.3"
            transform="rotate(-45 12 12)"
            strokeDasharray="60"
            strokeDashoffset={isMounted ? 0 : 60}
            style={{
              animation: isMounted ? 'drawOrbit 600ms ease-out forwards' : 'none',
            }}
          />

          {/* Satellite body - fades in with scale */}
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              transform: isMounted ? 'scale(1)' : 'scale(0.8)',
              transformOrigin: '12px 12px',
              animation: isMounted ? 'fadeInScale 400ms ease-out 200ms forwards' : 'none',
            }}
          >
            <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
          </g>

          {/* Solar panels - slide in from center outward */}
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              animation: isMounted ? 'slideInLeft 300ms ease-out 400ms forwards' : 'none',
            }}
          >
            <path d="M3 11h6" strokeOpacity="0.6" />
            <path d="M3 13h6" strokeOpacity="0.6" />
          </g>
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              animation: isMounted ? 'slideInRight 300ms ease-out 400ms forwards' : 'none',
            }}
          >
            <path d="M15 11h6" strokeOpacity="0.6" />
            <path d="M15 13h6" strokeOpacity="0.6" />
          </g>

          {/* Antenna */}
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              animation: isMounted ? 'fadeInScale 400ms ease-out 300ms forwards' : 'none',
            }}
          >
            <path d="M12 3v6M12 15v6" />
            <circle cx="12" cy="3" r="1" fill="currentColor" />
          </g>

          {/* Signal waves */}
          <g
            style={{
              opacity: isMounted ? 1 : 0,
              animation: isMounted ? 'fadeInScale 400ms ease-out 500ms forwards' : 'none',
            }}
          >
            <path d="M12 21c2 0 3-1 3-3" strokeOpacity="0.4" />
            <path d="M12 21c-2 0-3-1-3-3" strokeOpacity="0.4" />
          </g>
        </svg>

        {/* Status dot - fades in last with pop */}
        <div
          className="absolute top-1 right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900"
          style={{
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? 'scale(1)' : 'scale(0)',
            animation: isMounted ? 'popIn 300ms ease-out 600ms forwards' : 'none',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
      </div>

      <div className="flex flex-col">
        <span className={cn('font-bold tracking-tight', s.text)}>
          <span className="text-white">Night</span>
          <span
            className="bg-gradient-to-r from-purple-400 via-purple-500 to-violet-500 bg-clip-text text-transparent"
          >
            Shift
          </span>
        </span>
        <span className={cn('font-medium tracking-[0.15em] text-cyan-400/80 uppercase', s.subtext)}>
          Ship While You Sleep
        </span>
      </div>
    </div>
  );
}

export function LogoIcon({ className, size = 40 }: { className?: string; size?: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-2xl',
        'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        'border border-slate-700/50',
        'shadow-xl shadow-cyan-500/20',
        className
      )}
      style={{
        width: size,
        height: size,
        perspective: '600px',
        transform: isHovered ? 'perspective(600px) rotateY(15deg) rotateX(-5deg)' : 'perspective(600px) rotateY(0deg) rotateX(0deg)',
        transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isMounted
          ? '0 0 15px rgba(34,211,238,0.3), 0 0 30px rgba(34,211,238,0.15)'
          : '0 0 15px rgba(34,211,238,0.3)',
        animation: isMounted ? 'glowPulse 3s ease-in-out infinite' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style jsx>{`
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(34, 211, 238, 0.3), 0 0 30px rgba(34, 211, 238, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), 0 0 50px rgba(34, 211, 238, 0.2);
          }
        }
        @keyframes drawOrbit {
          from {
            stroke-dashoffset: 60;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          70% {
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

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
        {/* Orbit lines - draws itself first */}
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="3"
          strokeOpacity="0.3"
          transform="rotate(-45 12 12)"
          strokeDasharray="60"
          strokeDashoffset={isMounted ? 0 : 60}
          style={{
            animation: isMounted ? 'drawOrbit 600ms ease-out forwards' : 'none',
          }}
        />

        {/* Satellite body - fades in with scale */}
        <g
          style={{
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? 'scale(1)' : 'scale(0.8)',
            transformOrigin: '12px 12px',
            animation: isMounted ? 'fadeInScale 400ms ease-out 200ms forwards' : 'none',
          }}
        >
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </g>

        {/* Solar panels - slide in from center outward */}
        <g
          style={{
            opacity: isMounted ? 1 : 0,
            animation: isMounted ? 'slideInLeft 300ms ease-out 400ms forwards' : 'none',
          }}
        >
          <path d="M3 11h6" strokeOpacity="0.6" />
          <path d="M3 13h6" strokeOpacity="0.6" />
        </g>
        <g
          style={{
            opacity: isMounted ? 1 : 0,
            animation: isMounted ? 'slideInRight 300ms ease-out 400ms forwards' : 'none',
          }}
        >
          <path d="M15 11h6" strokeOpacity="0.6" />
          <path d="M15 13h6" strokeOpacity="0.6" />
        </g>

        {/* Antenna */}
        <g
          style={{
            opacity: isMounted ? 1 : 0,
            animation: isMounted ? 'fadeInScale 400ms ease-out 300ms forwards' : 'none',
          }}
        >
          <path d="M12 3v6M12 15v6" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
        </g>

        {/* Signal waves */}
        <g
          style={{
            opacity: isMounted ? 1 : 0,
            animation: isMounted ? 'fadeInScale 400ms ease-out 500ms forwards' : 'none',
          }}
        >
          <path d="M12 21c2 0 3-1 3-3" strokeOpacity="0.4" />
          <path d="M12 21c-2 0-3-1-3-3" strokeOpacity="0.4" />
        </g>
      </svg>

      {/* Status dot - fades in last with pop */}
      <div
        className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"
        style={{
          opacity: isMounted ? 1 : 0,
          transform: isMounted ? 'scale(1)' : 'scale(0)',
          animation: isMounted ? 'popIn 300ms ease-out 600ms forwards' : 'none',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />
      </div>
    </div>
  );
}
