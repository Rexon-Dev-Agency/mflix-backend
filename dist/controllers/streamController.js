import { errorHandler } from "../handlers/errorHandlers.js";
import { sendSuccess } from "../handlers/responseHandler.js";
import { createSession, updateSessionActivity, endSession } from "../utils/session.js";
import { fetchStreamUrl } from "../utils/externalProvider.js";
export const startStreamSession = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return errorHandler({ status: 401, message: "Unauthorized" }, req, res, () => { });
    }
    const movieId = parseInt(req.params.id ?? '0');
    if (!movieId) {
        return errorHandler({ status: 400, message: "Movie ID is required to start a stream" }, req, res, () => { });
    }
    const deviceId = req.headers["x-device-id"] || crypto.randomUUID();
    const deviceInfo = req.headers["user-agent"] || "Unknown Device";
    const ipAddress = req.ip ?? req.socket?.remoteAddress ?? "Unknown";
    if (!deviceId) {
        return errorHandler({ status: 400, message: "Device ID is required" }, req, res, () => { });
    }
    try {
        const streamUrl = await fetchStreamUrl(movieId, {
            type: req.query.type === "tv" ? "tv" : "movie",
            ...(req.query.season && { season: Number(req.query.season) }),
            ...(req.query.episode && { episode: Number(req.query.episode) }),
        });
        await createSession({
            userId,
            deviceId,
            deviceInfo,
            ipAddress,
            lastActiveAt: new Date(),
            createdAt: new Date(),
        });
        return sendSuccess(res, { streamUrl, deviceId }, "Stream session started successfully");
    }
    catch (error) {
        console.error("Start Stream Session Error:", error);
        return errorHandler({ status: 500, message: "Failed to start stream session" }, req, res, () => { });
    }
};
export const heartbeatSession = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return errorHandler({ status: 401, message: "Unauthorized" }, req, res, () => { });
    }
    try {
        const deviceId = req.headers["x-device-id"] || crypto.randomUUID();
        if (!deviceId) {
            return errorHandler({ status: 400, message: "Device ID missing in request" }, req, res, () => { });
        }
        await updateSessionActivity(userId, deviceId);
        res.status(200).json({ message: "Session heartbeat updated" });
    }
    catch (err) {
        console.error("Heartbeat error:", err);
        return errorHandler({ status: 500, message: "Internal server error" }, req, res, () => { });
    }
};
export const endStreamSession = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return errorHandler({ status: 401, message: "Unauthorized" }, req, res, () => { });
    }
    const deviceId = req.headers["x-device-id"] || crypto.randomUUID();
    if (!deviceId) {
        return errorHandler({ status: 400, message: "Device ID missing in request" }, req, res, () => { });
    }
    try {
        await endSession(userId, deviceId);
        return sendSuccess(res, { message: "Stream session ended successfully" });
    }
    catch (err) {
        console.error("End Stream Session Error:", err);
        return errorHandler({ status: 500, message: "Failed to end stream session" }, req, res, () => { });
    }
};
//# sourceMappingURL=streamController.js.map