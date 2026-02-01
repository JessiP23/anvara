'use client';

interface EmptyStateProps {
    title?: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ 
    title = 'Nothing here yet',
    message,
    action,
    className = '' 
}: EmptyStateProps) {
    return (
        <div className={`rounded-lg border border-dashed border-[--color-border] p-8 text-center ${className}`}>
            <h3 className="text-lg font-medium text-[--color-foreground]">{title}</h3>
            {message && <p className="mt-1 text-[--color-muted]">{message}</p>}
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}