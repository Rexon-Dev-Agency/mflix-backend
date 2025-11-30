import type { Plan } from "./plan.js";
import { subscriptionsCollection } from "../config/firebase.js";

export interface Subscription {
    userId: string;
    planId: string;
    plan?: Plan;
    status: "active" | "canceled" | "expired" | "pending";
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    paystackSubscriptionId?: string;
    paystackCustomerId?: string;                                                                                                                
}



export const createOrUpdateSubscription = async (
    userId: string,
    payload: Partial<Subscription>
) => {
    const userRef = await subscriptionsCollection.doc(userId);
    const now = Date.now();

    await userRef.set({
        ...(payload as any),
        updatedAt: new Date(now),
        ...(payload.createdAt ? {} : { createdAt: new Date(now) }),
    }, { merge: true})
};

export const getSubscription = async (userId: string) => {
    const userSub = await subscriptionsCollection.doc(userId).get();
    if (!userSub.exists) return new Error("Subscription not found, Subscribe to a plan");
    return userSub.data();
};

export const cancelSubscription = async (userId: string) => {
    const userSub = await subscriptionsCollection.doc(userId).get();
    if (!userSub.exists) throw new Error("Subscription not found, cannot cancel");
    await subscriptionsCollection.doc(userId).update({
        status: "canceled",
        updatedAt: new Date(),
    });
};
