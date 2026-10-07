import { Router } from "express";
import InstitutionController from "../controllers/institutionController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import validate from "../middlewares/validate";
import { createInstitutionSchema, updateInstitutionSchema } from "../validators/institutionValidator";

const router = Router();

router.get("/", InstitutionController.getAllInstitutions);
router.post("/", authMiddleware, roleMiddleware("admin"), validate(createInstitutionSchema), InstitutionController.createInstitution);
router.get("/:id", InstitutionController.getInstitutionById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validate(updateInstitutionSchema), InstitutionController.updateInstitution);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), InstitutionController.deleteInstitution);

export default router;
