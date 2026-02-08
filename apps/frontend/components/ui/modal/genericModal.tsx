'use client'

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
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
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) handleClose();
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
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
                isClosing ? animations.fadeOut : animations.fadeIn
            }`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div 
                className="absolute inset-0 bg-black/50" 
                onClick={handleClose} 
            />
            <div
                className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl ${
                isClosing ? animations.scaleOut : animations.scaleIn
            }`}>
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600 active:scale-95"
                    aria-label="Close"
                >
                    ✕
                </button>
                <h2 className="mb-6 text-xl font-semibold text-black">{title}</h2>
                {children}
            </div>
        </div>
    );

    if (typeof window === 'undefined') return null;
    return createPortal(modalContent, document.body);
}