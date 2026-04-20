'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { motion } from 'framer-motion';
import { Card, CardContent, Button, Badge, Skeleton } from '@/components/ui';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Building2, 
  AlertCircle,
  Github,
  ExternalLink,
  CheckCircle2,
  Play,
  Send,
  Copy,
  Check
} from '@/components/icons';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Feature {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'building' | 'testing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  pr_url: string | null;
  created_at: string;
  updated_at: string;
  org_id: string;
  organizations?: {
    id: string;
    name: string;
    slug: string;
  };
  user?: {
    id: string;
    email: string;
    full_name: string | null;
  };
  builds?: {
    id: string;
    status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
    started_at: string | null;
    completed_at: string | null;
    pr_number: number | null;
    commit_sha: string | null;
    agent_logs: string | null;
    morning_brief?: string;
  }[];
}

const fetchAdminRequest = async (id: string): Promise<Feature> => {
  const res = await fetch(`/api/admin/requests/${id}`);
  if (!res.ok) throw new Error('Failed to fetch request');
  const data = await res.json();
  return data.feature;
};

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'text-zinc-400' },
  { value: 'in_progress', label: 'In Progress', color: 'text-amber-400' },
  { value: 'building', label: 'Building', color: 'text-cyan-400' },
  { value: 'testing', label: 'Testing', color: 'text-purple-400' },
  { value: 'completed', label: 'Shipped', color: 'text-emerald-400' },
  { value: 'failed', label: 'Failed', color: 'text-rose-400' },
];

const buildStatusOptions = [
  { value: 'queued', label: 'Queued', color: 'text-amber-400' },
  { value: 'running', label: 'Running', color: 'text-cyan-400' },
  { value: 'success', label: 'Success', color: 'text-emerald-400' },
  { value: 'failed', label: 'Failed', color: 'text-rose-400' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-zinc-400' },
];

export default function AdminRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: feature, error, isLoading } = useSWR(
    id ? `admin-request-${id}` : null,
    () => fetchAdminRequest(id),
    { refreshInterval: 5000 }
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const [showShipForm, setShowShipForm] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [status, setStatus] = useState(feature?.status || 'pending');
  const [buildStatus, setBuildStatus] = useState(feature?.builds?.[0]?.status || 'queued');
  const [prUrl, setPrUrl] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [morningBrief, setMorningBrief] = useState('');

  // Update form states when feature loads
  useState(() => {
    if (feature) {
      setStatus(feature.status);
      setBuildStatus(feature.builds?.[0]?.status || 'queued');
    }
  });

  const handleUpdateStatus = async (newStatus: string, newBuildStatus?: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          build_status: newBuildStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to update');
      
      mutate(`admin-request-${id}`);
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsBuilding = async () => {
    await handleUpdateStatus('building', 'running');
    await fetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'building',
        build_status: 'running',
        started_at: new Date().toISOString(),
      }),
    });
    mutate(`admin-request-${id}`);
    toast.success('Marked as building');
  };

  const handleShipIt = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          build_status: 'success',
          pr_url: prUrl,
          completed_at: new Date().toISOString(),
          agent_logs: morningBrief,
        }),
      });

      if (!res.ok) throw new Error('Failed to ship');

      // Log Telegram notification (for now)
      console.log(`[TELEGRAM] Would notify ${feature?.user?.email}: Your feature "${feature?.title}" has been shipped!`);
      
      mutate(`admin-request-${id}`);
      setShowShipForm(false);
      toast.success('Shipped! Notification logged.');
    } catch (err) {
      toast.error('Failed to ship');
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="glass rounded-xl border border-rose-500/20 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-4" />
        <h3 className="text-lg font-medium text-rose-400">Failed to load request</h3>
        <p className="text-rose-400/70 mt-2 text-sm">{error.message}</p>
        <Link href="/admin/requests">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to requests
          </Button>
        </Link>
      </div>
    );
  }

  const build = feature?.builds?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/requests"
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : feature ? (
        <>
          {/* Title Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={feature.status} />
                {build && <BuildStatusBadge status={build.status} />}
              </div>
              <h1 className="text-2xl font-semibold text-white">{feature.title}</h1>
              <p className="text-zinc-500 text-sm mt-1 font-mono">{feature.id}</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {feature.status !== 'completed' && feature.status !== 'building' && (
                <Button
                  onClick={handleMarkAsBuilding}
                  disabled={isUpdating}
                  className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Mark as Building
                </Button>
              )}
              {feature.status !== 'completed' && (
                <Button
                  onClick={() => setShowShipForm(true)}
                  disabled={isUpdating}
                  className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Ship It
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="glass">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Description</h3>
                  <p className="text-sm text-white whitespace-pre-wrap">{feature.description}</p>
                </CardContent>
              </Card>

              {/* Status Management */}
              <Card className="glass">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-zinc-400 mb-4">Status Management</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-500 mb-1.5 block">Feature Status</label>
                      <select
                        value={feature.status}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        disabled={isUpdating}
                        className="w-full px-3 py-2 bg-night-800 border border-white/10 rounded-lg text-sm text-white focus:border-neon-purple/50 focus:outline-none disabled:opacity-50"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-zinc-500 mb-1.5 block">Build Status</label>
                      <select
                        value={build?.status || 'queued'}
                        onChange={(e) => handleUpdateStatus(feature.status, e.target.value)}
                        disabled={isUpdating || !build}
                        className="w-full px-3 py-2 bg-night-800 border border-white/10 rounded-lg text-sm text-white focus:border-neon-purple/50 focus:outline-none disabled:opacity-50"
                      >
                        {buildStatusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Build Details */}
              {build && (
                <Card className="glass">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">Build Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-500 text-xs block">Started</span>
                        <span className="text-white font-mono">
                          {build.started_at ? formatDateTime(build.started_at) : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-xs block">Completed</span>
                        <span className="text-white font-mono">
                          {build.completed_at ? formatDateTime(build.completed_at) : '—'}
                        </span>
                      </div>
                      {build.pr_number && (
                        <div>
                          <span className="text-zinc-500 text-xs block">PR Number</span>
                          <span className="text-white font-mono">#{build.pr_number}</span>
                        </div>
                      )}
                      {build.commit_sha && (
                        <div>
                          <span className="text-zinc-500 text-xs block">Commit</span>
                          <span className="text-white font-mono">{build.commit_sha.slice(0, 7)}</span>
                        </div>
                      )}
                    </div>
                    
                    {feature.pr_url && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <a
                          href={feature.pr_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-neon-cyan hover:text-neon-cyan/80"
                        >
                          <Github className="h-4 w-4" />
                          View Pull Request
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Agent Logs */}
              {build?.agent_logs && (
                <Card className="glass">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">Agent Logs / Morning Brief</h3>
                    <div className="bg-night-800 rounded-lg p-3 font-mono text-xs text-zinc-400 whitespace-pre-wrap">
                      {build.agent_logs}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - User Info */}
            <div className="space-y-6">
              <Card className="glass">
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-sm font-medium text-zinc-400">Requester</h3>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-neon-purple/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-neon-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {feature.user?.full_name || 'Unknown'}
                      </p>
                      <button
                        onClick={() => copyToClipboard(feature.user?.email || '')}
                        className="text-xs text-zinc-500 hover:text-neon-cyan transition-colors flex items-center gap-1"
                      >
                        {feature.user?.email}
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-xs text-zinc-500 mb-2">Organization</h4>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm text-white">{feature.organizations?.name || 'Unknown'}</span>
                    </div>
                    <p className="text-xs text-zinc-600 font-mono mt-1">{feature.org_id}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-xs text-zinc-500 mb-2">Timeline</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Created</span>
                        <span className="text-white font-mono">{formatDateTime(feature.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Updated</span>
                        <span className="text-white font-mono">{formatDateTime(feature.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ship It Modal */}
          {showShipForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowShipForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg glass rounded-2xl border border-emerald-500/30 overflow-hidden"
              >
                <div className="p-6 border-b border-white/5">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Ship Feature
                  </h2>
                  <p className="text-zinc-500 text-sm mt-1">
                    Mark as complete and notify the user
                  </p>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1.5 block">PR URL</label>
                    <input
                      type="url"
                      value={prUrl}
                      onChange={(e) => setPrUrl(e.target.value)}
                      placeholder="https://github.com/.../pull/123"
                      className="w-full px-3 py-2 bg-night-800 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-zinc-500 mb-1.5 block">Deployed URL</label>
                    <input
                      type="url"
                      value={deployedUrl}
                      onChange={(e) => setDeployedUrl(e.target.value)}
                      placeholder="https://...vercel.app"
                      className="w-full px-3 py-2 bg-night-800 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-zinc-500 mb-1.5 block">Morning Brief Notes</label>
                    <textarea
                      value={morningBrief}
                      onChange={(e) => setMorningBrief(e.target.value)}
                      placeholder="What was built? Any notes for the user..."
                      rows={4}
                      className="w-full px-3 py-2 bg-night-800 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none resize-none"
                    />
                  </div>
                </div>
                
                <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowShipForm(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleShipIt}
                    disabled={isUpdating}
                    className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                  >
                    {isUpdating ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                        Shipping...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Ship It
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      ) : null}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-8 w-64" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="glass">
            <CardContent className="p-4 space-y-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', label: 'Pending' },
    in_progress: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'In Progress' },
    building: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', label: 'Building' },
    testing: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Testing' },
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Shipped' },
    failed: { bg: 'bg-rose-500/10', text: 'text-rose-400', label: 'Failed' },
  };
  
  const c = config[status] || config.pending;
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text} border border-${c.text.split('-')[1]}-500/20`}>
      {c.label}
    </span>
  );
}

function BuildStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string; dot: string }> = {
    queued: { color: 'text-amber-400', label: 'Queued', dot: 'bg-amber-400' },
    running: { color: 'text-cyan-400', label: 'Running', dot: 'bg-cyan-400 animate-pulse' },
    success: { color: 'text-emerald-400', label: 'Success', dot: 'bg-emerald-400' },
    failed: { color: 'text-rose-400', label: 'Failed', dot: 'bg-rose-400' },
    cancelled: { color: 'text-zinc-400', label: 'Cancelled', dot: 'bg-zinc-400' },
  };
  
  const c = config[status] || config.queued;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${c.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
