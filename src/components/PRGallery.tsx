'use client';

import { motion } from 'framer-motion';
import { GitPullRequest, GitBranch, FileCode, Plus, CheckCircle2 } from 'lucide-react';

interface PRData {
  id: string;
  title: string;
  branch: string;
  filesChanged: number;
  linesAdded: number;
  timestamp: string;
}

const prData: PRData[] = [
  {
    id: '#1',
    title: 'Add Stripe billing integration',
    branch: 'feature/stripe-billing',
    filesChanged: 12,
    linesAdded: 487,
    timestamp: 'Merged 2 hours ago',
  },
  {
    id: '#2',
    title: 'Add user authentication flow',
    branch: 'feature/user-auth',
    filesChanged: 8,
    linesAdded: 324,
    timestamp: 'Merged 5 hours ago',
  },
  {
    id: '#3',
    title: 'Build admin dashboard',
    branch: 'feature/admin-dashboard',
    filesChanged: 15,
    linesAdded: 892,
    timestamp: 'Merged 8 hours ago',
  },
  {
    id: '#4',
    title: 'Implement real-time notifications',
    branch: 'feature/notifications',
    filesChanged: 6,
    linesAdded: 256,
    timestamp: 'Merged 12 hours ago',
  },
  {
    id: '#5',
    title: 'Add API rate limiting',
    branch: 'feature/rate-limiting',
    filesChanged: 4,
    linesAdded: 178,
    timestamp: 'Merged 16 hours ago',
  },
  {
    id: '#6',
    title: 'Setup CI/CD pipeline',
    branch: 'feature/cicd-pipeline',
    filesChanged: 3,
    linesAdded: 145,
    timestamp: 'Merged 20 hours ago',
  },
];

function PRCard({ pr, index }: { pr: PRData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center">
              <GitPullRequest className="h-4 w-4 text-neon-cyan" />
            </div>
            <span className="text-xs font-mono text-zinc-500">{pr.id}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">Merged</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white mb-3 line-clamp-1">
          {pr.title}
        </h3>

        {/* Branch */}
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="h-3 w-3 text-zinc-500" />
          <span className="text-xs font-mono text-zinc-400 truncate">
            {pr.branch}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <FileCode className="h-3 w-3 text-zinc-500" />
            <span className="text-xs text-zinc-400">
              {pr.filesChanged} files
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Plus className="h-3 w-3 text-emerald-400" />
            <span className="text-xs text-emerald-400">
              {pr.linesAdded.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="mt-3 text-xs text-zinc-500">
          {pr.timestamp}
        </div>
      </div>
    </motion.div>
  );
}

export function PRGallery() {
  return (
    <section className="relative py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6">
            <GitPullRequest className="h-4 w-4 text-neon-cyan" />
            <span className="text-sm text-zinc-300">Shipped Overnight</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real PRs. Real code. Every morning.
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            These are actual pull requests our AI engineers shipped while founders were sleeping. Production-ready code, ready to merge.
          </p>
        </motion.div>

        {/* PR Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prData.map((pr, index) => (
            <PRCard key={pr.id} pr={pr} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-zinc-500 text-sm">
            Your next feature could be here tomorrow morning.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
