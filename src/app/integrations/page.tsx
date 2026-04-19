'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Mail,
  Zap,
  MessageSquare,
  LineChart,
  Bell,
  Code2,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'live' | 'coming_soon';
  color: string;
}

function IntegrationCard({ name, description, icon: Icon, status, color }: IntegrationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all ${
        status === 'live' ? 'hover:shadow-lg hover:shadow-neon-cyan/5' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
        <span 
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            status === 'live' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}
        >
          {status === 'live' ? 'Live' : 'Coming Soon'}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </motion.div>
  );
}

// Slack Notification Mock
function SlackMock() {
  return (
    <div className="bg-[#1A1D21] rounded-lg overflow-hidden border border-white/10 shadow-2xl">
      {/* Slack Header */}
      <div className="bg-[#121016] px-3 py-2 flex items-center gap-2 border-b border-white/5">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-zinc-500">Night Shift</span>
        </div>
      </div>
      
      {/* Slack Content */}
      <div className="p-3 space-y-3">
        {/* Channel header */}
        <div className="flex items-center gap-2 text-zinc-400 text-sm pb-2 border-b border-white/5">
          <span className="text-zinc-500">#</span>
          <span>engineering</span>
        </div>
        
        {/* Bot message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">Night Shift</span>
              <span className="text-xs text-zinc-500">APP</span>
              <span className="text-xs text-zinc-600">2:34 AM</span>
            </div>
            
            {/* Attachment */}
            <div className="mt-2 bg-[#222529] rounded-lg border-l-4 border-neon-cyan p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-white font-medium text-sm">Your PR is ready</span>
              </div>
              <p className="text-zinc-400 text-sm mb-3">
                Feature <span className="text-neon-cyan">&quot;Add payment flow&quot;</span> has been built and tested.
              </p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Code2 className="h-3 w-3" />
                  +342 lines
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  6h 23m
                </span>
              </div>
              <a 
                href="#" 
                className="mt-3 inline-flex items-center gap-1 text-neon-cyan text-sm hover:underline"
              >
                View Pull Request
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Discord Notification Mock
function DiscordMock() {
  return (
    <div className="bg-[#36393F] rounded-lg overflow-hidden border border-white/10 shadow-2xl">
      {/* Discord Header */}
      <div className="bg-[#202225] px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-14 bg-[#202225] py-3 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-neon-purple" />
          </div>
          <div className="w-8 h-0.5 bg-white/10 rounded-full" />
          <div className="w-10 h-10 rounded-full bg-[#36393F] flex items-center justify-center text-zinc-500 text-xs">
            #
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-[#36393F] p-3">
          {/* Channel header */}
          <div className="flex items-center gap-2 text-zinc-400 text-sm pb-3 border-b border-white/5 mb-3">
            <span className="text-zinc-500">#</span>
            <span>night-shift</span>
          </div>
          
          {/* Bot message */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">Night Shift</span>
                <span className="px-1.5 py-0.5 rounded bg-[#5865F2] text-white text-[10px] font-bold">
                  BOT
                </span>
                <span className="text-xs text-zinc-500">Today at 2:34 AM</span>
              </div>
              
              {/* Embed */}
              <div className="mt-2">
                <div className="bg-[#2F3136] rounded-l-lg border-l-4 border-neon-cyan p-3 max-w-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-white font-medium text-sm">Your PR is ready</span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-2">
                    Feature <span className="text-neon-cyan">&quot;Add payment flow&quot;</span> is ready for review.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Code2 className="h-3 w-3" />
                      +342 lines
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      6h 23m
                    </span>
                  </div>
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-1 text-neon-cyan text-sm hover:underline"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/integrations/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const integrations: IntegrationCardProps[] = [
    {
      name: 'GitHub',
      description: 'Connect your repos and get PR notifications directly in your workflow.',
      icon: Code2,
      status: 'live',
      color: '#8B5CF6',
    },
    {
      name: 'Slack',
      description: 'Get notified when your features are ready. Never miss a shipped PR.',
      icon: MessageSquare,
      status: 'coming_soon',
      color: '#4A154B',
    },
    {
      name: 'Discord',
      description: 'Real-time build updates in your server. Perfect for indie teams.',
      icon: MessageSquare,
      status: 'coming_soon',
      color: '#5865F2',
    },
    {
      name: 'Linear',
      description: 'Sync your Linear issues with Night Shift builds automatically.',
      icon: LineChart,
      status: 'coming_soon',
      color: '#5E6AD2',
    },
  ];

  return (
    <div className="min-h-screen bg-night-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-night-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-neon-cyan" />
              <span className="text-sm text-zinc-300">Integrations</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Connect your workflow
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Get notified where you work. Night Shift integrates with the tools 
              you already use.
            </p>
          </motion.div>

          {/* Notification Previews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-[#4A154B]" />
                <span className="text-white font-medium">Slack</span>
              </div>
              <SlackMock />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-[#5865F2]" />
                <span className="text-white font-medium">Discord</span>
              </div>
              <DiscordMock />
            </div>
          </motion.div>

          {/* Integration Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          >
            {integrations.map((integration) => (
              <IntegrationCard key={integration.name} {...integration} />
            ))}
          </motion.div>

          {/* Email Capture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass neon-border rounded-2xl p-8 md:p-12 max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-neon-cyan" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Get notified when Slack & Discord are ready
              </h2>
              <p className="text-zinc-400">
                Be the first to know when our integrations go live.
              </p>
            </div>

            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">You&apos;re on the list</h3>
                <p className="text-slate-400">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="satoshi@example.com"
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="h-12 px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Joining...
                      </>
                    ) : (
                      'Notify Me'
                    )}
                  </Button>
                </div>

                {status === 'error' && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                    {message}
                  </div>
                )}

                <p className="text-xs text-center text-zinc-500">
                  We&apos;ll only email you about integration updates. No spam, ever.
                </p>
              </form>
            )}
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-zinc-400 mb-4">
              Ready to start shipping?
            </p>
            <Link
              href="/#waitlist"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <Zap className="h-5 w-5" />
              Join the Waitlist
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
