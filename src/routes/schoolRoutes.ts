import { Router } from "express";
import SchoolController from "../controllers/schoolController";
const router = Router();

router.get("/", SchoolController.getAllSchools);

router.post("/", SchoolController.createSchool);

router.get("/:id", SchoolController.getSchoolById);

router.put("/:id", SchoolController.updateSchool);

router.delete("/:id", SchoolController.deleteSchool);

export default router;