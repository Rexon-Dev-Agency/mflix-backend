export interface SubscribeUserParams {
    userId: string;
    email: string;
    planCode: string;
    amount: number;
}
export declare const subscribeUserToPlan: ({ userId, email, planCode, amount, }: SubscribeUserParams) => Promise<{
    subscriptionId: any;
    planCode: string;
    status: any;
    nextPaymentAt: Date;
    userId: string;
}>;
export declare const verifyTransaction: (reference: string) => Promise<any>;
//# sourceMappingURL=paystack.d.ts.map