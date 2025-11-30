import { getSubscription, cancelSubscription } from "../utils/subscription.js";
import { errorHandler } from "../handlers/errorHandlers.js";
import { getPlanById } from "../utils/plan.js";
import { getUserSessions, createSession } from "../utils/session.js";

export const checkSubscription = async (req: any, res: any, next: any) => {
    try {
        const userId = req.user?.id;
        if (!userId) return errorHandler({ status: 401, message: "Unauthorized" }, req, res, next);

        const subscription = await getSubscription(userId);
        if (!subscription || subscription instanceof Error) {
            return errorHandler({ status: 403, message: "No active subscription found. Please get a subscription" }, req, res, next);
        }

        const now = new Date();
        const subEndDate = subscription.endDate instanceof Date ? subscription.endDate : new Date(subscription.endDate);

        if (subscription.status === "active" && subEndDate < now) {
            await cancelSubscription(subscription.id);
            return res.status(403).json({ message: "Your subscription has expired. Please renew." });
        }

        if (subscription.status !== "active") {
            return errorHandler({ status: 403, message: "Subscription is expired or inactive" }, req, res, next);
        }

        const plan = await getPlanById(subscription.planId);
        if (!plan) {
            return errorHandler({ status: 500, message: "Subscription plan not found" }, req, res, next);
        }

        // Manage user sessions based on plan limits
        const activeSessions = await getUserSessions(userId);
        if (activeSessions.length >= plan.maxStreams) {
            return errorHandler({ status: 403, message: `Maximum active streams limit reached (${plan.maxStreams}). Please end a session to start a new one.` }, req, res, next);
        }
        
        // Create a session for this device/request
        const deviceId = req.headers["x-device-id"] as string || crypto.randomUUID();
        const deviceInfo = req.headers["user-agent"] || "Unknown Device";
        const ipAddress = req.ip;


        const hasThisDevice =activeSessions.some(s => s.deviceId === deviceId);
        if (!hasThisDevice && activeSessions >= subscription.maxStreams) {
            return errorHandler({ status: 429, message: "Max concurrent streams reached for your plan" }, req, res, () => {});
        }
        


        await createSession({
            userId,
            deviceId,                                                               
            deviceInfo,
            ipAddress,
            lastActiveAt: new Date(),
            createdAt: new Date(),
        });

        req.subscription = subscription;
        req.plan = plan;
        req.deviceId = deviceId;

        next();
    } catch (err: any) {
        console.error("Subscription check error:", err);
        return errorHandler({ status: 500, message: "Internal server error" }, req, res, next);
    }   
};

