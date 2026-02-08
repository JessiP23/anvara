'use client'

import { cn } from "@/lib/utils";
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"

type ToastType = 'success' | 'error' | 'info';
interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
    children: ReactNode;
    duration?: number;
}

export function ToastProvider({ children, duration = 3000 }: ToastProviderProps) {
    const [toast, setToast] = useState<Toast[]>([]);
    const show = useCallback((message: string, type: ToastType = 'success') =>{
        const id = Date.now().toString();
        setToast(prev => [...prev, { id, message, type }]);
    }, []);

    const remove = useCallback((id: string) => {
        setToast(prev => prev.filter(t => t.id !== id));
    }, [])

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div 
                className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
                role="region"
                aria-label="Notifications"
            >
                {toast.map((toast) => (
                    <ToastItem 
                        key={toast.id} 
                        toast={toast} 
                        duration={duration}
                        onRemove={remove}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

const typeStyles = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
};

const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
};

function ToastItem({ toast, duration, onRemove }: { toast: Toast; duration: number; onRemove: (id: string) => void }) {
    const [isExiting, setIsExiting] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        // Schedule exit
        timerRef.current = window.setTimeout(() => setIsExiting(true), duration - 200);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [duration]);

    const handleAnimationEnd = (e: React.AnimationEvent) => {
        if (e.animationName.includes('slide-out')) {
            onRemove(toast.id);
        }
    };

    return (
        <div
            role="alert"
            onAnimationEnd={handleAnimationEnd}
            className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg',
                typeStyles[toast.type],
                isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
            )}
        >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {icons[toast.type]}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
        </div>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}