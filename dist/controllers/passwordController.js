import crypto from "crypto";
import { db } from "../config/firebase.js";
import { sendMail } from "../utils/email.js";
import { hashPassword } from "../utils/passwordHashing.js";
import { errorHandler } from "../handlers/errorHandlers.js";
import { sendSuccess } from "../handlers/responseHandler.js";
import { RESET_PASSWORD_REDIRECT_URL } from "../env.js";
const userCollection = db.collection("users");
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const snapshot = await userCollection
        .where("email", "==", email.trim().toLowerCase())
        .get();
    if (snapshot.empty) {
        console.log("Searching for email:", email);
        console.log("Docs found:", snapshot.size);
        return errorHandler({ status: 404, message: "Email not found" }, req, res, () => { });
    }
    const userDoc = snapshot.docs[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 1000 * 60 * 30; //30 mins
    await userDoc?.ref.update({ resetToken: token, resetTokenExpiresAt: expiresAt });
    const resetLink = `${RESET_PASSWORD_REDIRECT_URL}?token=${token}`;
    const html = `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`;
    await sendMail(email, "Password Reset Request", html);
    sendSuccess(res, {}, "Password reset email sent");
};
export const resetPassword = async (req, res) => {
    const { token, newPassword: rawNewPassword } = req.body;
    const newPassword = rawNewPassword.trim();
    const snapshot = await userCollection.where("resetToken", "==", token).get();
    if (snapshot.empty) {
        return errorHandler({ status: 400, message: "Invalid or expired token" }, req, res, () => { });
    }
    const userDoc = snapshot.docs[0];
    const userData = userDoc?.data();
    if (userData?.resetTokenExpiresAt < Date.now()) {
        return errorHandler({ status: 400, message: "Token has expired" }, req, res, () => { });
    }
    const hashedPassword = await hashPassword(newPassword);
    await userDoc?.ref.update({ password: hashedPassword, resetToken: null, resetTokenExpiresAt: null });
    sendSuccess(res, {}, "Password has been reset successfully");
};
//# sourceMappingURL=passwordController.js.map