import type { Firestore } from "@google-cloud/firestore";
import admin from "firebase-admin";
import { Auth } from "firebase-admin/auth";
import serviceAccountJson from "../config/mflix-app-fd437-firebase-adminsdk-fbsvc-8a750bbda0.json" with { type: "json" }; // adjust path

const serviceAccount = serviceAccountJson as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db: Firestore = admin.firestore();
export const auth: Auth = admin.auth();