'use server'

import type { ActionState } from '@/lib/types'
import { API_URL } from '@/lib/utils';

export async function subscribeNewsletter(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const email = formData.get('email')?.toString().trim();
    if (!email) {
        return {
            fieldErrors: {
                email: 'Email is required'
            }
        }
    };

    const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })

    const data = await response.json();
    if (!response.ok) {
        return {
            error: data.message || 'Subscription failed'
        }
    }

    return {success: true};
}