'use client';

import { StatsRow } from '@/components/ui/stat-card';

interface SponsorStatsProps {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudget: number;
  totalSpent: number;
}

export function SponsorStats({ totalCampaigns, activeCampaigns, totalBudget, totalSpent }: SponsorStatsProps) {
  const spendRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const stats = [
    {
      label: 'Total Campaigns',
      value: totalCampaigns,
      description: 'All time',
    },
    {
      label: 'Active',
      value: activeCampaigns,
      change: { value: 12, trend: 'up' as const },
      accent: true,
    },
    {
      label: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      description: 'Allocated spend',
    },
    {
      label: 'Total Spent',
      value: `$${totalSpent.toLocaleString()}`,
      description: `${spendRate}% of budget`,
    },
  ];

  return <StatsRow stats={stats} />;
}

interface PublisherStatsProps {
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  totalRevenue: number;
}

export function PublisherStats({ totalSlots, availableSlots, bookedSlots, totalRevenue }: PublisherStatsProps) {
  const bookingRate = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;
  const stats = [
    {
      label: 'Total Ad Slots',
      value: totalSlots,
      description: 'In your inventory',
    },
    {
      label: 'Available',
      value: availableSlots,
      description: 'Ready for booking',
      accent: true,
    },
    {
      label: 'Booked',
      value: bookedSlots,
      change: { value: 8, trend: 'up' as const },
      description: `${bookingRate}% booking rate`,
    },
    {
      label: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      description: 'From booked slots',
    },
  ];

  return <StatsRow stats={stats} />;
}