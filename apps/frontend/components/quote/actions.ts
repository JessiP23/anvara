'use server';

import type { ActionState } from '@/lib/types';
import { API_URL } from '@/lib/utils';

function getValues(formData: FormData) {
  return {
    companyName: formData.get('companyName')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    phone: formData.get('phone')?.toString() || '',
    budget: formData.get('budget')?.toString() || '',
    timeline: formData.get('timeline')?.toString() || '',
    message: formData.get('message')?.toString() || '',
  };
}

function validateQuoteForm(values: ReturnType<typeof getValues>) {
  const fieldErrors: Record<string, string> = {};

  if (!values.companyName.trim()) fieldErrors.companyName = 'Company name is required';
  if (!values.email.trim()) {
    fieldErrors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    fieldErrors.email = 'Invalid email format';
  }
  if (!values.budget) fieldErrors.budget = 'Budget is required';
  if (!values.timeline) fieldErrors.timeline = 'Timeline is required';
  if (!values.message.trim()) fieldErrors.message = 'Requirements are required';

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

export async function requestQuote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = getValues(formData);

  const fieldErrors = validateQuoteForm(values);
  if (fieldErrors) {
    return { fieldErrors, values };
  }

  try {
    const response = await fetch(`${API_URL}/api/quotes/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adSlotId: formData.get('adSlotId'),
        ...values,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Failed to submit', values };
    }

    return { success: true };
  } catch {
    return { error: 'Failed to submit request', values };
  }
}