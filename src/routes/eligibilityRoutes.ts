import { Router } from "express";
import validate from "../middlewares/validate";
import EligibilityController from "../controllers/eligibilityController";
import { checkEligibilitySchema } from "../validators/eligibilityValidator";

const router = Router();

router.post( "/check", validate(checkEligibilitySchema), EligibilityController.checkEligibility );

export default router;