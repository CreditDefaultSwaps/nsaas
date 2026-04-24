'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogLine {
  id: string;
  text: string;
  timestamp: string;
}

type ConnectionStatus = 'connecting' | 'live' | 'complete' | 'failed' | 'error';

interface BuildLogTerminalProps {
  buildId: string;
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_LINES = [
  '[02:14:33] 🤖 Agent Cyprus initialized',
  '[02:14:34] 📋 Analyzing feature request: "Add dark mode toggle"',
  '[02:14:35] 🔍 Scanning repository structure...',
  '[02:14:38] 📁 Found 47 TypeScript files across 12 directories',
  '[02:14:40] 🧠 Planning implementation: 3 files to modify, 1 new file',
  '[02:14:42] ✍️  Writing src/components/DarkModeToggle.tsx',
  '[02:14:55] ✍️  Updating src/app/layout.tsx — adding theme provider',
  '[02:15:02] ✍️  Updating src/styles/globals.css — dark mode variables',
  '[02:15:08] 🔨 Running TypeScript compiler...',
  '[02:15:12] ✅ TypeScript: 0 errors',
  '[02:15:13] 🔨 Running ESLint...',
  '[02:15:15] ✅ ESLint: clean',
  '[02:15:16] 🔨 Running build...',
  '[02:15:31] ✅ Build: passed (3.2s)',
  '[02:15:32] 📤 Creating branch: feature/dark-mode-toggle',
  '[02:15:33] 📤 Committing 4 files (312 additions, 18 deletions)',
  '[02:15:34] 📤 Opening pull request #47...',
  '[02:15:35] ✅ PR #47 opened: "feat: Add dark mode toggle with system preference detection"',
  '[02:15:36] 🎉 Shift complete! Your code is ready for review.',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

let lineCounter = 0;

function makeLineId(): string {
  return `line-${Date.now()}-${++lineCounter}`;
}

function formatTimestamp(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `[${h}:${m}:${s}]`;
}

function extractText(data: unknown): string {
  if (typeof data === 'string') return data;
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === 'string' && obj.message) return obj.message;
    if (typeof obj.content === 'string' && obj.content) return obj.content;
    if (typeof obj.text === 'string' && obj.text) return obj.text;
    if (typeof obj.log === 'string' && obj.log) return obj.log;
    if (typeof obj.payload === 'string' && obj.payload) return obj.payload;
    // Skip bare metadata objects (connected/complete events)
    const keys = Object.keys(obj);
    const metaOnly = keys.every(k => ['build_id', 'status', 'reason', 'id', 'org_id'].includes(k));
    if (metaOnly) return '';
    return JSON.stringify(obj);
  }
  return String(data);
}

function lineColor(text: string): string {
  if (
    text.includes('✅') ||
    text.includes('🎉') ||
    text.includes('✓') ||
    text.includes('Shift complete') ||
    text.includes('passed') ||
    text.includes('clean') ||
    text.includes('0 errors')
  ) {
    return 'text-emerald-400';
  }
  if (
    text.includes('✗') ||
    text.includes('[error]') ||
    text.includes('Error') ||
    text.includes('failed') ||
    text.includes('FAILED')
  ) {
    return 'text-rose-400';
  }
  if (text.includes('⚠️') || text.includes('warning')) {
    return 'text-amber-400';
  }
  return 'text-green-300';
}

// ─── Manual SSE parser using Fetch ───────────────────────────────────────────

type SSEEvent = { type: string; data: string };

async function* parseSseStream(
  response: Response,
): AsyncGenerator<SSEEvent> {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE messages are separated by double newlines
      const blocks = buffer.split('\n\n');
      buffer = blocks.pop() ?? '';

      for (const block of blocks) {
        if (!block.trim()) continue;
        let eventType = 'message';
        let dataLine = '';

        for (const line of block.split('\n')) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            dataLine = line.slice(6);
          }
        }

        if (dataLine) yield { type: eventType, data: dataLine };
      }
    }
  } finally {
    reader.cancel();
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BuildLogTerminal({ buildId }: BuildLogTerminalProps) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [finalBuildStatus, setFinalBuildStatus] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const addLine = useCallback((text: string, timestamp?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLines(prev => [
      ...prev,
      { id: makeLineId(), text: trimmed, timestamp: timestamp ?? formatTimestamp() },
    ]);
  }, []);

  // Auto-scroll to bottom whenever lines change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // ── Demo mode ──────────────────────────────────────────────────────────────

  const runDemo = useCallback(() => {
    setStatus('live');
    let i = 0;

    const scheduleNext = () => {
      if (i >= DEMO_LINES.length) {
        setStatus('complete');
        setFinalBuildStatus('success');
        return;
      }
      const delay = 300 + Math.random() * 500;
      setTimeout(() => {
        addLine(DEMO_LINES[i]);
        i++;
        scheduleNext();
      }, delay);
    };

    setTimeout(scheduleNext, 600);
  }, [addLine]);

  // ── REST polling fallback ─────────────────────────────────────────────────

  const startPolling = useCallback(() => {
    setStatus('live');
    const seenIds = new Set<string>();

    const poll = async () => {
      try {
        const res = await fetch(`/api/builds/events?build_id=${buildId}`);
        if (!res.ok) return;
        const body = await res.json() as { events?: Array<Record<string, unknown>> };
        const events = body.events ?? [];

        for (const event of events) {
          const id = String(event.id ?? '');
          if (id && seenIds.has(id)) continue;
          if (id) seenIds.add(id);

          const text = extractText(event);
          if (text) {
            const ts = typeof event.created_at === 'string'
              ? formatTimestamp(event.created_at)
              : undefined;
            addLine(text, ts);
          }

          const evType = event.event_type as string | undefined;
          if (evType === 'completion' || evType === 'error') {
            const fs = (event.status as string) ?? (evType === 'completion' ? 'success' : 'failed');
            setFinalBuildStatus(fs);
            setStatus(['failed', 'cancelled'].includes(fs) ? 'failed' : 'complete');
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          }
        }
      } catch {
        // Ignore transient poll errors
      }
    };

    poll();
    pollIntervalRef.current = setInterval(poll, 3000);
  }, [buildId, addLine]);

  // ── SSE connection ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (buildId === 'demo') {
      runDemo();
      return;
    }

    const abort = new AbortController();
    abortRef.current = abort;
    let sseEstablished = false;

    const connectSse = async () => {
      try {
        const response = await fetch(`/api/builds/logs?build_id=${buildId}`, {
          signal: abort.signal,
        });

        if (!response.ok) {
          startPolling();
          return;
        }

        for await (const { type, data } of parseSseStream(response)) {
          if (abort.signal.aborted) break;

          let parsed: unknown;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }

          if (type === 'connected') {
            sseEstablished = true;
            setStatus('live');
            continue;
          }

          if (type === 'complete') {
            const obj = parsed as Record<string, unknown> | null;
            const fs = (obj?.status as string) ?? 'success';
            setFinalBuildStatus(fs);
            setStatus(['failed', 'cancelled'].includes(fs) ? 'failed' : 'complete');
            break;
          }

          if (type === 'error') {
            const obj = parsed as Record<string, unknown> | null;
            if (obj?.error) addLine(`[error] ${obj.error}`);
            continue;
          }

          // Any other event type — extract displayable text
          const text = extractText(parsed);
          if (text) {
            const ts =
              parsed !== null &&
              typeof parsed === 'object' &&
              typeof (parsed as Record<string, unknown>).created_at === 'string'
                ? formatTimestamp((parsed as Record<string, unknown>).created_at as string)
                : undefined;
            addLine(text, ts);
          }
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        if (!sseEstablished) {
          startPolling();
        } else {
          setStatus('error');
        }
      }
    };

    // Fallback: if SSE doesn't establish within 6s, switch to polling
    const connectionTimeout = setTimeout(() => {
      if (!sseEstablished) {
        abort.abort();
        startPolling();
      }
    }, 6000);

    connectSse().then(() => clearTimeout(connectionTimeout));

    return () => {
      clearTimeout(connectionTimeout);
      abort.abort();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [buildId, addLine, runDemo, startPolling]);

  const isLive = status === 'connecting' || status === 'live';

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0f] font-mono">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-[#0f0f19] border-b border-white/10">
        {/* macOS window dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500/20" />
          <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/20" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/20" />
        </div>

        {/* Status badge */}
        <div className="text-xs">
          {status === 'connecting' && (
            <span className="text-zinc-500 animate-pulse">● Connecting to build agent...</span>
          )}
          {status === 'live' && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              LIVE
            </span>
          )}
          {status === 'complete' && (
            <span className="text-emerald-400">✓ COMPLETE</span>
          )}
          {status === 'failed' && (
            <span className="text-rose-400">
              ✗ {finalBuildStatus === 'cancelled' ? 'CANCELLED' : 'FAILED'}
            </span>
          )}
          {status === 'error' && (
            <span className="text-rose-400">✗ CONNECTION ERROR</span>
          )}
        </div>

        {/* Build ID */}
        <span className="text-xs text-zinc-700 shrink-0 select-none">
          {buildId === 'demo' ? 'demo-shift' : buildId.slice(0, 8)}
        </span>
      </div>

      {/* Log body */}
      <div className="h-72 overflow-y-auto p-4 text-xs leading-relaxed space-y-0.5">
        {/* Skeleton while connecting */}
        {status === 'connecting' && lines.length === 0 && (
          <p className="text-zinc-600 animate-pulse">Connecting to build agent...</p>
        )}

        <AnimatePresence initial={false}>
          {lines.map((line, idx) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-start gap-2"
            >
              <span className="text-zinc-600 shrink-0 select-none">{line.timestamp}</span>
              <span className={`break-all ${lineColor(line.text)}`}>
                {line.text}
                {/* Blinking cursor on the last line while stream is live */}
                {isLive && idx === lines.length - 1 && (
                  <span className="inline-block w-[7px] h-[13px] ml-0.5 bg-green-400 align-middle animate-pulse" />
                )}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Standalone cursor when live but no lines yet */}
        {isLive && lines.length === 0 && status === 'live' && (
          <span className="inline-block w-[7px] h-[13px] bg-green-400 animate-pulse" />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
