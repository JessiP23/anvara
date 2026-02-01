'use client'

import { useEffect } from "react"
import { QuoteForm } from "./quote-form"

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    adSlotId: string;
    adSlotName: string;
    basePrice?: number;
    perfillEmail?: string;
}

export function QuoteModal({ isOpen, onClose, adSlotId, adSlotName, basePrice, perfillEmail }: QuoteModalProps) {
    useEffect(() => {
        const handleScape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleScape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleScape);
            document.body.style.overflow = '';
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-black">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600" aria-label="Close">✕</button>
                <h2 className="mb-4 text-xl font-semibold">Request a Quote</h2>
                <QuoteForm
                    adSlotId={adSlotId}
                    adSlotName={adSlotName}
                    basePrice={basePrice}
                    perfillEmail={perfillEmail}
                    onSuccess={onClose}
                    onCancel={onClose}
                />
            </div>
        </div>
  );
}