import { Router } from "express";
import studentViewAuthMiddleware from "../middlewares/studentViewAuthMiddleware";
import studentViewRoleMiddleware from "../middlewares/studentViewRoleMiddleware";
import StudentDashboardController from "../controllers/studentDashboardController";

const router = Router();

router.use(studentViewAuthMiddleware);
router.use(studentViewRoleMiddleware);

router.get("/", StudentDashboardController.showDashboard);

export default router;