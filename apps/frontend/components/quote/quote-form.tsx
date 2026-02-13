'use client';

import { useActionState, useEffect, useRef } from 'react';
import { requestQuote } from './actions';
import { initialActionState } from '@/lib/types';
import { FormField, TextAreaField, SelectField } from '../ui/form/form-field';
import { SubmitButton } from '../ui/form/submit-button';
import { useToast } from '../notification/toast';

interface QuoteFormProps {
  adSlotId: string;
  adSlotName: string;
  basePrice?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  perfillEmail?: string;
}

const BUDGETS = [
  { value: '', label: 'Select' },
  { value: 'Under $1,000/mo', label: 'Under $1,000/mo' },
  { value: '$1,000 - $5,000/mo', label: '$1,000 - $5,000/mo' },
  { value: '$5,000 - $10,000/mo', label: '$5,000 - $10,000/mo' },
  { value: '$10,000+/mo', label: '$10,000+/mo' },
];

export function QuoteForm({ adSlotId, adSlotName, basePrice, onSuccess, onCancel, perfillEmail }: QuoteFormProps) {
  const [state, formAction] = useActionState(requestQuote, initialActionState);
  const { show } = useToast();
  const prevSuccess = useRef(false);
  const prevError = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.success && !prevSuccess.current) {
      prevSuccess.current = true;
      show('Quote request submitted!', 'success');
      onSuccess?.();
    }
    if (state.error && state.error !== prevError.current) {
      prevError.current = state.error;
      show(state.error, 'error');
    }
    if (!state.success) prevSuccess.current = false;
    if (!state.error) prevError.current = undefined;
  }, [state.success, state.error, onSuccess, show]);

  const getValue = (field: string, fallback = '') => {
    if (state.values?.[field] !== undefined) return state.values[field];
    if (field === 'email' && perfillEmail) return perfillEmail;
    return fallback;
  };

  return (
    <form action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="adSlotId" value={adSlotId} />

      <div className="rounded-lg bg-[--color-background] p-3 text-sm">
        <span className="text-[--color-muted]">Quote for:</span>{' '}
        <span className="font-medium text-[--color-foreground]">{adSlotName}</span>
        {basePrice && <span className="text-[--color-muted]"> (${basePrice}/mo)</span>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField name="companyName" label="Company" required error={state.fieldErrors?.companyName} defaultValue={getValue('companyName')} />
        <FormField name="email" label="Email" type="email" required error={state.fieldErrors?.email} defaultValue={getValue('email')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField name="phone" label="Phone" type="tel" defaultValue={getValue('phone')} />
        <SelectField name="budget" label="Budget" required error={state.fieldErrors?.budget} options={BUDGETS} defaultValue={getValue('budget')} />
      </div>

      <FormField name="timeline" label="Timeline" required error={state.fieldErrors?.timeline} defaultValue={getValue('timeline')} />
      <TextAreaField name="message" label="Requirements" required rows={3} error={state.fieldErrors?.message} defaultValue={getValue('message')} />

      <div className="flex gap-3 pt-2">
        <SubmitButton pendintText="Submitting...">Request Quote</SubmitButton>
        {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>}
      </div>
    </form>
  );
}