'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navLinks } from '@/app/components/nav';
import type { UserRole } from '@/lib/types';

interface BottomNavProps {
    onMenuOpen: () => void;
    userRole: UserRole;
}

const navIcons: Record<string, React.ReactNode> = {
    '/marketplace': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    '/dashboard/sponsor': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    '/dashboard/publisher': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
    ),
};

export function BottomNav({ onMenuOpen, userRole }: BottomNavProps) {
    const pathname = usePathname();

    const visibleLinks = navLinks.filter(link => {
        if (!link.role) return true;
        return link.role === userRole;
    })

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-[--color-border] bg-[--color-background]/95 backdrop-blur-sm md:hidden safe-bottom"
            role="navigation"
            aria-label="Main navigation"
        >   
        <div className="flex h-16 items-center justify-around px-2">
            {visibleLinks.map(({ href, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/');
                
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors touch-target',
                            isActive 
                            ? 'text-[--color-primary]' 
                            : 'text-[--color-muted]'
                        )}
                    >
                        {isActive && (
                            <span className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[--color-primary]" />
                        )}
                        {navIcons[href]}
                        <span className="text-[10px] font-medium">{label}</span>
                    </Link>
                );
            })}
            
            <button
                type="button"
                onClick={onMenuOpen}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-[--color-muted] transition-colors touch-target"
                aria-label="Open menu"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-[10px] font-medium">More</span>
            </button>
        </div>
    </nav>
  );
}