import { Router } from "express";

import ApplicationSessionController from "../controllers/applicationSessionController";
import validate from "../middlewares/validate";
import { createApplicationSessionSchema, updateApplicationSessionSchema } from "../validators/admissionSessionValidator";

const router = Router();

router.get("/", ApplicationSessionController.getAllApplicationSessions);
router.post("/", validate(createApplicationSessionSchema), ApplicationSessionController.createApplicationSession);
router.get("/:id", ApplicationSessionController.getApplicationSessionById);
router.put("/:id", validate(updateApplicationSessionSchema), ApplicationSessionController.updateApplicationSession);
router.delete("/:id", ApplicationSessionController.deleteApplicationSession);

export default router;
