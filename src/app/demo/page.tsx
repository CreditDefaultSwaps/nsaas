'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  ChevronRight,
  Clock,
  CheckCircle2,
  Rocket,
  Users,
  DollarSign,
  Calendar,
  ArrowRight,
  Sparkles,
  Terminal,
  Shield,
  Database,
  Server,
  Code2,
  FileCode,
  GitPullRequest,
  Volume2,
  VolumeX
} from 'lucide-react';
import { LogoWordmark } from '@/components/logo';

const TOTAL_DURATION = 60;
const SCENES = [
  { id: 0, name: 'Hero', duration: 8, startAt: 0 },
  { id: 1, name: 'Problem', duration: 10, startAt: 8 },
  { id: 2, name: 'Fleet', duration: 15, startAt: 18 },
  { id: 3, name: 'Morning', duration: 12, startAt: 33 },
  { id: 4, name: 'CTA', duration: 15, startAt: 45 },
];

function createZHUAmbience(audioCtx: AudioContext): () => void {
  const nodes: AudioNode[] = [];
  
  // Sub-bass pulse (40-60 Hz) - ZHU's signature deep bass
  const subBass = audioCtx.createOscillator();
  const subBassGain = audioCtx.createGain();
  subBass.type = 'sine';
  subBass.frequency.setValueAtTime(45, audioCtx.currentTime);
  subBassGain.gain.setValueAtTime(0, audioCtx.currentTime);
  subBassGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 2);
  // Slow pulse every 2 bars
  const lfoSub = audioCtx.createOscillator();
  const lfoSubGain = audioCtx.createGain();
  lfoSub.frequency.value = 0.5; // 0.5 Hz = 1 pulse per 2 seconds
  lfoSubGain.gain.value = 0.08;
  lfoSub.connect(lfoSubGain);
  lfoSubGain.connect(subBassGain.gain);
  subBass.connect(subBassGain);
  subBassGain.connect(audioCtx.destination);
  
  // Atmospheric pad (mid-range, slightly detuned for width)
  const pad1 = audioCtx.createOscillator();
  const pad2 = audioCtx.createOscillator();
  const padGain = audioCtx.createGain();
  const padFilter = audioCtx.createBiquadFilter();
  pad1.type = 'sawtooth';
  pad2.type = 'sawtooth';
  pad1.frequency.value = 220; // A3
  pad2.frequency.value = 221.5; // slightly detuned for chorus effect
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 800;
  padFilter.Q.value = 2;
  padGain.gain.setValueAtTime(0, audioCtx.currentTime);
  padGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 3);
  pad1.connect(padFilter);
  pad2.connect(padFilter);
  padFilter.connect(padGain);
  padGain.connect(audioCtx.destination);
  
  // High atmospheric shimmer (ZHU-style synth top)
  const shimmer = audioCtx.createOscillator();
  const shimmerGain = audioCtx.createGain();
  const shimmerFilter = audioCtx.createBiquadFilter();
  shimmer.type = 'triangle';
  shimmer.frequency.value = 880; // A5
  shimmerFilter.type = 'highpass';
  shimmerFilter.frequency.value = 600;
  shimmerGain.gain.setValueAtTime(0, audioCtx.currentTime);
  shimmerGain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 4);
  // Very slow shimmer fade
  const lfoShimmer = audioCtx.createOscillator();
  const lfoShimmerGain = audioCtx.createGain();
  lfoShimmer.frequency.value = 0.2; // very slow
  lfoShimmerGain.gain.value = 0.015;
  lfoShimmer.connect(lfoShimmerGain);
  lfoShimmerGain.connect(shimmerGain.gain);
  shimmer.connect(shimmerFilter);
  shimmerFilter.connect(shimmerGain);
  shimmerGain.connect(audioCtx.destination);
  
  // Start all oscillators
  [subBass, lfoSub, pad1, pad2, shimmer, lfoShimmer].forEach(osc => osc.start());
  nodes.push(subBass, lfoSub, pad1, pad2, shimmer, lfoShimmer);
  
  // Return cleanup function
  return () => {
    nodes.forEach(node => {
      try { (node as OscillatorNode).stop(); } catch {}
    });
  };
}

function useTypewriter(text: string, speed: number = 50, isActive: boolean) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!isActive) {
      setDisplayText('');
      return;
    }

    setDisplayText('');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isActive]);

  return { displayText };
}

function StarsBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px]" />
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

function HeroScene({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <LogoWordmark size="xl" />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
      >
        Stop waiting on engineers.
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-xl md:text-2xl text-slate-400 max-w-3xl mb-10"
      >
        Meet NightShift, a fleet of AI agents that builds while you sleep.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl text-lg hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-pulse">
          Join the Waitlist →
        </button>
      </motion.div>
    </div>
  );
}

function ProblemScene({ isActive }: { isActive: boolean }) {
  const productName = "Stripe Revenue Dashboard";
  const description = "I want a dashboard that shows my daily revenue, recent transactions, and MRR trends. It should have charts and export to CSV.";
  
  const { displayText: nameText } = useTypewriter(productName, 40, isActive);
  const { displayText: descText } = useTypewriter(description, 30, isActive && nameText.length === productName.length);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-8 lg:gap-16 px-4 lg:px-16">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.6 }}
        className="flex-1 max-w-md"
      >
        <div className="glass rounded-2xl p-8 border border-red-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-red-400 font-semibold">Traditional Hiring</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>3-6 months to hire</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <DollarSign className="h-4 w-4" />
              <span>$120K+ per engineer</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Clock className="h-4 w-4" />
              <span>Weeks of onboarding</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-red-400">
              <span className="text-2xl font-bold">$50K+</span>
              <span className="text-sm">before first line of code</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="hidden lg:flex"
      >
        <ArrowRight className="h-12 w-12 text-cyan-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 max-w-md"
      >
        <div className="glass rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="text-cyan-400 font-semibold">NightShift</span>
          </div>
          
          <p className="text-slate-300 mb-6">Describe what you want built. In plain English.</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Product Name</label>
              <div className="bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-700 font-mono text-cyan-400 min-h-[44px]">
                {nameText}
                {isActive && nameText.length < productName.length && (
                  <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />
                )}
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Description</label>
              <div className="bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-700 font-mono text-sm text-slate-300 min-h-[80px]">
                {descText}
                {isActive && nameText.length === productName.length && descText.length < description.length && (
                  <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />
                )}
              </div>
            </div>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={isActive && descText.length > 20 ? { opacity: 1 } : { opacity: 0 }}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              Brief the Fleet
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FleetScene({ isActive }: { isActive: boolean }) {
  const [activeAgents, setActiveAgents] = useState<number>(-1);
  const [visibleLogs, setVisibleLogs] = useState(0);
  
  const agents = [
    { id: 'architect', name: 'Architect', icon: FileCode, color: 'text-purple-400', ring: 110 },
    { id: 'frontend', name: 'Frontend', icon: Code2, color: 'text-cyan-400', ring: 110 },
    { id: 'backend', name: 'Backend', icon: Database, color: 'text-cyan-400', ring: 110 },
    { id: 'security', name: 'Security', icon: Shield, color: 'text-emerald-400', ring: 185 },
    { id: 'devops', name: 'DevOps', icon: Server, color: 'text-emerald-400', ring: 185 },
  ];

  const logs = [
    { time: '10:48 PM', agent: 'Cyprus', message: 'activating fleet...' },
    { time: '10:51 PM', agent: 'Architect', message: 'spec generated' },
    { time: '10:52 PM', agent: 'Frontend + Backend', message: 'building in parallel' },
    { time: '11:03 PM', agent: 'DevOps', message: 'deployed' },
  ];

  useEffect(() => {
    if (!isActive) {
      setActiveAgents(-1);
      setVisibleLogs(0);
      return;
    }

    const agentInterval = setInterval(() => {
      setActiveAgents(prev => {
        if (prev >= agents.length - 1) return prev;
        return prev + 1;
      });
    }, 800);

    const logInterval = setInterval(() => {
      setVisibleLogs(prev => {
        if (prev >= logs.length) return prev;
        return prev + 1;
      });
    }, 1200);

    return () => {
      clearInterval(agentInterval);
      clearInterval(logInterval);
    };
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Terminal className="h-6 w-6 text-cyan-400" />
          <span className="text-cyan-400 font-mono">Cyprus has been briefed. Fleet activating...</span>
        </div>
      </motion.div>

      <div className="relative w-[400px] h-[400px] mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={isActive ? { scale: 1 } : { scale: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.5)]"
        >
          <span className="text-white font-bold text-lg">C</span>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-10 text-center">
          <span className="text-cyan-400 text-sm font-medium">Cyprus</span>
        </div>

        {[110, 185].map((radius) => (
          <div
            key={radius}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700"
            style={{ width: radius * 2, height: radius * 2 }}
          />
        ))}

        {agents.map((agent, index) => {
          const angle = (index * 72) - 90;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * agent.ring;
          const y = Math.sin(rad) * agent.ring;
          const agentActive = index <= activeAgents;
          const Icon = agent.icon;

          return (
            <div
              key={agent.id}
              className="absolute"
              style={{ 
                left: `calc(50% + ${x}px - 24px)`,
                top: `calc(50% + ${y}px - 24px)`,
                width: 48,
                height: 48,
              }}
            >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: agentActive ? 1 : 0.3, 
                scale: agentActive ? 1 : 0.8,
              }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  agentActive 
                    ? `bg-slate-900 ${agent.color.replace('text-', 'border-')} shadow-[0_0_20px_rgba(34,211,238,0.3)]` 
                    : 'bg-slate-900/50 border-slate-700'
                }`}
              >
                <Icon className={`h-5 w-5 ${agentActive ? agent.color : 'text-slate-600'}`} />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={`text-xs ${agentActive ? 'text-white' : 'text-slate-600'}`}>{agent.name}</span>
              </div>
              
              {agentActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-1/2 left-1/2 w-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent origin-top"
                  style={{
                    height: agent.ring,
                    transform: `rotate(${angle + 90}deg) translateY(-${agent.ring}px)`,
                  }}
                />
              )}
            </motion.div>
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        className="glass rounded-xl p-4 font-mono text-sm max-w-xl w-full"
      >
        {logs.slice(0, visibleLogs).map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <span className="text-slate-600">[{log.time}]</span>
            <span className="text-cyan-400">{log.agent}:</span>
            <span className="text-slate-300">{log.message}</span>
          </motion.div>
        ))}
        {visibleLogs < logs.length && isActive && (
          <div className="flex items-center gap-2">
            <span className="text-slate-600">[{logs[visibleLogs]?.time}]</span>
            <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse" />
          </div>
        )}
      </motion.div>
    </div>
  );
}

function MorningScene({ isActive }: { isActive: boolean }) {
  const [timeValue, setTimeValue] = useState(2248);
  const [showNotification, setShowNotification] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setTimeValue(2248);
      setShowNotification(false);
      setShowDashboard(false);
      return;
    }

    const duration = 3000;
    const startTime = 2248;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      
      let current;
      if (progress < 0.7) {
        current = startTime + Math.floor((2359 - startTime) * (progress / 0.7));
      } else {
        const nightProgress = (progress - 0.7) / 0.3;
        current = Math.floor(603 * nightProgress);
      }
      
      setTimeValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeValue(603);
        setTimeout(() => setShowNotification(true), 500);
        setTimeout(() => setShowDashboard(true), 1500);
      }
    };

    requestAnimationFrame(animate);
  }, [isActive]);

  const formatTime = (t: number) => {
    const hours = Math.floor(t / 100);
    const mins = t % 100;
    const period = hours >= 12 && hours < 24 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        className="mb-12"
      >
        <div className="text-8xl md:text-9xl font-bold font-mono text-white tabular-nums tracking-tight">
          {formatTime(timeValue)}
        </div>
        <div className="text-center text-slate-500 mt-2">
          {timeValue < 600 ? 'Good morning' : 'Building overnight...'}
        </div>
      </motion.div>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <div className="glass rounded-2xl p-4 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] flex items-center gap-4 max-w-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <span className="text-xl">🛰️</span>
              </div>
              <div>
                <div className="font-semibold text-white">Cyprus</div>
                <div className="text-slate-300">Your product shipped.</div>
              </div>
              <div className="ml-auto">
                <span className="text-xs text-slate-500">6:03 AM</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            <div className="glass rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Deployment Complete</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 uppercase mb-1">Status</div>
                  <div className="text-emerald-400 font-semibold">Success</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 uppercase mb-1">Live URL</div>
                  <div className="text-cyan-400 font-mono text-sm truncate">dashboard-stripe.vercel.app</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 uppercase mb-1">PR Created</div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <GitPullRequest className="h-4 w-4" />
                    <span className="text-sm">#47</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CTAScene({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <LogoWordmark size="xl" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-6xl font-bold text-white mb-6"
      >
        Your first shift starts tonight.
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-12"
      >
        <button className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl text-xl hover:opacity-90 transition-all shadow-[0_0_40px_rgba(34,211,238,0.4)] animate-pulse">
          Join the Waitlist →
        </button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-slate-500 text-sm"
      >
        <p>One founder. One vision. A fleet that never sleeps.</p>
        <p className="mt-2">© 2026 NightShift</p>
      </motion.div>
    </div>
  );
}

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const cleanupAudioRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isPlaying || isRecording) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= TOTAL_DURATION) {
          setIsPlaying(false);
          return TOTAL_DURATION;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isRecording]);

  useEffect(() => {
    const scene = SCENES.findIndex((s, i) => {
      const next = SCENES[i + 1];
      return currentTime >= s.startAt && (!next || currentTime < next.startAt);
    });
    if (scene !== -1) setCurrentScene(scene);
  }, [currentTime]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audio management
  useEffect(() => {
    if (isPlaying && !audioCtxRef.current && !isMuted) {
      // Must be triggered by user interaction (already satisfied by play button click)
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      cleanupAudioRef.current = createZHUAmbience(audioCtxRef.current);
    }
    
    if (!isPlaying && audioCtxRef.current) {
      audioCtxRef.current.suspend();
    }
    
    if (isPlaying && audioCtxRef.current?.state === 'suspended' && !isMuted) {
      audioCtxRef.current.resume();
    }

    if (isMuted && audioCtxRef.current) {
      audioCtxRef.current.suspend();
    }
    
    return () => {
      if (cleanupAudioRef.current) cleanupAudioRef.current();
    };
  }, [isPlaying, isMuted]);

  const handleSceneClick = (index: number) => {
    setCurrentTime(SCENES[index].startAt);
    setCurrentScene(index);
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingProgress(0);
    setCurrentTime(0);
    setCurrentScene(0);
    setIsPlaying(true);
    
    const progressInterval = setInterval(() => {
      setRecordingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (TOTAL_DURATION * 10));
      });
    }, 100);

    setTimeout(() => {
      setIsRecording(false);
      setIsPlaying(false);
      setRecordingProgress(0);
      alert('Demo recording complete! (In production, this would download a WebM file)');
    }, TOTAL_DURATION * 1000);
  };

  const progressPercent = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <StarsBackground />
      
      {isRecording && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-6 py-2 border-red-500/30 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium">Recording... {Math.floor(recordingProgress)}%</span>
        </div>
      )}

      <button
        onClick={startRecording}
        disabled={isRecording}
        className="fixed top-4 right-4 z-50 glass rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {isRecording ? 'Recording...' : 'Record Demo'}
      </button>

      <div 
        ref={containerRef}
        className="relative z-10 h-screen flex flex-col"
      >
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {currentScene === 0 && (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <HeroScene isActive={currentScene === 0} />
              </motion.div>
            )}
            {currentScene === 1 && (
              <motion.div
                key="problem"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <ProblemScene isActive={currentScene === 1} />
              </motion.div>
            )}
            {currentScene === 2 && (
              <motion.div
                key="fleet"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <FleetScene isActive={currentScene === 2} />
              </motion.div>
            )}
            {currentScene === 3 && (
              <motion.div
                key="morning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <MorningScene isActive={currentScene === 3} />
              </motion.div>
            )}
            {currentScene === 4 && (
              <motion.div
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <CTAScene isActive={currentScene === 4} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="glass border-t border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-cyan-400" />
              ) : (
                <Play className="h-5 w-5 text-cyan-400 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-slate-500" />
              ) : (
                <Volume2 className="h-5 w-5 text-cyan-400" />
              )}
            </button>

            <div className="flex-1">
              <div 
                className="h-1 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(percent * TOTAL_DURATION);
                }}
              >
                <motion.div
                  className="h-full bg-cyan-400"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-slate-500">
                  {Math.floor(currentTime)}s / {TOTAL_DURATION}s
                </span>
                <span className="text-xs text-slate-500">
                  {SCENES[currentScene]?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {SCENES.map((scene, i) => (
                <button
                  key={scene.id}
                  onClick={() => handleSceneClick(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentScene 
                      ? 'bg-cyan-400' 
                      : i < currentScene 
                        ? 'bg-cyan-400/50' 
                        : 'bg-slate-700'
                  }`}
                  title={scene.name}
                />
              ))}
            </div>

            <button
              onClick={handleRestart}
              className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
            >
              <RotateCcw className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}