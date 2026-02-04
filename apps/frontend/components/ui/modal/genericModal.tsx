'use client'
import React from "react"
import { useEffect } from "react"
import { useBreakpoint } from "@/hooks/use-breakpoint"
import { cn } from "@/lib/utils"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const {isMobile} = useBreakpoint();
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={cn('fixed inset-0 z-50 flex justify-center', isMobile ? 'items-end' : 'items-center')}>
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className={cn('relative z-10 max-h-[90vh] w-full overflow-y-auto bg-white p-4 shadow-xl', isMobile ? 'rounded-t-2xl' : 'max-w-lg rounded-2xl p-6')}>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl')}>{title}</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                        aria-label="Close"
                    >
                    ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}