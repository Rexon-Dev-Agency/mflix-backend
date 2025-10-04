import type { Firestore } from "@google-cloud/firestore";
import admin from "firebase-admin";
import {Auth} from "firebase-admin/auth";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export const db: Firestore = admin.firestore();
export const auth: Auth = admin.auth();