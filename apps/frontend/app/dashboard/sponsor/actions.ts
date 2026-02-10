'use server';

import { revalidatePath } from 'next/cache';
import { apiRequest } from '@/lib/actions/utils';
import type { ActionState } from '@/lib/types';

function parseCampaignForm(formData: FormData) {
    return {
        id: formData.get('id')?.toString(),
        name: formData.get('name')?.toString().trim(),
        description: formData.get('description')?.toString().trim() || undefined,
        budget: formData.get('budget')?.toString(),
        startDate: formData.get('startDate')?.toString(),
        endDate: formData.get('endDate')?.toString(),
        status: formData.get('status')?.toString(),
    };
}

function validateCampaignForm(data: ReturnType<typeof parseCampaignForm>) {
    const fieldErrors: Record<string, string> = {};
    if (!data.name) fieldErrors.name = 'Name is required';
    if (!data.description) fieldErrors.description = 'Description is required'
    if (!data.budget || isNaN(Number(data.budget)) || Number(data.budget) <= 0) {
        fieldErrors.budget = 'Budget must be a positive number';
    }
    if (!data.startDate) fieldErrors.startDate = 'Start date is required';
    if (!data.endDate) fieldErrors.endDate = 'End date is required';
    if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
        fieldErrors.endDate = 'End date must be after start date';
    }
    return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

function buildCampaignPayload(data: ReturnType<typeof parseCampaignForm>) {
    return {
        name: data.name,
        description: data.description,
        budget: Number(data.budget),
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
    };
}

export async function createCampaign(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    const data = parseCampaignForm(formData);
    const fieldErrors = validateCampaignForm(data);

    const values: Record<string, string> = {
        name: data.name || '',
        description: data.description || '',
        budget: data.budget || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
    }

    if (fieldErrors) return { fieldErrors, values };

    const { error } = await apiRequest('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify(buildCampaignPayload(data)),
    });

    if (error) return { error };

    revalidatePath('/dashboard/sponsor');
    return { success: true };
}

export async function updateCampaign(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    const data = parseCampaignForm(formData);
    if (!data.id) return { error: 'Missing campaign ID' };

    const fieldErrors = validateCampaignForm(data);
    const values: Record<string, string> = {
        name: data.name || '',
        description: data.description || '',
        budget: data.budget || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        status: data.status || '',
    }
    if (fieldErrors) return { fieldErrors, values };

    const { error } = await apiRequest(`/api/campaigns/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(buildCampaignPayload(data)),
    });

    if (error) return { error, values };

    revalidatePath('/dashboard/sponsor');
    return { success: true };
}

export async function deleteCampaign(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id')?.toString();
    if (!id) return { error: 'Missing campaign ID' };

    const { error } = await apiRequest(`/api/campaigns/${id}`, { method: 'DELETE' });

    if (error) return { error };

    revalidatePath('/dashboard/sponsor');
    return { success: true };
}