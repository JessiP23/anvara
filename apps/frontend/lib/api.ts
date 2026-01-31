// Simple API client
// FIXME: This client has no error response parsing - when API returns { error: "..." },
// we should extract and throw that message instead of generic "API request failed"

// TODO: Add authentication token to requests
// Hint: Include credentials: 'include' for cookie-based auth, or
// add Authorization header for token-based auth
const env = globalThis.process?.env;
const API_URL = env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export async function api<T>(endpoint: string, options?: globalThis.RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}

// Campaigns
export const getCampaigns = <T = unknown[]>(sponsorId?: string) =>
  api<T>(sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns');
export const getCampaign = <T = unknown>(id: string) => api<T>(`/api/campaigns/${id}`);
export const createCampaign = (data: Record<string, unknown>) =>
  api('/api/campaigns', { method: 'POST', body: JSON.stringify(data) });
// TODO: Add updateCampaign and deleteCampaign functions

// Ad Slots
export const getAdSlots = <T = unknown[]>(publisherId?: string) =>
  api<T>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');
export const getAdSlot = <T = unknown>(id: string) => api<T>(`/api/ad-slots/${id}`);
export const createAdSlot = (data: Record<string, unknown>) =>
  api('/api/ad-slots', { method: 'POST', body: JSON.stringify(data) });
// TODO: Add updateAdSlot, deleteAdSlot functions

// Placements
export const getPlacements = <T = unknown[]>() => api<T>('/api/placements');
export const createPlacement = (data: Record<string, unknown>) =>
  api('/api/placements', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
export const getStats = <T = unknown>() => api<T>('/api/dashboard/stats');
