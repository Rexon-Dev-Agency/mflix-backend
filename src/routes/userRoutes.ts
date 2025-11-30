import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";
import { 
    getUserProfile, 
    updateUserProfile, 
    updatePassword, 
    addToWatchlist, 
    removeFromWatchlist,
    getUserSubscriptionInfo
} from "../controllers/userController.js";

const router = Router();

router.get('/me', authMiddleware, getUserProfile);
router.patch('/me', authMiddleware, updateUserProfile);
router.get('/me/subscription', authMiddleware, getUserSubscriptionInfo);
router.put('/password', authMiddleware, updatePassword);
router.post('/watchlist/:movieId', authMiddleware, addToWatchlist);
router.delete('/watchlist/:movieId', authMiddleware, removeFromWatchlist);

export const userRouter = router;
