import { register, login } from "../controllers/authController.js";
import { Router } from "express";
const router = Router();
router.post('/register', register);
router.post('/login', login);
export const authRouter = router;
//# sourceMappingURL=authRoutes.js.map