import { Router } from "express";
import InstitutionController from "../controllers/institutionController";
import validate from "../middlewares/validate";
import { createInstitutionSchema, updateInstitutionSchema } from "../validators/institutionValidator";

const router = Router();

router.get("/", InstitutionController.getAllInstitutions);
router.post("/", validate(createInstitutionSchema), InstitutionController.createInstitution);
router.get("/:id", InstitutionController.getInstitutionById);
router.put("/:id", validate(updateInstitutionSchema), InstitutionController.updateInstitution);
router.delete("/:id", InstitutionController.deleteInstitution);

export default router;