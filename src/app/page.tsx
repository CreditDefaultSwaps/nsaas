'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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
    price: '$49',
    period: '/mo',
    description: 'Perfect for testing concepts and building MVPs',
    features: [
      '5 products per month',
      'Your own codebase',
      'Your own domain',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Builder',
    price: '$149',
    period: '/mo',
    description: 'For founders shipping multiple products',
    features: [
      '20 products per month',
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
    price: '$499',
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

// What you get features
const whatYouGet = [
  {
    icon: Globe,
    title: 'A live URL',
    description: 'Not a prototype. A real deployed product with your own domain.',
  },
  {
    icon: Code,
    title: 'Your own codebase',
    description: 'GitHub repo, fully yours. No lock-in. Take it anywhere.',
  },
  {
    icon: Server,
    title: 'Your own infrastructure',
    description: 'Vercel + Supabase + your domain. You control everything.',
  },
  {
    icon: Send,
    title: 'Morning delivery',
    description: 'Telegram message with your new product link when you wake up.',
  },
  {
    icon: RefreshCw,
    title: 'Unlimited revisions',
    description: 'Describe what to change. Next morning, it\'s done.',
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
    quote: "Night Shift built my SaaS dashboard while I was sleeping. I own the code, the domain, everything. No agency could match this speed.",
    author: "Marcus Johnson",
    role: "Solo Founder",
  },
  {
    quote: "I went from idea to live product in 24 hours. The morning Telegram message is now my favorite notification.",
    author: "Elena Rodriguez",
    role: "Founder, TaskFlow",
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
              <a
                href="#what-you-get"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                What You Get
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
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2">
                <Shield className="h-4 w-4 text-neon-cyan" />
                <span className="text-sm text-zinc-300">No code required. No lock-in. No waiting.</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
            >
              You have the idea.
              <br />
              <span className="gradient-text">We build the software.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 mb-10"
            >
              Describe what you need tonight. Wake up to a live product tomorrow. 
              Your code. Your domain. Yours forever.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            >
              <a href="#waitlist">
                <Button size="lg" className="gap-2 neon-glow animate-glow-pulse">
                  <Rocket className="h-5 w-5" />
                  Describe your first product
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

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {[
                { value: '8 hrs', label: 'From Idea to Live' },
                { value: '100%', label: 'You Own Everything' },
                { value: '24/7', label: 'Fleet Working' },
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

      {/* How It Works - 3 Steps */}
      <section id="how-it-works" className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              No technical knowledge needed. Just describe what you want, and we handle the rest.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Describe your idea',
                description: 'Plain English. No technical specs. Like texting a friend what you want built.',
                step: '01',
              },
              {
                icon: Moon,
                title: 'The fleet builds overnight',
                description: 'Your AI team plans, designs, and builds while you sleep. Every night.',
                step: '02',
              },
              {
                icon: Rocket,
                title: 'Wake up to something live',
                description: 'Your product is deployed. Real URL. You own the code, the domain, the infrastructure.',
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

      {/* What You Get Section */}
      <section id="what-you-get" className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What you get
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Not prototypes. Real products you own completely.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatYouGet.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass glass-hover rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-neon-cyan" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiation Section */}
      <section className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              While you slept, Bolt made you a prototype.
              <br />
              <span className="gradient-text">Night Shift made you a product.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: 'Bolt / Lovable',
                cons: ['Builds prototypes', 'Owns your code', 'Real-time = you wait'],
              },
              {
                icon: Building2,
                title: 'Agencies',
                cons: ['Slow (weeks/months)', 'Expensive ($10K+)', 'You lose control'],
              },
              {
                icon: Moon,
                title: 'Night Shift',
                pros: ['Overnight delivery', 'You own everything', 'Keeps improving'],
                highlight: true,
              },
            ].map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 ${
                  col.highlight 
                    ? 'glass neon-border' 
                    : 'glass'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    col.highlight 
                      ? 'bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20' 
                      : 'bg-slate-800'
                  }`}>
                    <col.icon className={`h-5 w-5 ${col.highlight ? 'text-neon-cyan' : 'text-zinc-400'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold ${col.highlight ? 'text-white' : 'text-zinc-300'}`}>
                    {col.title}
                  </h3>
                </div>
                
                {'cons' in col && col.cons && (
                  <ul className="space-y-3">
                    {col.cons.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-zinc-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                
                {'pros' in col && col.pros && (
                  <ul className="space-y-3">
                    {col.pros.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-emerald-400">
                        <Check className="h-4 w-4" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
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
      <section id="pricing" className="relative py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-zinc-500 mb-4">
              Starting at <span className="text-zinc-300 font-medium">$49/mo</span> · No credit card required · Cancel anytime
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
                  47 founders ahead of you. Beta closes May 15.
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the waitlist. Your first product ships tonight.
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
                    <a href="#what-you-get" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      What You Get
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
