'use server';

import { revalidatePath } from 'next/cache';
import { apiRequest } from '@/lib/actions/utils';
import type { ActionState } from '@/lib/actions/types';

function parseAdSlotForm(formData: FormData) {
  return {
    id: formData.get('id')?.toString(),
    name: formData.get('name')?.toString().trim(),
    type: formData.get('type')?.toString(),
    basePrice: formData.get('basePrice')?.toString(),
    description: formData.get('description')?.toString().trim() || undefined,
    position: formData.get('position')?.toString().trim() || undefined,
    width: formData.get('width')?.toString(),
    height: formData.get('height')?.toString(),
    isAvailable: formData.get('isAvailable') === 'true',
  };
}

function validateAdSlotForm(data: ReturnType<typeof parseAdSlotForm>) {
  const fieldErrors: Record<string, string> = {};
  if (!data.name) fieldErrors.name = 'Name is required';
  if (!data.type) fieldErrors.type = 'Type is required';
  if (!data.basePrice || isNaN(Number(data.basePrice)) || Number(data.basePrice) <= 0) {
    fieldErrors.basePrice = 'Base price must be a positive number';
  }
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

function buildAdSlotPayload(data: ReturnType<typeof parseAdSlotForm>) {
  return {
    name: data.name,
    type: data.type,
    basePrice: Number(data.basePrice),
    description: data.description,
    position: data.position,
    width: data.width ? Number(data.width) : undefined,
    height: data.height ? Number(data.height) : undefined,
    isAvailable: data.isAvailable,
  };
}

export async function createAdSlot(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const data = parseAdSlotForm(formData);
  const fieldErrors = validateAdSlotForm(data);
  if (fieldErrors) return { fieldErrors };

  const { error } = await apiRequest('/api/ad-slots', {
    method: 'POST',
    body: JSON.stringify(buildAdSlotPayload(data)),
  });

  if (error) return { error };

  revalidatePath('/dashboard/publisher');
  return { success: true };
}

export async function updateAdSlot(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const data = parseAdSlotForm(formData);
  if (!data.id) return { error: 'Missing ad slot ID' };

  const fieldErrors = validateAdSlotForm(data);
  if (fieldErrors) return { fieldErrors };

  const { error } = await apiRequest(`/api/ad-slots/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(buildAdSlotPayload(data)),
  });

  if (error) return { error };

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