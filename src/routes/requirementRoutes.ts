import { Router } from "express";
import RequirementController from "../controllers/requirementController";

const router = Router();

router.get("/", RequirementController.getAllRequirements);
router.post("/", RequirementController.createRequirement);
router.get("/:id", RequirementController.getRequirementById);
router.put("/:id", RequirementController.updateRequirement);
router.delete("/:id", RequirementController.deleteRequirement);

export default router;