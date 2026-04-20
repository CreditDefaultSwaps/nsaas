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
  GitPullRequest
} from 'lucide-react';
import { LogoWordmark } from '@/components/logo';

const TOTAL_DURATION = 90;
const SCENES = [
  { id: 0, name: 'Hero', duration: 8, startAt: 0 },
  { id: 1, name: 'Problem', duration: 10, startAt: 8 },
  { id: 2, name: 'Fleet', duration: 22, startAt: 18 },
  { id: 3, name: 'Morning', duration: 15, startAt: 40 },
  { id: 4, name: 'Product', duration: 20, startAt: 55 },
  { id: 5, name: 'CTA', duration: 15, startAt: 75 },
];

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
    { time: '11:03 PM', agent: 'QA', message: 'all tests passing' },
    { time: '11:04 PM', agent: 'DevOps', message: 'deployed' },
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
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: agentActive ? 1 : 0.3, 
                scale: agentActive ? 1 : 0.8,
              }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2"
              style={{ 
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
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

function ProductScene({ isActive }: { isActive: boolean }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Overview', 'Brief the Fleet', 'Morning Brief'];

  useEffect(() => {
    if (!isActive) {
      setActiveTab(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % tabs.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Your NightShift Dashboard</h2>
        <p className="text-slate-400">Track builds, brief the fleet, get morning handoffs</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl glass rounded-2xl overflow-hidden border border-slate-700"
      >
        <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-white">NightShift</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Fleet Active
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-800">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === i ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
              {activeTab === i && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Products Built', value: '12', color: 'text-cyan-400' },
                    { label: 'Success Rate', value: '98%', color: 'text-emerald-400' },
                    { label: 'Hours Saved', value: '340+', color: 'text-purple-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-900/50 rounded-xl p-4">
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-3">Recent Builds</div>
                  {[
                    { name: 'Stripe Revenue Dashboard', status: 'Live', time: '2h ago' },
                    { name: 'Auth System v2', status: 'Building', time: 'Now' },
                    { name: 'API Documentation', status: 'Complete', time: '1d ago' },
                  ].map((build) => (
                    <div key={build.name} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                      <span className="text-sm text-white">{build.name}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs ${build.status === 'Building' ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {build.status}
                        </span>
                        <span className="text-xs text-slate-600">{build.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="brief"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <label className="text-xs text-slate-500 uppercase mb-2 block">What do you want built?</label>
                  <div className="bg-slate-800 rounded-lg p-4 text-slate-300 text-sm min-h-[100px]">
                    I need a customer portal where users can view their subscription status, download invoices, and update payment methods...
                  </div>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
                  <Rocket className="h-4 w-4" />
                  Brief the Fleet
                </button>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="morning"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-slate-900/50 rounded-xl p-4 border border-cyan-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                      <span className="text-lg">🛰️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Cyprus</div>
                      <div className="text-xs text-slate-500">6:03 AM · Lead Agent</div>
                    </div>
                  </div>
                  <div className="text-slate-300 text-sm leading-relaxed space-y-2">
                    <p>Good morning! Your Stripe Revenue Dashboard is now live.</p>
                    <p>✓ Dashboard with 4 charts</p>
                    <p>✓ CSV export functionality</p>
                    <p>✓ Connected to your Stripe account</p>
                    <p>✓ Deployed to dashboard-stripe.vercel.app</p>
                    <p className="text-cyan-400 mt-4">Ready for your next brief?</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
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
  const containerRef = useRef<HTMLDivElement>(null);

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
                key="product"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <ProductScene isActive={currentScene === 4} />
              </motion.div>
            )}
            {currentScene === 5 && (
              <motion.div
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <CTAScene isActive={currentScene === 5} />
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