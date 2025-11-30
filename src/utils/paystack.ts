import { apiClient } from "./apiClient.js";
import { PAYSTACK_SECRET_KEY } from "../env.js";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export interface SubscribeUserParams {
    email: string;
    planCode: string; // Existing Paystack plan code
    userId: string;
}

export const subscribeUserToPlan = async ({
    email,
    planCode,
    userId,
}: SubscribeUserParams) => {
    try {
        // Initialize subscription via Paystack API
        const url = `${PAYSTACK_BASE_URL}/subscription`;
        const config = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            data: {
                customer: email,
                plan: planCode,
                start: Math.floor(Date.now() / 1000), // subscription start timestamp
            },
        };

        const response = await apiClient(url, config);

        if (!response || response.status !== true) {
            throw new Error("Failed to create subscription in Paystack");
        }

        // Return Paystack subscription info to save locally
        return {
            subscriptionId: response.data.id,
            planCode,
            status: response.data.status, // active / inactive
            nextPaymentAt: new Date(response.data.next_payment_date * 1000),
            userId,
        };
    } catch (err: any) {
        console.error("Subscription Error:", err.message || err);
        throw err;
    }
};

export const verifyTransaction = async (reference: string) => {
    const url = `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`;
    const config = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
    };
    return await apiClient(url, config);
};
