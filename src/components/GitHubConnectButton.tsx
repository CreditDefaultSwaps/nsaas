'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface GitHubConnectButtonProps {
  featureId: string;
  onConnect?: (repoFullName: string, installationId: number) => void;
}

export function GitHubConnectButton({ featureId, onConnect }: GitHubConnectButtonProps) {
  const [repos, setRepos] = useState<Array<{ id: number; full_name: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/github/repos');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch repos');
      }
      setRepos(data.repos || []);
      setShowPicker(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const connectRepo = useCallback(
    async (repoFullName: string, installationId: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/github/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            featureId,
            repoFullName,
            installationId,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to connect repo');
        }
        setShowPicker(false);
        onConnect?.(repoFullName, installationId);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [featureId, onConnect]
  );

  if (showPicker) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-zinc-400">Select a repository:</p>
        <div className="max-h-60 overflow-y-auto space-y-1 rounded-lg border border-white/10 bg-zinc-900 p-2">
          {repos.length === 0 && (
            <p className="text-sm text-zinc-500 px-2 py-1">No repositories found.</p>
          )}
          {repos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => connectRepo(repo.full_name, repo.id)}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              {repo.full_name}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowPicker(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button onClick={fetchRepos} disabled={loading} variant="outline" size="sm">
        {loading ? 'Loading...' : 'Connect GitHub Repo'}
      </Button>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
