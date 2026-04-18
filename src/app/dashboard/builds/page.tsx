import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

export default async function BuildsPage() {
  const user = await requireAuth();

  const { data: builds } = await supabaseAdmin
    .from('builds')
    .select(`
      *,
      features(title, repo_id, repos(name, full_name))
    `)
    .eq('org_id', user.org_id)
    .order('created_at', { ascending: false });

  const statusColors: Record<string, string> = {
    queued: 'bg-gray-100 text-gray-800',
    running: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Builds</h1>
        <p className="text-gray-600 mt-1">
          Track the status of your AI-powered builds
        </p>
      </div>

      {builds?.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No builds yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create a feature request to trigger your first build
          </p>
          <Link
            href="/dashboard/features/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Feature
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repository
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {builds?.map((build) => {
                const duration = build.started_at && build.completed_at
                  ? Math.round((new Date(build.completed_at).getTime() - new Date(build.started_at).getTime()) / 1000 / 60)
                  : build.started_at
                  ? Math.round((Date.now() - new Date(build.started_at).getTime()) / 1000 / 60)
                  : null;

                return (
                  <tr key={build.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/features/${build.feature_id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {(build.features as any)?.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(build.features as any)?.repos?.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[build.status]}`}>
                        {build.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {build.started_at
                        ? new Date(build.started_at).toLocaleString()
                        : 'Not started'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {duration !== null ? `${duration}m` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
