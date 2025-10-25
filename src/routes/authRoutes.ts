import { register, login, refresh, logout } from "../controllers/authController.js";
import {Router} from "express";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);








export const authRouter = router;

