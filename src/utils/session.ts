import{ sessionsCollection }from "../config/firebase.js";

export interface DeviceSession {
    userId: string;
    deviceId: string;   
    deviceInfo: string; // e.g., "iPhone 12, iOS 14.4"
    ipAddress: string;
    lastActiveAt: Date;
    createdAt: Date;
};


export const createSession = async (
    sessions: DeviceSession
) => {
    const now = Date.now();
    await sessionsCollection.doc(`${sessions.userId}_${sessions.deviceId}`).set({
        ...sessions,
        lastActiveAt: new Date(now),
        createdAt: new Date(now),
    });
};

export const updateSessionActivity = async (deviceId: string) => {
    await sessionsCollection.doc(deviceId).update({
        lastActiveAt: new Date(),
    });
};

export const endSession = async (deviceId: string) => {
    await sessionsCollection.doc(deviceId).delete();
};

export const getUserSessions = async (userId: string): Promise<DeviceSession[]> => {
    const snapshot = await sessionsCollection.where("userId", "==", userId).get();
    const sessions: DeviceSession[] = [];
    snapshot.forEach(doc => {
        sessions.push(doc.data() as DeviceSession);
    });
    return sessions;
};


export const getAllSessionsIdleBefore = async (cutoffDate: Date): Promise<DeviceSession[]> => {
    const snapshot = await sessionsCollection.where("lastActiveAt", "<", cutoffDate).get();
    const sessions: DeviceSession[] = [];   
    snapshot.forEach(doc => {
        sessions.push(doc.data() as DeviceSession);
    });
    return sessions;
};

export const endIdleSessions = async (maxIdleMinutes = 30): Promise<void> => {
    const cutoffDate = new Date(Date.now() - maxIdleMinutes * 60 * 1000);
    const idleSessions = await getAllSessionsIdleBefore(cutoffDate);
    if (idleSessions.length === 0) return;
    const batch = sessionsCollection.firestore.batch();
    idleSessions.forEach(session => {
        const docRef = sessionsCollection.doc(`${session.userId}_${session.deviceId}`);
        batch.delete(docRef);
    });
    await batch.commit();
};
