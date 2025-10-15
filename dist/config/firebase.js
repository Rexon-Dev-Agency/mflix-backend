import admin from "firebase-admin";
import { Auth } from "firebase-admin/auth";
import serviceAccountJson from "../config/mflix-app-fd437-firebase-adminsdk-fbsvc-8a750bbda0.json" with { type: "json" }; // adjust path
const serviceAccount = serviceAccountJson;
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
export const db = admin.firestore();
export const auth = admin.auth();
//# sourceMappingURL=firebase.js.map