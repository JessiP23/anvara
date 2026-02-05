'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authClient } from '@/auth-client';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getUserRole } from '@/lib/auth-helpers';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { responsive } from '@/lib/responsive';

type NavRole = 'sponsor' | 'publisher' | null;

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [role, setRole] = useState<NavRole>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const {isMobile} = useBreakpoint();

  // TODO: Convert to server component and fetch role server-side
  // Fetch user role from backend when user is logged in
  useEffect(() => {
    if (!user?.id) return;
    getUserRole(user.id)
      .then((data) => setRole(data.role))
      .catch(() => setRole(null));
  }, [user?.id]);

  // TODO: Add active link styling using usePathname() from next/navigation
  // The current page's link should be highlighted differently
  useEffect(() => setMenuOpen(false), [pathname]);
  const linkClass = (path: string) => cn(
    'block py-3 md:py-0 transition-colors min-h-[44px] flex items-center',
    pathname === path ? 'text-[--color-foreground] font-medium' : 'text-[--color-muted] hover:text-[--color-foreground]'
  );  return (
    <header className="border-b border-[--color-border]">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 p-4">
        <Link href="/" className="text-xl font-bold text-[--color-primary]">
          Anvara
        </Link>

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            aria-label='Toggle Menu'
          >
            <span className={cn('h-0.5 w-5 bg-current transition-all', menuOpen && 'translate-y-2 rotate-45')} />
            <span className={cn('h-0.5 w-5 bg-current transition-opacity', menuOpen && 'opacity-0')} />
            <span className={cn('h-0.5 w-5 bg-current transition-all', menuOpen && '-translate-y-2 -rotate-45')} />
          </button>
        )}

        <div className={cn('w-full flex-col gap-2 md:flex md:w-auto md:flex-row md:items-center md:gap-6', isMobile ? (menuOpen ? 'flex' : 'hidden') : 'flex')}>
          <Link
            href="/marketplace"
            className={linkClass('/marketplace')}
          >
            Marketplace
          </Link>

          {user && role === 'sponsor' && (
            <Link
              href="/dashboard/sponsor"
              className={linkClass('/dashboard/sponsor')}
            >
              My Campaigns
            </Link>
          )}
          {user && role === 'publisher' && (
            <Link
              href="/dashboard/publisher"
              className={linkClass('/dashboard/publisher')}
            >
              My Ad Slots
            </Link>
          )}

          {isPending ? (
            <span className="text-[--color-muted]">...</span>
          ) : user ? (
            <div className={cn('flex gap-4', isMobile ? 'flex-col border-t border-[--color-border] pt-3' : 'items-center')}>
              <span className={cn('text-[--color-muted]', responsive.text.small)}>
                {user.name} {role && `(${role})`}
              </span>
              <button
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = '/';
                      },
                    },
                  });
                }}
                className={cn('rounded bg-gray-600 px-3 text-white hover:bg-gray-500', responsive.button.touch, responsive.text.small)}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={cn('rounded bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]', isMobile && 'text-center')}            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
