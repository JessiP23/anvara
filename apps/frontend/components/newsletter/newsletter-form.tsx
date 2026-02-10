'use client';

import { useActionState, useEffect, useRef } from 'react';
import { subscribeNewsletter } from './actions';
import { initialActionState, type ActionState } from '@/lib/types';
import { SubmitButton } from '../ui/form/submit-button';
import { useToast } from '../notification/toast';

export function NewsletterForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    subscribeNewsletter,
    initialActionState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { show } = useToast();
  const prevSuccess = useRef(false);

  useEffect(() => {
    if (state.success && !prevSuccess.current) {
      prevSuccess.current = true;
      formRef.current?.reset();
      show('Thanks for subscribing!', 'success');
    }

    if (state.error) {
      show(state.error, 'error');
    }

    if (!state.success) {
      prevSuccess.current = false;
    }
  }, [state, show]);


  if (state.success) {
    return (
      <div className="rounded-lg border border-[--color-success]/30 bg-[--color-success]/10 p-4 text-center">
        <p className="font-medium text-[--color-success]">You&apos;re subscribed!</p>
        <p className="mt-1 text-sm text-[--color-muted]">
          We&apos;ll send you the latest deals and updates.
        </p>
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
          className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-4 py-3 text-sm text-[--color-foreground] shadow-sm transition-all placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.email}</p>
        )}
      </div>
      <SubmitButton pendintText="Subscribing...">Subscribe →</SubmitButton>
    </form>
  );
}