import { upsertPlan } from "../utils/plan.js";

const initPlans = async () => {
    await upsertPlan("basic", { id: "Basic", price: 0, interval: "monthly", maxStreams: 1, maxProfiles: 1, paystackPlanCode: ""});
    await upsertPlan("premium", { id: "Premium", price: 3500, interval: "monthly", maxStreams: 2, maxProfiles: 4, paystackPlanCode: "PLN_8dlddadozed9ab5" });
    await upsertPlan("pro", { id: "Pro", price: 5000, interval: "monthly", maxStreams: 5, maxProfiles: 6, paystackPlanCode: "PLN_mwvlisbgch9oarm" });
    await upsertPlan("family", { id: "Family", price: 76000, interval: "annual", maxStreams: 5, maxProfiles: 6, paystackPlanCode: "PLN_22w060mgegm9ql2" });
    console.log("Plans initialized");
};

initPlans().catch(console.error);