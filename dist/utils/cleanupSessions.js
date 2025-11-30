import { getAllSessionsIdleBefore, endSession } from "./session.js";
export const cleanupIdleSessions = async (maxIdleMinutes = 30) => {
    try {
        const cutoffDate = new Date(Date.now() - maxIdleMinutes * 60 * 1000);
        const idleSessions = await getAllSessionsIdleBefore(cutoffDate);
        if (idleSessions.length === 0) {
            console.log("No idle sessions found for cleanup.");
            return 0;
        }
        console.log(`Found ${idleSessions.length} idle sessions to clean up.`);
        // Delete sessions individually or in batches if needed
        const deletePromises = idleSessions.map(session => endSession(`${session.userId}_${session.deviceId}`));
        await Promise.all(deletePromises);
        console.log(`Successfully cleaned up ${idleSessions.length} idle sessions.`);
        return idleSessions.length;
    }
    catch (error) {
        console.error("Error during idle session cleanup:", error);
        throw error; // Re-throw to let the caller handle it
    }
};
//# sourceMappingURL=cleanupSessions.js.map