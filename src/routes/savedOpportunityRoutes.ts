import { Router } from "express";
import savedOpportunityController from "../controllers/savedOpportunityController";

const router = Router();

router.get('/', savedOpportunityController.getAllSavedOpportunities);
router.post('/', savedOpportunityController.saveOpportunity);
router.get('/:id', savedOpportunityController.getSavedOpportunityById);
router.get('/:userId', savedOpportunityController.getSavedOpportunitiesByUser);
router.delete('/:id', savedOpportunityController.removeSavedOpportunity);

export default router;
