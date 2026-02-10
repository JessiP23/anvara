'use client'

import React, { useEffect, useCallback } from "react"
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
    
    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) handleClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, handleClose]);

    if (!isOpen) return null;
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div 
            className={cn(
                'fixed inset-0 z-50',
                'flex items-end sm:items-center justify-center',
                animations.fadeIn
            )}
        >
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50" 
                onClick={handleClose} 
            />
            
            {/* Modal */}
            <div 
                className={cn(
                    'relative w-full shadow-xl flex flex-col',
                    'bg-(--color-card)',
                    'max-h-[90vh] rounded-t-2xl',
                    'sm:max-w-lg sm:rounded-xl sm:m-4 sm:max-h-[85vh]',
                    'animate-slide-in-bottom sm:animate-scale-in'
                )}
            >
                {/* Drag indicator - mobile only */}
                <div className="flex-shrink-0 flex justify-center pt-3 sm:hidden">
                    <div className="h-1 w-10 rounded-full bg-[--color-border]" />
                </div>
                
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[--color-border]">
                    <h2 className="text-lg font-semibold text-[--color-foreground]">{title}</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[--color-muted] transition-colors hover:bg-[--color-background] hover:text-[--color-foreground] active:scale-95"
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 sm:px-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}