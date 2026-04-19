'use client';

import useSWR from 'swr';
import { fetchRepos } from '@/lib/api';
import { Button, Card, CardContent, EmptyState, Skeleton, Badge } from '@/components/ui';
import { Github, ExternalLink, Plus, AlertCircle, Moon } from '@/components/icons';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { motion } from 'framer-motion';

export default function ReposPage() {
  return (
    <ErrorBoundary>
      <ReposContent />
    </ErrorBoundary>
  );
}

function ReposContent() {
  const { data: repos, error, isLoading, mutate } = useSWR('repos', fetchRepos);

  if (error) {
    return (
      <div className="glass rounded-xl border border-rose-500/20 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-4" />
        <h3 className="text-lg font-medium text-rose-400">Night Interrupted</h3>
        <p className="text-rose-400/70 mt-2">{error.message}</p>
        <Button variant="outline" className="mt-4 border-rose-500/30" onClick={() => mutate()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Repositories</h1>
          <p className="text-zinc-400 mt-1">
            Connect your codebases for overnight shipping
          </p>
        </div>
        <Button className="gap-2 neon-glow" onClick={handleConnectRepo}>
          <Plus className="h-4 w-4" />
          Connect Repository
        </Button>
      </div>

      {/* Repos List */}
      {isLoading ? (
        <ReposSkeleton />
      ) : repos && repos.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo: any, index: number) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass glass-hover group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                        <Github className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{repo.name}</h3>
                        <p className="text-sm text-zinc-500">{repo.full_name}</p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Default branch</span>
                      <span className="text-zinc-300 font-mono text-xs">{repo.default_branch}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2 border-white/10 hover:border-neon-cyan/50 hover:text-neon-cyan"
                      onClick={() => window.open(`https://github.com/${repo.full_name}`, '_blank')}
                    >
                      View on GitHub
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Github className="h-8 w-8" />}
          title="No repositories connected"
          description="Connect your GitHub repositories to start shipping while you sleep."
          action={{
            label: 'Connect Repository',
            onClick: handleConnectRepo,
          }}
        />
      )}
    </div>
  );
}

function handleConnectRepo() {
  // TODO: Implement GitHub OAuth flow
  alert('GitHub OAuth integration coming soon! For now, repos are added via the database.');
}

function ReposSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="glass">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-px w-full my-4" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
