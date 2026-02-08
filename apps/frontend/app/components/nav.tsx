'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authClient } from '@/auth-client';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getUserRole } from '@/lib/auth-helpers';

type NavRole = 'sponsor' | 'publisher' | null;

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [role, setRole] = useState<NavRole>(null);
  const pathname = usePathname();

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
  const isActive = (path: string) => pathname === path;
  const linkClass = (path:string) => cn('transition-colors', isActive(path) ? 'text-[--color-foreground] font-medium' : 'text-[--color-muted] hover:text-[--color-foreground]');

  return (
    <header className="border-b border-[--color-border] bg-[--color-background]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-[--color-primary]">
          Anvara
        </Link>

        <div className="flex items-center gap-6">
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-[--color-muted]">
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
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-primary"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
