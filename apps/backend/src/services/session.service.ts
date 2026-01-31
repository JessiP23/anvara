import { prisma } from "../db";
import type { AuthUser } from "../types/auth.types";

export function extractSessionToken(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';').reduce(
        (acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) {
                acc[key] = decodeURIComponent(value);
            }
            return acc;
        },
        {} as Record<string, string>
    );

    const fullToken = cookies['better-auth.session_token'] || null;
    if (!fullToken) return null;
    const sessionId = fullToken.split('.')[0];
    
    return sessionId;
}

export async function validateSession(sessionToken: string): Promise<AuthUser | null> {
    try {
        // Look up the session
        const session = await prisma.$queryRaw<
            Array<{
                userId: string;
                expiresAt: Date;
                email: string;
                name: string;
            }>
        >`
        SELECT s."userId", s."expiresAt", u.email, u.name
        FROM "session" s
        JOIN "user" u ON s."userId" = u.id
        WHERE s.token = ${sessionToken}
        LIMIT 1
        `;

        if (!session.length) {
            return null;
        }

        if (new Date(session[0].expiresAt) < new Date()) {
            return null;
        }

        const { userId, email, name } = session[0];

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