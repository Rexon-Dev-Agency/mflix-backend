import type { Request, Response } from "express";
import { errorHandler } from "../handlers/errorHandlers.js";
import { sendSuccess } from "../handlers/responseHandler.js";
import { createSession, updateSessionActivity } from "../utils/session.js";
import { fetchStreamUrl } from "../utils/externalProvider.js";


export const startStreamSession = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return errorHandler({ status: 401, message: "Unauthorized" }, req, res, () => {});
    }

    const movieId = req.params.movieId;
    if (!movieId) {
        return errorHandler({ status: 400, message: "Movie ID is required to start a stream" }, req, res, () => {});
    }

    const deviceId = req.headers["x-device-id"] as string || crypto.randomUUID();
    const deviceInfo = req.headers["user-agent"] || "Unknown Device";
    const ipAddress = req.ip ?? req.socket?.remoteAddress ?? "Unknown";

    if (!deviceId) {
        return errorHandler({ status: 400, message: "Device ID is required" }, req, res, () => {});
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
        return sendSuccess(res, { message: "Stream session started successfully", deviceId }, streamUrl);
    } catch (error: any) {
        console.error("Start Stream Session Error:", error);
        return errorHandler({ status: 500, message: "Failed to start stream session" }, req, res, () => {});
    }
};

export const heartbeatSession = async (req: any, res: any) => {
    const userId = req.user?.id;
    if (!userId) {
        return errorHandler({ status: 401, message: "Unauthorized" }, req, res, () => {});
    }

    try {
        const deviceId = req.deviceId;
        if (!deviceId) {
            return errorHandler({ status: 400, message: "Device ID missing in request" }, req, res, () => {});
        }
        await updateSessionActivity(`${req.user.id}_${deviceId}`);
        res.status(200).json({ message: "Session heartbeat updated" });
    } catch (err: any) {
        console.error("Heartbeat error:", err);
        return errorHandler({ status: 500, message: "Internal server error" }, req, res, () => {});
    }
};