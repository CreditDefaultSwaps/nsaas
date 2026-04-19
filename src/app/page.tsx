'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { Logo, LogoWordmark } from '@/components/logo';
import { WaitlistForm } from '@/components/WaitlistForm';
import { WaitlistCounter } from '@/components/WaitlistCounter';
import { PRGallery } from '@/components/PRGallery';
import { FeatureDemos } from '@/components/FeatureDemos';
import { 
  Moon, 
  Zap, 
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  Rocket,
  TrendingUp,
  Users,
  Code2,
  CheckCircle2,
  Check,
  Cpu,
  TrendingDown,
  ZapIcon
} from 'lucide-react';

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

// Pricing data
const pricingPlans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'Perfect for solo founders and small projects',
    features: [
      '5 shifts per month',
      '1 repository',
      'Email support',
      'Private builds',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/mo',
    description: 'For teams shipping multiple features per week',
    features: [
      '20 shifts per month',
      'Unlimited repositories',
      'Priority queue',
      'Slack alerts',
      'Dedicated support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$499',
    period: '/mo',
    description: 'Custom solutions for large organizations',
    features: [
      'Unlimited shifts',
      'Custom agents',
      'SLA guarantee',
      'White-glove onboarding',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

// Why Now data
const whyNowPoints = [
  {
    icon: Cpu,
    title: 'AI agents went mainstream',
    subtitle: '2025',
    description: 'The technology finally works. Agents can reason, code, and ship autonomously.',
  },
  {
    icon: TrendingUp,
    title: 'Engineering costs hit all-time highs',
    subtitle: 'Talent shortage',
    description: 'Senior engineers command $200K+ salaries. The gap between demand and supply keeps widening.',
  },
  {
    icon: ZapIcon,
    title: 'The best founders ship faster than anyone',
    subtitle: 'Speed wins',
    description: 'Markets move in days, not quarters. The founders who iterate fastest capture the most value.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-night-900">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-night-900/80 backdrop-blur-xl"
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
              <Link
                href="/builds"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Live Builds
              </Link>
              <a
                href="#pricing"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Log In
              </Link>
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
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2">
                <TrendingUp className="h-4 w-4 text-neon-cyan" />
                <span className="text-sm text-zinc-300">Ship 10x Faster Without Hiring</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
            >
              A fleet of AI engineers.
              <br />
              <span className="gradient-text">Working while you sleep.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 mb-10"
            >
              Stop waiting on engineering. Describe what you need, and our AI team ships 
              production-ready code overnight. No hiring. No backlog. Just shipped features.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            >
              <a href="#waitlist">
                <Button size="lg" className="gap-2 neon-glow animate-glow-pulse">
                  <Rocket className="h-5 w-5" />
                  Join the Waitlist
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                See how it works
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Waitlist Counter */}
            <motion.div variants={itemVariants} className="mb-10">
              <WaitlistCounter />
            </motion.div>

            {/* Pricing Strip */}
            <motion.div 
              variants={itemVariants}
              className="mb-16"
            >
              <p className="text-sm text-zinc-500">
                Starting at <span className="text-zinc-300 font-medium">$49/mo</span> · No credit card required · Cancel anytime
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {[
                { value: '10x', label: 'Faster Shipping' },
                { value: '$50K+', label: 'Engineering Savings' },
                { value: '24/7', label: 'Development' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              From Idea to Revenue in 8 Hours
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Stop letting engineering bottlenecks kill your momentum. Night Shift turns your product ideas into shipped code while you focus on growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Describe Your Request',
                description: 'Write what you need in plain English. No technical specs required. Our AI understands intent.',
                step: '01',
              },
              {
                icon: Moon,
                title: 'Go to Sleep',
                description: 'Our AI engineering team analyzes your codebase, plans the implementation, and starts building.',
                step: '02',
              },
              {
                icon: Rocket,
                title: 'Wake Up to Shipped Code',
                description: 'Review the PR, merge, and deploy. Your customers get new features while you were sleeping.',
                step: '03',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass glass-hover rounded-2xl p-8 h-full">
                  <div className="text-6xl font-bold text-white/5 absolute top-4 right-4">{step.step}</div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center mb-6">
                      <step.icon className="h-6 w-6 text-neon-cyan" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-zinc-400">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PR Gallery */}
      <PRGallery />

      {/* Founder Section */}
      <section className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            {/* Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Built by a founder who automated his own engineering team
              </h2>
              <div className="space-y-4 text-lg text-zinc-400">
                <p>
                  I spent 3 years running a company where engineering was always the bottleneck. Every feature request meant hiring, onboarding, or waiting.
                </p>
                <p>
                  So I built an AI fleet that works while I sleep. No standups. No blockers. Just shipped code every morning.
                </p>
                <p className="text-white font-medium">
                  Night Shift ships more code in one night than most teams ship in a week.
                </p>
              </div>
            </div>
            
            {/* Avatar Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-neon-purple via-purple-500 to-neon-cyan flex items-center justify-center shadow-2xl">
                <span className="text-4xl md:text-5xl font-bold text-white">AK</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Everything You Need */}
      <section className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Ship Faster
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Click any feature to see a live demo of how Night Shift works
            </p>
          </motion.div>

          <FeatureDemos />
        </div>
      </section>

      {/* Differentiation */}
      <section className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-neon-cyan" />
              <span className="text-sm text-zinc-300">Not just another tool</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Linear manages your backlog.
              <br />
              <span className="gradient-text">Night Shift empties it.</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Every other tool helps you manage or assist. Night Shift autonomously builds — no engineers, no standups, no blockers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Autonomous, not assisted',
                body: 'Night Shift doesn\'t suggest code — it writes, tests, and ships it. Zero human hands on keyboard.',
              },
              {
                title: 'Overnight, every night',
                body: 'Submit before bed. Wake up to a PR. Predictable 8-hour turnaround, 7 nights a week.',
              },
              {
                title: 'Production-ready, not prototype',
                body: 'TypeScript, tests, your codebase patterns. Code you can merge — not proof-of-concepts you\'ll rewrite.',
              },
            ].map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="w-2 h-2 rounded-full bg-purple-500 mb-4" />
                <h3 className="text-base font-semibold text-white mb-2">{point.title}</h3>
                <p className="text-sm text-zinc-400">{point.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The timing has never been better
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Three converging trends make Night Shift possible — and necessary — right now.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {whyNowPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass glass-hover rounded-2xl p-8 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center mx-auto mb-6">
                  <point.icon className="h-7 w-7 text-neon-cyan" />
                </div>
                <div className="text-sm text-neon-purple font-medium mb-2">{point.subtitle}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{point.title}</h3>
                <p className="text-zinc-400 text-sm">{point.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Stat Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 md:p-12 text-center"
          >
            <div className="text-5xl md:text-6xl font-bold gradient-text mb-4">
              90%
            </div>
            <p className="text-xl text-white font-medium mb-2">
              AI development costs dropped 90% in 18 months
            </p>
            <p className="text-zinc-400">
              What required a team of engineers in 2024 now runs on a single GPU. The economics have flipped.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Start free. Upgrade when you&apos;re ready to ship faster.
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

          {/* All Plans Include */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-zinc-400 text-sm">
              All plans include:{' '}
              <span className="text-zinc-300">TypeScript</span>
              <span className="mx-2 text-zinc-600">·</span>
              <span className="text-zinc-300">Tests</span>
              <span className="mx-2 text-zinc-600">·</span>
              <span className="text-zinc-300">GitHub PRs</span>
              <span className="mx-2 text-zinc-600">·</span>
              <span className="text-zinc-300">Quality gates</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="relative py-24 border-t border-white/5">
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
                  Private beta closes May 15, 2026 · 47 spots remaining
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the Night Shift
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
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Left: Logo + Tagline */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Logo showText={false} />
                <span className="text-white font-bold">Night Shift</span>
              </div>
              <p className="text-sm text-zinc-500">
                Ship while you sleep. AI engineers that work 24/7.
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
                    <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <Link href="/builds" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Live Builds
                    </Link>
                  </li>
                  <li>
                    <Link href="/integrations" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Integrations
                    </Link>
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
              © 2026 Night Shift. All rights reserved.
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
