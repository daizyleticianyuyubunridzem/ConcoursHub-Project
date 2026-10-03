import { Router } from "express";
import SchoolController from "../controllers/schoolController";
import validate from "../middlewares/validate";
import { createSchoolSchema, updateSchoolSchema } from "../validators/schoolValidator";

const router = Router();

router.get("/", SchoolController.getAllSchools);
router.post("/", validate(createSchoolSchema), SchoolController.createSchool);
router.get("/:id", SchoolController.getSchoolById);
router.put("/:id", validate(updateSchoolSchema), SchoolController.updateSchool);
router.delete("/:id", SchoolController.deleteSchool);

export default router;