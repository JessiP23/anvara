export const animations = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  slideInRight: 'animate-slide-in-right',
  slideOutRight: 'animate-slide-out-right',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  fadeOutDown: 'animate-fade-out-down',
  shake: 'animate-shake',
} as const;

export type AnimationName = keyof typeof animations;