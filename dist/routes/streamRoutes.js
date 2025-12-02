import { Router } from "express";
import { startStreamSession } from "../controllers/streamController.js";
import { heartbeatSession } from "../controllers/streamController.js";
import { endStreamSession } from "../controllers/streamController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";
const router = Router();
// Start a stream (creates session, enforces limits)
router.get("/:movieId", authMiddleware, checkSubscription, startStreamSession);
// Heartbeat (keep session alive)
router.post("/heartbeat", authMiddleware, heartbeatSession);
// End session (optional): client can call to free slot
router.post("/end", authMiddleware, endStreamSession);
export const streamRouter = router;
//# sourceMappingURL=streamRoutes.js.map