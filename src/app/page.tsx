'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';
import { Button } from '@/components/ui';
import { Logo } from '@/components/logo';
import { WaitlistForm } from '@/components/WaitlistForm';
import { WaitlistCounter } from '@/components/WaitlistCounter';
import { 
  Moon, 
  Zap, 
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  Rocket,
  Globe,
  Database,
  MessageCircle,
  RefreshCw,
  Check,
  Building2,
  Users,
  Bot,
  Send,
  Server,
  Code
} from 'lucide-react';
import { AgentOrbit } from '@/components/AgentOrbit';
import { TerminalMockup } from '@/components/TerminalMockup';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Pricing data - renamed tiers
const pricingPlans = [
  {
    name: 'Idea',
    price: '$99',
    period: '/mo',
    description: 'Perfect for testing concepts and building MVPs',
    features: [
      '1 sandbox environment',
      '2 products per month',
      'Your own codebase',
      'Your own domain',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Builder',
    price: '$299',
    period: '/mo',
    description: 'For founders shipping multiple products',
    features: [
      '2 sandbox environments',
      '5 products per month',
      'Priority queue',
      'Custom domains',
      'Slack alerts',
      'Dedicated support',
    ],
    cta: 'Start Building',
    popular: true,
  },
  {
    name: 'Fleet',
    price: '$999',
    period: '/mo',
    description: 'Unlimited products for power founders',
    features: [
      'Unlimited products',
      'Custom infrastructure',
      'SLA guarantee',
      'White-glove onboarding',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

// Testimonials (updated for non-technical founders)
const testimonials = [
  {
    quote: "I described my marketplace idea before bed. Woke up to a working product with Stripe payments. I don't know how to code—this felt like magic.",
    author: "Sarah Chen",
    role: "Founder, MarketFind",
  },
  {
    quote: "NightShift built my SaaS dashboard while I was sleeping. I own the code, the domain, everything. No agency could match this speed.",
    author: "Marcus Johnson",
    role: "Solo Founder",
  },
  {
    quote: "I went from idea to live product in 24 hours. The morning Telegram message is now my favorite notification.",
    author: "Elena Rodriguez",
    role: "Founder, TaskFlow",
  },
];

// Fleet Advantage statements
const fleetAdvantage = [
  {
    headline: "Your backlog is now a to-do list.",
    body: "Every idea you've shelved because you couldn't afford to build it — gone. The fleet doesn't care if it's 3 AM. It builds.",
  },
  {
    headline: "You just became a 100x founder.",
    body: "The 10x engineer competed with humans. You now have something that competes with teams. One founder with a fleet outships a 5-person startup.",
  },
  {
    headline: "The bottleneck was never your idea.",
    body: "You always had the vision. The bottleneck was translation — turning vision into code. NightShift eliminated that bottleneck.",
  },
];

// Animated counter component
function IdeasCounter() {
  const [count, setCount] = React.useState(() => Math.floor(Math.random() * 400) + 800);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, Math.random() * 2000 + 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="glass rounded-full px-6 py-3 text-sm text-zinc-400 inline-flex items-center gap-2">
      <span>🛰️ Ideas built tonight:</span>
      <span className="text-cyan-400 font-mono font-bold">{count.toLocaleString()}</span>
    </div>
  );
}

export default function Home() {
  // Scroll listener for nav border transition
  React.useEffect(() => {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.style.borderColor = 'rgba(139, 92, 246, 0.2)';
      } else {
        nav.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-night-900">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[rgba(10,10,15,0.85)] backdrop-blur-[20px] backdrop-saturate-[180%] transition-all duration-300"
        id="main-nav"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                How it Works
              </a>
              <a
                href="#fleet"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                The Fleet
              </a>
              <a
                href="#pricing"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#waitlist"
                className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-cyan-400 text-night-900 font-semibold hover:from-cyan-300 hover:to-cyan-200 transition-all"
              >
                Join Waitlist
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 border-neon-cyan/30">
                <Zap className="h-4 w-4 text-neon-cyan" />

              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6"
            >
              Stop waiting on engineers.
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="mx-auto max-w-3xl text-2xl md:text-4xl font-bold gradient-text mb-8"
            >
              Meet NightShift, a fleet of AI agents that builds while you sleep.
            </motion.p>

            {/* Body */}
            <motion.p 
              variants={itemVariants}
              className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 mb-10"
            >
              The old model: hire engineers, wait months, burn runway. The new model: describe what you want. A fleet of 10 specialized AI agents builds it overnight. You wake up. It&apos;s live.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            >
              <a href="#waitlist">
                <Button size="lg" className="group gap-2 neon-glow animate-glow-pulse text-lg px-10 py-5 hover:shadow-[0_0_30px_rgba(34,211,238,0.4),0_0_60px_rgba(139,92,246,0.25)]">
                  <Rocket className="h-5 w-5" />
                  Deploy your fleet
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </a>
              <a href="#fleet" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                Meet the fleet
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Waitlist Counter */}
            <motion.div variants={itemVariants} className="mb-10">
              <WaitlistCounter />
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-row justify-center items-start gap-0 max-w-3xl mx-auto w-full"
            >
              {[
                { value: '10+', sub: 'agents', label: 'And growing' },
                { value: '48 hrs', sub: '', label: 'Idea to live product' },
                { value: '$99', sub: '/mo', label: 'vs $15K/yr for an engineer' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex-1 text-center px-4" style={i > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.06)' } : {}}>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-5xl md:text-6xl font-bold text-white">{stat.value}</span>
                    {stat.sub && <span className="text-lg text-neon-cyan font-medium mb-1">{stat.sub}</span>}
                  </div>
                  <div className="text-sm text-zinc-500 mt-1 leading-snug">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How The Fleet Works Section */}
      <section id="fleet" className="relative py-24 overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          {/* Section Number */}
          <span className="absolute top-8 left-8 text-xs font-mono tracking-widest text-zinc-600 uppercase">01</span>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 pt-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Not One AI. A Coordinated Swarm.
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Every NightShift deployment is led by <span className="text-cyan-400 font-medium">Cyprus</span> — your dedicated lead agent. Cyprus reviews your request, briefs the specialist fleet, resolves conflicts, and delivers a morning handoff. Think of Cyprus as your AI engineering lead who never sleeps, never drops context, and always ships.
            </p>
          </motion.div>

          {/* Orbit Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center mb-8 overflow-hidden w-full"
          >
            {/* Desktop */}
            <div className="hidden md:flex justify-center">
              <AgentOrbit />
            </div>
            {/* Mobile — scale down to fit */}
            <div
              className="md:hidden flex justify-center"
              style={{ width: '100%', overflowX: 'hidden' }}
            >
              <div style={{ transform: 'scale(0.62)', transformOrigin: 'top center', width: 480, height: 480, flexShrink: 0 }}>
                <AgentOrbit />
              </div>
            </div>
          </motion.div>

          {/* Beta notice */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-zinc-500">
              Currently in private beta. Core fleet active. Additional specialist agents rolling out through 2026.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Timeline + Terminal Split */}
      <section id="how-it-works" className="relative py-24">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
          
          {/* Section header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">From idea to live product in one night</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Here's exactly what happens between when you submit and when you wake up.</p>
          </motion.div>

          {/* Split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* LEFT: Timestamp timeline */}
            <div className="space-y-0">
              {/* 10:47 PM */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-20 shrink-0">
                  <span className="text-xs font-mono text-zinc-600">10:47 PM</span>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <div className="w-px h-16 bg-slate-800" />
                </div>
                <div className="pb-8">
                  <h4 className="text-white font-semibold mb-1">You submit your request</h4>
                  <p className="text-sm text-zinc-400">Brief description in plain English. No specs. No tickets. Just what you want.</p>
                </div>
              </motion.div>

              {/* 10:48 PM */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-20 shrink-0">
                  <span className="text-xs font-mono text-zinc-600">10:48 PM</span>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <div className="w-px h-16 bg-slate-800" />
                </div>
                <div className="pb-8">
                  <h4 className="text-white font-semibold mb-1">Cyprus activates the fleet</h4>
                  <p className="text-sm text-zinc-400">Your lead agent reads your request, scans your codebase, and briefs 8 specialist agents simultaneously.</p>
                </div>
              </motion.div>

              {/* 10:51 PM */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2 * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-20 shrink-0">
                  <span className="text-xs font-mono text-zinc-600">10:51 PM</span>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <div className="w-px h-16 bg-slate-800" />
                </div>
                <div className="pb-8">
                  <h4 className="text-white font-semibold mb-1">Architect generates the spec</h4>
                  <p className="text-sm text-zinc-400">System design complete. 12 components mapped. 3 API routes planned. Stack confirmed.</p>
                </div>
              </motion.div>

              {/* 10:52 PM */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 3 * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-20 shrink-0">
                  <span className="text-xs font-mono text-zinc-600">10:52 PM</span>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <div className="w-px h-16 bg-slate-800" />
                </div>
                <div className="pb-8">
                  <h4 className="text-white font-semibold mb-1">Frontend + Backend build in parallel</h4>
                  <p className="text-sm text-zinc-400">Two agents working simultaneously. Frontend builds your UI. Backend builds your API. No bottleneck.</p>
                </div>
              </motion.div>

              {/* 11:03 PM */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 4 * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-20 shrink-0">
                  <span className="text-xs font-mono text-zinc-600">11:03 PM</span>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="w-px h-16 bg-slate-800" />
                </div>
                <div className="pb-8">
                  <h4 className="text-white font-semibold mb-1">QA agent runs tests</h4>
                  <p className="text-sm text-zinc-400">Automated tests written and passing. 0 build errors. 0 TypeScript errors.</p>
                </div>
              </motion.div>

              {/* 11:04 PM */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 5 * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-20 shrink-0">
                  <span className="text-xs font-mono text-zinc-600">11:04 PM</span>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="w-px h-16 bg-slate-800" />
                </div>
                <div className="pb-8">
                  <h4 className="text-white font-semibold mb-1">DevOps deploys to your infrastructure</h4>
                  <p className="text-sm text-zinc-400">Your Vercel. Your Supabase. Your domain. Deployed and live.</p>
                </div>
              </motion.div>

              {/* 6:03 AM */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 6 * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-20 shrink-0">
                  <span className="text-xs font-mono text-zinc-600">6:03 AM</span>
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Morning handoff from Cyprus</h4>
                  <p className="text-sm text-zinc-400 mb-2">PR created with full context. Your product is live. Cyprus sends you a summary.</p>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">You wake up to this ↓</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Terminal mockup (sticky on desktop) */}
            <div className="lg:sticky lg:top-24">
              <TerminalMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation Section */}
      <section className="relative py-24">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent absolute top-0 left-0 right-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Every other option makes you wait.
              <br />
              <span className="gradient-text">NightShift ships while you sleep.</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              You&apos;ve tried the alternatives. Here&apos;s the honest truth about each one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bolt/Lovable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="glass rounded-2xl p-8 flex flex-col gap-5"
            >
              <div>
                <div className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">Bolt / Lovable / Replit</div>
                <h3 className="text-xl font-bold text-white">You sit and watch it build.</h3>
              </div>
              <div className="space-y-4 text-sm text-zinc-400">
                <div className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <span><span className="text-white font-medium">They own your code.</span> Try to export it and you&apos;ll find it&apos;s locked to their platform. Switching costs are brutal.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <span><span className="text-white font-medium">You have to be there.</span> Real-time tools require your full attention. That&apos;s not leverage — that&apos;s a new job.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <span><span className="text-white font-medium">Prototypes, not products.</span> Great for demos. Breaks at scale. You&apos;ll rebuild it anyway.</span>
                </div>
              </div>
            </motion.div>

            {/* Agencies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8 flex flex-col gap-5"
            >
              <div>
                <div className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">Dev Agencies / Freelancers</div>
                <h3 className="text-xl font-bold text-white">You wait weeks. Then you wait more.</h3>
              </div>
              <div className="space-y-4 text-sm text-zinc-400">
                <div className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <span><span className="text-white font-medium">$10K–$50K to start.</span> And that&apos;s before scope creep, missed deadlines, and &quot;that&apos;ll cost extra.&quot;</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <span><span className="text-white font-medium">3–6 months to launch.</span> Your window closes. Your competitors ship. You&apos;re still in sprint planning.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <span><span className="text-white font-medium">They leave. You&apos;re stuck.</span> No documentation, no handoff, no one who knows the codebase.</span>
                </div>
              </div>
            </motion.div>

            {/* Night Shift — highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative neon-border rounded-2xl p-8 flex flex-col gap-5"
              style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(10, 10, 15, 0.95) 60%)' }}
            >
              <div className="absolute top-4 right-4">
                <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">NightShift</span>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-2">The Alternative</div>
                <h3 className="text-xl font-bold text-white">Go to sleep. Wake up to a live product.</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span className="text-zinc-300"><span className="text-white font-medium">You own everything.</span> Your code, your domain, your infrastructure. NightShift is the builder — not the landlord.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span className="text-zinc-300"><span className="text-white font-medium">Overnight, every night.</span> Describe what you need before bed. Wake up to a real, deployed product. Not a demo.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span className="text-zinc-300"><span className="text-white font-medium">Gets better over time.</span> Every product teaches the fleet more about what you want. The second build is faster than the first.</span>
                </div>
              </div>
              <a href="#waitlist" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Start tonight <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent absolute top-0 left-0 right-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Founders are waking up to products
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass glass-hover rounded-2xl p-6"
              >
                <p className="text-zinc-300 mb-6 text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center text-sm font-medium text-white">
                    {t.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.author}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent absolute top-0 left-0 right-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-zinc-500 mb-4">
              Starting at <span className="text-zinc-300 font-medium">$99/mo</span> · No credit card required · Cancel anytime
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Start small. Scale as you ship more products.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'glass neon-border'
                    : 'glass glass-hover'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple text-night-900 text-xs font-semibold">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <p className="text-zinc-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-400">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-zinc-300">
                      <Check className="h-5 w-5 text-neon-cyan flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="relative py-24">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent absolute top-0 left-0 right-0" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass neon-border rounded-3xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              {/* Urgency Text */}
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-2 mb-6">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">
                  47 founders ahead of you. Beta closes May 15.
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the waitlist. The fleet starts working the moment you submit your first request.
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Limited spots available for our private beta. Join the waitlist and be the first to ship while you sleep.
              </p>
            </div>
            <WaitlistForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent absolute top-0 left-0 right-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Left: Logo + Tagline */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Logo showText={false} />
                <span className="text-white font-bold">NightShift</span>
              </div>
              <p className="text-sm text-zinc-500">
                One founder. One vision. A fleet that never sleeps.
              </p>
            </div>

            {/* Middle: Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a href="#fleet" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      The Fleet
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Social */}
            <div className="md:text-right">
              <h4 className="text-sm font-semibold text-white mb-4">Follow the build</h4>
              <a
                href="https://twitter.com/nightshift"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-sm">@nightshift</span>
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              © 2026 NightShift. All rights reserved.
            </p>
            <p className="text-sm text-zinc-500 flex items-center gap-2">
              Made by an AI fleet <span className="text-lg">🛰️</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
