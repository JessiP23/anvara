'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { Theme } from '@/lib/theme';
import { getSystemTheme } from '@/lib/theme';

function getThemeSnapshot(): Theme {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('theme') as Theme) || getSystemTheme();
}

function getServerSnapshot(): Theme {
    return 'light';
}

function subscribeToTheme(callback: () => void): () => void {
    const handler = () => {
        const currentTheme = localStorage.getItem('theme') as Theme || getSystemTheme();
        document.documentElement.classList.toggle('dark', currentTheme === 'dark');
        callback();
    }
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
}

export function ThemeToggle({ className = '' }: { className?: string }) {
    const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot);

    const toggle = useCallback(() => {
        const next = theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', next === 'dark');
        localStorage.setItem('theme', next);
        document.cookie = `theme=${next};path=/;max-age=31536000`;
        window.dispatchEvent(new Event('storage'));
    }, [theme]);

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