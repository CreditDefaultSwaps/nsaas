'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Rocket, ArrowRight, Sparkles, Moon } from 'lucide-react';
import { Button } from '@/components/ui';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // In a real implementation, you might want to verify the session
    // For now, we just show the success state
    if (sessionId) {
      setVerified(true);
    }
  }, [sessionId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative max-w-lg w-full"
    >
      <div className="glass neon-border rounded-3xl p-8 md:p-12 text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-purple-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          You're in.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-400 mb-8"
        >
          Your first shift starts tonight.
        </motion.p>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-8"
        >
          <div className="flex items-start gap-4 text-left p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Welcome email incoming</h3>
              <p className="text-sm text-slate-400">Check your inbox for onboarding instructions and your dashboard link.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
              <Moon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Submit your first request</h3>
              <p className="text-sm text-slate-400">Describe what you need. Our AI team starts working at 10 PM tonight.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Wake up to shipped code</h3>
              <p className="text-sm text-slate-400">Review the PR, merge, and deploy. Your customers get new features while you sleep.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 neon-glow w-full">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Support link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-sm text-slate-500"
        >
          Questions?{' '}
          <a href="mailto:support@nightshift.dev" className="text-purple-400 hover:text-purple-300 transition-colors">
            support@nightshift.dev
          </a>
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function WaitlistSuccessPage() {
  return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <Suspense fallback={
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
