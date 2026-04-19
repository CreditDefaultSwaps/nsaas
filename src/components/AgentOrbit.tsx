'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Layout, 
  Wrench, 
  Lock, 
  Cloud, 
  BarChart3, 
  Search, 
  FileText, 
  Target,
  Plus,
  Moon
} from 'lucide-react';

// Agent data with positions on orbit rings
// Positions are in degrees (0-360) around the circle
const orbitRings = [
  {
    id: 'inner',
    radius: 90, // px from center
    duration: 20, // seconds for full rotation
    agents: [
      { 
        id: 'architect', 
        icon: Brain, 
        label: '🧠 Architect', 
        description: 'System design and stack selection — planning before the first line of code.',
        angle: 0 
      },
      { 
        id: 'frontend', 
        icon: Layout, 
        label: '⚡ Frontend', 
        description: 'Interface development — responsive, accessible, pixel-perfect execution.',
        angle: 120 
      },
      { 
        id: 'backend', 
        icon: Wrench, 
        label: '🔧 Backend', 
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
        icon: Lock, 
        label: '🛡️ Security', 
        description: 'Audit, harden, and protect — security by design, not afterthought.',
        angle: 45 
      },
      { 
        id: 'devops', 
        icon: Cloud, 
        label: '🚀 DevOps', 
        description: 'Deploy, scale, and monitor — infrastructure that just works.',
        angle: 135 
      },
      { 
        id: 'data', 
        icon: BarChart3, 
        label: '📊 Data', 
        description: 'Analytics, pipelines, and insights — turning data into decisions.',
        angle: 225 
      },
      { 
        id: 'qa', 
        icon: Search, 
        label: '🔍 QA', 
        description: 'Test, verify, and validate — quality without the bottleneck.',
        angle: 315 
      },
    ],
  },
  {
    id: 'outer',
    radius: 210,
    duration: 45,
    agents: [
      { 
        id: 'docs', 
        icon: FileText, 
        label: '📝 Docs', 
        description: 'Documentation and guides — knowledge that scales with your team.',
        angle: 30 
      },
      { 
        id: 'pm', 
        icon: Target, 
        label: '🎯 PM Agent', 
        description: 'Scope, prioritize, and track — product management that ships.',
        angle: 150 
      },
      { 
        id: 'expand', 
        icon: Plus, 
        label: 'Coming Soon', 
        description: 'New specialist agents rolling out through 2026.',
        angle: 270,
        isPlaceholder: true 
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
  ringDuration: number;
  isPaused: boolean;
}

function AgentNode({ agent, ringDuration, isPaused }: AgentNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = agent.icon;

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

      {/* Agent Node */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.15, zIndex: 10 }}
        className={`
          relative w-11 h-11 rounded-full 
          flex flex-col items-center justify-center
          cursor-pointer
          transition-all duration-300
          ${agent.isPlaceholder 
            ? 'bg-night-800/50 border border-dashed border-purple-500/30' 
            : 'glass border border-white/10 hover:border-neon-cyan/40'
          }
          ${isHovered ? 'shadow-[0_0_30px_rgba(34,211,238,0.3)]' : ''}
        `}
      >
        {/* Status dot */}
        {!agent.isPlaceholder && (
          <div className="absolute -top-1 -right-1">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-neon-cyan" />
              <div 
                className="absolute inset-0 rounded-full bg-neon-cyan animate-ping" 
                style={{ animationDuration: '2s' }} 
              />
            </div>
          </div>
        )}

        {/* Icon */}
        <Icon className={`h-5 w-5 ${agent.isPlaceholder ? 'text-purple-400/60' : 'text-white'}`} />
      </motion.div>

      {/* Label */}
      <div 
        className={`
          absolute top-full left-1/2 -translate-x-1/2 mt-2
          text-xs font-medium whitespace-nowrap
          ${agent.isPlaceholder ? 'text-purple-400/60' : 'text-zinc-400'}
        `}
      >
        {agent.label}
      </div>
    </div>
  );
}

export function AgentOrbit() {
  const [isPaused, setIsPaused] = useState(false);

  return (
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

      {/* Center: Cyprus */}
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
          className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #9333ea 0%, #06b6d4 100%)',
          }}
        >
          <Moon className="h-8 w-8 text-white" />
        </motion.div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 text-sm font-semibold text-white">
          Cyprus
        </div>
      </div>

      {/* Orbit Rings */}
      {orbitRings.map((ring) => (
        <div
          key={ring.id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: ring.radius * 2, height: ring.radius * 2 }}
        >
          {/* Ring border */}
          <div 
            className="absolute inset-0 rounded-full border border-dashed border-purple-500/20"
            style={{
              animation: `orbitRotate ${ring.duration}s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
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
                {/* Counter-rotate wrapper to keep agent upright */}
                <div
                  style={{
                    animation: `counterRotate ${ring.duration}s linear infinite`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                  }}
                >
                  <AgentNode 
                    agent={agent} 
                    ringDuration={ring.duration}
                    isPaused={isPaused}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes orbitRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes counterRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
