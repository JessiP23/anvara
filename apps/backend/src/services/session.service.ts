import { prisma } from "../db";
import type { AuthUser } from "../types/auth.types";

const COOKIE_NAME = 'better-auth.session_token';

/**
 * Token format: "sessionId.signature" - we only need the sessionId part.
 */
export function extractSessionToken(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) return null;

    const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    if (!match) return null;

    const fullToken = decodeURIComponent(match[1]);
    return fullToken.split('.')[0];
}

/**
 * Validates session and returns authenticated user with role info.
 */
export async function validateSession(sessionToken: string): Promise<AuthUser | null> {
    try {
        const sessions = await prisma.$queryRaw<Array<{
            userId: string;
            expiresAt: Date;
            email: string;
            name: string;
        }>>`
            SELECT s."userId", s."expiresAt", u.email, u.name
            FROM "session" s
            JOIN "user" u ON s."userId" = u.id
            WHERE s.token = ${sessionToken}
              AND s."expiresAt" > NOW()
            LIMIT 1
        `;

        if (!sessions.length) return null;

        const { userId, email, name } = sessions[0];

        const [sponsor, publisher] = await Promise.all([
            prisma.sponsor.findUnique({ where: { userId }, select: { id: true } }),
            prisma.publisher.findUnique({ where: { userId }, select: { id: true } }),
        ]);

        if (sponsor) {
            return { id: userId, email, name, role: 'SPONSOR', sponsorId: sponsor.id, publisherId: null };
        }

        if (publisher) {
            return { id: userId, email, name, role: 'PUBLISHER', publisherId: publisher.id, sponsorId: null };
        }

        return null;
    } catch (error) {
        console.error('Session validation error:', error);
        return null;
    }
}