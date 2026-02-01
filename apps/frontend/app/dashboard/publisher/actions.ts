'use server';

import { revalidatePath } from 'next/cache';
import { apiRequest } from '@/lib/actions/utils';
import type { ActionState } from '@/lib/actions/types';

function getValues(formData: FormData) {
  return {
    name: formData.get('name')?.toString() || '',
    type: formData.get('type')?.toString() || '',
    basePrice: formData.get('basePrice')?.toString() || '',
    description: formData.get('description')?.toString() || '',
    position: formData.get('position')?.toString() || '',
    width: formData.get('width')?.toString() || '',
    height: formData.get('height')?.toString() || '',
  };
}

function validateAdSlotForm(values: ReturnType<typeof getValues>) {
  const fieldErrors: Record<string, string> = {};
  if (!values.name.trim()) fieldErrors.name = 'Name is required';
  if (!values.type) fieldErrors.type = 'Type is required';
  if (!values.basePrice || isNaN(Number(values.basePrice)) || Number(values.basePrice) <= 0) {
    fieldErrors.basePrice = 'Base price must be a positive number';
  }
  if (!values.description.trim()) fieldErrors.description = 'Description is required';
  if (!values.position.trim()) fieldErrors.position = 'Position is required';
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

function buildPayload(values: ReturnType<typeof getValues>, isAvailable: boolean) {
  return {
    name: values.name.trim(),
    type: values.type,
    basePrice: Number(values.basePrice),
    description: values.description.trim() || undefined,
    position: values.position.trim() || undefined,
    width: values.width ? Number(values.width) : undefined,
    height: values.height ? Number(values.height) : undefined,
    isAvailable,
  };
}

export async function createAdSlot(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const values = getValues(formData);
  const fieldErrors = validateAdSlotForm(values);
  if (fieldErrors) return { fieldErrors, values };

  const { error } = await apiRequest('/api/ad-slots', {
    method: 'POST',
    body: JSON.stringify(buildPayload(values, true)),
  });

  if (error) return { error, values };

  revalidatePath('/dashboard/publisher');
  return { success: true };
}

export async function updateAdSlot(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id')?.toString();
  if (!id) return { error: 'Missing ad slot ID' };

  const values = getValues(formData);
  const fieldErrors = validateAdSlotForm(values);
  if (fieldErrors) return { fieldErrors, values };

  const isAvailable = formData.get('isAvailable') === 'true';

  const { error } = await apiRequest(`/api/ad-slots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(buildPayload(values, isAvailable)),
  });

  if (error) return { error, values };

  revalidatePath('/dashboard/publisher');
  return { success: true };
}

export async function deleteAdSlot(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id')?.toString();
  if (!id) return { error: 'Missing ad slot ID' };

  const { error } = await apiRequest(`/api/ad-slots/${id}`, { method: 'DELETE' });
  if (error) return { error };

  revalidatePath('/dashboard/publisher');
  return { success: true };
}