import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';
import { generateBranchName } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

// GET /api/features?id=xxx or /api/features
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const featureId = searchParams.get('id');

    // If ID is provided, fetch single feature
    if (featureId) {
      const { data: features, error } = await supabaseAdmin
        .from('features')
        .select(`
          *,
          repos(name, full_name)
        `)
        .eq('id', featureId)
        .eq('org_id', (user as any).org_id);

      if (error) {
        console.error('Error fetching feature:', error);
        throw new Error('Failed to fetch feature');
      }

      return NextResponse.json({ features });
    }

    // Otherwise fetch all features
    const { data: features, error } = await supabaseAdmin
      .from('features')
      .select(`
        *,
        repos(name, full_name)
      `)
      .eq('org_id', (user as any).org_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching features:', error);
      throw new Error('Failed to fetch features');
    }

    return NextResponse.json({ features: features || [] });
  } catch (error: any) {
    console.error('GET /api/features error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch features' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/features
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { repo_id, title, description, priority = 'p1', techPreferences, referenceUrls } = body;

    // Validation — repo_id is optional for now
    if (!title || typeof title !== 'string' || title.trim().length < 1) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      return NextResponse.json(
        { error: 'Description must be at least 5 characters' },
        { status: 400 }
      );
    }

    // Normalize priority to schema format (low/medium/high/urgent)
    const priorityMap: Record<string, 'low' | 'medium' | 'high' | 'urgent'> = {
      'urgent': 'urgent', 'high': 'high',
      'medium': 'medium', 'tonight': 'high', 'p1': 'medium',
      'low': 'low', 'this week': 'low', 'p2': 'low',
    };
    const normalizedPriority = priorityMap[priority?.toLowerCase()] || 'medium';

    // Verify repo belongs to user's org (optional — skip if no repo_id)
    if (repo_id) {
      const { data: repo, error: repoError } = await supabaseAdmin
        .from('repos')
        .select('*')
        .eq('id', repo_id)
        .eq('org_id', (user as any).org_id)
        .single();

      if (repoError || !repo) {
        return NextResponse.json(
          { error: 'Repository not found or access denied' },
          { status: 404 }
        );
      }
    }

    // Generate branch name
    const branchName = generateBranchName(title);

    // Create feature
    const featureId = uuidv4();
    const { data: feature, error: featureError } = await supabaseAdmin
      .from('features')
      .insert({
        id: featureId,
        org_id: (user as any).org_id,
        repo_id: repo_id || null,
        title: title.trim(),
        description: description.trim(),
        priority: normalizedPriority,
        status: 'pending',
        created_by: (user as any).id,
      } as any)
      .select()
      .single();

    if (featureError) {
      console.error('Error creating feature:', featureError);
      throw new Error('Failed to create feature');
    }

    // Create initial build record (queued)
    const buildId = uuidv4();
    const { error: buildError } = await supabaseAdmin
      .from('builds')
      .insert({
        id: buildId,
        feature_id: feature.id,
        org_id: (user as any).org_id,
        status: 'queued',
      } as any);

    if (buildError) {
      console.error('Error creating build:', buildError);
      // Don't fail the request, but log the error
    }

    // Send Telegram alert to Alex
    try {
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = '2105672582'; // Alex's chat ID
      
      if (telegramBotToken) {
        // Get org name
        const { data: org } = await supabaseAdmin
          .from('organizations')
          .select('name')
          .eq('id', (user as any).org_id)
          .single();

        const alertMessage = [
          '🛰️ *New NightShift Request*',
          '',
          `👤 *From:* ${(user as any).full_name || 'Unknown'} (${(user as any).email || 'Unknown'})`,
          `🏢 *Org:* ${org?.name || 'Unknown'}`,
          '',
          `📋 *Product:* ${title}`,
          '',
          '📝 *Description:*',
          description.trim(),
          '',
          `⚡ *Priority:* ${normalizedPriority}`,
          techPreferences ? `🔧 *Tech:* ${techPreferences}` : '',
          '',
          '🔗 *Review:* https://nsaas-nine.vercel.app/admin/requests',
          '',
          '---',
          '*Brief the fleet when ready.*',
        ].filter(Boolean).join('\n');

        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: alertMessage,
            parse_mode: 'Markdown',
          }),
        });
      }
    } catch (alertErr) {
      // Don't fail the request if alert fails
      console.error('Telegram alert failed:', alertErr);
    }

    return NextResponse.json({ feature }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/features error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create feature' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
