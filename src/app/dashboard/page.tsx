'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { fetchFeatures, fetchRepos } from '@/lib/api';
import { Button, Card, CardContent, StatusBadge, EmptyState, Skeleton } from '@/components/ui';
import { 
  Plus, 
  Github, 
  AlertCircle,
  Moon,
  Clock,
  CheckCircle2,
  Zap,
  ArrowRight
} from '@/components/icons';
import { formatDate } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}

function DashboardContent() {
  const { data: features, error: featuresError, isLoading: featuresLoading } = useSWR(
    'features',
    fetchFeatures,
    { refreshInterval: 5000 }
  );
  
  const { data: repos, error: reposError, isLoading: reposLoading } = useSWR(
    'repos',
    fetchRepos
  );

  const isLoading = featuresLoading || reposLoading;
  const error = featuresError || reposError;

  if (error) {
    return (
      <div className="glass rounded-xl border border-rose-500/20 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-4" />
        <h3 className="text-lg font-medium text-rose-400">Night Interrupted</h3>
        <p className="text-rose-400/70 mt-2">{error.message}</p>
        <Button 
          variant="outline" 
          className="mt-4 border-rose-500/30"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // No repos connected state
  if (!isLoading && (!repos || repos.length === 0)) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Requests</h1>
            <p className="text-zinc-400 mt-1">
              Manage your requests and track their progress through the night
            </p>
          </div>
        </div>

        <EmptyState
          icon={<Github className="h-8 w-8" />}
          title="No repositories connected"
          description="Connect your GitHub repositories to start shipping while you sleep."
          action={{
            label: 'Connect Repository',
            onClick: () => window.location.href = '/dashboard/repos',
          }}
        />
      </div>
    );
  }

  // Calculate stats
  const totalRequests = features?.length || 0;
  const activeShifts = features?.filter((f: any) => ['in_progress', 'building', 'testing'].includes(f.status)).length || 0;
  const shipped = features?.filter((f: any) => f.status === 'completed').length || 0;
  const repoCount = repos?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Requests</h1>
          <p className="text-zinc-400 mt-1">
            Manage your requests and track their progress through the night
          </p>
        </div>
        <Link href="/dashboard/features/new">
          <Button className="gap-2 neon-glow">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={totalRequests}
          icon={<Zap className="h-4 w-4" />}
          loading={isLoading}
        />
        <StatCard
          label="Active Shifts"
          value={activeShifts}
          icon={<Moon className="h-4 w-4" />}
          loading={isLoading}
          highlight
        />
        <StatCard
          label="Shipped"
          value={shipped}
          icon={<CheckCircle2 className="h-4 w-4" />}
          loading={isLoading}
        />
        <StatCard
          label="Repositories"
          value={repoCount}
          icon={<Github className="h-4 w-4" />}
          loading={isLoading}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Requests</h2>
            <Link href="/dashboard" className="text-sm text-neon-cyan hover:text-neon-purple transition-colors flex items-center gap-1">
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {isLoading ? (
            <RequestsSkeleton />
          ) : features && features.length > 0 ? (
            <div className="space-y-3">
              {features.slice(0, 5).map((feature: any, index: number) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/dashboard/features/${feature.id}`}>
                    <Card className="glass glass-hover cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium text-white group-hover:text-neon-cyan transition-colors truncate">
                                {feature.title}
                              </h3>
                              <StatusBadge status={feature.status} />
                              <StatusBadge status={feature.priority} />
                            </div>
                            <p className="text-sm text-zinc-500 mt-1">
                              {feature.repos?.full_name} • Created {formatDate(feature.created_at)}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-neon-cyan transition-colors ml-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Plus className="h-8 w-8" />}
              title="No requests yet"
              description="Create your first request to start shipping while you sleep."
              action={{
                label: 'Create Request',
                onClick: () => window.location.href = '/dashboard/features/new',
              }}
            />
          )}
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Night Activity</h2>
          <Card className="glass">
            <CardContent className="p-4 space-y-4">
              {isLoading ? (
                <>
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                </>
              ) : features && features.length > 0 ? (
                features.slice(0, 5).map((feature: any, index: number) => (
                  <div key={feature.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      {feature.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : feature.status === 'building' ? (
                        <Moon className="h-4 w-4 text-neon-cyan animate-pulse" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 truncate">
                        {feature.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {feature.status === 'completed' ? 'Shipped' : 
                         feature.status === 'building' ? 'In progress' : 'Queued'} • {formatDate(feature.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">
                  No activity yet. Start your first night shift!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="glass border-neon-purple/20">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-white mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-zinc-400">
                Be specific in your requests. Instead of "fix the bug", try "fix the login error when users enter special characters in passwords".
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon,
  loading,
  highlight 
}: { 
  label: string; 
  value: number; 
  icon: React.ReactNode;
  loading: boolean;
  highlight?: boolean;
}) {
  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-12" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass ${highlight ? 'neon-border' : 'glass-hover'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-zinc-400">{label}</p>
          <span className={`${highlight ? 'text-neon-cyan' : 'text-zinc-500'}`}>
            {icon}
          </span>
        </div>
        <p className={`text-2xl font-bold ${highlight ? 'text-white neon-text' : 'text-zinc-200'}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function RequestsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-5 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="h-4 w-4 mt-1" />
      <div className="flex-1">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
