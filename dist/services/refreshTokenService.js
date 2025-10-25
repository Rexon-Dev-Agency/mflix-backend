import { db } from '../config/firebase.js';
const collection = db.collection('refreshTokens');
export const saveRefreshTokenRecord = async (userId, hash, expiresAt) => {
    const rec = {
        userId,
        hash,
        revoked: false,
        createdAt: Date.now(),
        expiresAt,
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