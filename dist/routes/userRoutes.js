import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getUserProfile, updateUserProfile, updatePassword, addToWatchlist, removeFromWatchlist } from "../controllers/userController.js";
const router = Router();
router.get('/profile', authMiddleware, getUserProfile);
router.patch('/profile', authMiddleware, updateUserProfile);
router.put('/password', authMiddleware, updatePassword);
router.post('/watchlist', authMiddleware, addToWatchlist);
router.delete('/watchlist/:movieId', authMiddleware, removeFromWatchlist);
export const userRouter = router;
//# sourceMappingURL=userRoutes.js.map