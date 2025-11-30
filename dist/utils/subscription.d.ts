import type { Plan } from "./plan.js";
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
export declare const createOrUpdateSubscription: (userId: string, payload: Partial<Subscription>) => Promise<void>;
export declare const getSubscription: (userId: string) => Promise<Error | FirebaseFirestore.DocumentData | undefined>;
export declare const cancelSubscription: (userId: string) => Promise<void>;
//# sourceMappingURL=subscription.d.ts.map