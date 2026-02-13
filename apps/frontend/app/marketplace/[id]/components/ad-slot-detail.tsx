'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookAdSlot, unbookAdSlot } from '@/lib/api';
import { authClient } from '@/auth-client';
import { queryKeys } from '@/lib/query-keys';
import { QuoteButton } from '@/components/quote/quote-button';
import { useToast } from '@/components/notification/toast';
import { Badge, TypeBadge } from '@/components/ui/badge';
import type { AdSlot } from '@/lib/types';

interface Props {
  adSlot: AdSlot;
}

export function AdSlotDetail({ adSlot: initialAdSlot }: Props) {
  const [adSlot, setAdSlot] = useState<AdSlot>(initialAdSlot);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const { show } = useToast();
  const queryClient = useQueryClient();

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const user = session?.user;
  const isSponsor = !!user;

  const bookMutation = useMutation({
    mutationFn: (msg?: string) => bookAdSlot(adSlot.id, msg),
    onSuccess: () => {
      setAdSlot((prev) => ({ ...prev, isAvailable: false }));
      queryClient.invalidateQueries({ queryKey: queryKeys.adSlots.all });
      show('Placement booked!', 'success');
      setMessage('');
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
    },
  });

  const canBook = adSlot.isAvailable && !bookMutation.isSuccess;

  return (
    <div className="space-y-6">
      <Link 
        href="/marketplace" 
        className="inline-flex items-center gap-1 text-sm text-[--color-muted] transition-colors hover:text-[--color-primary]"
      >
        <span>←</span> Back to Marketplace
      </Link>

      <div className="overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-card]">
        {/* Hero Header with Gradient */}
        <div className="relative bg-gradient-to-br from-[--color-primary]/10 via-transparent to-transparent p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[--color-foreground]">
                {adSlot.name}
              </h1>
              {adSlot.publisher && (
                <p className="text-sm text-[--color-muted]">
                  by <span className="font-medium text-[--color-foreground]">{adSlot.publisher.name}</span>
                </p>
              )}
            </div>
            <TypeBadge type={adSlot.type} />
          </div>

          {adSlot.description && (
            <p className="mt-4 text-[--color-muted]">{adSlot.description}</p>
          )}
        </div>

        {/* Status Bar - Eye-catching */}
        <div className="flex items-center justify-between border-y border-[--color-border] bg-[--color-background] px-6 py-4">
          <div className="flex items-center gap-3">
            {adSlot.isAvailable ? (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                </span>
                <span className="font-semibold text-[--badge-success-text]">
                  Available Now
                </span>
              </div>
            ) : (
              <Badge variant="default" dot>
                Currently Booked
              </Badge>
            )}
            
            {!adSlot.isAvailable && (
              <button
                onClick={() => unbookMutation.mutate()}
                disabled={unbookMutation.isPending}
                className="text-xs text-[--color-primary] underline hover:opacity-80 disabled:opacity-50"
              >
                {unbookMutation.isPending ? 'Resetting...' : 'Reset'}
              </button>
            )}
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-[--color-foreground]">
              ${Number(adSlot.basePrice).toLocaleString()}
            </p>
            <p className="text-xs text-[--color-muted]">per month</p>
          </div>
        </div>

        {/* Booking Section */}
        {canBook && (
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-[--color-foreground]">
              Request This Placement
            </h2>

            {/* Wait for client mount to avoid hydration mismatch */}
            {!mounted || isPending ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[--color-primary] border-t-transparent" />
              </div>
            ) : isSponsor ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-[--color-background] p-4">
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[--color-muted]">
                    Your Account
                  </label>
                  <p className="font-medium text-[--color-foreground]">
                    {user?.name || user?.email}
                  </p>
                </div>

                <div>
                  <label 
                    htmlFor="message" 
                    className="mb-2 block text-sm font-medium text-[--color-foreground]"
                  >
                    Message to Publisher
                    <span className="ml-1 text-[--color-muted]">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the publisher about your campaign goals..."
                    className="w-full resize-none rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-3 text-[--color-foreground] placeholder:text-[--color-muted] transition-colors focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
                    rows={3}
                  />
                </div>

                {bookMutation.isError && (
                  <div className="rounded-lg bg-[--badge-error-bg] p-3 text-sm text-[--badge-error-text]">
                    {bookMutation.error?.message || 'Failed to book placement'}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => bookMutation.mutate(message || undefined)}
                    disabled={bookMutation.isPending}
                    className="btn-primary flex-1"
                  >
                    {bookMutation.isPending ? 'Booking...' : 'Book This Placement'}
                  </button>

                  <QuoteButton
                    adSlotId={adSlot.id}
                    adSlotName={adSlot.name}
                    basePrice={adSlot.basePrice}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[--color-border] bg-[--color-background] p-6 text-center">
                <p className="mb-4 text-[--color-muted]">
                  Sign in as a sponsor to request this placement
                </p>
                <Link href="/login" className="btn-primary inline-block">
                  Sign In to Continue
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Success State */}
        {bookMutation.isSuccess && (
          <div className="border-t border-[--badge-success-bg] bg-[--badge-success-bg]/50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[--badge-success-bg]">
                <svg className="h-5 w-5 text-[--badge-success-text]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[--badge-success-text]">
                  Placement Booked!
                </h3>
                <p className="mt-1 text-sm text-[--badge-success-text]/80">
                  Your request has been submitted to the publisher.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}