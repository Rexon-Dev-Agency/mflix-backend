import { db } from "../config/firebase.js";
import { plansCollection } from "../config/firebase.js";
;
export const getPlanById = async (planId) => {
    const planDoc = await plansCollection.doc(planId).get();
    if (!planDoc.exists)
        return null;
    return { id: planDoc.id, ...planDoc.data() };
};
export const planList = async () => {
    const snapshot = await plansCollection.get();
    const plans = [];
    snapshot.forEach(doc => {
        plans.push({ id: doc.id, ...doc.data() });
    });
    return plans;
};
export const upsertPlan = async (planId, data) => {
    await plansCollection.doc(planId).set(data, { merge: true });
};
//# sourceMappingURL=plan.js.map