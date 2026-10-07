import { Router } from "express";
import SchoolController from "../controllers/schoolController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import validate from "../middlewares/validate";
import { createSchoolSchema, updateSchoolSchema } from "../validators/schoolValidator";

const router = Router();

router.get("/", SchoolController.getAllSchools);
router.post("/", authMiddleware, roleMiddleware("admin"), validate(createSchoolSchema), SchoolController.createSchool);
router.get("/:id", SchoolController.getSchoolById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validate(updateSchoolSchema), SchoolController.updateSchool);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), SchoolController.deleteSchool);

export default router;
