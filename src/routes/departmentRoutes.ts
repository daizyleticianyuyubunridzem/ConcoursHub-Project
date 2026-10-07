import { Router } from "express";
import DepartmentController from "../controllers/departmentController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import validate from "../middlewares/validate";
import { createDepartmentSchema, updateDepartmentSchema } from "../validators/departmentValidator";
const router = Router();


router.get("/", DepartmentController.getAllDepartments);
router.post("/", authMiddleware, roleMiddleware("admin"), validate(createDepartmentSchema), DepartmentController.createDepartment);
router.get("/:id", DepartmentController.getDepartmentById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validate(updateDepartmentSchema), DepartmentController.updateDepartment);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), DepartmentController.deleteDepartment);

export default router;
