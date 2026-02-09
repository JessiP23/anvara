'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from './bottom-nav';
import { MenuDrawer } from './menu-drawer';
import { authClient } from '@/auth-client';
import { getUserRole } from '@/lib/auth-helpers';
import type { UserRole } from '@/lib/types';

export function MobileNavWrapper() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const { data: session } = authClient.useSession();

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

    return (
        <>
            <BottomNav onMenuOpen={() => setMenuOpen(true)} userRole={userRole} />
            <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} userRole={userRole} />
        </>
    );
}