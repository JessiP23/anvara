'use client'

import { useActionState, useEffect, useRef, useState } from "react";
import { subscribeNewsletter } from "./actions";
import { initialActionState, type ActionState } from '@/lib/types';
import { SubmitButton } from "../ui/form/submit-button";
import { useToast } from "../notification/toast";

export function NewsletterForm() {
    const [state, formAction] = useActionState<ActionState, FormData>(subscribeNewsletter, initialActionState);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const {show} = useToast();
    const prevState = useRef(false);

    // localstorage for subscribed
    useEffect(() => {
        const subscribed = localStorage.getItem('newsletter-subscribed');
        if (subscribed === 'true') {
            setIsSubscribed(true);
        }
    }, [])

    useEffect(() => {
        if (state.success && !prevState.current) {
            prevState.current = true;
            formRef.current?.reset();
            localStorage.setItem('newsletter-subscribed', 'true');
            setIsSubscribed(true);
            show("Thanks for subscribing!", 'success');
        }

        if (state.error) {
            show(state.error, 'error')
        }

        if (!state.success) {
            prevState.current = false;
        }
    }, [state, show])

    if (isSubscribed) {
        return (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p className="font-medium text-green-800">You are subscribed!</p>
                <p className="mt-1 text-sm text-green-600">
                    We will send you the latest deals and updates
                </p>
            </div>
        )
    }

    return (
        <form ref={formRef} action={formAction} className="space-y-3">
            <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full text-black rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {state.fieldErrors?.email && (
                    <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.email}</p>
                )}
            </div>
            <SubmitButton pendintText="Subscriting..">
                Subscribe →
            </SubmitButton>
        </form>
    )
}