export interface DeviceSession {
    userId: string;
    deviceId: string;
    deviceInfo: string;
    ipAddress: string;
    lastActiveAt: Date;
    createdAt: Date;
}
export declare const createSession: (sessions: DeviceSession) => Promise<void>;
export declare const updateSessionActivity: (userId: string, deviceId: string) => Promise<void>;
export declare const endSession: (userId: string, deviceId: string) => Promise<void>;
export declare const getUserSessions: (userId: string) => Promise<DeviceSession[]>;
export declare const getAllSessionsIdleBefore: (cutoffDate: Date) => Promise<DeviceSession[]>;
export declare const endIdleSessions: (maxIdleMinutes?: number) => Promise<void>;
//# sourceMappingURL=session.d.ts.map