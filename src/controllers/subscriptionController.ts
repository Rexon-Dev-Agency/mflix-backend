import type { Request, Response } from "express";
import { errorHandler } from "../handlers/errorHandlers.js";
import { sendSuccess } from "../handlers/responseHandler.js";
import { subscribeUserToPlan } from "../utils/paystack.js";
import { getPlanById, planList } from "../utils/plan.js";
import { createOrUpdateSubscription, cancelSubscription, getSubscription } from "../utils/subscription.js";

export const subscribeToPlan = async (req: Request, res: Response) => {
    const { planId } = req.params;
    const user = req.user;

    if (!planId || !user?.email || !user?.id) {
        return errorHandler(
            { status: 400, message: "Plan ID and user email required" }, req, res, () => {}
        );
    }

    const plan = await getPlanById(planId);
    if (!plan || !plan.paystackPlanCode) {
        return errorHandler(
            { status: 404, message: "Plan not found" }, req, res, () => {}
        );
    }

    // Calculate subscription end date
    const durationMs =
        plan.interval === "monthly"
            ? 30 * 24 * 60 * 60 * 1000
            : 365 * 24 * 60 * 60 * 1000; // annual

    try {
        // Call Paystack to subscribe user to the existing plan
        const paystackResponse = await subscribeUserToPlan({
            email: user.email,
            planCode: plan.paystackPlanCode,
            userId: user.id,
            amount: plan.price,
        });

        // Save subscription locally
        const subscription = await createOrUpdateSubscription(user.id, {
            planId: plan.id,
            paystackSubscriptionId: paystackResponse.subscriptionId,
            status: "active",
            startDate: new Date(),
            endDate: new Date(Date.now() + durationMs),
        });

        return sendSuccess(res, {
            message: "Subscription created successfully",
            subscription,
        });
    } catch (error: any) {
        console.error("Subscription Error:", error);
        return errorHandler(
            { status: 500, message: error.message || "Failed to create subscription" },
            req,
            res,
            () => {}
        );
    }
};

export const getSubscriptionInfo = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return errorHandler(
            { status: 401, message: "Unauthorized" }, req, res, () => {}
        );
    }

    try {
        const subscriptionData = await getSubscription(userId);
        return sendSuccess(res, { subscription: subscriptionData }, "Subscription fetched successfully");
    } catch (error: any) {
        console.error("Get Subscription Info Error:", error);
        return errorHandler(
            { status: 500, message: error.message || "Failed to fetch subscription info" }, req, res,  () => {}
        );
    }
};

export const getAvailablePlans = async (req: Request, res: Response) => {
    try {
        const plans = await planList();
        return sendSuccess(res, { plans }, "Available plans fetched successfully");
    } catch (error: any) {
        console.error("Get Available Plans Error:", error);
        return errorHandler(
            { status: 500, message: error.message || "Failed to fetch available plans" }, req, res, () => {}
        );
    }
};

export const cancelUserSubscription = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return errorHandler(
            { status: 401, message: "Unauthorized" }, req, res, () => {}
        );
    }
    try {
        await cancelSubscription(userId);
        return sendSuccess(res, { message: "Subscription canceled successfully" });
    } catch (error: any) {
        console.error("Cancel Subscription Error:", error); 
        return errorHandler(
            { status: 500, message: error.message || "Failed to cancel subscription" }, req, res, () => {}
        );

    }
};  