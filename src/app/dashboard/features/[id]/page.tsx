'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetchFeature, fetchBuilds, fetchBuildEvents, createBuildLogsEventSource } from '@/lib/api';
import { Button, Card, CardContent, StatusBadge, Skeleton, Badge } from '@/components/ui';
import { ChevronLeft, ExternalLink, Terminal, Clock, AlertCircle, Github, Moon, Stars } from '@/components/icons';
import { formatDateTime, formatDuration } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { BuildEvent } from '@/types';
import { motion } from 'framer-motion';
import { MoonPhaseLoader } from '@/components/ui/loading-spinner';

interface PageProps {
  params: { id: string };
}

export default function RequestDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary>
      <RequestDetailContent requestId={params.id} />
    </ErrorBoundary>
  );
}

function RequestDetailContent({ requestId }: { requestId: string }) {
  const { data: feature, error: featureError, isLoading: featureLoading } = useSWR(
    ['feature', requestId],
    () => fetchFeature(requestId),
    { refreshInterval: 5000 }
  );
  
  const { data: builds, error: buildsError } = useSWR(
    ['builds', requestId],
    () => fetchBuilds(requestId)
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
          Back to Requests
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{feature.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
              <Github className="h-4 w-4" />
              <span>{feature.repos?.full_name}</span>
              <span>•</span>
              <span>Created {formatDateTime(feature.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={feature.status} />
            <StatusBadge status={feature.priority} />
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="glass">
        <CardContent className="p-6">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">Description</h2>
          <p className="text-white whitespace-pre-wrap">{feature.description}</p>
        </CardContent>
      </Card>

      {/* Shift Status */}
      {build && (
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-purple/20 border border-neon-purple/30">
                  <Terminal className="h-5 w-5 text-neon-cyan" />
                </div>
                <div>
                  <h2 className="font-medium text-white">Shift Status</h2>
                  <p className="text-sm text-zinc-500">
                    {build.status === 'running' ? 'Working through the night...' : `Shift ${build.status}`}
                  </p>
                </div>
              </div>
              <StatusBadge status={build.status} />
            </div>

            {/* Shift Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-lg p-4">
                <p className="text-sm text-zinc-500">Duration</p>
                <p className="text-lg font-medium text-white mt-1">
                  {build.started_at 
                    ? formatDuration(
                        build.completed_at 
                          ? (new Date(build.completed_at).getTime() - new Date(build.started_at).getTime()) / 1000 / 60
                          : (Date.now() - new Date(build.started_at).getTime()) / 1000 / 60
                      )
                    : '-'
                  }
                </p>
              </div>
              <div className="glass rounded-lg p-4">
                <p className="text-sm text-zinc-500">PR Number</p>
                <p className="text-lg font-medium text-white mt-1">
                  {build.pr_number ? `#${build.pr_number}` : '-'}
                </p>
              </div>
              <div className="glass rounded-lg p-4">
                <p className="text-sm text-zinc-500">Branch</p>
                <p className="text-lg font-medium text-white mt-1 truncate" title={feature.branch_name || ''}>
                  {feature.branch_name ? feature.branch_name.split('/').pop() : '-'}
                </p>
              </div>
            </div>

            {/* Shift Logs */}
            <ShiftLogs buildId={build.id} status={build.status} />
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {feature.pr_url && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4"
        >
          <a
            href={feature.pr_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="gap-2 neon-glow">
              <Stars className="h-4 w-4" />
              View Pull Request
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </motion.div>
      )}
    </div>
  );
}

function ShiftLogs({ buildId, status }: { buildId: string; status: string }) {
  const [events, setEvents] = useState<BuildEvent[]>([]);
  const [isLive, setIsLive] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Fetch historical events
  const { data: historicalEvents } = useSWR(
    ['build-events', buildId],
    () => fetchBuildEvents(buildId)
  );

  useEffect(() => {
    if (historicalEvents) {
      setEvents(historicalEvents);
    }
  }, [historicalEvents]);

  // Connect to SSE for live logs
  useEffect(() => {
    if (!buildId || !['queued', 'running'].includes(status)) return;

    setIsLive(true);
    const eventSource = createBuildLogsEventSource(buildId);

    eventSource.addEventListener('log', (e: MessageEvent) => {
      const event = JSON.parse(e.data);
      setEvents(prev => [...prev, event]);
    });

    eventSource.addEventListener('status_change', (e: MessageEvent) => {
      const event = JSON.parse(e.data);
      setEvents(prev => [...prev, event]);
    });

    eventSource.addEventListener('error', (e: MessageEvent) => {
      const event = JSON.parse(e.data);
      setEvents(prev => [...prev, event]);
    });

    eventSource.addEventListener('completion', (e: MessageEvent) => {
      const event = JSON.parse(e.data);
      setEvents(prev => [...prev, event]);
      setIsLive(false);
      eventSource.close();
    });

    eventSource.addEventListener('complete', () => {
      setIsLive(false);
      eventSource.close();
    });

    eventSource.onerror = () => {
      setIsLive(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsLive(false);
    };
  }, [buildId, status]);

  // Auto-scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'log': return '›';
      case 'status_change': return '◆';
      case 'error': return '✕';
      case 'completion': return '✓';
      default: return '•';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-400">Shift Logs</h3>
        {isLive && (
          <div className="flex items-center gap-2 text-xs text-neon-cyan">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
            </span>
            Live
          </div>
        )}
      </div>
      
      <div className="rounded-xl bg-night-900 border border-white/10 p-4 h-96 overflow-y-auto font-mono text-sm">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600">
            <Moon className="h-8 w-8 mb-2 opacity-50" />
            <p>Waiting for the night shift to begin...</p>
          </div>
        ) : (
          <div className="space-y-1">
            {events.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className={`flex gap-3 ${
                  event.event_type === 'error'
                    ? 'text-rose-400'
                    : event.event_type === 'completion'
                    ? 'text-emerald-400'
                    : event.event_type === 'status_change'
                    ? 'text-neon-cyan'
                    : 'text-zinc-400'
                }`}
              >
                <span className="text-zinc-700 shrink-0">
                  {new Date(event.created_at).toLocaleTimeString()}
                </span>
                <span className="shrink-0 text-zinc-600">{getEventIcon(event.event_type)}</span>
                <span className="break-all">{event.message}</span>
              </div>
            ))}
            {isLive && (
              <div className="flex items-center gap-2 text-neon-cyan animate-pulse">
                <span className="text-zinc-700">{new Date().toLocaleTimeString()}</span>
                <span className="text-zinc-600">›</span>
                <span>Working...</span>
              </div>
            )}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
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
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}
