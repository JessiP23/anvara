'use client';

import { useActionState, useRef } from 'react';
import { subscribeNewsletter } from './actions';
import { initialActionState, type ActionState } from '@/lib/types';
import { SubmitButton } from '../ui/form/submit-button';
import { useFormSuccess } from '@/lib/hooks/use-form-success';

export function NewsletterForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    subscribeNewsletter,
    initialActionState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useFormSuccess({
    success: state.success,
    error: state.error,
    successMessage: 'Thanks for subscribing!',
    onSuccess: () => formRef.current?.reset(),
  })

  if (state.success) {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
        <p className="font-medium text-green-600">You&apos;re subscribed!</p>
        <p className="mt-1 text-sm text-[--color-muted]">We&apos;ll send you the latest deals.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-3 text-sm text-[--color-foreground] placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.email}</p>
        )}
      </div>
      <SubmitButton pendintText="Subscribing...">Subscribe →</SubmitButton>
    </form>
  );
}