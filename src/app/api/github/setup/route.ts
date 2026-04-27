/**
 * GitHub App Setup Helper
 * GET  → Returns a GitHub App manifest URL for one-click app creation
 * POST → Stores app credentials after creation (called by manifest redirect)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';

const APP_NAME = 'Night Shift';
const APP_DESCRIPTION = 'AI-powered code shifts for your repositories';

export async function GET() {
  try {
    const user = await requireAuth();

    // Only admins can set up the GitHub App
    if ((user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const webhookUrl = `${appUrl}/api/webhooks/github`;
    const setupUrl = `${appUrl}/api/github/setup`;

    // GitHub App manifest
    const manifest = {
      name: APP_NAME,
      description: APP_DESCRIPTION,
      url: appUrl,
      setup_url: setupUrl,
      redirect_url: setupUrl,
      callback_urls: [setupUrl],
      hook_attributes: {
        url: webhookUrl,
        active: true,
      },
      default_events: [
        'installation',
        'installation_repositories',
        'pull_request',
        'push',
      ],
      default_permissions: {
        contents: 'write',
        metadata: 'read',
        pull_requests: 'write',
      },
      public: false,
    };

    const manifestJson = JSON.stringify(manifest);
    const encodedManifest = Buffer.from(manifestJson).toString('base64');

    const manifestUrl = `https://github.com/settings/apps/new?state=${encodeURIComponent(
      (user as any).org_id
    )}&manifest=${encodeURIComponent(encodedManifest)}`;

    return NextResponse.json({ manifest_url: manifestUrl, manifest });
  } catch (error: any) {
    console.error('GET /api/github/setup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate manifest' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if ((user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    }

    const body = await request.json();
    const { code, state } = body;

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state' },
        { status: 400 }
      );
    }

    // Exchange the temporary code for app credentials
    const response = await fetch(
      `https://api.github.com/app-manifests/${code}/conversions`,
      { method: 'POST', headers: { Accept: 'application/vnd.github+json' } }
    );

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `GitHub API error: ${err}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Return credentials so the frontend can store them
    // In production, these should be stored securely (e.g., env vars, secrets manager)
    return NextResponse.json({
      app_id: data.id,
      app_name: data.name,
      app_slug: data.slug,
      pem: data.pem, // private key
      webhook_secret: data.webhook_secret,
      client_id: data.client_id,
      client_secret: data.client_secret,
      html_url: data.html_url,
    });
  } catch (error: any) {
    console.error('POST /api/github/setup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete setup' },
      { status: 500 }
    );
  }
}
