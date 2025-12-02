import { plansCollection } from "../config/firebase.js";


export interface Plan {
    id: string;            // document id (eg: 'freemium', 'premium')
    price: number;         // in NGN (or currency unit)
    paystackPlanCode?: string | null;
    interval?: "monthly" | "annual" | string;
    maxProfiles: number;   // number of profiles allowed
    maxStreams: number;    // concurrent streams allowed
    metadata?: any;
};


export const getPlanById = async (planId: string): Promise<Plan | null> => {
    console.log("Fetching plan by ID:", planId);
    const planDoc = await plansCollection.doc(planId).get();
    if (!planDoc.exists) return null;
    return { id: planDoc.id, ...planDoc.data() } as Plan;
};     

export const planList = async (): Promise<Plan[]> => {
    const snapshot = await plansCollection.get();
    const plans: Plan[] = [];
    snapshot.forEach(doc => {
        plans.push({ id: doc.id, ...doc.data() } as Plan);
    });
    return plans;
};

export const upsertPlan = async (planId: string, data: Partial<Plan>): Promise<void> => {
    await plansCollection.doc(planId).set(data, { merge: true });
};