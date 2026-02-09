'use client';

import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '@/auth-client';
import { Modal } from '@/components/ui/modal/genericModal';
import { navLinks } from '@/app/components/nav';
import type { UserRole } from '@/lib/types';

interface MenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    userRole: UserRole;
}

export function MenuDrawer({ isOpen, onClose, userRole }: MenuDrawerProps) {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const pathname = usePathname();

    const visibleLinks = navLinks.filter(link => {
        if (!link.role) return true;
        return link.role === userRole;
    })

    const handleNavigation = (href: string) => {
        onClose();
        if (href !== pathname) {
            router.push(href);
        }
    }

    const handleSignOut = async () => {
        onClose();
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                window.location.href = '/';
                }
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Menu">
            <div className="space-y-6">
                {session?.user && (
                    <div className="flex items-center gap-3 rounded-xl bg-[--color-background] p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[--color-primary]/10 text-lg font-semibold text-[--color-primary]">
                            {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-[--color-foreground]">
                                {session.user.name || 'User'}
                            </p>
                            <p className="truncate text-sm text-[--color-muted]">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                )}

                <div className="border-t border-[--color-border]" />

                <div className="space-y-1">
                    {visibleLinks.map(({ href, label }) => (
                        <button
                            key={href}
                            type='button'
                            onClick={() => handleNavigation(href)}
                            className="flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-[--color-foreground] transition-colors hover:bg-[--color-background] active:bg-[--color-border]"
                        >
                            <span className="font-medium">{label}</span>
                        </button>
                    ))}
                </div>

                <div className="border-t border-[--color-border] pt-4">
                    {session?.user ? (
                        <button
                            onClick={handleSignOut}
                            className="flex h-12 w-full items-center gap-3 rounded-lg px-4 text-red-600 transition-colors hover:bg-red-50 active:bg-red-100"
                        >
                            <span className="font-medium">Sign Out</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleNavigation('/login')}
                            className="flex h-12 w-full items-center justify-center rounded-lg bg-[--color-primary] font-medium text-white transition-colors hover:opacity-90"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}