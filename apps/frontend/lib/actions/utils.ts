"use server"
import { cookies } from "next/headers";
import { getApiUrl } from "../auth-helpers";
const API_URL = getApiUrl();

export async function getAuthHeaders(): Promise<Record<string, string>> {
    const cookieStore = await cookies();

    return {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
    }
}

export type ApiResponse<T> = 
    | { data: T; error?: undefined }
    | { data?: never; error: string };

export async function apiRequest<T>(
    endpoint: string,
    options: {
        method?: string;
        body?: string;
        headers?: Record<string, string>;
    }
): Promise<ApiResponse<T>> {
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
                data: undefined as T,
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