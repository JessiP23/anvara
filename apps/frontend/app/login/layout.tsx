import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Login - Anvara',
    description: 'Sign in to your Anvara account to manage your sponsorships and campaigns.',
    openGraph: {
        title: 'Login | Anvara',
        description: 'Sign in to your Anvara Account.'
    }
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}