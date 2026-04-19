'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users } from 'lucide-react';

interface WaitlistCounterProps {
  className?: string;
}

export function WaitlistCounter({ className = '' }: WaitlistCounterProps) {
  const [count, setCount] = useState(247);
  const [displayCount, setDisplayCount] = useState(247);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const hasAnimated = useRef(false);

  // Fetch the actual count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/waitlist/count');
        if (res.ok) {
          const data = await res.json();
          setCount(data.count || 247);
        }
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
        // Keep default count
      } finally {
        setIsLoaded(true);
      }
    };

    fetchCount();
  }, []);

  // Animate count up when in view
  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1500; // 1.5 seconds
    const startValue = 247;
    const endValue = count;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(startValue + (endValue - startValue) * easeOut);
      setDisplayCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
        <Users className="h-3.5 w-3.5 text-neon-cyan" />
        <span className="text-sm text-zinc-300">
          Join{' '}
          <span className="font-semibold text-white tabular-nums">
            {displayCount.toLocaleString()}+
          </span>{' '}
          founders
        </span>
      </div>
    </motion.div>
  );
}
