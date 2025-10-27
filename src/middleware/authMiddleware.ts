import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.js';
import { errorHandler } from '../handlers/errorHandlers.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorHandler({ status: 401, message: 'Authorization header missing or malformed' }, req, res, () => { });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyAccessToken(token as string);
        req.user = {
            id: payload.sub as string,
            email: payload.email,
            role: payload.role,
        };
        next();
    } catch (err) {
        return errorHandler({ status: 401, message: 'Invalid or expired token' }, req, res, () => { });
    }
};