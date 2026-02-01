'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

type ToastType = 'success' | 'error';

const ToastContext = createContext<{ show: (message: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: {children: ReactNode}) {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const show = useCallback((message: string, type: ToastType = 'success') =>
        setToast({ message, type }), []);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 rounded px-4 py-3 text-white shadow-lg ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}