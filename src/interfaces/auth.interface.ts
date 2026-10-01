import type {Request} from 'express';

export interface JwtPayload {
    id: number;
    email: string;
    role?: string;
}

export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}
