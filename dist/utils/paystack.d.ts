export interface SubscribeUserParams {
    email: string;
    planCode: string;
    userId: string;
}
export declare const subscribeUserToPlan: ({ email, planCode, userId, }: SubscribeUserParams) => Promise<{
    subscriptionId: any;
    planCode: string;
    status: any;
    nextPaymentAt: Date;
    userId: string;
}>;
export declare const verifyTransaction: (reference: string) => Promise<any>;
//# sourceMappingURL=paystack.d.ts.map