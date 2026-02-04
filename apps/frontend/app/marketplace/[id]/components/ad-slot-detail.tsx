'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdSlot, bookAdSlot, unbookAdSlot } from '@/lib/api';
import { getUserRole } from '@/lib/auth-helpers';
import { authClient } from '@/auth-client';
import type { AdSlot, User, RoleInfo } from '@/lib/types';
import { QuoteButton } from '@/components/quote/quote-button';
import { LoadingState } from '@/components/state/loading';
import { ErrorState } from '@/components/state/error';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { cn } from '@/lib/utils';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

interface Props {
  id: string;
}

export function AdSlotDetail({ id }: Props) {
  const [adSlot, setAdSlot] = useState<AdSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    // Fetch ad slot
    getAdSlot<AdSlot>(id)
      .then(setAdSlot)
      .catch(() => setError('Failed to load ad slot details'))
      .finally(() => setLoading(false));

    // Check user session and fetch role
    authClient
      .getSession()
      .then(async ({ data }) => {
        if (data?.user) {
          const sessionUser = data.user as User;
          setUser(sessionUser);

          // Fetch role info from backend
          const role = await getUserRole(sessionUser.id);
          setRoleInfo(role);
        }
      })
      .catch(() => setRoleInfo(null))
      .finally(() => setRoleLoading(false));
  }, [id]);

  const handleBooking = async () => {
    if (!roleInfo?.sponsorId || !adSlot) return;

    setBooking(true);
    setBookingError(null);

    try {
      await bookAdSlot(adSlot.id, message || undefined);
      setBookingSuccess(true);
      setAdSlot({ ...adSlot, isAvailable: false });
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to book placement');
    } finally {
      setBooking(false);
    }
  };

  const handleUnbook = async () => {
    if (!adSlot) return;

    try {
      await unbookAdSlot(adSlot.id);
      setBookingSuccess(false);
      setAdSlot({ ...adSlot, isAvailable: true });
      setMessage('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to unbook:', err);
    }
  };

  if (loading) {
    return <LoadingState message='Loading ad slot details...' />
  }

  if (error || !adSlot) {
    return (
      <div className="space-y-4">
        <Link href="/marketplace" className="text-[--color-primary] hover:underline">
          ← Back to Marketplace
        </Link>
        <ErrorState 
          title="Ad Slot Not Found"
          message={error || "The ad slot you are looking for does not exist."}
        />
      </div>
    );
  }

  const isSponsor = roleInfo?.role === 'sponsor' && roleInfo?.sponsorId;
  const canBook = adSlot.isAvailable && !bookingSuccess;

  return (
    <div className="space-y-6">
      <Link href="/marketplace" className={cn('inline-block text-[--color-primary] hover:underline', isMobile ? 'text-sm' : 'text-base')}>
        ← Back to Marketplace
      </Link>

      <div className={cn('rounded-lg border border-[--color-border]', isMobile ? 'p-4' : 'p-6')}>
        <div className={cn('mb-4 gap-2', isMobile ? 'flex flex-col' : 'flex items-start justify-between')}>
          <div>
            <h1 className={cn('font-bold', isMobile ? 'text-xl' : 'text-2xl')}>{adSlot.name}</h1>
            {adSlot.publisher && (
              <p className={cn('text-[--color-muted]', isMobile ? 'text-sm' : 'text-base')}>
                by {adSlot.publisher.name}
                {adSlot.publisher.website && (
                  <>
                    {' '}
                    ·{' '}
                    <a
                      href={adSlot.publisher.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[--color-primary] hover:underline"
                    >
                      {adSlot.publisher.website}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
          <span className={`self-start rounded px-3 py-1 text-sm ${typeColors[adSlot.type] || 'bg-gray-100'}`}>
            {adSlot.type}
          </span>
        </div>

        {adSlot.description && <p className={cn('mb-6 text-[--color-muted]', isMobile ? 'text-sm' : 'text-base')}>{adSlot.description}</p>}

        <div className={cn('border-t border-[--color-border] pt-4', isMobile ? 'flex flex-col gap-4' : 'flex items-center justify-between')}>
          <div>
            <span
              className={`text-sm font-medium ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
            >
              {adSlot.isAvailable ? '● Available' : '○ Currently Booked'}
            </span>
            {!adSlot.isAvailable && !bookingSuccess && (
              <button
                onClick={handleUnbook}
                className="ml-3 text-sm text-[--color-primary] underline"
              >
                Reset listing
              </button>
            )}
          </div>
          <div className={cn(isMobile ? 'text-left' : 'text-right')}>
            <p className={cn('font-bold text-[--color-primary]', isMobile ? 'text-xl' : 'text-2xl')}>              
              ${Number(adSlot.basePrice).toLocaleString()}
            </p>
            <p className={cn('text-[--color-muted]', isMobile ? 'text-xs' : 'text-sm')}>per month</p>
          </div>
        </div>

        {canBook && (
          <div className="mt-6 border-t border-[--color-border] pt-6">
            <h2 className={cn('mb-4 font-semibold', isMobile ? 'text-base' : 'text-lg')}>Request This Placement</h2>

            {roleLoading ? (
              <LoadingState message='Loading...' />
            ) : isSponsor ? (
              <div className="space-y-4">
                <div>
                  <label className={cn('mb-1 block font-medium text-[--color-muted]', isMobile ? 'text-xs' : 'text-sm')}>
                    Your Company
                  </label>
                  <p className="text-[--color-foreground]">{roleInfo.name || user?.name}</p>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className={cn('mb-1 block font-medium text-[--color-muted]', isMobile ? 'text-xs' : 'text-sm')}
                  >
                    Message to Publisher (optional)
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the publisher about your campaign goals..."
                    className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-3 text-sm text-[--color-foreground] placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none"
                    rows={3}
                  />
                </div>
                {bookingError && <p className="text-sm text-red-600">{bookingError}</p>}
                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className={cn('rounded-lg bg-[--color-primary] px-4 py-3 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50', isMobile ? 'w-full' : '')}
                >
                  {booking ? 'Booking...' : 'Book This Placement'}
                </button>
                <QuoteButton 
                  adSlotId={adSlot.id}
                  adSlotName={adSlot.name}
                  basePrice={adSlot.basePrice}
                />
              </div>
            ) : (
              <div>
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-3 font-semibold text-gray-500"
                >
                  Request This Placement
                </button>
                <p className="mt-2 text-center text-sm text-[--color-muted]">
                  {user
                    ? 'Only sponsors can request placements'
                    : 'Log in as a sponsor to request this placement'}
                </p>
              </div>
            )}
          </div>
        )}

        {bookingSuccess && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-green-800">Placement Booked!</h3>
            <p className="mt-1 text-sm text-green-700">
              Your request has been submitted. The publisher will be in touch soon.
            </p>
            <button
              onClick={handleUnbook}
              className="mt-3 text-sm text-green-700 underline hover:text-green-800"
            >
              Remove Booking (reset for testing)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
