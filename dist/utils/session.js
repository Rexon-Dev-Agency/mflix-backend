import { sessionsCollection } from "../config/firebase.js";
;
export const createSession = async (sessions) => {
    const now = Date.now();
    await sessionsCollection.doc(`${sessions.userId}_${sessions.deviceId}`).set({
        ...sessions,
        lastActiveAt: new Date(now),
        createdAt: new Date(now),
    });
};
export const updateSessionActivity = async (userId, deviceId) => {
    await sessionsCollection.doc(`${userId}_${deviceId}`).update({
        lastActiveAt: new Date(),
    });
};
export const endSession = async (userId, deviceId) => {
    await sessionsCollection.doc(`${userId}_${deviceId}`).delete();
};
export const getUserSessions = async (userId) => {
    const snapshot = await sessionsCollection.where("userId", "==", userId).get();
    const sessions = [];
    snapshot.forEach(doc => {
        sessions.push(doc.data());
    });
    return sessions;
};
export const getAllSessionsIdleBefore = async (cutoffDate) => {
    const snapshot = await sessionsCollection.where("lastActiveAt", "<", cutoffDate).get();
    const sessions = [];
    snapshot.forEach(doc => {
        sessions.push(doc.data());
    });
    return sessions;
};
export const endIdleSessions = async (maxIdleMinutes = 30) => {
    const cutoffDate = new Date(Date.now() - maxIdleMinutes * 60 * 1000);
    const idleSessions = await getAllSessionsIdleBefore(cutoffDate);
    if (idleSessions.length === 0)
        return;
    const batch = sessionsCollection.firestore.batch();
    idleSessions.forEach(session => {
        const docRef = sessionsCollection.doc(`${session.userId}_${session.deviceId}`);
        batch.delete(docRef);
    });
    await batch.commit();
};
//# sourceMappingURL=session.js.map