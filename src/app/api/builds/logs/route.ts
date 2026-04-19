import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import { requireAuth } from '@/lib/clerk';
import { supabaseAdmin } from '@/lib/supabase';

// SSE endpoint for real-time build logs
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const buildId = searchParams.get('build_id');

    if (!buildId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: build_id' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify build belongs to user's org
    const { data: build, error: buildError } = await supabaseAdmin
      .from('builds')
      .select('id, org_id, status')
      .eq('id', buildId)
      .single();

    if (buildError || !build) {
      return new Response(
        JSON.stringify({ error: 'Build not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (build.org_id !== user.org_id) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If build is already complete, just return empty stream
    const isComplete = ['success', 'failed', 'cancelled'].includes(build.status);

    // Create SSE stream
    const encoder = new TextEncoder();
    let lastEventId: string | null = null;
    let isActive = true;
    let pollCount = 0;
    const maxPolls = isComplete ? 1 : 3600; // 1 hour of polling max

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial connection message
        controller.enqueue(
          encoder.encode(`event: connected\ndata: ${JSON.stringify({ build_id: buildId, status: build.status })}\n\n`)
        );

        // If complete, close immediately after sending current events
        if (isComplete) {
          try {
            const { data: events } = await supabaseAdmin
              .from('build_events')
              .select('*')
              .eq('build_id', buildId)
              .order('created_at', { ascending: true });

            if (events && events.length > 0) {
              for (const event of events) {
                controller.enqueue(
                  encoder.encode(`event: ${event.event_type}\ndata: ${JSON.stringify(event)}\n\n`)
                );
              }
            }
          } catch (err) {
            console.error('Error fetching historical events:', err);
          }
          
          controller.enqueue(
            encoder.encode(`event: complete\ndata: ${JSON.stringify({ status: build.status })}\n\n`)
          );
          controller.close();
          return;
        }

        // Poll for new events
        while (isActive && pollCount < maxPolls) {
          try {
            pollCount++;
            
            let query = supabaseAdmin
              .from('build_events')
              .select('*')
              .eq('build_id', buildId)
              .order('created_at', { ascending: true });

            if (lastEventId) {
              query = query.gt('id', lastEventId);
            }

            const { data: events, error } = await query;

            if (error) {
              controller.enqueue(
                encoder.encode(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`)
              );
            } else if (events && events.length > 0) {
              for (const event of events) {
                controller.enqueue(
                  encoder.encode(`event: ${event.event_type}\ndata: ${JSON.stringify(event)}\n\n`)
                );
                lastEventId = event.id;

                // Check if build is complete
                if (event.event_type === 'completion' || event.event_type === 'error') {
                  isActive = false;
                  controller.close();
                  return;
                }
              }
            }

            // Check if build status changed
            const { data: currentBuild } = await supabaseAdmin
              .from('builds')
              .select('status')
              .eq('id', buildId)
              .single();

            if (currentBuild && ['success', 'failed', 'cancelled'].includes(currentBuild.status)) {
              isActive = false;
              controller.enqueue(
                encoder.encode(`event: complete\ndata: ${JSON.stringify({ status: currentBuild.status })}\n\n`)
              );
              controller.close();
              return;
            }

            // Wait before polling again
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (err: any) {
            console.error('SSE polling error:', err);
            controller.enqueue(
              encoder.encode(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`)
            );
            isActive = false;
            controller.close();
            return;
          }
        }

        // Max polls reached
        controller.enqueue(
          encoder.encode(`event: complete\ndata: ${JSON.stringify({ reason: 'timeout' })}\n\n`)
        );
        controller.close();
      },
      cancel() {
        isActive = false;
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('GET /api/builds/logs error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to connect to build logs' }),
      { status: error.message === 'Unauthorized' ? 401 : 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
