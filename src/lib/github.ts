import { App } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

const appId = process.env.GITHUB_APP_ID!;
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n');

export function createGitHubApp() {
  return new App({
    appId,
    privateKey,
  });
}

export async function getInstallationToken(installationId: number) {
  const app = createGitHubApp();
  const { data: installation } = await app.octokit.rest.apps.getInstallation({
    installation_id: installationId,
  });

  const auth = createAppAuth({
    appId,
    privateKey,
    installationId,
  });

  const { token } = await auth({ type: 'installation' });
  return token;
}

export async function getInstallationRepos(installationId: number) {
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

export function generateBranchName(featureTitle: string): string {
  const timestamp = Date.now();
  const sanitized = featureTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 30)
    .replace(/-+$/, '');
  return `nsaas/${sanitized}-${timestamp}`;
}
