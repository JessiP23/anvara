'use client'

import type { ReactNode } from "react"

interface FormFieldProps {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
}

export function FormField({ id, label, required, error, children }: FormFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}