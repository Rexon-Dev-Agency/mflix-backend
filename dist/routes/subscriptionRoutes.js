import Router from "express";
import { subscribeToPlan, getSubscriptionInfo, cancelUserSubscription } from "../controllers/subscriptionController.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
router.post('/subscribe/:planId', authMiddleware, subscribeToPlan);
router.get('/subscription', authMiddleware, checkSubscription, getSubscriptionInfo);
router.post('/cancel', authMiddleware, checkSubscription, cancelUserSubscription);
export const subscriptionRouter = router;
//# sourceMappingURL=subscriptionRoutes.js.map