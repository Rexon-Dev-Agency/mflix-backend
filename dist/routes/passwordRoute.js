import { Router } from "express";
import { requestPasswordReset, resetPassword } from "../controllers/passwordController.js";
const router = Router();
router.post('/request-reset', requestPasswordReset);
router.post('/reset', resetPassword);
export const passwordRouter = router;
//# sourceMappingURL=passwordRoute.js.map