import { Router } from "express";
import EligibilityController from "../controllers/eligibilityController";

const router = Router();

router.post( "/check", EligibilityController.checkEligibility );

export default router;