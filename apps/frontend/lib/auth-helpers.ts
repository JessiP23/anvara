const API_URL = globalThis.process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

import type { RoleInfo } from "./types";

/**
 * Fetch user role from the backend based on userId.
 * Returns role info including sponsorId/publisherId if applicable.
 */
export async function getUserRole(userId: string): Promise<RoleInfo> {
  try {
    const res = await fetch(`${API_URL}/api/auth/role/${userId}`, {
      cache: 'no-store', // Always fetch fresh role data
    });
    if (!res.ok) {
      return { role: null };
    }
    return await res.json();
  } catch {
    return { role: null };
  }
}

export function getApiUrl(): string {
  return API_URL;
}