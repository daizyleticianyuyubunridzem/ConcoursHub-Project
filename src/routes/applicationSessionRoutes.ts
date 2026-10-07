import { Router } from "express";

import ApplicationSessionController from "../controllers/applicationSessionController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import validate from "../middlewares/validate";
import { createApplicationSessionSchema, updateApplicationSessionSchema } from "../validators/admissionSessionValidator";

const router = Router();

router.get("/", ApplicationSessionController.getAllApplicationSessions);
router.post("/", authMiddleware, roleMiddleware("admin"), validate(createApplicationSessionSchema), ApplicationSessionController.createApplicationSession);
router.get("/:id", ApplicationSessionController.getApplicationSessionById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validate(updateApplicationSessionSchema), ApplicationSessionController.updateApplicationSession);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), ApplicationSessionController.deleteApplicationSession);

export default router;
