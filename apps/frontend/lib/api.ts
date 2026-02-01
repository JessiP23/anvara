import { API_URL } from "./utils";

export async function api<T>(endpoint: string, options?: globalThis.RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
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
export const updateCampaign = <T = unknown>(id: string, data: Record<string, unknown>) => api<T>(`/api/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data)});
export const deleteCampaign = (id: string) => api(`/api/campaigns/${id}`, {  method: 'DELETE' });

// Ad Slots 
export const getAdSlots = <T = unknown[]>(publisherId?: string) =>
  api<T>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');
export const getAdSlot = <T = unknown>(id: string) => api<T>(`/api/ad-slots/${id}`);
export const createAdSlot = (data: Record<string, unknown>) =>
  api('/api/ad-slots', { method: 'POST', body: JSON.stringify(data) });
export const updateAdSlot = <T = unknown>(id: string, data: Record<string, unknown>) => api<T>(`/api/ad-slots/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAdSlot = (id: string) => api(`/api/ad-slots/${id}`, { method: 'DELETE' });
export const bookAdSlot = (id: string, message?: string) => api(`/api/ad-slots/${id}/book`, { method: 'POST', body: JSON.stringify({message})});
export const unbookAdSlot = (id: string) => api(`/api/ad-slots/${id}/unbook`, { method: 'POST' });


// Placements
export const getPlacements = <T = unknown[]>() => api<T>('/api/placements');
export const createPlacement = (data: Record<string, unknown>) =>
  api('/api/placements', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
export const getStats = <T = unknown>() => api<T>('/api/dashboard/stats');
