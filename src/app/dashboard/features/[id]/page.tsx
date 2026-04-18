import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface FeaturePageProps {
  params: { id: string };
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const user = await requireAuth();

  const { data: feature } = await supabaseAdmin
    .from('features')
    .select(`
      *,
      repos(name, full_name),
      users(full_name, email)
    `)
    .eq('id', params.id)
    .eq('org_id', user.org_id)
    .single();

  if (!feature) {
    notFound();
  }

  const { data: builds } = await supabaseAdmin
    .from('builds')
    .select(`
      *,
      build_events(*)
    `)
    .eq('feature_id', params.id)
    .order('created_at', { ascending: false });

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    building: 'bg-yellow-100 text-yellow-800',
    testing: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const buildStatusColors: Record<string, string> = {
    queued: 'bg-gray-100 text-gray-800',
    running: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to Features
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{feature.title}</h1>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[feature.status]}`}>
            {feature.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="text-gray-500">Repository:</span>
            <span className="ml-2 text-gray-900">{(feature.repos as any)?.full_name}</span>
          </div>
          <div>
            <span className="text-gray-500">Priority:</span>
            <span className="ml-2 text-gray-900 capitalize">{feature.priority}</span>
          </div>
          <div>
            <span className="text-gray-500">Created by:</span>
            <span className="ml-2 text-gray-900">{(feature.users as any)?.full_name || (feature.users as any)?.email}</span>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2 text-gray-900">
              {new Date(feature.created_at).toLocaleString()}
            </span>
          </div>
          {feature.branch_name && (
            <div>
              <span className="text-gray-500">Branch:</span>
              <span className="ml-2 font-mono text-gray-900">{feature.branch_name}</span>
            </div>
          )}
          {feature.pr_url && (
            <div>
              <span className="text-gray-500">PR:</span>
              <a
                href={feature.pr_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                View on GitHub →
              </a>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-900 whitespace-pre-wrap">{feature.description}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Build History</h2>

      {builds?.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
          No builds yet for this feature
        </div>
      ) : (
        <div className="space-y-4">
          {builds?.map((build) => (
            <div key={build.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">Build ID:</span>
                  <span className="ml-2 font-mono text-sm">{build.id.slice(0, 8)}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${buildStatusColors[build.status]}`}>
                  {build.status}
                </span>
              </div>

              {(build.build_events as any[])?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Events</h4>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono">
                      {(build.build_events as any[])
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        .map(e => `[${new Date(e.created_at).toISOString()}] ${e.event_type}: ${e.message}`)
                        .join('\n')}
                    </pre>
                  </div>
                </div>
              )}

              {build.agent_logs && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Agent Logs</h4>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                      {build.agent_logs}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
