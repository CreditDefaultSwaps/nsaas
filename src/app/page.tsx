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
  Star,
  TrendingDown,
  Clock3,
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

// Testimonials data
const testimonials = [
  {
    quote: "I wake up to 3-4 PRs every morning. It feels like having a senior engineer who never sleeps.",
    author: "Sarah Chen",
    role: "Founder @ TechStart",
    initials: "SC"
  },
  {
    quote: "We shipped 2 weeks of backlog in 3 days. Night Shift is now core to how we build.",
    author: "Marcus Johnson",
    role: "CTO @ DataFlow",
    initials: "MJ"
  },
  {
    quote: "The code quality is surprisingly good. It follows our patterns and conventions perfectly.",
    author: "Elena Rodriguez",
    role: "Lead Dev @ CloudSync",
    initials: "ER"
  }
];

// Star rating component
function StarRating() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-cyan-400 text-cyan-400" />
      ))}
    </div>
  );
}

// Testimonial Card component
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="glass glass-hover rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-[0_8px_40px_rgba(139,92,246,0.15)]">
        {/* Star Rating */}
        <div className="mb-4">
          <StarRating />
        </div>
        
        {/* Quote */}
        <p className="text-zinc-300 mb-6 leading-relaxed">
          "{testimonial.quote}"
        </p>
        
        {/* Author */}
        <div className="flex items-center gap-3">
          {/* Avatar with gradient */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{testimonial.initials}</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm">{testimonial.author}</div>
            <div className="text-zinc-500 text-xs">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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
            <div className="flex items-center gap-4">
              <a
                href="#waitlist"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
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
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-6"
            >
              {[
                { value: '10x', label: 'Faster', sublabel: 'vs traditional hiring timeline' },
                { value: '$50K+', label: 'saved vs 1 engineer/year', sublabel: '' },
                { value: '24/7', label: 'autonomous development', sublabel: '' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-400">{stat.label}</div>
                  {stat.sublabel && <div className="text-xs text-zinc-500 mt-1">{stat.sublabel}</div>}
                </div>
              ))}
            </motion.div>

            {/* Market Size Badge */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-sm text-zinc-500">
                Targeting the <span className="text-zinc-400">$650B global software development market</span>
              </p>
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

      {/* Testimonials Section */}
      <section className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What founders are saying
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* PR Gallery */}
      <PRGallery />

      {/* The Full Stack. Autonomous. */}
      <section className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Full Stack. Autonomous.
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Every tool you need, built into every shift
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

      {/* Why Now - Market Timing */}
      <section className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-4">
                <Clock3 className="h-4 w-4 text-neon-cyan" />
                <span className="text-sm text-zinc-300">Market timing</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Now?
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: TrendingDown,
                  text: "AI inference costs dropped 90% in 18 months — making autonomous agents economically viable"
                },
                {
                  icon: Clock,
                  text: "Average time-to-hire for senior engineers: 4.2 months. Night Shift starts tonight."
                },
                {
                  icon: ZapIcon,
                  text: "The fastest-growing startups in 2025 ship 3x more features than their competitors"
                }
              ].map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                    <point.icon className="h-5 w-5 text-neon-cyan" />
                  </div>
                  <p className="text-zinc-300 text-lg leading-relaxed pt-2">
                    {point.text}
                  </p>
                </motion.div>
              ))}
            </div>
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo showText={false} />
            <p className="text-sm text-zinc-500">
              © 2026 Night Shift. Ship while you sleep.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
