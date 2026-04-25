'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Moon, Github, ArrowRight, CheckCircle2, Zap } from '@/components/icons';

const STORAGE_KEY = 'nsaas_onboarding_completed';

interface OnboardingData {
  workspaceName: string;
  repoUrl: string;
}

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export function OnboardingWizard() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<OnboardingData>({ workspaceName: '', repoUrl: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done) setVisible(true);
    }
  }, []);

  const navigate = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    setError('');
  };

  const handleStep1 = async () => {
    if (!data.workspaceName.trim()) {
      setError('Please enter a workspace name.');
      return;
    }
    setSaving(true);
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceName: data.workspaceName.trim() }),
      });
    } catch {
      // Non-fatal — name update is best-effort
    } finally {
      setSaving(false);
      navigate(2);
    }
  };

  const handleStep2 = () => {
    const url = data.repoUrl.trim();
    if (url && !/^https:\/\/github\.com\/[^/]+\/[^/]+/.test(url)) {
      setError('Please enter a valid GitHub URL (e.g. https://github.com/org/repo).');
      return;
    }
    if (url) localStorage.setItem('nsaas_onboarding_repo_url', url);
    navigate(3);
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Card */}
      <motion.div
        className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-night-800 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Neon top bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink" />

        {/* Step progress */}
        <div className="flex items-center justify-center gap-2 px-8 pt-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <motion.div
                animate={{
                  backgroundColor: n <= step ? 'rgb(34 211 238)' : 'rgba(255,255,255,0.1)',
                  scale: n === step ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="h-2 w-2 rounded-full"
              />
              {n < 3 && <div className="h-px w-8 bg-white/10" />}
            </div>
          ))}
          <span className="ml-3 text-xs text-zinc-500 tabular-nums">Step {step} of 3</span>
        </div>

        {/* Step content */}
        <div className="px-8 pb-8 pt-6 min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="flex flex-col flex-1"
            >
              {step === 1 && (
                <Step1
                  value={data.workspaceName}
                  onChange={(v) => setData((d) => ({ ...d, workspaceName: v }))}
                  onNext={handleStep1}
                  saving={saving}
                  error={error}
                />
              )}
              {step === 2 && (
                <Step2
                  value={data.repoUrl}
                  onChange={(v) => setData((d) => ({ ...d, repoUrl: v }))}
                  onNext={handleStep2}
                  onSkip={() => navigate(3)}
                  error={error}
                />
              )}
              {step === 3 && (
                <Step3
                  workspaceName={data.workspaceName}
                  repoUrl={data.repoUrl}
                  onComplete={handleComplete}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Workspace Name
// ---------------------------------------------------------------------------
function Step1({
  value,
  onChange,
  onNext,
  saving,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  saving: boolean;
  error: string;
}) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
          <Moon className="h-5 w-5 text-neon-cyan" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Welcome to Night Shift</h2>
          <p className="text-sm text-zinc-400">Let's get your workspace set up.</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            What should we call your workspace?
          </label>
          <Input
            placeholder="Acme Corp"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onNext()}
            autoFocus
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            This is what your team will see in the dashboard
          </p>
          {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
        </div>
      </div>

      <Button
        className="mt-6 w-full gap-2"
        onClick={onNext}
        isLoading={saving}
      >
        Set Workspace Name
        <ArrowRight className="h-4 w-4" />
      </Button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Connect Repo
// ---------------------------------------------------------------------------
function Step2({
  value,
  onChange,
  onNext,
  onSkip,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onSkip: () => void;
  error: string;
}) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-purple/10 border border-neon-purple/20">
          <Github className="h-5 w-5 text-neon-purple" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Connect Your First Repo</h2>
          <p className="text-sm text-zinc-400">Night Shift builds features directly in your GitHub repos.</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            GitHub Repo URL
          </label>
          <Input
            placeholder="https://github.com/yourorg/yourapp"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onNext()}
            autoFocus
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            We'll request read/write access to ship code overnight
          </p>
          {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button className="w-full gap-2" onClick={onNext}>
          Connect Repo
          <ArrowRight className="h-4 w-4" />
        </Button>
        <button
          onClick={onSkip}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors py-1"
        >
          Skip for now
        </button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — All Set
// ---------------------------------------------------------------------------
function Step3({
  workspaceName,
  repoUrl,
  onComplete,
}: {
  workspaceName: string;
  repoUrl: string;
  onComplete: () => void;
}) {
  return (
    <>
      <div className="flex flex-col items-center text-center flex-1">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 mb-5"
        >
          <Zap className="h-8 w-8 text-neon-cyan" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">You're All Set!</h2>
        <p className="text-zinc-400 text-sm max-w-sm">
          Your workspace is configured and ready for its first night shift.
          Agents will build while you sleep.
        </p>

        {/* Summary */}
        <div className="mt-6 w-full rounded-xl border border-white/5 bg-white/[0.03] divide-y divide-white/5 text-left">
          <SummaryRow
            label="Workspace"
            value={workspaceName || 'Your Workspace'}
            icon={<CheckCircle2 className="h-3.5 w-3.5 text-neon-cyan" />}
          />
          <SummaryRow
            label="Repository"
            value={repoUrl || 'Not connected — add one in Repositories'}
            icon={
              repoUrl
                ? <CheckCircle2 className="h-3.5 w-3.5 text-neon-cyan" />
                : <CheckCircle2 className="h-3.5 w-3.5 text-zinc-600" />
            }
            muted={!repoUrl}
          />
        </div>
      </div>

      <Button className="mt-6 w-full gap-2" onClick={onComplete}>
        Enter Your Dashboard
        <ArrowRight className="h-4 w-4" />
      </Button>
    </>
  );
}

function SummaryRow({
  label,
  value,
  icon,
  muted,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {icon}
      <div className="min-w-0">
        <p className="text-xs text-zinc-500">{label}</p>
        <p className={`text-sm truncate ${muted ? 'text-zinc-600' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  );
}
