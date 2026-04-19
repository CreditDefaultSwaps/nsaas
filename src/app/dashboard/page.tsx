'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetchFeatures, fetchBuilds } from '@/lib/api';
import { Button, Card, CardContent, Input, Textarea, Select, SelectItem, Badge, Skeleton } from '@/components/ui';
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
  Loader2
} from '@/components/icons';
import { formatDate, formatDateTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'overview' | 'new-request' | 'builds' | 'morning-brief';

const techOptions = [
  { value: 'nextjs-supabase', label: 'Next.js + Supabase' },
  { value: 'react-firebase', label: 'React + Firebase' },
  { value: 'vue-postgres', label: 'Vue + Postgres' },
  { value: 'other', label: 'Other' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

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

  // Calculate stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const shippedThisMonth = builds?.filter(b => 
    b.status === 'success' && 
    new Date(b.created_at) >= startOfMonth
  ).length || 0;
  const activeBuildsCount = builds?.filter(b => b.status === 'running').length || 0;
  const recentBuilds = builds?.slice(0, 3) || [];

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
        <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/30">
          Idea Plan
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-white/10">
        <nav className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
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
              shippedThisMonth={shippedThisMonth}
              activeBuildsCount={activeBuildsCount}
              recentBuilds={recentBuilds}
              isLoading={isLoading}
              onNewRequest={() => setActiveTab('new-request')}
              features={features || []}
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
            <MorningBriefTab builds={builds || []} isLoading={isLoading} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({
  greeting,
  shippedThisMonth,
  activeBuildsCount,
  recentBuilds,
  isLoading,
  onNewRequest,
  features,
}: {
  greeting: string;
  shippedThisMonth: number;
  activeBuildsCount: number;
  recentBuilds: any[];
  isLoading: boolean;
  onNewRequest: () => void;
  features: any[];
}) {
  const hasActiveBuilds = activeBuildsCount > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass rounded-2xl p-6 border border-neon-purple/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-xl font-semibold text-white">
            {greeting}, Alex. Your fleet is standing by.
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
          label="Products shipped this month"
          value={shippedThisMonth}
          icon={<Rocket className="h-5 w-5" />}
          loading={isLoading}
          color="emerald"
        />
        <StatCard
          label="Active builds"
          value={activeBuildsCount}
          icon={<Loader2 className="h-5 w-5" />}
          loading={isLoading}
          color="cyan"
        />
        <StatCard
          label="Sandboxes"
          value="1 / 1"
          icon={<Box className="h-5 w-5" />}
          loading={isLoading}
          color="purple"
          isText
        />
      </div>

      {/* Recent Builds */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Builds</h3>
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
        ) : recentBuilds.length > 0 ? (
          <div className="space-y-3">
            {recentBuilds.map((build, index) => (
              <motion.div
                key={build.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass glass-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BuildStatusBadge status={build.status} />
                        <span className="font-medium text-white">
                          {build.features?.title || 'Untitled'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span>{formatDate(build.created_at)}</span>
                        {build.status === 'success' && build.pr_number && (
                          <a
                            href={`#`}
                            className="text-neon-cyan hover:underline flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                            PR #{build.pr_number}
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="glass border-dashed border-zinc-700">
            <CardContent className="p-8 text-center">
              <Moon className="mx-auto h-8 w-8 text-zinc-500 mb-3" />
              <p className="text-zinc-400">No builds yet</p>
              <Button 
                variant="ghost" 
                className="mt-3 text-neon-cyan hover:text-neon-cyan/80"
                onClick={onNewRequest}
              >
                Start your first request →
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA Card if no active builds */}
      {!hasActiveBuilds && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className="glass border-neon-cyan/30 cursor-pointer group"
            onClick={onNewRequest}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white group-hover:text-neon-cyan transition-colors">
                  Ready to ship something?
                </h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Start a new request and let the fleet work overnight
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-500 group-hover:text-neon-cyan transition-colors" />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// New Request Tab Component
function NewRequestTab({ onSuccess }: { onSuccess: () => void }) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [referenceUrls, setReferenceUrls] = useState<string[]>(['']);
  const [techPreference, setTechPreference] = useState('nextjs-supabase');
  const [priority, setPriority] = useState<'tonight' | 'this-week'>('tonight');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const addReferenceUrl = () => setReferenceUrls([...referenceUrls, '']);
  const removeReferenceUrl = (index: number) => {
    setReferenceUrls(referenceUrls.filter((_, i) => i !== index));
  };
  const updateReferenceUrl = (index: number, value: string) => {
    const newUrls = [...referenceUrls];
    newUrls[index] = value;
    setReferenceUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For demo, we'll use a default repo_id
      const repoId = '00000000-0000-0000-0000-000000000001';
      
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo_id: repoId,
          title: productName,
          description: `${description}\n\nTech Preference: ${techPreference}\nPriority: ${priority}\n\nReference URLs:\n${referenceUrls.filter(u => u).join('\n')}`,
          priority: priority === 'tonight' ? 'high' : 'medium',
        }),
      });

      if (!response.ok) throw new Error('Failed to create request');
      
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
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
        className="glass rounded-2xl p-12 text-center border border-emerald-500/30"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Cyprus has been briefed
        </h3>
        <p className="text-zinc-400">
          Your fleet activates tonight. Check the Morning Brief tab at sunrise.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Card className="glass">
        <CardContent className="p-6 space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Product name
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
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want built in plain English. What does it do? Who is it for? What should it look like?"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-zinc-500 min-h-[120px]"
              required
            />
          </div>

          {/* Reference URLs */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">
              Reference URLs
            </label>
            <p className="text-xs text-zinc-500">
              Paste any URLs for inspiration, examples, or existing products
            </p>
            {referenceUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateReferenceUrl(index, e.target.value)}
                  placeholder="https://..."
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-zinc-500 flex-1"
                />
                {referenceUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReferenceUrl(index)}
                    className="text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addReferenceUrl}
              className="text-neon-cyan hover:text-neon-cyan/80"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add URL
            </Button>
          </div>

          {/* Tech Preferences */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Tech preferences <span className="text-zinc-500">(optional)</span>
            </label>
            <Select
              value={techPreference}
              onChange={(e) => setTechPreference(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            >
              {techOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">Priority</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="tonight"
                  checked={priority === 'tonight'}
                  onChange={(e) => setPriority(e.target.value as 'tonight')}
                  className="text-neon-cyan focus:ring-neon-cyan"
                />
                <span className="text-zinc-300">Tonight</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="this-week"
                  checked={priority === 'this-week'}
                  onChange={(e) => setPriority(e.target.value as 'this-week')}
                  className="text-neon-cyan focus:ring-neon-cyan"
                />
                <span className="text-zinc-300">This week</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !productName || !description}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity neon-glow"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Briefing the fleet...
          </>
        ) : (
          <>
            Brief the Fleet →
          </>
        )}
      </Button>
    </form>
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
function MorningBriefTab({ builds, isLoading }: { builds: any[]; isLoading: boolean }) {
  const latestBuild = builds.find(b => b.status === 'success');

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
          <Moon className="h-6 w-6 text-neon-cyan" />
          <h2 className="text-xl font-semibold text-white">
            Cyprus — Morning Handoff
          </h2>
        </div>

        {latestBuild ? (
          <div className="space-y-4 font-mono text-sm">
            <p className="text-zinc-300">Good morning. Here&apos;s what shipped last night:</p>
            
            <div className="space-y-2 pl-4 border-l-2 border-emerald-500/50">
              <p className="text-emerald-400">
                ✓ {latestBuild.features?.title || 'Product'} — deployed and ready
              </p>
              {latestBuild.pr_number && (
                <p className="text-emerald-400">
                  ✓ PR #{latestBuild.pr_number} created and ready for review
                </p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-1 text-zinc-400">
              <p>Fleet status: All agents standing by.</p>
              <p>Ready for tonight&apos;s request.</p>
              <p className="text-zinc-500 mt-4">— Cyprus</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Moon className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <p className="text-zinc-400">
              Nothing shipped yet. Brief the fleet tonight to wake up to your first product.
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
  isText = false,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  loading: boolean;
  color?: 'cyan' | 'emerald' | 'purple';
  isText?: boolean;
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
        <p className={`text-2xl font-bold ${isText ? 'text-zinc-200' : 'text-white'}`}>
          {value}
        </p>
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

function LayoutDashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2" />
    </svg>
  );
}