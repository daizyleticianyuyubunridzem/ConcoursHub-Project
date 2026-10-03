import { Router } from "express";
import AdmissionOpportunityController from "../controllers/admissionOpportunityController";
import validate from "../middlewares/validate";
import { createAdmissionOpportunitySchema, updateAdmissionOpportunitySchema
} from "../validators/admissionOpportunityValidator";


const router = Router();

router.get("/", AdmissionOpportunityController.getAllAdmissionOpportunities);
router.post("/", validate(createAdmissionOpportunitySchema), AdmissionOpportunityController.createAdmissionOpportunity);
router.get("/:id", AdmissionOpportunityController.getAdmissionOpportunityById);
router.put("/:id",validate(updateAdmissionOpportunitySchema), AdmissionOpportunityController.updateAdmissionOpportunity);
router.delete("/:id", AdmissionOpportunityController.deleteAdmissionOpportunity);

export default router;