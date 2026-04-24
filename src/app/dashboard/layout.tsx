'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { CommandPalette } from '@/components/ui/command-palette';
import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import {
  LayoutDashboard,
  GitBranch,
  Moon,
  Settings,
  Plus,
  Search,
  Bell,
  LogOut,
  CreditCard,
} from '@/components/icons';

// Check if Clerk is configured
const isClerkConfigured = typeof window !== 'undefined' && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('pk_test_dmFsaWQ');

const navigation = [
  { name: 'Requests', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Repositories', href: '/dashboard/repos', icon: GitBranch },
  { name: 'Active Shifts', href: '/dashboard/builds', icon: Moon },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const commands = [
    { id: 'new-request', name: 'New Request', action: () => window.location.href = '/dashboard/features/new' },
    { id: 'requests', name: 'Go to Requests', action: () => window.location.href = '/dashboard' },
    { id: 'repos', name: 'Go to Repositories', action: () => window.location.href = '/dashboard/repos' },
    { id: 'shifts', name: 'Go to Active Shifts', action: () => window.location.href = '/dashboard/builds' },
  ];

  return (
    <div className="min-h-screen bg-night-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-night-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/dashboard" className="flex items-center gap-2">
                <Logo size="sm" />
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                      pathname === item.href
                        ? 'bg-neon-purple/20 text-neon-cyan neon-glow-purple'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard/features/new">
                <button className="hidden sm:flex items-center gap-2 rounded-lg bg-neon-cyan/10 text-neon-cyan px-3 py-2 text-sm font-medium hover:bg-neon-cyan/20 transition-colors">
                  <Plus className="h-4 w-4" />
                  New Request
                </button>
              </Link>
              
              <button 
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline-flex h-5 items-center rounded bg-white/10 px-1.5 text-xs">
                  ⌘K
                </kbd>
              </button>

              <button className="relative rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
              </button>

              <DemoUserBadge />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-white/5 bg-night-800/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                  pathname === item.href
                    ? 'bg-neon-purple/20 text-neon-cyan'
                    : 'text-zinc-400 hover:bg-white/5'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Command Palette */}
      <CommandPalette 
        commands={commands} 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
      />
    </div>
  );
}

function DemoUserBadge() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push('/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 border border-white/10 hover:bg-white/10 transition-colors"
    >
      <LogOut className="h-4 w-4 text-zinc-400" />
      <span className="text-sm text-zinc-400 hidden sm:block">Log out</span>
    </button>
  );
}
