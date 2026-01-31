// Core types matching the Prisma schema

export type UserRole = 'sponsor' | 'publisher';

export interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  publisher?: {
    id: string;
    name: string;
    website?: string;
  }
}

export interface RoleInfo {
  role: 'sponsor' | 'publisher' | null;
  sponsorId?: string;
  publisherId?: string;
  name?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startDate: string;
  endDate: string;
  sponsorId: string;
  sponsor?: { id: string; name: string };
}

export interface Placement {
  id: string;
  impressions: number;
  clicks: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  campaignId: string;
  adSlotId: string;
}
