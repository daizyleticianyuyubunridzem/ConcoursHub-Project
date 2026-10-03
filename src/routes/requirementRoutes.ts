import { Router } from "express";

import RequirementController from "../controllers/requirementController";

import validate from "../middlewares/validate";

import {
    createRequirementSchema,
    updateRequirementSchema
} from "../validators/requirementValidator";

const router = Router();

router.get("/", RequirementController.getAllRequirements);
router.post( "/", validate(createRequirementSchema), RequirementController.createRequirement );
router.get("/:id", RequirementController.getRequirementById);
router.put( "/:id", validate(updateRequirementSchema),
    RequirementController.updateRequirement);

router.delete("/:id", RequirementController.deleteRequirement);

export default router;