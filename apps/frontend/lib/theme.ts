export const THEME_COOKIE = 'theme';
export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

export function getSystemTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}