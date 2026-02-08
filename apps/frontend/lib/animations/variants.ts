export const animations = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  fadeInUp: 'animate-fade-in-up',
  fadeOutDown: 'animate-fade-out-down',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  slideInRight: 'animate-slide-in-right',
  slideOutRight: 'animate-slide-out-right',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  shake: 'animate-shake',
} as const;

export type AnimationName = keyof typeof animations;