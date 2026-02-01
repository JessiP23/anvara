'use client';

import { useActionState, useEffect, useRef } from 'react';
import { requestQuote } from './actions';
import { initialActionState, type ActionState } from '@/lib/types';
import { FormField } from '../ui/form/form-field';
import { SubmitButton } from '../ui/form/submit-button';
import { FormAlert } from '../ui/form/form-alerts';
import { useToast } from '../notification/toast';

interface QuoteFormProps {
  adSlotId: string;
  adSlotName: string;
  basePrice?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  perfillEmail?: string;
}

const BUDGETS = ['Under $1,000/mo', '$1,000 - $5,000/mo', '$5,000 - $10,000/mo', '$10,000+/mo'];
const TIMELINES = ['As soon as possible', 'This month', 'Next month', 'Just exploring'];

export function QuoteForm({ adSlotId, adSlotName, basePrice, onSuccess, onCancel, perfillEmail }: QuoteFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(requestQuote, initialActionState);
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
    <form action={formAction} className="space-y-4 text-black">
      <input type="hidden" name="adSlotId" value={adSlotId} />

      <div className="rounded-lg bg-gray-50 p-3 text-sm">
        <span className="text-gray-500">Quote for:</span>{' '}
        <span className="font-medium">{adSlotName}</span>
        {basePrice && <span className="text-gray-500"> (${basePrice}/mo)</span>}
      </div>

      <FormAlert error={state.error} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="companyName" label="Company" required error={state.fieldErrors?.companyName}>
          <input type="text" id="companyName" name="companyName" defaultValue={getValue('companyName')} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
        </FormField>

        <FormField id="email" label="Email" required error={state.fieldErrors?.email}>
          <input type="email" id="email" name="email" defaultValue={getValue('email')} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="phone" label="Phone">
          <input type="tel" id="phone" name="phone" defaultValue={getValue('phone')} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
        </FormField>

        <FormField id="budget" label="Budget" required error={state.fieldErrors?.budget}>
          <select key={`budget-${state.values?.budget}`} id="budget" name="budget" defaultValue={getValue('budget')} className="mt-1 w-full rounded border px-3 py-2 text-sm">
            <option value="">Select</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </FormField>
      </div>

      <FormField id="timeline" label="Timeline" required error={state.fieldErrors?.timeline}>
        <select key={`timeline-${state.values?.timeline}`} id="timeline" name="timeline" defaultValue={getValue('timeline')} className="mt-1 w-full rounded border px-3 py-2 text-sm">
          <option value="">Select</option>
          {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </FormField>

      <FormField id="message" label="Requirements" required error={state.fieldErrors?.message}>
        <textarea id="message" name="message" rows={3} defaultValue={getValue('message')} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
      </FormField>

      <div className="flex gap-3">
        <SubmitButton pendintText="Submitting...">Request Quote</SubmitButton>
        {onCancel && <button type="button" onClick={onCancel} className="rounded border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>}
      </div>
    </form>
  );
}