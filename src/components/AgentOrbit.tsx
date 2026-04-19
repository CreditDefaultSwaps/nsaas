'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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

// Agent data with positions on orbit rings
// Reduced to 8 agents: 3 inner, 3 middle, 2 outer + Cyprus center
// PM and Docs moved to pills below the orbit
const orbitRings = [
  {
    id: 'inner',
    radius: 90, // px from center
    duration: 20, // seconds for full rotation
    agents: [
      {
        id: 'architect',
        Icon: ArchitectIcon,
        label: 'Architect',
        description: 'System design and stack selection — planning before the first line of code.',
        angle: 0
      },
      {
        id: 'frontend',
        Icon: FrontendIcon,
        label: 'Frontend',
        description: 'Interface development — responsive, accessible, pixel-perfect execution.',
        angle: 120
      },
      {
        id: 'backend',
        Icon: BackendIcon,
        label: 'Backend',
        description: 'APIs, databases, and authentication — the engine under the hood.',
        angle: 240
      },
    ],
  },
  {
    id: 'middle',
    radius: 150,
    duration: 30,
    agents: [
      {
        id: 'security',
        Icon: SecurityIcon,
        label: 'Security',
        description: 'Audit, harden, and protect — security by design, not afterthought.',
        angle: 0
      },
      {
        id: 'devops',
        Icon: DevOpsIcon,
        label: 'DevOps',
        description: 'Deploy, scale, and monitor — infrastructure that just works.',
        angle: 120
      },
      {
        id: 'data',
        Icon: DataIcon,
        label: 'Data',
        description: 'Analytics, pipelines, and insights — turning data into decisions.',
        angle: 240
      },
    ],
  },
  {
    id: 'outer',
    radius: 210,
    duration: 45,
    agents: [
      {
        id: 'qa',
        Icon: QAIcon,
        label: 'QA',
        description: 'Test, verify, and validate — quality without the bottleneck.',
        angle: 0
      },
      {
        id: 'pm',
        Icon: PMIcon,
        label: 'PM',
        description: 'Scope, prioritize, and track — product management that ships.',
        angle: 180
      },
    ],
  },
];

// Convert polar coordinates to cartesian
function polarToCartesian(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180); // -90 to start from top
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

interface AgentNodeProps {
  agent: typeof orbitRings[0]['agents'][0];
  isPaused: boolean;
}

function AgentNode({ agent, isPaused }: AgentNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = agent.Icon;

  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%)`,
      }}
    >
      {/* Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50"
        >
          <div className="glass rounded-xl px-4 py-3 border border-neon-purple/30 whitespace-nowrap">
            <p className="text-sm text-white font-medium">{agent.label}</p>
            <p className="text-xs text-zinc-400 max-w-[200px] whitespace-normal mt-1">
              {agent.description}
            </p>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-night-800 border-r border-b border-neon-purple/30 rotate-45" />
          </div>
        </motion.div>
      )}

      {/* Agent Node - 44px × 44px */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.15, zIndex: 10 }}
        className={`
          relative w-11 h-11 rounded-full
          flex items-center justify-center
          cursor-pointer
          transition-all duration-300
          glass border border-white/10 hover:border-neon-cyan/40
          ${isHovered ? 'shadow-[0_0_30px_rgba(34,211,238,0.3)]' : ''}
        `}
      >
        {/* Status dot */}
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-neon-cyan" />
            <div
              className="absolute inset-0 rounded-full bg-neon-cyan animate-ping"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>

        {/* Icon */}
        {Icon && (
          <Icon className="h-5 w-5 text-cyan-400 group-hover:text-white transition-colors" />
        )}
      </motion.div>

      {/* Label - always horizontal, positioned below icon */}
      <div
        className="absolute text-xs font-medium whitespace-nowrap text-zinc-400"
        style={{
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
        }}
      >
        {agent.label}
      </div>
    </div>
  );
}

export function AgentOrbit() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative mx-auto"
        style={{ width: 500, height: 500 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background radial glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Center: Cyprus - 56px × 56px */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)',
                '0 0 50px rgba(139, 92, 246, 0.6), 0 0 100px rgba(139, 92, 246, 0.3)',
                '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #06b6d4 100%)',
            }}
          >
            <CyprusIcon className="h-7 w-7 text-cyan-400" />
          </motion.div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 text-sm font-semibold text-white whitespace-nowrap">
            Cyprus
          </div>
        </div>

        {/* Orbit Rings */}
        {orbitRings.map((ring, ringIndex) => (
          <div
            key={ring.id}
            className="absolute left-1/2 top-1/2"
            style={{ 
              width: ring.radius * 2, 
              height: ring.radius * 2,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Ring border - more visible with slate color and subtle glow */}
            <div
              className="absolute inset-0 rounded-full border border-slate-600/40"
              style={{
                animation: `orbitRotate${ringIndex + 1} ${ring.duration}s linear infinite`,
                animationPlayState: isPaused ? 'paused' : 'running',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.1) inset',
              }}
            />

            {/* Agents on this ring */}
            {ring.agents.map((agent) => {
              const pos = polarToCartesian(agent.angle, ring.radius);
              return (
                <div
                  key={agent.id}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: 0,
                    height: 0,
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                  }}
                >
                  {/* Counter-rotate wrapper to keep agent and label upright */}
                  <div
                    style={{
                      animation: `counterRotate${ringIndex + 1} ${ring.duration}s linear infinite`,
                      animationPlayState: isPaused ? 'paused' : 'running',
                    }}
                  >
                    <AgentNode
                      agent={agent}
                      isPaused={isPaused}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* CSS Keyframes - unique for each ring duration */}
        <style jsx>{`
          @keyframes orbitRotate1 {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes counterRotate1 {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          @keyframes orbitRotate2 {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes counterRotate2 {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          @keyframes orbitRotate3 {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes counterRotate3 {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
        `}</style>
      </div>

      {/* PM and Docs as compact pills below the orbit */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <span className="text-xs text-zinc-500">Also in your fleet:</span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700 text-xs text-slate-400">
          <DocsIcon className="h-3.5 w-3.5" />
          Docs
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700 text-xs text-slate-400">
          <PMIcon className="h-3.5 w-3.5" />
          PM
        </span>
      </div>
    </div>
  );
}
