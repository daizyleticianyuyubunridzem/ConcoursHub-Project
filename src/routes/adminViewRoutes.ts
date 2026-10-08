import { Router } from "express";
import adminViewAuthMiddleware from "../middlewares/adminViewAuthMiddleware";
import AdminViewController from "../controllers/adminViewController";

const router = Router();
router.use(adminViewAuthMiddleware);
router.get("/", AdminViewController.dashboard);
router.get("/account", AdminViewController.account);
router.get("/account/edit", AdminViewController.editAccount);
router.post("/account/edit", AdminViewController.updateAccount);
router.get("/:page", AdminViewController.resource);
export default router;
