'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { fetchBuilds } from '@/lib/api';
import { Card, CardContent, StatusBadge, EmptyState, Skeleton } from '@/components/ui';
import { Terminal, Clock, AlertCircle, Moon, ArrowRight } from '@/components/icons';
import { formatDateTime, formatDuration } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { motion } from 'framer-motion';

export default function ActiveShiftsPage() {
  return (
    <ErrorBoundary>
      <ActiveShiftsContent />
    </ErrorBoundary>
  );
}

function ActiveShiftsContent() {
  const { data: builds, error, isLoading, mutate } = useSWR('builds', fetchBuilds, {
    refreshInterval: 5000,
  });

  if (error) {
    return (
      <div className="glass rounded-xl border border-rose-500/20 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-4" />
        <h3 className="text-lg font-medium text-rose-400">Night Interrupted</h3>
        <p className="text-rose-400/70 mt-2">{error.message}</p>
      </div>
    );
  }

  // Calculate stats
  const activeCount = builds?.filter((b: any) => ['queued', 'running'].includes(b.status)).length || 0;
  const shippedCount = builds?.filter((b: any) => b.status === 'success').length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Active Shifts</h1>
          <p className="text-zinc-400 mt-1">
            Monitor your AI team's progress through the night
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-neon-cyan">{activeCount}</div>
            <div className="text-xs text-zinc-500">Active</div>
          </div>
          <div className="glass rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-emerald-400">{shippedCount}</div>
            <div className="text-xs text-zinc-500">Shipped</div>
          </div>
        </div>
      </div>

      {/* Shifts List */}
      {isLoading ? (
        <ShiftsSkeleton />
      ) : builds && builds.length > 0 ? (
        <div className="space-y-3">
          {builds.map((build: any, index: number) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/dashboard/features/${build.feature_id}`}>
                <Card className="glass glass-hover cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          build.status === 'running' 
                            ? 'bg-neon-cyan/20 border border-neon-cyan/30' 
                            : build.status === 'success'
                            ? 'bg-emerald-500/20 border border-emerald-500/30'
                            : 'bg-white/5 border border-white/10'
                        }`}>
                          {build.status === 'running' ? (
                            <Moon className="h-5 w-5 text-neon-cyan animate-pulse" />
                          ) : (
                            <Terminal className="h-5 w-5 text-zinc-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white group-hover:text-neon-cyan transition-colors">
                              {build.features?.title || 'Unknown Request'}
                            </h3>
                            <StatusBadge status={build.status} />
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {build.started_at 
                                ? formatDuration(
                                    build.completed_at 
                                      ? (new Date(build.completed_at).getTime() - new Date(build.started_at).getTime()) / 1000 / 60
                                      : (Date.now() - new Date(build.started_at).getTime()) / 1000 / 60
                                  )
                                : 'Queued'
                              }
                            </span>
                            <span>•</span>
                            <span>{formatDateTime(build.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-neon-cyan transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Moon className="h-8 w-8" />}
          title="No shifts yet"
          description="Your night shifts will appear here when you submit requests."
        />
      )}
    </div>
  );
}

function ShiftsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
