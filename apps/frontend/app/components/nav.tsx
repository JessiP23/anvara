'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authClient } from '@/auth-client';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/dashboard/sponsor', label: 'Campaigns', role: 'sponsor' },
  { href: '/dashboard/publisher', label: 'Ad Slots', role: 'publisher' },
] as const;

export function Nav() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        }
      }
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[--color-border] bg-[--color-background]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[--color-background]/80">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-[--color-foreground]">
            Anvara
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === href
                    ? 'text-[--color-primary]'
                    : 'text-[--color-muted] hover:text-[--color-foreground]'
                )}
              >
                {label}
              </Link>
            ))}
            
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

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[--color-foreground] transition-colors hover:bg-[--color-border] md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </header>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-[var(--color-background)] md:hidden animate-fade-in">
          <div className="flex flex-col p-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex h-12 items-center rounded-lg px-4 text-base font-medium transition-colors',
                  pathname === href
                    ? 'bg-[--color-primary]/10 text-[--color-primary]'
                    : 'text-[--color-foreground] hover:bg-[--color-border]'
                )}
              >
                {label}
              </Link>
            ))}
            
            <div className="my-4 border-t border-[--color-border]" />
            
            {session?.user ? (
              <button
                onClick={handleSignOut}
                className="flex h-12 items-center rounded-lg px-4 text-base font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="flex h-12 items-center justify-center rounded-lg bg-[--color-primary] text-base font-medium text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}