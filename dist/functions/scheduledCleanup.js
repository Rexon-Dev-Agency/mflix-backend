import { onSchedule } from "firebase-functions/v2/scheduler";
import { cleanupIdleSessions } from "../utils/cleanupSessions.js";
const MAX_IDLE_MINUTES = Number(process.env.SESSION_IDLE_MINUTES ?? 30);
// Scheduled Cloud Function: runs every 5 minutes to clean up idle sessions
export const scheduledCleanupIdleSessions = onSchedule("every 5 minutes", async (context) => {
    try {
        const deleted = await cleanupIdleSessions(MAX_IDLE_MINUTES);
        if (deleted > 0) {
            console.log(`Cleaned up ${deleted} idle sessions`);
        }
    }
    catch (err) {
        console.error("Scheduled cleanup failed", err);
    }
});
//# sourceMappingURL=scheduledCleanup.js.map