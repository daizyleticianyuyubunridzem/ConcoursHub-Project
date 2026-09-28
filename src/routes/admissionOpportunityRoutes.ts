import { Router } from "express";
import AdmissionOpportunityController from "../controllers/admissionOpportunityController";

const router = Router();

router.get("/", AdmissionOpportunityController.getAllAdmissionOpportunities);
router.post("/", AdmissionOpportunityController.createAdmissionOpportunity);
router.get("/:id", AdmissionOpportunityController.getAdmissionOpportunityById);
router.put("/:id", AdmissionOpportunityController.updateAdmissionOpportunity);
router.delete("/:id", AdmissionOpportunityController.deleteAdmissionOpportunity);

export default router;