import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

const webhookSecret = process.env.GITHUB_APP_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('x-hub-signature-256') || '';

  if (!verifySignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = request.headers.get('x-github-event');
  const data = JSON.parse(payload);

  try {
    switch (event) {
      case 'installation':
        await handleInstallationEvent(data);
        break;
      case 'installation_repositories':
        await handleInstallationRepositoriesEvent(data);
        break;
      case 'pull_request':
        await handlePullRequestEvent(data);
        break;
      default:
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error handling GitHub webhook:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleInstallationEvent(data: any) {
  const { action, installation } = data;

  if (action === 'created') {
    // Find org by installation ID and update
    const { error } = await supabaseAdmin
      .from('organizations')
      .update({
        github_app_installation_id: installation.id.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq('github_app_installation_id', installation.id.toString());

    if (error) {
      console.error('Error updating org with installation ID:', error);
    }
  }
}

async function handleInstallationRepositoriesEvent(data: any) {
  const { installation, repositories_added, repositories_removed } = data;

  // Find org
  const { data: org } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('github_app_installation_id', installation.id.toString())
    .single();

  if (!org) return;

  // Add new repos
  for (const repo of repositories_added || []) {
    const { error } = await supabaseAdmin
      .from('repos')
      .upsert({
        org_id: org.id,
        github_repo_id: repo.id,
        full_name: repo.full_name,
        name: repo.name,
        default_branch: repo.default_branch || 'main',
        is_active: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'org_id,github_repo_id',
      });

    if (error) {
      console.error('Error adding repo:', error);
    }
  }

  // Remove repos
  for (const repo of repositories_removed || []) {
    await supabaseAdmin
      .from('repos')
      .update({ is_active: false })
      .eq('github_repo_id', repo.id)
      .eq('org_id', org.id);
  }
}

async function handlePullRequestEvent(data: any) {
  const { action, pull_request, repository } = data;

  // Find feature by PR URL
  const { data: feature } = await supabaseAdmin
    .from('features')
    .select('id')
    .eq('pr_url', pull_request.html_url)
    .single();

  if (!feature) return;

  // Update feature status based on PR action
  let status: 'in_progress' | 'completed' | 'failed' = 'in_progress';
  if (action === 'closed' && pull_request.merged) {
    status = 'completed';
  } else if (action === 'closed') {
    status = 'failed';
  }

  await supabaseAdmin
    .from('features')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', feature.id);
}
