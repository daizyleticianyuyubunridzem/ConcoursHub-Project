import { Router } from "express";
import AuthViewController from "../controllers/authViewController";
import authRateLimiter from "../middlewares/rateLimitMiddleware";

const router = Router();

router.get("/login", AuthViewController.showLogin);
router.post("/login", authRateLimiter, AuthViewController.login);
router.get("/register", AuthViewController.showRegister);
router.post("/register", authRateLimiter, AuthViewController.register);
router.post("/logout", AuthViewController.logout);
router.get("/", AuthViewController.showHome);

export default router;
