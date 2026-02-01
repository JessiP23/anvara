'use client'

import { cn } from "@/lib/utils";
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

type ToastType = 'success' | 'error' | 'info';
interface ToastContextValue {
    show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
    children: ReactNode;
    duration?: number;
}

export function ToastProvider({ children, duration = 3000 }: ToastProviderProps) {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const show = useCallback((message: string, type: ToastType = 'success') =>
        setToast({ message, type }), []);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), duration);
        return () => clearTimeout(timer);
    }, [toast, duration]);

    const typeStyles = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    }

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {toast && (
                <div 
                    role="status"
                    aria-live="polite"
                    className={cn('fixed right-4 top-4 z-50 rounded px-4 py-3 text-white shadow-lg transition-all', typeStyles[toast.type])}
                >
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    )
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}