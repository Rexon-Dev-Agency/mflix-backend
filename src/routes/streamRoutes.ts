import { Router } from "express";
import { startStreamSession } from "../controllers/streamController.js";
import { heartbeatSession } from "../controllers/streamController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";
import { endSession } from "../utils/session.js";

const router = Router();

// Start a stream (creates session, enforces limits)
router.get("/:movieId", authMiddleware, checkSubscription, startStreamSession);

// Heartbeat (keep session alive)
router.post("/heartbeat", authMiddleware, heartbeatSession);

// End session (optional): client can call to free slot
router.post("/end", authMiddleware, async (req, res) => {
  const { deviceId } = req.body;
  if (!deviceId) return res.status(400).json({ message: "deviceId required" });
  try {
    await endSession(deviceId);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Failed to end session" });
  }
});

export const streamRouter = router;
