import { Router } from "express";
import savedOpportunityController from "../controllers/savedOpportunityController";
import authMiddleware from '../middlewares/authMiddleware';
import validate from "../middlewares/validate";
import { createSavedOpportunitySchema } from "../validators/savedOpportunityValidator";

const router = Router();

router.use(authMiddleware);

router.get('/', savedOpportunityController.getAllSavedOpportunities);
router.post("/", validate(createSavedOpportunitySchema), savedOpportunityController.saveOpportunity );
router.get('/my', savedOpportunityController.getSavedOpportunitiesByUser);
router.get('/:id', savedOpportunityController.getSavedOpportunityById);
router.delete('/:id', savedOpportunityController.removeSavedOpportunity);

export default router;

