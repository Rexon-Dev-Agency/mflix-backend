import type{ Request, Response } from "express";
import { db } from "../config/firebase.js";
import { comparePasswords, hashPassword } from "../utils/passwordHashing.js";
import { sendSuccess } from "../handlers/responseHandler.js";
import { errorHandler } from "../handlers/errorHandlers.js";
import { formatDate } from "../utils/helper.js";
import { isValidEmail, isValidPassword } from "../utils/validation.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.js";
import { hashToken } from "../utils/crypto.js";
import { saveRefreshTokenRecord, findRefreshTokenRecord, revokeRefreshTokenRecord } from "../services/refreshTokenService.js";


const usersCollection = db.collection("users");

export const register = async (req: Request, res: Response) => {
    const { email, password: rawPassword } = req.body;
    const password = rawPassword.trim();

    if (!email || !password) {
        return errorHandler({ status: 400, message: "Email and password are required" }, req, res, () => { });
    }
    if (!isValidEmail(email)) {
        return errorHandler({ status: 400, message: "Invalid email format" }, req, res, () => { });
    }
    if (!isValidPassword(password)) {
        return errorHandler({ status: 400, message: "Password must be at least 8 characters long" }, req, res, () => { });
    }

    try {
        const existingUserSnapshot = await usersCollection.where("email", "==", email).get();
        if (!existingUserSnapshot.empty) {
            errorHandler({ status: 409, message: "Email already in use" }, req, res, () => { });
            return
        }
        const hashedPassword = await hashPassword(password);
        const newUser = {
            email,
            password: hashedPassword,
            displayName: email.split("@")[0],
            createdAt: formatDate(new Date()),
        };
        const userRef = await usersCollection.add(newUser);
        const userId = userRef.id;
        sendSuccess(res, { id: userId, ...newUser }, "User registered successfully");
    } catch (error: any) {
        console.error("Registration Error:", error);
        errorHandler({ status: 500, message: error.message || "Server error during registration" }, req, res, () => { }); 
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password: rawPassword } = req.body;
    const password = rawPassword.trim();
    if (!email || !password) {
        return errorHandler({ status: 400, message: "Email and password are required" }, req, res, () => { });
    }
    if (!isValidEmail(email)) {
        return errorHandler({ status: 400, message: "Invalid email format" }, req, res, () => { });
    }
    if (!isValidPassword(password)) {
        return errorHandler({ status: 400, message: "Password must be at least 8 characters long" }, req, res, () => { });
    }
    
    try{
        const userSnapshot = await usersCollection
            .where("email", "==", email)
            .get();

        if (userSnapshot.empty) {
            return errorHandler({ status: 401, message: "Invalid email or password" }, req, res, () => { });
        }

        const userDoc = userSnapshot.docs[0];
        
        if (!userDoc) {
            errorHandler({ status: 401, message: "Invalid email or password" }, req, res, () => {});
            return
        }
        
        const userData = userDoc.data();
        
        const isPasswaordValid = await comparePasswords(password, userData.password);
        
        if (!isPasswaordValid) {
            return errorHandler({ status: 401, message: "Invalid email or password" }, req, res, () => { });
        }

        const userId = userDoc.id;
        // generate tokens
        const accessToken = generateAccessToken({ sub: userId, email });
        const refreshToken = generateRefreshToken({ sub: userId });

        // save hashed refresh token
        const hashed = hashToken(refreshToken);
        await saveRefreshTokenRecord(userId, hashed);

        sendSuccess(res, { accessToken, refreshToken, id: userId, ...userData }, "Login successful");
    } catch (error) {
        errorHandler({ status: 500, message: "Server error during login" }, req, res, () => { });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return errorHandler({ status: 401, message: 'No refresh token provided' }, req, res, () => { });

    let payload: any;
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch (err) {
        return errorHandler({ status: 401, message: 'Invalid refresh token' }, req, res, () => { });
    }

    const userId = payload.sub as string;
    const hashed = hashToken(refreshToken);
    const record = await findRefreshTokenRecord(hashed);
    if (!record || record.revoked) {
        return errorHandler({ status: 401, message: 'Refresh token revoked or not found' }, req, res, () => { });
    }

    // rotate: revoke old and issue new
    await revokeRefreshTokenRecord(record.id);
    const newRefreshToken = generateRefreshToken({ sub: userId });
    const newHashed = hashToken(newRefreshToken);
    await saveRefreshTokenRecord(userId, newHashed);

    const newAccessToken = generateAccessToken({ sub: userId });
    sendSuccess(res, { accessToken: newAccessToken, refreshToken: newRefreshToken }, 'Tokens refreshed');
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendSuccess(res, {}, 'Logged out');
    const hashed = hashToken(refreshToken);
    const record = await findRefreshTokenRecord(hashed);
    if (record) await revokeRefreshTokenRecord(record.id);
    sendSuccess(res, {}, 'Logged out');
};