import { verifyAccessToken } from '../utils/token.js';
import { errorHandler } from '../handlers/errorHandlers.js';
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorHandler({ status: 401, message: 'Authorization header missing or malformed' }, req, res, () => { });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch (err) {
        return errorHandler({ status: 401, message: 'Invalid or expired token' }, req, res, () => { });
    }
};
//# sourceMappingURL=authMiddleware.js.map