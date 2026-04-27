/**
 * GitHub App authentication helpers
 * - JWT generation for app-level requests
 * - Installation token exchange
 */

import { createAppAuth } from '@octokit/auth-app';

const appId = process.env.GITHUB_APP_ID;
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n');
const webhookSecret = process.env.GITHUB_APP_WEBHOOK_SECRET;

/** Check if GitHub App credentials are configured */
export function isGitHubAppConfigured(): boolean {
  return Boolean(appId && privateKey && webhookSecret);
}

/** Get a JWT token for app-level GitHub API calls */
export function getAppJWT(): string {
  if (!appId || !privateKey) {
    throw new Error('GitHub App credentials not configured');
  }

  const auth = createAppAuth({ appId, privateKey });
  // Synchronously create JWT (valid for 10 minutes by default)
  const { token } = auth({ type: 'app' }) as unknown as { token: string };
  return token;
}

/** Get an installation access token for a specific installation */
export async function getInstallationToken(installationId: number): Promise<string> {
  if (!appId || !privateKey) {
    throw new Error('GitHub App credentials not configured');
  }

  const auth = createAppAuth({ appId, privateKey, installationId });
  const { token } = await auth({ type: 'installation' });
  return token;
}

/** Create an authenticated Octokit instance for an installation */
export async function getInstallationOctokit(installationId: number) {
  const { Octokit } = await import('@octokit/rest');
  const token = await getInstallationToken(installationId);
  return new Octokit({ auth: token });
}

/** Verify a GitHub webhook signature */
export async function verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
  if (!webhookSecret) {
    throw new Error('GITHUB_APP_WEBHOOK_SECRET not configured');
  }

  const crypto = await import('crypto');
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
