import crypto from 'crypto';
import { JWT_REFRESH_SECRET } from '../env.js';
export const hashToken = (token) => {
    const key = JWT_REFRESH_SECRET ?? 'fallback_key';
    return crypto.createHmac('sha256', key).update(token).digest('hex');
};
export const verifyHashedToken = (token, hash) => {
    const computed = hashToken(token);
    // timing safe compare
    const a = Buffer.from(computed);
    const b = Buffer.from(hash);
    if (a.length !== b.length)
        return false;
    return crypto.timingSafeEqual(a, b);
};
//# sourceMappingURL=crypto.js.map