"use server"
import { cookies } from "next/headers";

const API_URL = globalThis.process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export async function getAuthHeaders(): Promise<Record<string, string>> {
    const cookieStore = await cookies();

    return {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options: {
        method?: string;
        body?: string;
        headers?: Record<string, string>;
    }
): Promise<{ data?: T; error?: string }> {
    try{
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.json().catch(() => ({}))
            return {error: errorMessage.error || `Request failed: ${response.status}`};
        }

        if (response.status === 204) {
            return {
                data: undefined,
            }
        }

        const data = await response.json();
        return {data}
    } catch {
        return {
            error: "Network error. Please retry later."
        }
    }
}