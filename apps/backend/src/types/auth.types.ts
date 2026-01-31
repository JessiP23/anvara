import { type Request } from "express";

export type UserRole = 'SPONSOR' | 'PUBLISHER';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    sponsorId: string | null;
    publisherId: string | null;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}