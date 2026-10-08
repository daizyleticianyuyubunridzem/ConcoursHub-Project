import { Router } from "express";
import AuthViewController from "../controllers/authViewController";
import authRateLimiter, { passwordResetRateLimiter } from "../middlewares/rateLimitMiddleware";

const router = Router();

router.get("/login", AuthViewController.showLogin);
router.post("/login", authRateLimiter, AuthViewController.login);
router.get("/forgot-password", AuthViewController.showForgotPassword);
router.post("/forgot-password", passwordResetRateLimiter, AuthViewController.requestPasswordReset);
router.get("/reset-password/:token", AuthViewController.showResetPassword);
router.post("/reset-password/:token", passwordResetRateLimiter, AuthViewController.resetPassword);
router.get("/register", AuthViewController.showRegister);
router.post("/register", authRateLimiter, AuthViewController.register);
router.post("/logout", AuthViewController.logout);
router.get("/", AuthViewController.showHome);

export default router;
