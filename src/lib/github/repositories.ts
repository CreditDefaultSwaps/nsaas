/**
 * GitHub repository listing and validation helpers
 */

import { getInstallationOctokit } from './auth';

export interface GitHubRepo {
  id: number;
  full_name: string;
  name: string;
  description: string | null;
  private: boolean;
  default_branch: string;
  html_url: string;
}

/** List repositories accessible to a GitHub App installation */
export async function listInstallationRepos(installationId: number): Promise<GitHubRepo[]> {
  const octokit = await getInstallationOctokit(installationId);

  const { data } = await octokit.apps.listReposAccessibleToInstallation({
    per_page: 100,
  });

  return (data.repositories as any[]).map((r) => ({
    id: r.id,
    full_name: r.full_name,
    name: r.name,
    description: r.description,
    private: r.private,
    default_branch: r.default_branch || 'main',
    html_url: r.html_url,
  }));
}

/** Validate that a repo is accessible to the installation */
export async function validateRepoAccess(
  installationId: number,
  repoFullName: string
): Promise<boolean> {
  try {
    const repos = await listInstallationRepos(installationId);
    return repos.some((r) => r.full_name === repoFullName);
  } catch {
    return false;
  }
}
