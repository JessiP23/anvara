export const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
}

export type Breakpoint = keyof typeof breakpoints;

export const isMobile = (w: number) => w < breakpoints.md;
export const isTablet = (w: number) => w >= breakpoints.md && w < breakpoints.lg;
export const isDesktop = (w: number) => w >= breakpoints.lg;