import { cookies } from "next/headers";
import type { Campaign, AdSlot } from "../types";
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

export async function getServerCampaigns(): Promise<Campaign[]> {
    return (await serverFetch<Campaign[]>('/api/campaigns')) || []
}

export async function getServerAdSlots(publisherId: string): Promise<AdSlot[]> {
    const query = publisherId ? `?publisherId=${publisherId}`: '';
    return (await serverFetch<AdSlot[]>(`/api/ad-slots${query}`)) || []
}

export async function getServerAdSlot(id: string): Promise<AdSlot | null> {
    return serverFetch<AdSlot>(`/api/ad-slots/${id}`);
}