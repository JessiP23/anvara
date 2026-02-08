'use client';
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title?: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    variant?: 'default' | 'minimal';
    className?: string;
}

export function EmptyState({ 
    title = 'Nothing here yet',
    message,
    action,
    variant='default',
    className = '' 
}: EmptyStateProps) {
    return (
        <div 
            className={cn(
                'flex flex-col items-center justify-center text-center',
                variant === 'default' 
                ? 'rounded-xl border-2 border-dashed border-[--color-border] bg-[--color-card] p-12' 
                : 'py-12',
                className
            )}
        >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[--color-primary]/10">
                <div className="h-6 w-6 rounded-sm bg-[--color-primary]/40" />
            </div>

            <h3 className="text-xl font-semibold text-[--color-foreground]">{title}</h3>
            {message && (
                <p className="mt-2 max-w-sm text-sm text-[--color-muted]">{message}</p>
            )}            
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="btn-accent mt-6"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
