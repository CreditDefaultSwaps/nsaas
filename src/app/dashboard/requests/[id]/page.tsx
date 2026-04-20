'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetchFeature, fetchBuilds } from '@/lib/api';
import { Button, Card, CardContent, Badge, Skeleton } from '@/components/ui';
import { 
  ChevronLeft, 
  ExternalLink, 
  Github, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Moon,
  Loader2,
  Rocket,
  Zap
} from '@/components/icons';
import { formatDateTime } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PageProps {
  params: { id: string };
}

export default function RequestDetailPage({ params }: PageProps) {
  const { id } = params;
  
  const { data: feature, error: featureError, isLoading: featureLoading } = useSWR(
    ['feature', id],
    () => fetchFeature(id),
    { refreshInterval: 5000 }
  );
  
  const { data: builds, error: buildsError } = useSWR(
    ['builds', id],
    () => fetchBuilds(id)
  );

  const build = builds?.[0];
  const error = featureError || buildsError;

  if (error) {
    return (
      <div className="glass rounded-xl border border-rose-500/20 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-4" />
        <h3 className="text-lg font-medium text-rose-400">Night Interrupted</h3>
        <p className="text-rose-400/70 mt-2">{error.message}</p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  if (featureLoading) {
    return <RequestDetailSkeleton />;
  }

  if (!feature) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-white">Request not found</h3>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{feature.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
              <Clock className="h-4 w-4" />
              <span>Submitted {formatDateTime(feature.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FeatureStatusBadge status={feature.status} />
            <PriorityBadge priority={feature.priority} />
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="glass">
        <CardContent className="p-6">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">Description</h2>
          <div className="text-white whitespace-pre-wrap">
            {feature.description?.split('\n\nReference URLs:')[0] || feature.description}
          </div>
          
          {/* Reference URLs if present */}
          {feature.description?.includes('Reference URLs:') && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">References</h3>
              <div className="space-y-2">
                {feature.description
                  .split('Reference URLs:')[1]
                  ?.split('\n')
                  .filter(url => url.trim())
                  .map((url, i) => (
                    <a
                      key={i}
                      href={url.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:underline text-sm flex items-center gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {url.trim()}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Build Status Timeline */}
      {build && (
        <Card className="glass">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Build Status</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-800" />
              
              <div className="space-y-6">
                {/* Request Submitted */}
                <TimelineItem
                  status="completed"
                  icon={<Rocket className="h-4 w-4" />}
                  title="Request submitted"
                  timestamp={feature.created_at}
                  isFirst
                />
                
                {/* Cyprus Reviewing */}
                <TimelineItem
                  status={build.status === 'queued' ? 'pending' : 'completed'}
                  icon={<Moon className="h-4 w-4" />}
                  title="Cyprus reviewing..."
                  description="Your request is being analyzed"
                  isActive={build.status === 'queued'}
                />
                
                {/* Fleet Activated */}
                <TimelineItem
                  status={build.status === 'queued' ? 'pending' : 
                          ['running', 'success', 'failed'].includes(build.status) ? 'completed' : 'upcoming'}
                  icon={<Zap className="h-4 w-4" />}
                  title="Fleet activated"
                  description="Agents are assigned and ready"
                  isActive={build.status === 'queued'}
                />
                
                {/* Building */}
                <TimelineItem
                  status={build.status === 'running' ? 'pending' : 
                          ['success', 'failed'].includes(build.status) ? 'completed' : 'upcoming'}
                  icon={<Loader2 className="h-4 w-4" />}
                  title="Building..."
                  description="Code is being written and tested"
                  isActive={build.status === 'running'}
                  isRunning={build.status === 'running'}
                />
                
                {/* Shipped */}
                <TimelineItem
                  status={build.status === 'success' ? 'completed' : 
                          build.status === 'failed' ? 'failed' : 'upcoming'}
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title={build.status === 'failed' ? 'Build failed' : 'Shipped'}
                  description={build.status === 'failed' ? 'Check the logs for details' : 'Your product is ready'}
                  isLast
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        {build?.pr_number && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <a
              href={feature.pr_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="gap-2 neon-glow">
                <Github className="h-4 w-4" />
                View PR
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        )}
        
        {build?.deployed_url && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <a
              href={build.deployed_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500">
                <ExternalLink className="h-4 w-4" />
                View Live Product
              </Button>
            </a>
          </motion.div>
        )}
      </div>

      {/* Morning Brief Card */}
      <Card className="glass border-neon-purple/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-purple/20">
              <Moon className="h-4 w-4 text-neon-cyan" />
            </div>
            <h3 className="font-semibold text-white">Morning Handoff</h3>
          </div>
          
          {build?.agent_logs ? (
            <div className="bg-night-800 rounded-lg p-4 font-mono text-sm text-zinc-400 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {build.agent_logs}
            </div>
          ) : (
            <p className="text-zinc-400 text-sm">
              Your morning handoff from Cyprus will appear here once the build is complete.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({
  status,
  icon,
  title,
  description,
  timestamp,
  isFirst,
  isLast,
  isActive,
  isRunning,
}: {
  status: 'completed' | 'pending' | 'upcoming' | 'failed';
  icon: React.ReactNode;
  title: string;
  description?: string;
  timestamp?: string;
  isFirst?: boolean;
  isLast?: boolean;
  isActive?: boolean;
  isRunning?: boolean;
}) {
  const getStatusColors = () => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return isRunning 
          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse'
          : 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'failed':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'upcoming':
      default:
        return 'bg-slate-800 text-slate-500 border-slate-700';
    }
  };

  return (
    <div className="relative flex gap-4">
      {/* Timeline dot */}
      <div className="relative z-10">
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${getStatusColors()}`}>
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            icon
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-6">
        <div className={`font-medium ${
          status === 'upcoming' ? 'text-slate-500' : 'text-white'
        }`}>
          {title}
        </div>
        {description && (
          <div className={`text-sm mt-1 ${
            status === 'upcoming' ? 'text-slate-600' : 'text-zinc-400'
          }`}>
            {description}
          </div>
        )}
        {timestamp && (
          <div className="text-sm text-zinc-500 mt-1">
            {formatDateTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; label: string }> = {
    pending: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      label: 'Pending',
    },
    in_progress: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      label: 'In Progress',
    },
    building: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      label: 'Building',
    },
    testing: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      label: 'Testing',
    },
    completed: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      label: 'Completed',
    },
    failed: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      label: 'Failed',
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <Badge variant="outline" className={`${config.bg} ${config.text} border-${config.text.split('-')[1]}-500/30`}>
      {config.label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const configs: Record<string, { bg: string; text: string; label: string }> = {
    p0: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      label: 'P0',
    },
    p1: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      label: 'P1',
    },
    p2: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      label: 'P2',
    },
    urgent: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      label: 'Urgent',
    },
    high: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      label: 'High',
    },
    medium: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      label: 'Medium',
    },
    low: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      label: 'Low',
    },
  };

  const config = configs[priority] || configs.medium;

  return (
    <Badge variant="outline" className={`${config.bg} ${config.text} border-${config.text.split('-')[1]}-500/30`}>
      {config.label}
    </Badge>
  );
}

function RequestDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-8 w-96 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <Card className="glass">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
