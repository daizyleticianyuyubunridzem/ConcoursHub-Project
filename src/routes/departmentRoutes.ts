import { Router } from "express";
import DepartmentController from "../controllers/departmentController";
import validate from "../middlewares/validate";
import { createDepartmentSchema, updateDepartmentSchema } from "../validators/departmentValidator";
const router = Router();


router.get("/", DepartmentController.getAllDepartments);
router.post("/", validate(createDepartmentSchema), DepartmentController.createDepartment);
router.get("/:id", DepartmentController.getDepartmentById);
router.put("/:id", validate(updateDepartmentSchema), DepartmentController.updateDepartment);
router.delete("/:id", DepartmentController.deleteDepartment);

export default router;
