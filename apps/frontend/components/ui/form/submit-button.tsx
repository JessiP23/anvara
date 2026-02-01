'use client'

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
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
            {pending ? `${pendintText}...` : children}
        </button>
    )
}