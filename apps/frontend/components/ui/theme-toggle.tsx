'use client';

import { useEffect, useState } from 'react';
import type { Theme } from '@/lib/theme';
import { getSystemTheme } from '@/lib/theme';

export function ThemeToggle({ className = '' }: { className?: string }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('theme') as Theme | null;
        const initial = stored || getSystemTheme();
        setTheme(initial);
    }, []);

    const toggle = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        localStorage.setItem('theme', next);
        document.cookie = `theme=${next};path=/;max-age=31536000`;
    };

    if (!mounted) {
        return <div className={`h-9 w-9 ${className}`} />;
    }

    return (
        <button
            type="button"
            onClick={toggle}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-[--color-border] bg-[--color-card] text-[--color-foreground] transition-colors hover:bg-[--color-card-hover] ${className}`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </button>
    );
}