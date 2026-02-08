'use client';

import { type ReactNode } from 'react';

interface StaggerProps {
    children: ReactNode;
    className?: string;
}

export function Stagger({
    children,
    className = ''
}: StaggerProps) {
    return (
        <div className={className} data-stagger>
            {children}
        </div>
    );
}