import { Router } from "express";
import studentViewAuthMiddleware from "../middlewares/studentViewAuthMiddleware";
import studentViewRoleMiddleware from "../middlewares/studentViewRoleMiddleware";
import StudentOpportunityViewController from "../controllers/studentOpportunityViewController";

const router = Router();
router.use(studentViewAuthMiddleware, studentViewRoleMiddleware);
router.get("/opportunities", StudentOpportunityViewController.list);
router.get("/opportunities/:sessionId", StudentOpportunityViewController.details);
router.get("/eligibility/:sessionId", StudentOpportunityViewController.eligibility);
router.get("/eligibility", StudentOpportunityViewController.eligibilityIndex);
router.get("/saved-opportunities", StudentOpportunityViewController.saved);
router.get("/account", StudentOpportunityViewController.account);
export default router;
