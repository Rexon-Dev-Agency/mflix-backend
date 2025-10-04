import admin from "firebase-admin";
import { Auth } from "firebase-admin/auth";
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}
export const db = admin.firestore();
export const auth = admin.auth();
//# sourceMappingURL=firebase.js.map