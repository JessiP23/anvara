import { type Response, type NextFunction } from 'express';
import { validateSession, extractSessionToken } from '../services/session.service.js';
import type { AuthRequest } from '../types/auth.types.js';

export async function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    const sessionToken = extractSessionToken(req.headers.cookie);

    if (!sessionToken) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const user = await validateSession(sessionToken);

    if (!user) {
        res.status(401).json({ error: 'Invalid or expired session' });
        return;
    }

    req.user = user;
    next();
}