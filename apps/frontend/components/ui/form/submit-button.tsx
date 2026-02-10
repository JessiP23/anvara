'use client'

import React from "react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
    children: React.ReactNode;
    pendintText?: string;
}

export function SubmitButton({ children, pendintText = 'Saving' }: SubmitButtonProps){
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="btn-accent w-full disabled:opacity-50"
        >
            {pending ? `${pendintText}...` : children}
        </button>
    )
}