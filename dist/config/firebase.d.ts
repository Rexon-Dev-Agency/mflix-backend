import admin from "firebase-admin";
import { Auth } from "firebase-admin/auth";
export declare const db: admin.firestore.Firestore;
export declare const auth: Auth;
export declare const subscriptionsCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>;
export declare const usersCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>;
export declare const plansCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>;
export declare const sessionsCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>;
//# sourceMappingURL=firebase.d.ts.map