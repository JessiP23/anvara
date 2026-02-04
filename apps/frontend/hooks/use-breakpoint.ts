'use client'

import { useState, useEffect, use } from "react"
import { breakpoints, isDesktop, isMobile, isTablet } from "@/lib/breakpoint"

export function useBreakpoint() {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        width,
        isMobile: isMobile(width),
        isTablet: isTablet(width),
        isDesktop: isDesktop(width),
        isAtLeast: (bp: keyof typeof breakpoints) => width >= breakpoints[bp]
    }
}