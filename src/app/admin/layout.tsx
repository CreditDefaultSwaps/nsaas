'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { supabaseClient } from '@/lib/supabase-client';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Settings,
  LogOut,
  Shield,
  Users,
  GitBranch
} from '@/components/icons';

const ADMIN_EMAIL = 'randomdev296@gmail.com';

const navigation = [
  { name: 'Requests', href: '/admin/requests', icon: LayoutDashboard },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push('/login');
        return;
      }
      
      setIsAdmin(true);
    } catch (error) {
      console.error('Admin auth error:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-neon-cyan" />
          <span className="text-sm font-mono">Verifying access...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-night-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-night-900/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link href="/admin/requests" className="flex items-center gap-2">
                <Logo size="sm" />
                <span className="flex items-center gap-1.5 text-xs font-medium text-neon-purple uppercase tracking-wider">
                  <Shield className="h-3 w-3" />
                  Admin
                </span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200',
                      pathname === item.href || pathname?.startsWith(item.href + '/')
                        ? 'bg-neon-purple/20 text-neon-cyan'
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
              <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                {ADMIN_EMAIL}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
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
                  pathname === item.href || pathname?.startsWith(item.href + '/')
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
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
