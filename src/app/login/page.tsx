'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabaseClient } from '@/lib/supabase-client';
import { Button, Input } from '@/components/ui';
import { Loader2, Mail, Satellite } from '@/components/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      setIsSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Satellite className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Night Shift</span>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">Ship While You Sleep</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-neon-purple/20">
          {!isSent ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome back.</h1>
                <p className="text-slate-400 text-sm">
                  Enter your email to receive a magic link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-rose-400 text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Magic Link'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Mail className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
              <p className="text-slate-400 text-sm">
                Magic link sent to <span className="text-cyan-400">{email}</span>
              </p>
              <p className="text-slate-500 text-xs mt-4">
                Click the link in your email to sign in.
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Secure, passwordless login powered by Supabase
        </p>
      </motion.div>
    </div>
  );
}
