import { Router } from "express";
import PublicExploreController from "../controllers/publicExploreController";

const router = Router();
router.get("/", PublicExploreController.list);
router.get("/:sessionId", PublicExploreController.details);
export default router;
