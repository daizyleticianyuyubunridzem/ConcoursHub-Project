import { Router } from "express";
import AuthViewController from "../controllers/authViewController";

const router = Router();

router.get("/login", AuthViewController.showLogin);
router.post("/login", AuthViewController.login);

export default router;