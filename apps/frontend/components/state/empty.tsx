'use client';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ 
    title = 'Nothing here yet',
    message,
    // choose any other icon you like
    icon = '📭',
    action,
    className = '' 
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[--color-border] bg-gradient-to-b from-gray-50 to-white p-12 text-center ${className}`}>
            <div className="mb-4 text-5xl" role="img" aria-hidden="true">
                {icon}
            </div>
            <h3 className="text-xl font-medium text-[--color-foreground]">{title}</h3>
            {message && <p className="mt-2 max-w-sm text-[--color-muted]">{message}</p>}
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-6 rounded-lg bg-[--color-primary] px-6 py-2.5 font-medium text-white transition-all hover:bg-[--color-primary-hover] hover:shadow-md"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
