import { db } from '../config/firebase.js';

type TokenRecord = {
  userId: string;
  hash: string;
  revoked: boolean;
  createdAt: number;
  expiresAt?: number | undefined;
};

const collection = db.collection('refreshTokens');

export const saveRefreshTokenRecord = async (userId: string, hash: string, expiresAt?: number) => {
  const rec: TokenRecord = {
    userId,
    hash,
    revoked: false,
    createdAt: Date.now(),
    expiresAt,
  };
  await collection.add(rec);
};

export const findRefreshTokenRecord = async (hash: string) => {
  const snap = await collection.where('hash', '==', hash).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return { id: doc.id, ...(doc.data() as TokenRecord) };
};

export const revokeRefreshTokenRecord = async (id: string) => {
  await collection.doc(id).update({ revoked: true });
};

export const revokeAllUserTokens = async (userId: string) => {
  const snap = await collection.where('userId', '==', userId).get();
  const batch = db.batch();
  snap.docs.forEach(d => batch.update(d.ref, { revoked: true }));
  await batch.commit();
};
