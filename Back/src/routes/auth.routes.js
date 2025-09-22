import { Router } from "express";
import { register, login, user, logout } from "../controller/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", verifyToken, user);
router.post("/logout", logout);

export default router;
