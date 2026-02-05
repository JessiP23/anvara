import { breakpoints } from './breakpoint';

export const responsive = {
  grid: {
    cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    cols2: 'grid-cols-1 sm:grid-cols-2',
  },
  
  text: {
    heading: 'text-xl md:text-2xl',
    subheading: 'text-base md:text-lg',
    body: 'text-sm md:text-base',
    small: 'text-xs md:text-sm',
  },
  
  spacing: {
    card: 'p-4 md:p-6',
    section: 'space-y-4 md:space-y-6',
    gap: 'gap-4 md:gap-6',
  },
  
  button: {
    full: 'w-full sm:w-auto',
    touch: 'min-h-[44px] py-3 sm:py-2',
  },
  
  layout: {
    stack: 'flex flex-col sm:flex-row',
    sidebar: 'flex flex-col lg:flex-row lg:gap-8',
  },
} as const;

export const TOUCH_MIN = 44;