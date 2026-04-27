/**
 * Git operations via GitHub API
 * - Branch creation
 * - Commit creation (via Git Data API)
 * - Pull request creation
 */

import { getInstallationOctokit } from './auth';

export interface FileChange {
  path: string;
  content: string; // plain text content
}

/** Create a new branch from a base branch */
export async function createBranch(
  installationId: number,
  owner: string,
  repo: string,
  baseBranch: string,
  newBranchName: string
): Promise<{ ref: string; sha: string }> {
  const octokit = await getInstallationOctokit(installationId);

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

  return { ref: newRef.ref, sha: newRef.object.sha };
}

/** Create a commit with multiple file changes on a branch */
export async function createCommit(
  installationId: number,
  owner: string,
  repo: string,
  branch: string,
  files: FileChange[],
  message: string
): Promise<{ sha: string; html_url: string }> {
  const octokit = await getInstallationOctokit(installationId);

  // 1. Get the current branch SHA
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const parentSha = refData.object.sha;

  // 2. Get the current tree
  const { data: parentCommit } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: parentSha,
  });

  // 3. Create blobs for each file
  const treeEntries = await Promise.all(
    files.map(async (file) => {
      const { data: blob } = await octokit.git.createBlob({
        owner,
        repo,
        content: Buffer.from(file.content).toString('base64'),
        encoding: 'base64',
      });
      return {
        path: file.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha,
      };
    })
  );

  // 4. Create a new tree
  const { data: tree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: parentCommit.tree.sha,
    tree: treeEntries,
  });

  // 5. Create the commit
  const { data: commit } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: tree.sha,
    parents: [parentSha],
  });

  // 6. Update the branch ref to point to the new commit
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: commit.sha,
    force: false,
  });

  return {
    sha: commit.sha,
    html_url: `https://github.com/${owner}/${repo}/commit/${commit.sha}`,
  };
}

/** Create a pull request */
export async function createPullRequest(
  installationId: number,
  owner: string,
  repo: string,
  head: string,
  base: string,
  title: string,
  body: string
): Promise<{ number: number; html_url: string }> {
  const octokit = await getInstallationOctokit(installationId);

  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title,
    head,
    base,
    body,
  });

  return {
    number: pr.number,
    html_url: pr.html_url,
  };
}
