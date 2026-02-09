'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from './bottom-nav';
import { MenuDrawer } from './menu-drawer';
import { authClient } from '@/auth-client';
import { getUserRole } from '@/lib/auth-helpers';
import type { UserRole } from '@/lib/types';
import { usePathname } from 'next/navigation';

const HIDDEN_PATHS = ['/', 'login']

export function MobileNavWrapper() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const { data: session, isPending } = authClient.useSession();
    const pathname = usePathname();

    useEffect(() => {
        async function fetchRole() {
            if (session?.user?.id) {
                const roleInfo = await getUserRole(session.user.id);
                setUserRole(roleInfo.role);
            } else {
                setUserRole(null);
            }
        }
        fetchRole();
    }, [session?.user?.id]);

    if (isPending || HIDDEN_PATHS.includes(pathname) || !session?.user) {
        return null
    }

    return (
        <>
            <BottomNav onMenuOpen={() => setMenuOpen(true)} userRole={userRole} />
            <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} userRole={userRole} />
        </>
    );
}