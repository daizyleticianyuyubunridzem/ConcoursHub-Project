import { Router } from "express";
import ProgrammeController from "../controllers/programmeController";
import validate from '../middlewares/validate';
import { createProgrammeSchema, updateProgrammeSchema } from '../validators/programmeValidator';

const router = Router();

router.get("/", ProgrammeController.getAllProgrammes);
router.post("/", validate(createProgrammeSchema), ProgrammeController.createProgramme);
router.get("/:id", ProgrammeController.getProgrammeById);
router.put("/:id", validate(updateProgrammeSchema), ProgrammeController.updateProgramme);
router.delete("/:id", ProgrammeController.deleteProgramme);

export default router;