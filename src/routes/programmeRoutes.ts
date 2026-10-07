import { Router } from "express";
import ProgrammeController from "../controllers/programmeController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import validate from '../middlewares/validate';
import { createProgrammeSchema, updateProgrammeSchema } from '../validators/programmeValidator';

const router = Router();

router.get("/", ProgrammeController.getAllProgrammes);
router.post("/", authMiddleware, roleMiddleware("admin"), validate(createProgrammeSchema), ProgrammeController.createProgramme);
router.get("/:id", ProgrammeController.getProgrammeById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validate(updateProgrammeSchema), ProgrammeController.updateProgramme);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), ProgrammeController.deleteProgramme);

export default router;
