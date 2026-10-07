import { Router } from "express";
import adminViewAuthMiddleware from "../middlewares/adminViewAuthMiddleware";
import AdminViewController from "../controllers/adminViewController";

const router = Router();
router.use(adminViewAuthMiddleware);
router.get("/", AdminViewController.dashboard);
router.get("/account", AdminViewController.account);
router.get("/:page", AdminViewController.resource);
export default router;
