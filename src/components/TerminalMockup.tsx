'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LogLine {
  timestamp: string;
  emoji: string;
  agent?: string;
  agentColor?: string;
  content: string;
  contentColor?: string;
}

const logLines: LogLine[] = [
  { timestamp: '[02:14:32]', emoji: '🛰', content: 'Fleet activated — 8 agents online' },
  { timestamp: '[02:14:33]', emoji: '🧠', agent: 'Architect', agentColor: 'text-cyan-400', content: 'scanning codebase... (Next.js 14, TypeScript, Supabase)' },
  { timestamp: '[02:14:35]', emoji: '🧠', agent: 'Architect', agentColor: 'text-cyan-400', content: 'spec generated: 12 components, 3 API routes' },
  { timestamp: '[02:14:36]', emoji: '⚡', agent: 'Frontend', agentColor: 'text-cyan-400', content: 'agent initialized — building /dashboard/analytics' },
  { timestamp: '[02:14:36]', emoji: '🔧', agent: 'Backend', agentColor: 'text-cyan-400', content: 'agent initialized — building /api/analytics' },
  { timestamp: '[02:14:37]', emoji: '🛡', agent: 'Security', agentColor: 'text-cyan-400', content: 'agent running dependency audit...' },
  { timestamp: '[02:14:41]', emoji: '⚡', agent: 'Frontend', agentColor: 'text-cyan-400', content: 'DashboardCard component complete (+127 lines)' },
  { timestamp: '[02:14:43]', emoji: '🔧', agent: 'Backend', agentColor: 'text-cyan-400', content: 'GET /api/analytics route complete (+89 lines)' },
  { timestamp: '[02:14:44]', emoji: '🛡', agent: 'Security', agentColor: 'text-cyan-400', content: '0 vulnerabilities found ✓', contentColor: 'text-emerald-400' },
  { timestamp: '[02:14:45]', emoji: '🚀', agent: 'DevOps', agentColor: 'text-cyan-400', content: 'agent deploying to Vercel...' },
  { timestamp: '[02:14:52]', emoji: '✅', content: 'Build passed — deployed to https://yourapp.vercel.app', contentColor: 'text-emerald-400' },
  { timestamp: '[02:14:52]', emoji: '📬', content: 'PR #47 created: "Add analytics dashboard"', contentColor: 'text-purple-400' },
  { timestamp: '[02:14:52]', emoji: '🌙', agent: 'Cyprus', agentColor: 'text-cyan-400', content: 'Handoff complete. Your feature is live.', contentColor: 'text-cyan-400 font-medium' },
];

export function TerminalMockup() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= logLines.length) {
          // All lines shown, pause then restart
          setIsPaused(true);
          setTimeout(() => {
            setVisibleLines(0);
            setIsPaused(false);
          }, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPaused]);

  const renderLine = (line: LogLine, index: number) => {
    const isLastVisible = index === visibleLines - 1;
    
    return (
      <div key={index} className="flex items-start gap-2">
        <span className="text-slate-600 shrink-0">{line.timestamp}</span>
        <span className="shrink-0">{line.emoji}</span>
        {line.agent && (
          <span className={`${line.agentColor} shrink-0`}>{line.agent}</span>
        )}
        <span className={`${line.contentColor || 'text-slate-300'}`}>
          {line.content}
          {isLastVisible && (
            <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border border-slate-700">
      {/* Title bar */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
        {/* macOS window dots */}
        <div className="flex items-center gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500/10" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/10" />
          <div className="w-3 h-3 rounded-full bg-green-500/10" />
        </div>
        
        {/* Title */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-sm text-slate-400">NightShift Fleet — Active</span>
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        
        {/* Spacer to balance the dots */}
        <div className="w-16" />
      </div>

      {/* Terminal body */}
      <div className="bg-[#0a0a0f] p-6 font-mono text-sm leading-relaxed min-h-[400px]">
        {logLines.slice(0, visibleLines).map((line, index) => renderLine(line, index))}
      </div>
    </div>
  );
}
