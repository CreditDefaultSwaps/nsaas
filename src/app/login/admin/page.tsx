'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRemainingAttempts(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Access granted');
        router.push('/admin/requests');
        router.refresh();
      } else if (res.status === 429) {
        setError(data.error || 'Too many attempts. Please try again later.');
        toast.error(data.error || 'Rate limit exceeded');
      } else if (res.status === 401) {
        setError('Invalid password');
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        toast.error('Invalid password');
      } else {
        setError(data.error || 'Authentication failed');
        toast.error(data.error || 'Authentication failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0a0f] to-[#0a0a0f]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-[#0f0f14]/80 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <Lock className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-zinc-400 text-sm">
              Enter the admin password to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Admin login form">
            <div className="relative">
              <label htmlFor="admin-password" className="sr-only">Admin password</label>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-[#141419] border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:border-purple-500/50 focus:outline-none pr-12"
                autoFocus
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div id="password-error" className="text-rose-400 text-sm" role="alert">
                {error}
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <span className="block text-zinc-500 mt-1">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isLoading || !password}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                  Verifying...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
              ← Back to homepage
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
