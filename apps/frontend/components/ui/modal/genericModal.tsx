'use client'

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { animations } from "@/lib/animations/variants"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
            document.body.style.overflow = 'hidden';
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen && shouldRender && !isClosing) {
            setIsClosing(true);
        }
    }, [isOpen, shouldRender, isClosing]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isClosing) handleClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, isClosing]);

    const handleClose = () => {
        if (isClosing) return;
        setIsClosing(true);
    };

    const handleAnimationEnd = () => {
        if (isClosing) {
            setShouldRender(false);
            setIsClosing(false);
            document.body.style.overflow = '';
            onClose();
        }
    };

    if (!shouldRender) return null;

    const modalContent = (
        <div 
            className={cn(
                'fixed inset-0 z-50',
                'flex items-end sm:items-center justify-center',
                isClosing ? animations.fadeOut : animations.fadeIn
            )}
            onAnimationEnd={handleAnimationEnd}
        >
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50" 
                onClick={handleClose} 
            />
            
            {/* Modal - slides up on mobile, scales on desktop */}
            <div 
                className={cn(
                    'relative w-full bg-white shadow-xl flex flex-col',
                    // Mobile: max height with flex layout
                    'max-h-[90vh]',
                    // Mobile: slide up, rounded top
                    'rounded-t-2xl',
                    // Desktop: constrained, fully rounded
                    'sm:max-w-lg sm:rounded-xl sm:m-4 sm:max-h-[85vh]',
                    // Animation
                    isClosing  ? 'animate-slide-out-bottom sm:animate-scale-out'  : 'animate-slide-in-bottom sm:animate-scale-in'
                )}
            >
                {/* Drag indicator - mobile only */}
                <div className="flex-shrink-0 flex justify-center pt-3 sm:hidden">
                    <div className="h-1 w-10 rounded-full bg-gray-300" />
                </div>
                
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-white rounded-t-2xl sm:rounded-t-xl">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:scale-95"
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Content - scrollable */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 sm:px-6">
                    {children}
                </div>
            </div>
        </div>
    );

    if (typeof window === 'undefined') return null;
    return createPortal(modalContent, document.body);
}