'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'none';
    once?: boolean;
}

export function FadeIn({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    once=true,
}: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (once) observer.unobserve(element);
            } else if (!once) {
                setIsVisible(false);
            }
        },
        { threshold: 0.1, rootMargin: '50px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [once]);

  const animationClass = {
    up: 'animate-fade-in-up',
    down: 'animate-fade-in-down',
    none: 'animate-fade-in',
  }[direction];

    return (
        <div
            ref={ref as never}
            className={cn(className, isVisible && animationClass)}
            style={{
                opacity: isVisible ? undefined : 0,
                animationDelay: isVisible ? `${delay}ms` : undefined,
            }}
            data-visible={isVisible}
        >
            <div className={isVisible ? animationClass : ''}>
                {children}
            </div>
        </div>
    );
}