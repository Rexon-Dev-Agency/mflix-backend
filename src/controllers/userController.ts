import type{ Request, Response } from "express";
import { db } from "../config/firebase.js";
import { errorHandler } from "../handlers/errorHandlers.js";
import { sendSuccess } from "../handlers/responseHandler.js";
import { formatDate } from "../utils/helper.js";
import { isValidEmail } from "../utils/validation.js";
import { comparePasswords, hashPassword } from "../utils/passwordHashing.js";

const usersCollection = db.collection("users");

export const getUserProfile = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id;
        if (!userId) {
            return errorHandler({ status: 401, message: "Unauthorized: User not authenticated" }, req, res, () => {});
        }
        const userDoc = await usersCollection.doc(userId).get();
        if (!userDoc.exists) {
            return errorHandler({ status: 404, message: "User not found" }, req, res, () => {});
        }
        const userData = userDoc.data();
        sendSuccess(res, { user: userData }, "User profile fetched successfully");
    }catch (error: any) {
        console.error("Get User Profile Error:", error);
        errorHandler({ status: 500, message: error.message || "Server error while fetching user profile" }, req, res, () => { });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id;    
        if (!userId) {
            return errorHandler({ status: 401, message: "Unauthorized: User not authenticated" }, req, res, () => {});
        }

        const { email, displayName } = req.body;
        const updates: any = {};

        if (email) {
            if (!isValidEmail(email)) {
                return errorHandler({ status: 400, message: "Invalid email format" }, req, res, () => { });
            }
            updates.email = email;
        }

        if (displayName) {
            updates.displayName = displayName;
        }
        
    
        if (Object.keys(updates).length === 0) {
            return errorHandler({ status: 400, message: "No valid fields to update" }, req, res, () => { });
        }

        await usersCollection.doc(userId).update(updates);
        const updatedUserDoc = await usersCollection.doc(userId).get();
        const updatedUserData = updatedUserDoc.data();

        sendSuccess(res, { user: updatedUserData }, "User profile updated successfully");

    }catch (error: any) {
        console.error("Update User Profile Error:", error); 
        errorHandler({ status: 500, message: error.message || "Server error while updating user profile" }, req, res, () => { });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorHandler({ status: 401, message: "Unauthorized: User not authenticated" }, req, res, () => { });
        }

        const { newPassword, oldPassword } = req.body;

        if (!newPassword || !oldPassword) {
            return errorHandler({ status: 400, message: "Old password and new password are required" }, req, res, () => { });
        }
        const userDoc = await usersCollection.doc(userId).get();
        if (!userDoc.exists) {
            return errorHandler({ status: 404, message: "User not found" }, req, res, () => { });
        }
        const userData = userDoc.data();
        const isOldPasswordValid = await comparePasswords(oldPassword, userData!.password);

        if (!isOldPasswordValid) {
            return errorHandler({ status: 401, message: "Old password is incorrect" }, req, res, () => { });
        }

        const hashedNewPassword = await hashPassword(newPassword);

        await usersCollection.doc(userId).update({ password: hashedNewPassword });
        sendSuccess(res, null, "Password updated successfully");
    } catch (error: any) {
        console.error("Update Password Error:", error);
        errorHandler({ status: 500, message: error.message || "Server error while updating password" }, req, res, () => { });
    }
};

export const addToWatchlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorHandler({ status: 401, message: "Unauthorized: User not authenticated" }, req, res, () => { });
        }

        const { movieId } = req.body;
        if (!movieId) {
            return errorHandler({ status: 400, message: "Movie ID is required" }, req, res, () => { });
        }

        const userDoc = await usersCollection.doc(userId).get();
        if (!userDoc.exists) {
            return errorHandler({ status: 404, message: "User not found" }, req, res, () => { });
        }

        const userData = userDoc.data();
        const watchlist: string[] = userData?.watchlist || [];

        if (watchlist.includes(movieId)) {
            return errorHandler({ status: 409, message: "Movie already in watchlist" }, req, res, () => { });
        }
        watchlist.push(movieId);

        await usersCollection.doc(userId).update({ watchlist });
        sendSuccess(res, { watchlist }, "Movie added to watchlist successfully");
    } catch (error: any) {
        console.error("Add to Watchlist Error:", error);
        errorHandler({ status: 500, message: error.message || "Server error while adding to watchlist" }, req, res, () => { });
    }
};

export const removeFromWatchlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorHandler({ status: 401, message: "Unauthorized: User not authenticated" }, req, res, () => { });
        }

        const { movieId } = req.body;
        if (!movieId) {
            return errorHandler({ status: 400, message: "Movie ID is required" }, req, res, () => { });
        }

        const userDoc = await usersCollection.doc(userId).get();
        if (!userDoc.exists) {
            return errorHandler({ status: 404, message: "User not found" }, req, res, () => { });
        }

        const userData = userDoc.data();

        const watchlist: string[] = userData?.watchlist || [];
        if (!watchlist.includes(movieId)) {
            return errorHandler({ status: 404, message: "Movie not found in watchlist" }, req, res, () => { });
        }

        const updatedWatchlist = watchlist.filter(id => id !== movieId);

        await usersCollection.doc(userId).update({ watchlist: updatedWatchlist });
        sendSuccess(res, { watchlist: updatedWatchlist }, "Movie removed from watchlist successfully");
    } catch (error: any) {
        console.error("Remove from Watchlist Error:", error);
        errorHandler({ status: 500, message: error.message || "Server error while removing from watchlist" }, req, res, () => { });
    }
};


// get watchlist controller
