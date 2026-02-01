'use client'

import { useActionState, useEffect, useRef } from "react";
import { subscribeNewsletter } from "./actions";
import { initialActionState, type ActionState } from "@/lib/actions/types";
import { FormField } from "../ui/form/form-field";
import { SubmitButton } from "../ui/form/submit-button";
import { useToast } from "../notification/toast";

export function NewsletterForm() {
    const [state, formAction] = useActionState<ActionState, FormData>(subscribeNewsletter, initialActionState);
    const formRef = useRef<HTMLFormElement>(null);
    const {show} = useToast();
    const prevState = useRef(false);

    useEffect(() => {
        if (state.success && !prevState.current) {
            prevState.current = true;
            formRef.current?.reset();
            show("Thanks for subscribing!", 'success');
        }

        if (state.error) {
            show(state.error, 'error')
        }

        if (!state.success) {
            prevState.current = false;
        }
    }, [state, show])

    return (
        <form ref={formRef} action={formAction} className="space-y-3">
            <FormField id="email" label="Email" error={state.fieldErrors?.email}>
                <input 
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
            </FormField>
            <SubmitButton pendintText="Subscribing...">Subscribe</SubmitButton>
        </form>
    )
}