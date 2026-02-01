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
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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