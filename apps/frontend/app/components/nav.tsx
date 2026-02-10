'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/auth-client';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getUserRole } from '@/lib/auth-helpers';
import type { UserRole } from '@/lib/types';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const navLinks = [
  { href: '/marketplace', label: 'Marketplace', role: undefined },
  { href: '/dashboard/sponsor', label: 'Campaigns', role: 'sponsor' },
  { href: '/dashboard/publisher', label: 'Ad Slots', role: 'publisher' },
] as const;

export function Nav() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    async function fetchRole() {
      if (session?.user?.id) {
        const roleInfo = await getUserRole(session.user.id);
        setUserRole(roleInfo.role);
      } else {
        setUserRole(null);
      }
    }
    fetchRole();
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        }
      }
    });
  };

  const visibleLinks = navLinks.filter(link => {
    if (!link.role) return true;
    return link.role === userRole;
  })

  return (
    <header className="sticky top-0 z-40 border-b border-[--color-border] bg-[--color-background]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[--color-background]/80 hidden md:block">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-[--color-foreground]">
          Anvara
        </Link>

        <div className="flex items-center gap-6">
          {visibleLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn('text-sm font-medium transition-colors', pathname === href ? 'text-[--color-primary]' : 'text-[--color-muted] hover:text-[--color-foreground]')}
            >
              {label}
            </Link>
          ))}

          <ThemeToggle />
          
          {session?.user ? (
            <button onClick={handleSignOut} className="btn-secondary text-sm">
              Sign Out
            </button>
          ) : (
            <Link href="/login" className="btn-primary text-sm">
              Sign In
            </Link>
          )}
          </div>
      </nav>
    </header>
  );
}