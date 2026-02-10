import { API_URL } from "./utils";
import type { PaginatedResponse, AdSlot } from './types';
import { PAGINATION } from "./types";

export async function api<T>(endpoint: string, options?: globalThis.RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}

export function fetchPaginated<T>(endpoint: string, limit = PAGINATION.DEFAULT_LIMIT, cursor?: string): Promise<PaginatedResponse<T>> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) {
    params.set('cursor', cursor);
  }
  return api<PaginatedResponse<T>>(`${endpoint}?${params}`);
}

export const getAdSlot = <T = unknown>(id: string) => api<T>(`/api/ad-slots/${id}`);
export const getAdSlotsPaginated = (limit?: number, cursor?: string) => fetchPaginated<AdSlot>('/api/ad-slots', limit, cursor);
export const bookAdSlot = (id: string, message?: string) => api(`/api/ad-slots/${id}/book`, { method: 'POST', body: JSON.stringify({message})});
export const unbookAdSlot = (id: string) => api(`/api/ad-slots/${id}/unbook`, { method: 'POST' });