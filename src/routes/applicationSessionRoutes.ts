import { Router } from "express";

import ApplicationSessionController from "../controllers/applicationSessionController";

const router = Router();

router.get("/", ApplicationSessionController.getAllApplicationSessions);
router.post("/", ApplicationSessionController.createApplicationSession);
router.get("/:id", ApplicationSessionController.getApplicationSessionById);
router.put("/:id", ApplicationSessionController.updateApplicationSession);
router.delete("/:id", ApplicationSessionController.deleteApplicationSession);

export default router;