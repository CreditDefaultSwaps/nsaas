'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArchitectIcon,
  FrontendIcon,
  BackendIcon,
  SecurityIcon,
  DevOpsIcon,
  DataIcon,
  QAIcon,
  DocsIcon,
  PMIcon,
  CyprusIcon,
} from './icons/AgentIcons';

// Agents positioned on fixed rings — nodes DON'T move
// Only the orbit ring indicator (a moving dot) rotates
const rings = [
  {
    id: 'inner',
    radius: 110,
    duration: 20,
    agents: [
      { id: 'architect', Icon: ArchitectIcon, label: 'Architect', description: 'System design and stack selection — planning before the first line of code.', angle: 0 },
      { id: 'frontend', Icon: FrontendIcon, label: 'Frontend', description: 'Interface development — responsive, accessible, pixel-perfect execution.', angle: 120 },
      { id: 'backend', Icon: BackendIcon, label: 'Backend', description: 'APIs, databases, and authentication — the engine under the hood.', angle: 240 },
    ],
  },
  {
    id: 'middle',
    radius: 185,
    duration: 30,
    agents: [
      { id: 'security', Icon: SecurityIcon, label: 'Security', description: 'Security hardening and vulnerability detection — every build.', angle: 60 },
      { id: 'devops', Icon: DevOpsIcon, label: 'DevOps', description: 'Deploy, scale, and monitor — infrastructure that just works.', angle: 180 },
      { id: 'data', Icon: DataIcon, label: 'Data', description: 'Analytics, pipelines, and insights — turning data into decisions.', angle: 300 },
    ],
  },
  {
    id: 'outer',
    radius: 258,
    duration: 45,
    agents: [
      { id: 'qa', Icon: QAIcon, label: 'QA', description: 'Automated testing and quality gates — nothing ships broken.', angle: 90 },
      { id: 'pm', Icon: PMIcon, label: 'PM', description: 'Coordination and prioritization — the fleet stays on target.', angle: 270 },
    ],
  },
];

// Convert angle + radius to x/y from center (0,0)
function toXY(angleDeg: number, radius: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

interface NodeProps {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  x: number;
  y: number;
  centerX: number;
  centerY: number;
}

function AgentNode({ Icon, label, description, x, y, centerX, centerY }: NodeProps) {
  const [hovered, setHovered] = useState(false);

  // Smart tooltip positioning based on node location relative to center
  // x, y are offsets from center (positive x = right, positive y = down)
  const tooltipStyle: React.CSSProperties = (() => {
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const base: React.CSSProperties = { position: 'absolute', zIndex: 50 };

    // Primarily left/right? Open to the opposite side
    if (absX > absY * 1.2) {
      if (x > 0) {
        // Right side — open to the left
        return { ...base, right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 12 };
      } else {
        // Left side — open to the right
        return { ...base, left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 12 };
      }
    }
    // Primarily up/down
    if (y < 0) {
      // Top — open downward
      return { ...base, top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 10 };
    }
    // Bottom — open upward
    return { ...base, bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 10 };
  })();

  return (
    <div
      className="absolute"
      style={{
        left: centerX + x - 22,
        top: centerY + y - 22,
        width: 44,
        height: 44,
        zIndex: hovered ? 50 : 10,
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none"
            style={tooltipStyle}
          >
            <div className="glass rounded-xl px-3 py-2 border border-purple-500/30 text-center" style={{ minWidth: 150, maxWidth: 180 }}>
              <p className="text-xs font-semibold text-white mb-1">{label}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node circle */}
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.2 }}
        className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer relative"
        style={{
          background: 'rgba(15, 15, 25, 0.8)',
          border: hovered ? '1px solid rgba(139, 92, 246, 0.6)' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: hovered ? '0 0 20px rgba(34, 211, 238, 0.3)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Status dot */}
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400">
          <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <Icon className="h-4 w-4 text-cyan-400" />
      </motion.div>

      {/* Label — always below, never rotated */}
      <div
        className="absolute text-xs font-medium text-zinc-400 whitespace-nowrap pointer-events-none"
        style={{
          top: 48,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function AgentOrbit() {
  const size = 560;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-visible" style={{ width: '100%', maxWidth: size, height: size }}>

        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.12) 0%, transparent 65%)' }}
        />

        {/* Static orbit rings */}
        {rings.map((ring) => (
          <div
            key={ring.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: ring.radius * 2,
              height: ring.radius * 2,
              left: center - ring.radius,
              top: center - ring.radius,
              border: '1px solid rgba(100, 116, 139, 0.35)',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.08) inset',
            }}
          />
        ))}

        {/* Animated dot on each ring — the only thing that rotates */}
        {rings.map((ring) => (
          <div
            key={`dot-${ring.id}`}
            className="absolute pointer-events-none"
            style={{
              width: ring.radius * 2,
              height: ring.radius * 2,
              left: center - ring.radius,
              top: center - ring.radius,
              animation: `spin-${ring.id} ${ring.duration}s linear infinite`,
            }}
          >
            {/* Single dot at top of ring */}
            <div
              className="absolute rounded-full bg-cyan-400/60"
              style={{ width: 5, height: 5, left: ring.radius - 2.5, top: -2.5 }}
            />
          </div>
        ))}

        {/* CSS for ring dot rotation */}
        <style jsx>{`
          @keyframes spin-inner { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes spin-middle { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes spin-outer { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>

        {/* Cyprus center node */}
        <div
          className="absolute z-20"
          style={{ left: center - 28, top: center - 28 }}
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.25)',
                '0 0 35px rgba(34,211,238,0.8), 0 0 70px rgba(34,211,238,0.4)',
                '0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.25)',
              ]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)' }}
          >
            <CyprusIcon className="h-7 w-7 text-white" />
          </motion.div>
          <div className="text-center mt-2">
            <div className="text-sm font-semibold text-white">Cyprus</div>
            <div className="text-xs text-cyan-400 font-medium tracking-wide mt-0.5">Lead Agent</div>
          </div>
        </div>

        {/* Agent nodes — stationary, positioned by angle */}
        {rings.map((ring) =>
          ring.agents.map((agent) => {
            const { x, y } = toXY(agent.angle, ring.radius);
            return (
              <AgentNode
                key={agent.id}
                Icon={agent.Icon}
                label={agent.label}
                description={agent.description}
                x={x}
                y={y}
                centerX={center}
                centerY={center}
              />
            );
          })
        )}
      </div>

      {/* Cyprus description card — outside the orbit */}
      <div className="mt-6 mb-4 max-w-sm text-center px-4">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Cyprus / Lead Agent</span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Orchestrates the fleet. Briefs you every morning. Never misses a shift.
        </p>
      </div>

      {/* Pills below */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <span className="text-xs text-zinc-600">Also in your fleet:</span>
        {[{ Icon: DocsIcon, label: 'Docs' }, { Icon: PMIcon, label: 'PM' }].map(({ Icon, label }) => (
          <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-slate-400" style={{ background: 'rgba(15,15,25,0.6)', border: '1px solid rgba(100,116,139,0.3)' }}>
            <Icon className="h-3.5 w-3.5" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
