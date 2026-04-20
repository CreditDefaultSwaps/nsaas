'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Card, CardContent, Badge, Skeleton } from '@/components/ui';
import { 
  ChevronRight, 
  Clock, 
  User, 
  Building2, 
  AlertCircle,
  Search,
  Filter
} from '@/components/icons';
import { formatDateTime } from '@/lib/utils';

interface Feature {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'building' | 'testing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
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
  }[];
}

const fetchAdminRequests = async (): Promise<Feature[]> => {
  const res = await fetch('/api/admin/requests');
  if (!res.ok) throw new Error('Failed to fetch requests');
  const data = await res.json();
  return data.features || [];
};

const statusConfig: Record<string, { color: string; label: string; bg: string }> = {
  pending: { color: 'text-zinc-400', label: 'Pending', bg: 'bg-zinc-500/10' },
  in_progress: { color: 'text-amber-400', label: 'In Progress', bg: 'bg-amber-500/10' },
  building: { color: 'text-cyan-400', label: 'Building', bg: 'bg-cyan-500/10' },
  testing: { color: 'text-purple-400', label: 'Testing', bg: 'bg-purple-500/10' },
  completed: { color: 'text-emerald-400', label: 'Shipped', bg: 'bg-emerald-500/10' },
  failed: { color: 'text-rose-400', label: 'Failed', bg: 'bg-rose-500/10' },
};

const buildStatusConfig: Record<string, { color: string; label: string; dot: string }> = {
  queued: { color: 'text-amber-400', label: 'Queued', dot: 'bg-amber-400' },
  running: { color: 'text-cyan-400', label: 'Running', dot: 'bg-cyan-400 animate-pulse' },
  success: { color: 'text-emerald-400', label: 'Success', dot: 'bg-emerald-400' },
  failed: { color: 'text-rose-400', label: 'Failed', dot: 'bg-rose-400' },
  cancelled: { color: 'text-zinc-400', label: 'Cancelled', dot: 'bg-zinc-400' },
};

export default function AdminRequestsPage() {
  const { data: features, error, isLoading } = useSWR('admin-requests', fetchAdminRequests, {
    refreshInterval: 10000,
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredFeatures = features?.filter(feature => {
    const matchesSearch = 
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.organizations?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || feature.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: features?.length || 0,
    pending: features?.filter(f => f.status === 'pending').length || 0,
    building: features?.filter(f => f.status === 'building' || f.status === 'in_progress').length || 0,
    shipped: features?.filter(f => f.status === 'completed').length || 0,
    failed: features?.filter(f => f.status === 'failed').length || 0,
  };

  if (error) {
    return (
      <div className="glass rounded-xl border border-rose-500/20 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-4" />
        <h3 className="text-lg font-medium text-rose-400">Failed to load requests</h3>
        <p className="text-rose-400/70 mt-2 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Feature Requests</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Manage and track all incoming build requests
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs">
          <StatBadge count={stats.pending} label="Pending" color="amber" />
          <StatBadge count={stats.building} label="Building" color="cyan" />
          <StatBadge count={stats.shipped} label="Shipped" color="emerald" />
          <StatBadge count={stats.failed} label="Failed" color="rose" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, email, or org..."
            className="w-full pl-10 pr-4 py-2 bg-night-800 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:border-neon-purple/50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-night-800 border border-white/10 rounded-lg text-sm text-white focus:border-neon-purple/50 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="building">Building</option>
            <option value="testing">Testing</option>
            <option value="completed">Shipped</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <Card className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-night-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Request</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">User / Org</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Build</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48 mt-1" />
                    </td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-3"></td>
                  </tr>
                ))
              ) : filteredFeatures?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-zinc-500 text-sm">No requests found</p>
                  </td>
                </tr>
              ) : (
                filteredFeatures?.map((feature, index) => (
                  <motion.tr
                    key={feature.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {feature.title}
                          </p>
                          <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-white flex items-center gap-1">
                          <User className="h-3 w-3 text-zinc-500" />
                          {feature.user?.email || 'Unknown'}
                        </span>
                        {feature.organizations?.name && (
                          <span className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            {feature.organizations.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={feature.status} />
                    </td>
                    <td className="px-4 py-3">
                      {feature.builds?.[0] ? (
                        <BuildStatusBadge status={feature.builds[0].status} />
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-zinc-500 font-mono">
                        {formatDateTime(feature.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/requests/${feature.id}`}
                        className="inline-flex items-center gap-1 text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                      >
                        View
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          Showing {filteredFeatures?.length || 0} of {stats.total} requests
        </span>
        <span className="font-mono">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color} border border-${config.color.split('-')[1]}-500/20`}>
      {config.label}
    </span>
  );
}

function BuildStatusBadge({ status }: { status: string }) {
  const config = buildStatusConfig[status] || buildStatusConfig.queued;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function StatBadge({ count, label, color }: { count: number; label: string; color: 'amber' | 'cyan' | 'emerald' | 'rose' }) {
  const colorClasses = {
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${colorClasses[color]}`}>
      <span className="font-semibold">{count}</span>
      <span className="text-zinc-500">{label}</span>
    </div>
  );
}
