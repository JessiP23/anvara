'use client';

import { useState, useEffect, useRef } from 'react';

interface UseExitAnimationOptions {
    isOpen: boolean;
    duration?: number;
}

export function useExitAnimation({ isOpen, duration = 500 }: UseExitAnimationOptions) {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isExiting, setIsExiting] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (isOpen) {
            setShouldRender(true);
            setIsExiting(false);
        } else if (shouldRender && !isExiting) {
            setIsExiting(true);
            timeoutRef.current = setTimeout(() => {
                setShouldRender(false);
                setIsExiting(false);
            }, duration);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [isOpen]);

    return { shouldRender, isExiting };
}