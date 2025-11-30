import admin from "firebase-admin";
import { Auth } from "firebase-admin/auth";
import { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } from "../env.js";
const serviceAccount = {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};
if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    throw new Error("Missing Firebase service account environment variables");
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
admin.firestore().settings({ ignoreUndefinedProperties: true });
export const db = admin.firestore();
export const auth = admin.auth();
export const subscriptionsCollection = db.collection("subscriptions");
export const usersCollection = db.collection("users");
export const plansCollection = db.collection("plans");
export const sessionsCollection = db.collection("devices");
//# sourceMappingURL=firebase.js.map