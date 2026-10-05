import AuthController from "../controllers/authController";
import { Router } from "express";
import validate from "../middlewares/validate";
import { createUserSchema, loginUserSchema } from "../validators/userValidator";
import authRateLimiter from "../middlewares/rateLimitMiddleware";
const router = Router();

router.post('/register', authRateLimiter, validate(createUserSchema), AuthController.register);
router.post('/login', authRateLimiter, validate(loginUserSchema),AuthController.login);
router.post('/logout', AuthController.logout);

export default router;
