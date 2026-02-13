'use client';

import Link from 'next/link';
import type { AdSlot } from '@/lib/types';
import { Badge, TypeBadge } from '@/components/ui/badge';

interface MarketplaceCardProps {
  slot: AdSlot;
}

export function MarketplaceCard({ slot }: MarketplaceCardProps) {
  const formatDimensions = () => {
    if (slot.width && slot.height) {
      return `${slot.width} × ${slot.height}`;
    }
    return null;
  };

  return (
    <Link
      href={`/marketplace/${slot.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-card] transition-all duration-300 hover:border-[--color-primary]/40 hover:shadow-lg hover:shadow-[--color-primary]/5"
    >
      <div
        className={`h-1.5 w-full ${
          slot.type === 'VIDEO' ? 'bg-gradient-to-r from-red-400 to-red-500' :
          slot.type === 'PODCAST' ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
          slot.type === 'NEWSLETTER' ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
          'bg-gradient-to-r from-blue-400 to-blue-500'
        }`}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-[--color-foreground] transition-colors group-hover:text-[--color-primary]">
              {slot.name}
            </h3>
            {slot.publisher && (
              <p className="mt-0.5 text-sm text-[--color-muted]">
                {slot.publisher.name}
              </p>
            )}
          </div>
          <TypeBadge type={slot.type} />
        </div>

        {slot.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[--color-foreground]/80">
            {slot.description}
          </p>
        )}

        <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-[--color-background] p-3">
          {formatDimensions() && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[--color-muted]">Size</p>
              <p className="mt-0.5 text-sm font-medium text-[--color-foreground]">{formatDimensions()}</p>
            </div>
          )}
          {slot.position && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[--color-muted]">Position</p>
              <p className="mt-0.5 text-sm font-medium text-[--color-foreground]">{slot.position}</p>
            </div>
          )}
          {!formatDimensions() && !slot.position && (
            <div className="col-span-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[--color-muted]">Type</p>
              <p className="mt-0.5 text-sm font-medium text-[--color-foreground]">{slot.type}</p>
            </div>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-end justify-between border-t border-[--color-border] pt-4">
          <Badge variant={slot.isAvailable ? 'success': 'default'} dot>
            <span className={`h-1.5 w-1.5 rounded-full ${slot.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
            {slot.isAvailable ? 'Available' : 'Booked'}
          </Badge>
          <div className='text-right'>
            <p className='text-2xl font-bold text-[--color-foreground]'>
              ${Number(slot.basePrice).toLocaleString()}
            </p>
            <p className='text-xs text-[--color-muted]'>per month</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-[--color-primary]/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
}