'use client'

interface FormAlertsProps {
    error?: string;
    success?: boolean;
    successMessage?: string;
}

export function FormAlert({ error, success, successMessage = 'Saved!' }: FormAlertsProps) {
    if (!error && !success) {
        return null
    };

    return (
        <div role="alert">
            {error && (
                <div className="rounded bg-red-100 p-3 text-sm text-red-700">
                {error}
                </div>
            )}
            {success && (
                <div className="rounded bg-green-100 p-3 text-sm text-green-700">
                {successMessage}
                </div>
            )}
        </div>
    );
}