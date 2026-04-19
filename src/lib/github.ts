import { createAppAuth } from '@octokit/auth-app';

const appId = process.env.GITHUB_APP_ID;
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Mock implementation for build/static generation
const isBuildTime = !appId || !privateKey;

export function createGitHubApp() {
  if (isBuildTime) {
    return {
      octokit: {
        rest: {
          apps: {
            getInstallation: async () => ({ data: {} }),
            listReposAccessibleToInstallation: async () => ({ data: { repositories: [] } }),
          }
        }
      }
    } as any;
  }
  
  const { App } = require('@octokit/rest');
  return new App({
    appId: appId!,
    privateKey: privateKey!,
  });
}

export async function getInstallationToken(installationId: number): Promise<string> {
  if (isBuildTime) return 'mock-token';
  
  const app = createGitHubApp();
  await app.octokit.rest.apps.getInstallation({
    installation_id: installationId,
  });

  const auth = createAppAuth({
    appId: appId!,
    privateKey: privateKey!,
    installationId,
  });

  const { token } = await auth({ type: 'installation' });
  return token;
}

export async function getInstallationRepos(installationId: number) {
  if (isBuildTime) return [];
  
  const app = createGitHubApp();
  const { data } = await app.octokit.rest.apps.listReposAccessibleToInstallation({
    installation_id: installationId,
    per_page: 100,
  });

  return data.repositories;
}

export async function createBranch(
  installationId: number,
  owner: string,
  repo: string,
  baseBranch: string,
  newBranchName: string
) {
  if (isBuildTime) return { ref: `refs/heads/${newBranchName}` };
  
  const token = await getInstallationToken(installationId);
  const { Octokit } = await import('@octokit/rest');
  const octokit = new Octokit({ auth: token });

  // Get base branch SHA
  const { data: baseRef } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });

  // Create new branch
  const { data: newRef } = await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${newBranchName}`,
    sha: baseRef.object.sha,
  });

  return newRef;
}

export async function createPullRequest(
  installationId: number,
  owner: string,
  repo: string,
  title: string,
  head: string,
  base: string,
  body: string
) {
  if (isBuildTime) return { number: 1, html_url: 'https://github.com/mock/pr/1' };
  
  const token = await getInstallationToken(installationId);
  const { Octokit } = await import('@octokit/rest');
  const octokit = new Octokit({ auth: token });

  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title,
    head,
    base,
    body,
  });

  return pr;
}
