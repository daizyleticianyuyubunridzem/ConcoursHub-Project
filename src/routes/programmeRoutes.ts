import { Router } from "express";
import ProgrammeController from "../controllers/programmeController";

const router = Router();

router.get("/", ProgrammeController.getAllProgrammes);

router.post("/", ProgrammeController.createProgramme);

router.get("/:id", ProgrammeController.getProgrammeById);

router.put("/:id", ProgrammeController.updateProgramme);

router.delete("/:id", ProgrammeController.deleteProgramme);

export default router;