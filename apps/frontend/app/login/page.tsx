'use client';

import React, {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/auth-client';
import { API_URL } from '@/lib/utils';
import { responsive } from '@/lib/responsive';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'sponsor' | 'publisher'>('sponsor');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-fill credentials based on selected role
  const email = role === 'sponsor' ? 'sponsor@example.com' : 'publisher@example.com';
  const password = 'password';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Use Better Auth signIn.email with proper callbacks
    const { error: signInError } = await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: async (ctx) => {
          // Fetch user role to determine redirect
          try {
            const userId = ctx.data?.user?.id;
            if (userId) {
              const roleRes = await fetch(`${API_URL}/api/auth/role/${userId}`);
              const roleData = await roleRes.json();
              if (roleData.role === 'sponsor') {
                router.push('/dashboard/sponsor');
              } else if (roleData.role === 'publisher') {
                router.push('/dashboard/publisher');
              } else {
                router.push('/');
              }
            } else {
              router.push('/');
            }
          } catch {
            router.push('/');
          }
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Login failed');
          setLoading(false);
        },
      }
    );

    // Handle any errors not caught by onError callback
    if (signInError) {
      setError(signInError.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className={cn('w-full max-w-md rounded-lg border border-[--color-border] shadow-sm', responsive.spacing.card)}>
        <h1 className={cn('mb-6 font-bold', responsive.text.heading)}>Login to Anvara</h1>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={cn('block font-medium text-[--color-foreground]', responsive.text.small)}>
              Quick Login As
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'sponsor' | 'publisher')}
              className={cn('mt-1 w-full rounded border border-[--color-border] bg-white px-3 text-gray-900', responsive.button.touch)}
            >
              <option value="sponsor">Sponsor (sponsor@example.com)</option>
              <option value="publisher">Publisher (publisher@example.com)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn('w-full rounded-lg bg-[--color-primary] font-semibold text-white hover:opacity-90 disabled:opacity-50', responsive.button.touch)}
          >
            {loading ? 'Logging in...' : `Login as ${role === 'sponsor' ? 'Sponsor' : 'Publisher'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
