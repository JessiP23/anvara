'use client';

import React, { useState, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SwipeAction {
    icon: ReactNode;
    label: string;
    color: string;
    onClick: () => void;
}

interface SwipeableCardProps {
    children: ReactNode;
    leftAction?: SwipeAction;
    rightAction?: SwipeAction;
    className?: string;
    disabled?: boolean;
}

const SWIPE_THRESHOLD = 60;
const LOCK_POSITION = 90;

export function SwipeableCard({ 
    children, 
    leftAction,
    rightAction,
    className,
    disabled = false
}: SwipeableCardProps) {
    const [swipeX, setSwipeX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const isHorizontalSwipe = useRef<boolean | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (disabled) return;
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
        isHorizontalSwipe.current = null;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping || disabled) return;
        const diffX = e.touches[0].clientX - startX.current;
        const diffY = e.touches[0].clientY - startY.current;

        if (isHorizontalSwipe.current === null) {
            if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
                isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
            }
        }
        if (isHorizontalSwipe.current !== true) return;
        e.preventDefault();

        const minX = rightAction ? -LOCK_POSITION : 0;
        const maxX = leftAction ? LOCK_POSITION : 0;
        
        setSwipeX(Math.max(minX, Math.min(maxX, diffX)));
    };

    const handleTouchEnd = () => {
        if (!isSwiping || disabled) return;
        setIsSwiping(false);

        // Lock open if past threshold, otherwise reset
        if (swipeX < -SWIPE_THRESHOLD && rightAction) {
            setSwipeX(-LOCK_POSITION);
        } else if (swipeX > SWIPE_THRESHOLD && leftAction) {
            setSwipeX(LOCK_POSITION);
        } else {
            setSwipeX(0);
        }
    };

    const handleActionClick = (action: SwipeAction) => {
        setSwipeX(0);
        action.onClick();
    };

    const resetPosition = () => {
        if (swipeX !== 0) {
            setSwipeX(0);
        }
    };

    return (
        <div className={cn('relative overflow-hidden rounded-xl', className)}>
            {leftAction && (
                <button
                    type="button"
                    onClick={() => handleActionClick(leftAction)}
                    className={cn('absolute inset-y-0 left-0 flex w-20 items-center justify-center rounded-l-xl transition-opacity', leftAction.color, swipeX > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none')}
                    aria-label={leftAction.label}
                >
                    {leftAction.icon}
                </button>
            )}

            {rightAction && (
                <button
                    type="button"
                    onClick={() => handleActionClick(rightAction)}
                    className={cn('absolute inset-y-0 right-0 flex w-20 items-center justify-center rounded-r-xl transition-opacity', rightAction.color, swipeX < 0 ? 'opacity-100' : 'opacity-0 pointer-events-none')}
                    aria-label={rightAction.label}
                >
                    {rightAction.icon}
                </button>
            )}

            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onClick={swipeX !== 0 ? resetPosition : undefined}
                style={{ 
                    transform: `translateX(${swipeX}px)`,
                    transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
                    touchAction: 'pan-y'
                }}
                className="relative"
            >
                {children}
            </div>
        </div>
    );
}