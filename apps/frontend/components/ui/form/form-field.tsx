'use client'

import { cn } from "@/lib/utils";

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'password' | 'date';
    placeholder?: string;
    defaultValue?: string | number;
    required?: boolean;
    error?: string;
    hint?: string;
    autoComplete?: string;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'url';
    min?: number;
    max?: number;
    step?: number;
}

const inputModeMap: Record<string, FormFieldProps['inputMode']> = {
    email: 'email',
    tel: 'tel',
    number: 'decimal',
    url: 'url'
}

export function FormField({ label, name, type='text', placeholder, defaultValue, required = false, error, hint, autoComplete, inputMode, min, max, step }: FormFieldProps) {
    const resolvedInputMode = inputMode ?? inputModeMap[type];

    return (
        <div className="space-y-1.5">
        <label htmlFor={name} className="block text-sm font-medium text-[--color-foreground]">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
            autoComplete={autoComplete}
            inputMode={resolvedInputMode}
            min={min}
            max={max}
            step={step}
            className={cn(
                'block w-full rounded-lg border px-4 text-base',
                'h-12 sm:h-11',
                'bg-[--color-background] text-[--color-foreground]',
                'placeholder:text-[--color-muted]',
                'outline-none transition-colors',
                'focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20',
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-[--color-border]'
            )}
        />
        
        {hint && !error && (
            <p className="text-sm text-[--color-muted]">{hint}</p>
        )}
        
        {error && (
            <p className="text-sm text-red-500">{error}</p>
        )}
    </div>
    )
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  error?: string;
  rows?: number;
}

export function TextAreaField({
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
  error,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-1.5">
        <label htmlFor={name} className="block text-sm font-medium text-[--color-foreground]">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
            rows={rows}
            className={cn(
                'block w-full rounded-lg border px-4 py-3 text-base',
                    'bg-[--color-background] text-[--color-foreground]',
                    'placeholder:text-[--color-muted]',
                    'outline-none transition-colors resize-none',
                    'focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20',
                    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-[--color-border]'
            )}
        />
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
  error?: string;
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  required = false,
  error,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
        <label htmlFor={name} className="block text-sm font-medium text-[--color-foreground]">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <select
            id={name}
            name={name}
            defaultValue={defaultValue}
            required={required}
            className={cn(
                'block w-full rounded-lg border px-4 text-base appearance-none',
                'h-12 sm:h-11',
                'bg-[--color-background] text-[--color-foreground]',
                'outline-none transition-colors cursor-pointer',
                'focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20',
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-[--color-border]'
            )}
        >
            {options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
      
        {error && (
            <p className="text-sm text-red-500">{error}</p>
        )}
    </div>
  );
}