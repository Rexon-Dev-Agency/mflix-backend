import type{ Request, Response } from "express";
import { db } from "../config/firebase.js";
import { comparePasswords, hashPassword } from "../utils/passwordHashing.js";
import { sendSuccess } from "../handlers/responseHandler.js";
import { errorHandler } from "../handlers/errorHandlers.js";
import { formatDate } from "../utils/helper.js";
import { isValidEmail, isValidPassword } from "../utils/validation.js";


const usersCollection = db.collection("users");

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

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
    const { email, password } = req.body;
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
        
        sendSuccess(res, { id: userId, ...userData }, "Login successful");
    } catch (error) {
        errorHandler({ status: 500, message: "Server error during login" }, req, res, () => { });
    }
};