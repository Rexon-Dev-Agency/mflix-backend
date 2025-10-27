import { db } from '../config/firebase.js';
import { REFRESH_TOKEN_EXPIRES_IN } from '../env.js';
const collection = db.collection('refreshTokens');
const parseExpiry = (expiry) => {
    const num = parseInt(expiry);
    if (expiry.endsWith('d'))
        return num * 24 * 60 * 60 * 1000;
    if (expiry.endsWith('h'))
        return num * 60 * 60 * 1000;
    if (expiry.endsWith('m'))
        return num * 60 * 1000;
    return num; // fallback (e.g., raw ms)
};
export const saveRefreshTokenRecord = async (userId, hash, expiresAt) => {
    const now = Date.now();
    const expiryTime = expiresAt ??
        now + parseExpiry(REFRESH_TOKEN_EXPIRES_IN);
    const rec = {
        userId,
        hash,
        revoked: false,
        createdAt: Date.now(),
        expiresAt: expiryTime,
    };
    await collection.add(rec);
};
export const findRefreshTokenRecord = async (hash) => {
    const snap = await collection.where('hash', '==', hash).limit(1).get();
    if (snap.empty)
        return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
};
export const revokeRefreshTokenRecord = async (id) => {
    await collection.doc(id).update({ revoked: true });
};
export const revokeAllUserTokens = async (userId) => {
    const snap = await collection.where('userId', '==', userId).get();
    const batch = db.batch();
    snap.docs.forEach(d => batch.update(d.ref, { revoked: true }));
    await batch.commit();
};
//# sourceMappingURL=refreshTokenService.js.map