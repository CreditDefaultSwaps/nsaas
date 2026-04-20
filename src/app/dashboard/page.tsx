'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetchFeatures, fetchBuilds } from '@/lib/api';
import { Button, Card, CardContent, Input, Textarea, Badge, Skeleton } from '@/components/ui';
import { 
  Plus, 
  Rocket,
  Clock,
  CheckCircle2,
  ExternalLink,
  Github,
  ChevronDown,
  ChevronUp,
  Trash2,
  Moon,
  Sun,
  Zap,
  Box,
  ArrowRight,
  AlertCircle,
  Loader2,
  SatelliteDish,
  Satellite,
  LayoutDashboard
} from '@/components/icons';
import { formatDate, formatDateTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Tab = 'overview' | 'new-request' | 'builds' | 'morning-brief';

interface User {
  id: string;
  email: string;
  full_name?: string;
  org_id: string;
  organizations?: {
    name: string;
    plan?: string;
  };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(console.error);
  }, []);

  const { data: features, error: featuresError, isLoading: featuresLoading, mutate: mutateFeatures } = useSWR(
    'features',
    fetchFeatures,
    { refreshInterval: 5000 }
  );

  const { data: builds, error: buildsError, isLoading: buildsLoading, mutate: mutateBuilds } = useSWR(
    'builds',
    fetchBuilds,
    { refreshInterval: 5000 }
  );

  const isLoading = featuresLoading || buildsLoading;
  const error = featuresError || buildsError;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get first name
  const firstName = user?.full_name?.split(' ')[0] || 'there';

  // Calculate stats
  const requestsSubmitted = features?.length || 0;
  const buildsCompleted = builds?.filter(b => b.status === 'success').length || 0;
  const activeBuildsCount = builds?.filter(b => b.status === 'running' || b.status === 'queued').length || 0;
  const recentFeatures = features?.slice(0, 5) || [];

  // Get plan badge
  const planTier = user?.organizations?.plan || 'idea';
  const planLabel = planTier === 'fleet' ? 'Fleet' : planTier === 'builder' ? 'Builder' : 'Idea';
  const planColor = planTier === 'fleet' ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30' : 
                    planTier === 'builder' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/30' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/30';

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
          <p className="text-zinc-400 mt-1">
            Manage your fleet and track shipments through the night
          </p>
        </div>
        <Badge variant="outline" className={planColor}>
          {planLabel} Plan
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-white/10">
        <nav className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'new-request', label: 'New Request', icon: Plus },
            { id: 'builds', label: 'Builds', icon: Box },
            { id: 'morning-brief', label: 'Morning Brief', icon: Sun },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-neon-cyan'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab
              greeting={getGreeting()}
              firstName={firstName}
              requestsSubmitted={requestsSubmitted}
              buildsCompleted={buildsCompleted}
              activeBuildsCount={activeBuildsCount}
              recentFeatures={recentFeatures}
              isLoading={isLoading}
              onNewRequest={() => setActiveTab('new-request')}
            />
          )}
          {activeTab === 'new-request' && (
            <NewRequestTab 
              onSuccess={() => {
                mutateFeatures();
                mutateBuilds();
                setActiveTab('overview');
              }}
            />
          )}
          {activeTab === 'builds' && (
            <BuildsTab builds={builds || []} isLoading={isLoading} />
          )}
          {activeTab === 'morning-brief' && (
            <MorningBriefTab builds={builds || []} features={features || []} isLoading={isLoading} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({
  greeting,
  firstName,
  requestsSubmitted,
  buildsCompleted,
  activeBuildsCount,
  recentFeatures,
  isLoading,
  onNewRequest,
}: {
  greeting: string;
  firstName: string;
  requestsSubmitted: number;
  buildsCompleted: number;
  activeBuildsCount: number;
  recentFeatures: any[];
  isLoading: boolean;
  onNewRequest: () => void;
}) {
  const hasActiveBuilds = activeBuildsCount > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass rounded-2xl p-6 border border-neon-purple/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-xl font-semibold text-white">
            {greeting}, {firstName}. Your fleet is standing by.
          </h2>
          <p className="text-zinc-400 mt-2">
            {hasActiveBuilds 
              ? `${activeBuildsCount} active build${activeBuildsCount > 1 ? 's' : ''} in progress. Results by morning.`
              : 'Ready to ship something? Submit a request and wake up to working code.'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Requests Submitted"
          value={requestsSubmitted}
          icon={<Rocket className="h-5 w-5" />}
          loading={isLoading}
          color="purple"
        />
        <StatCard
          label="Builds Completed"
          value={buildsCompleted}
          icon={<CheckCircle2 className="h-5 w-5" />}
          loading={isLoading}
          color="emerald"
        />
        <StatCard
          label="Active Builds"
          value={activeBuildsCount}
          icon={<Loader2 className="h-5 w-5" />}
          loading={isLoading}
          color="cyan"
        />
      </div>

      {/* Recent Requests */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Requests</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass">
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentFeatures.length > 0 ? (
          <div className="space-y-3">
            {recentFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/dashboard/requests/${feature.id}`}>
                  <Card className="glass glass-hover cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FeatureStatusBadge status={feature.status} />
                          <span className="font-medium text-white">
                            {feature.title || 'Untitled'}
                          </span>
                        </div>
                        <div className="text-sm text-zinc-400">
                          {formatDate(feature.created_at)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="glass border-dashed border-zinc-700">
            <CardContent className="p-8 text-center">
              <SatelliteDish className="mx-auto h-12 w-12 text-zinc-500 mb-3" />
              <p className="text-zinc-400 mb-4">No requests yet</p>
              <Button 
                onClick={onNewRequest}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
              >
                Submit your first request to brief the fleet
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fleet Status */}
      <Card className="glass border-neon-cyan/20">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Fleet Status</p>
            <p className="text-sm text-zinc-400">Cyprus is standing by, ready for tonight's shift</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// New Request Tab Component
function NewRequestTab({ onSuccess }: { onSuccess: () => void }) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [referenceUrls, setReferenceUrls] = useState('');
  const [priority, setPriority] = useState<'tonight' | 'this-week'>('tonight');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedFeatureId, setSubmittedFeatureId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: productName,
          description: `${description}\n\nReference URLs:\n${referenceUrls}`,
          priority: priority === 'tonight' ? 'high' : 'medium',
          techPreferences: priority === 'tonight' ? 'Next.js + Supabase' : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to create request');
      
      const data = await response.json();
      setSubmittedFeatureId(data.feature.id);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-12 text-center border border-neon-cyan/30"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-cyan/20 flex items-center justify-center relative">
          <Satellite className="h-10 w-10 text-neon-cyan" />
          <div className="absolute inset-0 rounded-full bg-neon-cyan/30 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">
          Cyprus has been briefed.
        </h3>
        <p className="text-zinc-400 mb-6">
          Your fleet activates tonight. Check back tomorrow morning.
        </p>
        {submittedFeatureId && (
          <Link 
            href={`/dashboard/requests/${submittedFeatureId}`}
            className="text-neon-cyan hover:text-neon-cyan/80 transition-colors inline-flex items-center gap-2"
          >
            View your request →
          </Link>
        )}
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Brief the Fleet</h2>
        <p className="text-zinc-400">
          Describe what you want built. Cyprus and the fleet activate tonight.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass">
          <CardContent className="p-6 space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                What are you building?
              </label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Customer Portal Dashboard"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-zinc-500"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Describe it like you&apos;re texting a friend
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="I want a dashboard that shows my Stripe revenue by day, with a chart and a table of recent transactions. It should look clean and dark."
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-zinc-500 min-h-[140px]"
                required
              />
            </div>

            {/* Reference URLs */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Any examples or references? <span className="text-zinc-500">(optional)</span>
              </label>
              <Textarea
                value={referenceUrls}
                onChange={(e) => setReferenceUrls(e.target.value)}
                placeholder="Paste URLs to inspiration, examples, or existing products..."
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-zinc-500 min-h-[80px]"
              />
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">When do you need it?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    priority === 'tonight' ? 'border-neon-cyan bg-neon-cyan/20' : 'border-slate-600 group-hover:border-slate-500'
                  }`}>
                    {priority === 'tonight' && <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan" />}
                  </div>
                  <input
                    type="radio"
                    name="priority"
                    value="tonight"
                    checked={priority === 'tonight'}
                    onChange={(e) => setPriority(e.target.value as 'tonight')}
                    className="sr-only"
                  />
                  <div>
                    <span className={`block ${priority === 'tonight' ? 'text-white' : 'text-zinc-300'}`}>
                      Tonight
                    </span>
                    <span className="text-xs text-zinc-500">Ships by morning</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    priority === 'this-week' ? 'border-neon-cyan bg-neon-cyan/20' : 'border-slate-600 group-hover:border-slate-500'
                  }`}>
                    {priority === 'this-week' && <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan" />}
                  </div>
                  <input
                    type="radio"
                    name="priority"
                    value="this-week"
                    checked={priority === 'this-week'}
                    onChange={(e) => setPriority(e.target.value as 'this-week')}
                    className="sr-only"
                  />
                  <div>
                    <span className={`block ${priority === 'this-week' ? 'text-white' : 'text-zinc-300'}`}>
                      This week
                    </span>
                    <span className="text-xs text-zinc-500">Within 3-5 days</span>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !productName || !description}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity neon-glow h-12 text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Briefing the fleet...
            </>
          ) : (
            <>
              Brief the Fleet
              <Rocket className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

// Builds Tab Component
function BuildsTab({ builds, isLoading }: { builds: any[]; isLoading: boolean }) {
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass">
            <CardContent className="p-4">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (builds.length === 0) {
    return (
      <Card className="glass border-dashed border-zinc-700">
        <CardContent className="p-12 text-center">
          <Box className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No builds yet</h3>
          <p className="text-zinc-400">
            Submit your first request to start building
          </p>
        </CardContent>
      </Card>
    );
  }

  const getDuration = (build: any) => {
    if (!build.started_at) return null;
    const start = new Date(build.started_at);
    const end = build.completed_at ? new Date(build.completed_at) : new Date();
    const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
    return minutes < 1 ? '< 1m' : `${minutes}m`;
  };

  return (
    <div className="space-y-3">
      {builds.map((build, index) => (
        <motion.div
          key={build.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="glass overflow-hidden">
            <CardContent className="p-0">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedBuild(expandedBuild === build.id ? null : build.id)}
              >
                <div className="flex items-center gap-4">
                  <BuildStatusBadge status={build.status} />
                  <span className="font-medium text-white">
                    {build.features?.title || 'Untitled'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-500">
                    {formatDateTime(build.created_at)}
                  </span>
                  {getDuration(build) && (
                    <span className="text-sm text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getDuration(build)}
                    </span>
                  )}
                  {expandedBuild === build.id ? (
                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedBuild === build.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-3">
                      {build.status === 'success' && (
                        <div className="flex gap-4">
                          {build.pr_number && (
                            <a
                              href={`#`}
                              className="text-sm text-neon-cyan hover:underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-4 w-4" />
                              PR #{build.pr_number}
                            </a>
                          )}
                        </div>
                      )}
                      {build.agent_logs && (
                        <div className="bg-night-800 rounded-lg p-3 font-mono text-xs text-zinc-400 whitespace-pre-wrap">
                          {build.agent_logs}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Morning Brief Tab Component
function MorningBriefTab({ builds, features, isLoading }: { builds: any[]; features: any[]; isLoading: boolean }) {
  // Find the latest completed build with a feature
  const latestCompletedBuild = builds.find(b => b.status === 'success');
  const latestFeature = latestCompletedBuild 
    ? features.find(f => f.id === latestCompletedBuild.feature_id)
    : null;
  
  // Check if there's a build in progress
  const inProgressBuild = builds.find(b => b.status === 'running' || b.status === 'queued');

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-neon-purple/30">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-purple/20 border border-neon-purple/30">
            <Moon className="h-5 w-5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Cyprus — Morning Handoff
            </h2>
            <p className="text-sm text-zinc-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {latestCompletedBuild && latestFeature ? (
          <div className="space-y-6">
            {/* What was built */}
            <div className="space-y-4">
              <p className="text-zinc-300 font-mono text-sm">Good morning. Here&apos;s what shipped last night:</p>
              
              <div className="space-y-3 pl-4 border-l-2 border-emerald-500/50">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-emerald-400 font-medium">
                      {latestFeature.title}
                    </p>
                    <p className="text-zinc-400 text-sm mt-1">
                      {latestFeature.description?.split('\n')[0]}
                    </p>
                  </div>
                </div>
                
                {latestCompletedBuild.pr_number && (
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-emerald-400" />
                    <a 
                      href={latestFeature.pr_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline text-sm"
                    >
                      PR #{latestCompletedBuild.pr_number} created and ready for review
                    </a>
                  </div>
                )}

                {latestCompletedBuild.deployed_url && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-emerald-400" />
                    <a 
                      href={latestCompletedBuild.deployed_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline text-sm"
                    >
                      View live product
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Agent logs */}
            {latestCompletedBuild.agent_logs && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Build Notes</h3>
                <div className="bg-night-800 rounded-lg p-4 font-mono text-xs text-zinc-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {latestCompletedBuild.agent_logs}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-white/10 space-y-1 text-zinc-400 font-mono text-sm">
              <p>Fleet status: All agents standing by.</p>
              <p>Ready for tonight&apos;s request.</p>
              <p className="text-zinc-500 mt-4">— Cyprus</p>
            </div>
          </div>
        ) : inProgressBuild ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center relative">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Cyprus is building tonight...</h3>
            <p className="text-zinc-400">
              Your request is being worked on. Check back in the morning for results.
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sun className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No morning brief yet</h3>
            <p className="text-zinc-400">
              Your first morning brief will appear after your first shift.
            </p>
            <p className="text-zinc-500 text-sm mt-2">
              Submit a request tonight and wake up to working code.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper Components
function StatCard({
  label,
  value,
  icon,
  loading,
  color = 'cyan',
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  loading: boolean;
  color?: 'cyan' | 'emerald' | 'purple';
}) {
  const colorClasses = {
    cyan: 'text-neon-cyan bg-neon-cyan/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    purple: 'text-neon-purple bg-neon-purple/10',
  };

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
    <Card className="glass glass-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-zinc-400">{label}</p>
          <span className={`p-1.5 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </span>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
      </CardContent>
    </Card>
  );
}

function BuildStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    queued: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      label: 'Queued',
    },
    running: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      dot: 'bg-cyan-400 animate-pulse',
      label: 'Building',
    },
    success: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'Success',
    },
    failed: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      dot: 'bg-rose-400',
      label: 'Failed',
    },
    cancelled: {
      bg: 'bg-zinc-500/10',
      text: 'text-zinc-400',
      dot: 'bg-zinc-400',
      label: 'Cancelled',
    },
  };

  const config = configs[status] || configs.queued;

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${config.bg} border border-${config.text.split('-')[1]}-500/20`}>
      <div className={`h-2 w-2 rounded-full ${config.dot}`} />
      <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
    </div>
  );
}

function FeatureStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    pending: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      label: 'Pending',
    },
    in_progress: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      dot: 'bg-cyan-400 animate-pulse',
      label: 'In Progress',
    },
    building: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      dot: 'bg-cyan-400 animate-pulse',
      label: 'Building',
    },
    testing: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      dot: 'bg-purple-400 animate-pulse',
      label: 'Testing',
    },
    completed: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'Completed',
    },
    failed: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      dot: 'bg-rose-400',
      label: 'Failed',
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${config.bg} border border-${config.text.split('-')[1]}-500/20`}>
      <div className={`h-2 w-2 rounded-full ${config.dot}`} />
      <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
    </div>
  );
}