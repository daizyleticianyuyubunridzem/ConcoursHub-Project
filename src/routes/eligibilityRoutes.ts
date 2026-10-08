import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import validate from "../middlewares/validate";
import EligibilityController from "../controllers/eligibilityController";
import { checkEligibilitySchema } from "../validators/eligibilityValidator";

const router = Router();

router.post(
    "/check",
    authMiddleware,
    roleMiddleware("student"),
    validate(checkEligibilitySchema),
    EligibilityController.checkEligibility
);

export default router;
