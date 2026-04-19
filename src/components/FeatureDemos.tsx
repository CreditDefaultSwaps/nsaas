'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, GitBranch, Zap, Shield, Clock, Rocket, Sparkles } from 'lucide-react';

interface DemoProps {
  isOpen: boolean;
  onClose: () => void;
}

function DemoModal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Demo 1: Natural Language Requests
function NaturalLanguageDemo({ isOpen, onClose }: DemoProps) {
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const steps = [
    { text: "Add a user authentication system with login, signup, and password reset", typed: false },
    { text: "Add a user authentication system with login, signup, and password reset", typed: true },
  ];

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Natural Language Requests">
      <div className="space-y-6">
        <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
          <label className="block text-sm font-medium text-slate-400 mb-2">Describe what you want built</label>
          <div className="relative">
            <textarea
              readOnly
              value="Add a user authentication system with login, signup, and password reset"
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white font-mono text-sm resize-none"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="text-xs text-slate-500">AI understands intent</span>
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-400" />
              Extracted Requirements
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Login page with email/password
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Signup with validation
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Password reset flow
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Session management
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              Tech Stack Detection
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Framework</span>
                <span className="text-cyan-400">Next.js 14</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Auth</span>
                <span className="text-cyan-400">Clerk</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Database</span>
                <span className="text-cyan-400">Supabase</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Styling</span>
                <span className="text-cyan-400">Tailwind</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoModal>
  );
}

// Demo 2: AI Code Generation
function AICodeDemo({ isOpen, onClose }: DemoProps) {
  const codeExample = `// Generated by Night Shift
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-cyan-500 hover:bg-cyan-600',
          }
        }}
      />
    </div>
  );
}`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="AI Code Generation">
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">AI</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-300">Night Shift Agent is writing code...</div>
            <div className="text-xs text-slate-500">Analyzing your codebase patterns</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Generating</span>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <span className="text-xs text-slate-500 ml-2">app/login/page.tsx</span>
          </div>
          <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto">
            <code>{codeExample}</code>
          </pre>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-2xl font-bold text-emerald-400">100%</div>
            <div className="text-xs text-slate-500">TypeScript Pass</div>
          </div>
          <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-2xl font-bold text-emerald-400">0</div>
            <div className="text-xs text-slate-500">ESLint Errors</div>
          </div>
          <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-2xl font-bold text-emerald-400">12s</div>
            <div className="text-xs text-slate-500">Generation Time</div>
          </div>
        </div>
      </div>
    </DemoModal>
  );
}

// Demo 3: Live Build Tracking
function LiveBuildDemo({ isOpen, onClose }: DemoProps) {
  const logs = [
    { time: '02:14:32', message: 'Cloning repository...', status: 'done' },
    { time: '02:14:35', message: 'Analyzing codebase structure', status: 'done' },
    { time: '02:14:38', message: 'Detected Next.js 14 + TypeScript', status: 'done' },
    { time: '02:14:42', message: 'Generating authentication components', status: 'active' },
    { time: '02:14:45', message: 'Writing login page...', status: 'pending' },
    { time: '02:14:48', message: 'Running TypeScript checks', status: 'pending' },
  ];

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Live Build Tracking">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Add authentication system</div>
              <div className="text-xs text-slate-500">Branch: night-shift/auth-472</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs text-yellow-400">Building</span>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-500">Live Build Log</span>
          </div>
          <div className="p-4 font-mono text-sm space-y-2 max-h-64 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-slate-600 text-xs">{log.time}</span>
                <span className="text-slate-400">{log.message}</span>
                {log.status === 'done' && <span className="text-emerald-400">✓</span>}
                {log.status === 'active' && <span className="text-yellow-400 animate-pulse">●</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Files Changed</div>
            <div className="text-2xl font-bold text-white">8</div>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Lines Added</div>
            <div className="text-2xl font-bold text-emerald-400">+342</div>
          </div>
        </div>
      </div>
    </DemoModal>
  );
}

// Demo 4: GitHub Integration
function GitHubDemo({ isOpen, onClose }: DemoProps) {
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="GitHub Integration">
      <div className="space-y-6">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Pull Request Created</div>
              <div className="text-xs text-slate-500">night-shift/auth-472 → main</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <h4 className="text-sm font-medium text-white mb-2">Add user authentication system</h4>
            <p className="text-xs text-slate-400 mb-4">
              This PR implements a complete authentication system including login, signup, and password reset functionality.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-400">TypeScript compilation passed</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-400">ESLint checks passed</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Build verification passed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-2xl font-bold text-white">+342</div>
            <div className="text-xs text-slate-500">Lines Added</div>
          </div>
          <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-xs text-slate-500">Files Changed</div>
          </div>
          <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-2xl font-bold text-emerald-400">Ready</div>
            <div className="text-xs text-slate-500">To Merge</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
            Merge Pull Request
          </button>
          <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
            View on GitHub
          </button>
        </div>
      </div>
    </DemoModal>
  );
}

// Demo 5: Quality Assurance
function QualityDemo({ isOpen, onClose }: DemoProps) {
  const checks = [
    { name: 'TypeScript Compilation', status: 'passed', time: '2.3s' },
    { name: 'ESLint', status: 'passed', time: '1.8s' },
    { name: 'Build Verification', status: 'passed', time: '4.2s' },
    { name: 'Unit Tests', status: 'passed', time: '3.1s' },
    { name: 'Security Scan', status: 'passed', time: '1.5s' },
  ];

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Quality Assurance">
      <div className="space-y-6">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">All Checks Passed</div>
              <div className="text-xs text-slate-500">5/5 quality gates cleared</div>
            </div>
          </div>

          <div className="space-y-3">
            {checks.map((check) => (
              <div key={check.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-300">{check.name}</span>
                </div>
                <span className="text-xs text-slate-500">{check.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div className="text-3xl font-bold text-emerald-400">0</div>
            <div className="text-xs text-slate-500">Errors</div>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div className="text-3xl font-bold text-yellow-400">2</div>
            <div className="text-xs text-slate-500">Warnings</div>
          </div>
        </div>
      </div>
    </DemoModal>
  );
}

// Demo 6: Cost Tracking
function CostDemo({ isOpen, onClose }: DemoProps) {
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Cost Tracking">
      <div className="space-y-6">
        <div className="p-6 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-slate-400">This Shift Cost</div>
              <div className="text-3xl font-bold text-white">$1.24</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">vs Traditional Dev</div>
              <div className="text-xl font-bold text-slate-500 line-through">$800+</div>
            </div>
          </div>

          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[0.15%] bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
          </div>
          <div className="text-xs text-slate-500 mt-2">99.8% cost reduction</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Gemma Screening</div>
            <div className="text-lg font-bold text-emerald-400">$0.00</div>
            <div className="text-xs text-slate-600">Local LLM</div>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Claude Generation</div>
            <div className="text-lg font-bold text-cyan-400">$1.24</div>
            <div className="text-xs text-slate-600">API calls only</div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <h4 className="text-sm font-medium text-white mb-3">Monthly Estimate</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">20 shifts/month</span>
              <span className="text-white">~$25</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">vs 1 senior engineer</span>
              <span className="text-slate-500">$15,000/mo</span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-emerald-400">Monthly Savings</span>
                <span className="text-emerald-400">$14,975</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoModal>
  );
}

// Main export with all demos
export function FeatureDemos() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  return (
    <>
      <NaturalLanguageDemo 
        isOpen={activeDemo === 'natural-language'} 
        onClose={() => setActiveDemo(null)} 
      />
      <AICodeDemo 
        isOpen={activeDemo === 'ai-code'} 
        onClose={() => setActiveDemo(null)} 
      />
      <LiveBuildDemo 
        isOpen={activeDemo === 'live-build'} 
        onClose={() => setActiveDemo(null)} 
      />
      <GitHubDemo 
        isOpen={activeDemo === 'github'} 
        onClose={() => setActiveDemo(null)} 
      />
      <QualityDemo 
        isOpen={activeDemo === 'quality'} 
        onClose={() => setActiveDemo(null)} 
      />
      <CostDemo 
        isOpen={activeDemo === 'cost'} 
        onClose={() => setActiveDemo(null)} 
      />

      {/* Feature cards with click handlers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 'natural-language',
            icon: Sparkles,
            title: 'Natural Language Requests',
            description: 'Describe what you want in plain English. No technical specs needed.',
            gradient: 'from-cyan-500/20 to-blue-500/20',
          },
          {
            id: 'ai-code',
            icon: Code2,
            title: 'AI Code Generation',
            description: 'Production-quality code that follows your patterns and conventions.',
            gradient: 'from-purple-500/20 to-pink-500/20',
          },
          {
            id: 'live-build',
            icon: Rocket,
            title: 'Live Build Tracking',
            description: 'Watch your code being built in real-time with detailed logs.',
            gradient: 'from-orange-500/20 to-red-500/20',
          },
          {
            id: 'github',
            icon: GitBranch,
            title: 'GitHub Integration',
            description: 'Automatic PRs with full context, tests, and documentation.',
            gradient: 'from-emerald-500/20 to-teal-500/20',
          },
          {
            id: 'quality',
            icon: Shield,
            title: 'Quality Assurance',
            description: 'TypeScript, ESLint, tests, and security scans on every shift.',
            gradient: 'from-yellow-500/20 to-amber-500/20',
          },
          {
            id: 'cost',
            icon: Zap,
            title: 'Cost Tracking',
            description: 'Track every shift cost. 90% cheaper than traditional development.',
            gradient: 'from-green-500/20 to-emerald-500/20',
          },
        ].map((feature) => (
          <motion.div
            key={feature.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveDemo(feature.id)}
            className="cursor-pointer group"
          >
            <div className={`glass glass-hover rounded-2xl p-6 h-full bg-gradient-to-br ${feature.gradient} border border-white/10`}>
              <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{feature.description}</p>
              <div className="flex items-center text-sm text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <span>View Demo</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
