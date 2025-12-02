import Router from "express";
import { subscribeToPlan, getSubscriptionInfo, getAvailablePlans, cancelUserSubscription } from "../controllers/subscriptionController.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
router.post('/subscribe/:planId', authMiddleware, subscribeToPlan);
router.get('/plans', getAvailablePlans);
router.get('/user-subscription', authMiddleware, getSubscriptionInfo);
router.post('/cancel', authMiddleware, checkSubscription, cancelUserSubscription);
export const subscriptionRouter = router;
//# sourceMappingURL=subscriptionRoutes.js.map