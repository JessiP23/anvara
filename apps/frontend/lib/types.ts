// Core types matching the Prisma schema

export type UserRole = 'sponsor' | 'publisher' | null;
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
export type PlacementStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED';
export type AdSlotType = 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | "PODCAST";

export const PAGINATION = { DEFAULT_LIMIT: 12 };

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Publisher {
  id: string;
  name: string;
  website?: string
}

export interface Sponsor {
  id: string;
  name: string;
}

export interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  width?: number;
  height?: number;
  position?: string;
  publisher?: Publisher;
}

export interface RoleInfo {
  role: 'sponsor' | 'publisher' | null;
  sponsorId?: string;
  publisherId?: string;
  name?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  sponsorId: string;
  sponsor?: Sponsor;
}

export interface Placement {
  id: string;
  impressions: number;
  clicks: number;
  status: PlacementStatus;
  campaignId: string;
  adSlotId: string;
}

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
}

export const initialActionState: ActionState = {};