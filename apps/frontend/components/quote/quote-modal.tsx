'use client'

import { QuoteForm } from "./quote-form"
import { Modal } from "../ui/modal/genericModal";

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    adSlotId: string;
    adSlotName: string;
    basePrice?: number;
    perfillEmail?: string;
}

export function QuoteModal({ isOpen, onClose, adSlotId, adSlotName, basePrice, perfillEmail }: QuoteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request a Quote">
            <QuoteForm 
                adSlotId={adSlotId} 
                adSlotName={adSlotName} 
                basePrice={basePrice} 
                perfillEmail={perfillEmail}
                onSuccess={onClose}
                onCancel={onClose}
            />
        </Modal>
  );
}