export interface Plan {
    id: string;
    price: number;
    paystackPlanCode?: string | null;
    interval?: "monthly" | "annual" | string;
    maxProfiles: number;
    maxStreams: number;
    metadata?: any;
}
export declare const getPlanById: (planId: string) => Promise<Plan | null>;
export declare const planList: () => Promise<Plan[]>;
export declare const upsertPlan: (planId: string, data: Partial<Plan>) => Promise<void>;
//# sourceMappingURL=plan.d.ts.map