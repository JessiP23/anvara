import { cookies } from "next/headers";
import type { Campaign, AdSlot, PaginatedResponse } from "../types";
import { PAGINATION } from '../types';
import { API_URL } from "../utils";

async function serverFetch<T>(endpoint: string): Promise<T | null> {
    const cookieStore = await cookies();
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            Cookie: cookieStore.toString()
        },
        cache: "no-store"
    });

    if (!response.ok) {
        return null;
    }
    return response.json();
}

async function fetchServerPaginated<T>(endpoint: string, limit = PAGINATION.DEFAULT_LIMIT, cursor?: string): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) {
        params.set('cursor', cursor);
    }
    const result = await serverFetch<PaginatedResponse<T>>(`${endpoint}?${params}`);
    return result ?? { items: [], nextCursor: null, hasMore: false };
}

export async function getServerCampaigns(): Promise<Campaign[]> {
    return (await serverFetch<Campaign[]>('/api/campaigns')) || []
}

export async function getServerAdSlots(publisherId?: string): Promise<AdSlot[]> {
    const query = publisherId ? `?publisherId=${publisherId}`: '';
    const result = await serverFetch<PaginatedResponse<AdSlot>>(`/api/ad-slots${query}`);
    return result?.items ?? [];
}

export async function getServerAdSlot(id: string): Promise<AdSlot | null> {
    return serverFetch<AdSlot>(`/api/ad-slots/${id}`);
}

export async function getServerAdSlotsPaginated(limit?: number, cursor?: string) {
    return fetchServerPaginated<AdSlot>('/api/ad-slots', limit, cursor);
}