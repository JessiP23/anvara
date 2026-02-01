'use client';

import { useState } from 'react';
import { QuoteModal } from './quote-modal';
import { authClient } from '@/auth-client';

interface QuoteButtonProps {
    adSlotId: string;
    adSlotName: string;
    basePrice?: number;
}

export function QuoteButton({ adSlotId, adSlotName, basePrice }: QuoteButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = authClient.useSession();

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg border-2 border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
            >
                Request Quote
            </button>
            <QuoteModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                adSlotId={adSlotId}
                adSlotName={adSlotName}
                basePrice={basePrice}
                perfillEmail={session?.user?.email}
            />
        </>
    );
}