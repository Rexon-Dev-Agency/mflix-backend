import { subscriptionsCollection } from "../config/firebase.js";
export const createOrUpdateSubscription = async (userId, payload) => {
    const userRef = await subscriptionsCollection.doc(userId);
    const now = Date.now();
    await userRef.set({
        ...payload,
        updatedAt: new Date(now),
        ...(payload.createdAt ? {} : { createdAt: new Date(now) }),
    }, { merge: true });
};
export const getSubscription = async (userId) => {
    const userSub = await subscriptionsCollection.doc(userId).get();
    if (!userSub.exists)
        return new Error("Subscription not found, Subscribe to a plan");
    return userSub.data();
};
export const cancelSubscription = async (userId) => {
    const userSub = await subscriptionsCollection.doc(userId).get();
    if (!userSub.exists)
        throw new Error("Subscription not found, cannot cancel");
    await subscriptionsCollection.doc(userId).update({
        status: "canceled",
        updatedAt: new Date(),
    });
};
//# sourceMappingURL=subscription.js.map