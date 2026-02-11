'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookAdSlot, unbookAdSlot } from '@/lib/api';
import { authClient } from '@/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { QuoteButton } from '@/components/quote/quote-button';
import { useToast } from '@/components/notification/toast';
import type { AdSlot } from '@/lib/types';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

interface Props {
  // update, no required fetched, is already passed from the server
  adSlot: AdSlot;
}

export function AdSlotDetail({ adSlot: initialAdSlot }: Props) {
  const [adSlot, setAdSlot] = useState<AdSlot>(initialAdSlot);
  const { data: session } = authClient.useSession();
  const { show } = useToast();
  const queryClient = useQueryClient();

  // update - moving to react query, booking mutation
  const bookMutation = useMutation({
    mutationFn: (message?: string) => bookAdSlot(adSlot.id, message),
    onSuccess: () => {
      setAdSlot((prev) => ({ ...prev, isAvailable: false }));
      queryClient.invalidateQueries({ queryKey: queryKeys.adSlots.all });
      show('Placement booked!', 'success');
    },
    onError: (error) => {
      show(error.message || 'Failed to book', 'error');
    },
  });

  const unbookMutation = useMutation({
    mutationFn: () => unbookAdSlot(adSlot.id),
    onSuccess: () => {
      setAdSlot((prev) => ({ ...prev, isAvailable: true }));
      queryClient.invalidateQueries({ queryKey: queryKeys.adSlots.all });
      show('Booking removed', 'success');
    },
    onError: (error) => {
      show(error.message || 'Failed to unbook', 'error');
    }
  })

  const isSponsor = session?.user;
  const canBook = adSlot.isAvailable && !bookMutation.isSuccess;

  return (
    <div className="space-y-6">
      <Link href="/marketplace" className="text-[--color-primary] hover:underline">
        ← Back to Marketplace
      </Link>

      <div className="rounded-lg border border-[--color-border] bg-[--color-card] p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[--color-foreground]">{adSlot.name}</h1>
            {adSlot.publisher && (
              <p className="text-[--color-muted]">by {adSlot.publisher.name}</p>
            )}
          </div>
          <span className={`rounded px-3 py-1 text-sm ${typeColors[adSlot.type] || 'bg-gray-100'}`}>
            {adSlot.type}
          </span>
        </div>

        {adSlot.description && (
          <p className="mb-6 text-[--color-muted]">{adSlot.description}</p>
        )}
        <div className="flex items-center justify-between border-t border-[--color-border] pt-4">
          <div>
            <span
              className={`text-sm font-medium ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
            >
              {adSlot.isAvailable ? '● Available' : '○ Currently Booked'}
            </span>
            {!adSlot.isAvailable && (
              <button
                onClick={() => unbookMutation.mutate()}
                disabled={unbookMutation.isPending}
                className="ml-3 text-sm text-[--color-primary] underline hover:opacity-80 disabled:opacity-50"
              >
                {unbookMutation.isPending ? 'Resetting...' : 'Reset listing'}
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[--color-primary]">
              ${Number(adSlot.basePrice).toLocaleString()}
            </p>
            <p className="text-sm text-[--color-muted]">per month</p>
          </div>
        </div>

        {canBook && (
          <div className="mt-6 border-t border-[--color-border] pt-6">
            <h2 className="mb-4 text-lg font-semibold text-[--color-foreground]">
              Request This Placement
            </h2>
            {isSponsor ? (
              <QuoteButton
                adSlotId={adSlot.id}
                adSlotName={adSlot.name}
                basePrice={adSlot.basePrice}
              />
            ) : (
              <p className="text-[--color-muted]">
                <Link href="/login" className="text-[--color-primary] underline">
                  Sign in
                </Link>{' '}
                as a sponsor to book this placement.
              </p>
            )}
          </div>
        )}

        {bookMutation.isSuccess && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-green-800">Placement Booked!</h3>
            <p className="mt-1 text-sm text-green-700">
              Your request has been submitted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
