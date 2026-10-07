import { Router } from "express";
import AdmissionOpportunityController from "../controllers/admissionOpportunityController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import validate from "../middlewares/validate";
import { createAdmissionOpportunitySchema, updateAdmissionOpportunitySchema
} from "../validators/admissionOpportunityValidator";


const router = Router();

router.get("/", AdmissionOpportunityController.getAllAdmissionOpportunities);
router.post("/", authMiddleware, roleMiddleware("admin"), validate(createAdmissionOpportunitySchema), AdmissionOpportunityController.createAdmissionOpportunity);
router.get("/:id", AdmissionOpportunityController.getAdmissionOpportunityById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validate(updateAdmissionOpportunitySchema), AdmissionOpportunityController.updateAdmissionOpportunity);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), AdmissionOpportunityController.deleteAdmissionOpportunity);

export default router;
