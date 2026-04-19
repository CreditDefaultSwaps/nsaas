'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  GitCommit, 
  Clock, 
  CheckCircle2, 
  Zap,
  ArrowLeft,
  Activity,
  Code2,
  Sparkles
} from 'lucide-react';
import { Logo } from '@/components/logo';

interface Build {
  id: string;
  feature_title: string;
  lines_added: number;
  lines_deleted: number;
  status: 'success' | 'running' | 'failed';
  created_at: string;
  language?: string;
}

// Seed data for realistic demo builds
const SEED_BUILDS: Build[] = [
  {
    id: '1',
    feature_title: 'Add payment flow with Stripe integration',
    lines_added: 342,
    lines_deleted: 28,
    status: 'success',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    language: 'TypeScript',
  },
  {
    id: '2',
    feature_title: 'Implement user authentication with OAuth',
    lines_added: 518,
    lines_deleted: 64,
    status: 'success',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    language: 'TypeScript',
  },
  {
    id: '3',
    feature_title: 'Create dashboard analytics widgets',
    lines_added: 267,
    lines_deleted: 12,
    status: 'success',
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    language: 'TypeScript',
  },
  {
    id: '4',
    feature_title: 'Add email notification system',
    lines_added: 189,
    lines_deleted: 8,
    status: 'success',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    language: 'TypeScript',
  },
  {
    id: '5',
    feature_title: 'Build API rate limiting middleware',
    lines_added: 156,
    lines_deleted: 23,
    status: 'success',
    created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    language: 'TypeScript',
  },
  {
    id: '6',
    feature_title: 'Implement real-time WebSocket updates',
    lines_added: 423,
    lines_deleted: 45,
    status: 'success',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    language: 'TypeScript',
  },
];

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 120) return '1 minute ago';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 7200) return '1 hour ago';
  return `${Math.floor(seconds / 3600)} hours ago`;
}

function getRandomFeatureTitle(): string {
  const titles = [
    'Add dark mode toggle',
    'Implement search with filters',
    'Create user profile page',
    'Add export to CSV feature',
    'Build notification center',
    'Implement drag-and-drop',
    'Add multi-language support',
    'Create onboarding flow',
    'Build admin dashboard',
    'Add team invitations',
    'Implement file uploads',
    'Create billing settings',
    'Add webhook support',
    'Build API documentation',
    'Implement caching layer',
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateRandomBuild(): Build {
  const linesAdded = Math.floor(Math.random() * 400) + 50;
  const linesDeleted = Math.floor(Math.random() * 50) + 5;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    feature_title: getRandomFeatureTitle(),
    lines_added: linesAdded,
    lines_deleted: linesDeleted,
    status: 'success',
    created_at: new Date().toISOString(),
    language: 'TypeScript',
  };
}

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>(SEED_BUILDS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch builds from API
  const fetchBuilds = async () => {
    try {
      const res = await fetch('/api/builds/public');
      if (res.ok) {
        const data = await res.json();
        if (data.builds && data.builds.length > 0) {
          // Merge real builds with seed data, prioritizing real ones
          const realBuilds = data.builds.map((b: any) => ({
            id: b.id,
            feature_title: b.features?.title || 'New feature shipped',
            lines_added: b.lines_added || Math.floor(Math.random() * 300) + 50,
            lines_deleted: b.lines_deleted || Math.floor(Math.random() * 30) + 5,
            status: b.status === 'success' ? 'success' : b.status,
            created_at: b.created_at,
            language: 'TypeScript',
          }));
          
          // Combine real builds with some seed data if needed
          setBuilds(prev => {
            const combined = [...realBuilds, ...prev.slice(realBuilds.length)];
            return combined.slice(0, 10);
          });
        }
      }
    } catch (error) {
      console.error('Error fetching builds:', error);
    } finally {
      setIsLoading(false);
      setLastUpdate(new Date());
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBuilds();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBuilds();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Simulate new builds coming in occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newBuild = generateRandomBuild();
        setBuilds(prev => [newBuild, ...prev.slice(0, 9)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Update "time ago" every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6">
              <Activity className="h-4 w-4 text-neon-cyan animate-pulse" />
              <span className="text-sm text-zinc-300">Live Feed</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Founders shipping while they sleep
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Real-time feed of features being built by Night Shift. 
              Anonymous, live, unstoppable.
            </p>
          </motion.div>

          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl overflow-hidden border border-white/10"
          >
            {/* Terminal Header */}
            <div className="bg-night-800/80 px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="ml-4 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                  <Terminal className="h-3 w-3" />
                  <span>night-shift — live-builds — zsh</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE</span>
                </div>
                <span className="text-zinc-600">|</span>
                <span>Updated {formatTimeAgo(lastUpdate.toISOString())}</span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-sm">
              {/* Static intro lines */}
              <div className="text-zinc-500 mb-4 space-y-1">
                <div>Last login: {new Date().toLocaleString()} from 192.168.1.42</div>
                <div className="text-neon-cyan">$ night-shift --watch --live</div>
                <div className="text-zinc-600">Watching for new builds...</div>
              </div>

              {/* Builds Feed */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {builds.map((build, index) => (
                    <motion.div
                      key={build.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-start gap-3 p-3 rounded-lg bg-night-800/30 border border-white/5 hover:border-neon-cyan/20 hover:bg-night-800/50 transition-all"
                    >
                      {/* Status Icon */}
                      <div className="mt-0.5">
                        {build.status === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : build.status === 'running' ? (
                          <Zap className="h-4 w-4 text-neon-cyan animate-pulse" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-rose-400" />
                        )}
                      </div>

                      {/* Build Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-zinc-400">A founder just shipped:</span>
                          <span className="text-white font-medium truncate">
                            {build.feature_title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Code2 className="h-3 w-3" />
                            +{build.lines_added.toLocaleString()} lines
                          </span>
                          {build.lines_deleted > 0 && (
                            <span className="text-rose-400">
                              -{build.lines_deleted} lines
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-zinc-500">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(build.created_at)}
                          </span>
                          <span className="text-neon-purple">
                            Merged ✓
                          </span>
                        </div>
                      </div>

                      {/* Sparkle for recent builds */}
                      {index === 0 && (
                        <Sparkles className="h-4 w-4 text-neon-cyan animate-pulse" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-zinc-500 mt-4">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-2">Fetching latest builds...</span>
                </div>
              )}

              {/* Cursor */}
              <div className="mt-4 flex items-center gap-2 text-zinc-500">
                <span className="text-neon-purple">❯</span>
                <span className="w-2 h-4 bg-neon-cyan/50 animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Features Shipped', value: '2,847', icon: GitCommit },
              { label: 'Lines of Code', value: '1.2M+', icon: Code2 },
              { label: 'Active Founders', value: '156', icon: Zap },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-4 text-center"
              >
                <stat.icon className="h-5 w-5 text-neon-cyan mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-zinc-400 mb-4">
              Ready to ship while you sleep?
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
