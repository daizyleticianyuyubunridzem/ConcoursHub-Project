import { Router } from "express";

import RequirementController from "../controllers/requirementController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";

import validate from "../middlewares/validate";

import {
    createRequirementSchema,
    updateRequirementSchema
} from "../validators/requirementValidator";

const router = Router();

router.get("/", RequirementController.getAllRequirements);
router.post( "/", authMiddleware, roleMiddleware("admin"), validate(createRequirementSchema), RequirementController.createRequirement );
router.get("/:id", RequirementController.getRequirementById);
router.put( "/:id", authMiddleware, roleMiddleware("admin"), validate(updateRequirementSchema),
    RequirementController.updateRequirement);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), RequirementController.deleteRequirement);

export default router;
