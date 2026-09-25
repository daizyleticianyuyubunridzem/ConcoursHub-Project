import { Router } from "express";
import InstitutionController from "../controllers/institutionController";
const router = Router();

router.get("/", InstitutionController.getAllInstitutions);
router.post("/", InstitutionController.createInstitution);
router.get("/:id", InstitutionController.getInstitutionById);
router.put("/:id", InstitutionController.updateInstitution);
router.delete("/:id", InstitutionController.deleteInstitution);

export default router;