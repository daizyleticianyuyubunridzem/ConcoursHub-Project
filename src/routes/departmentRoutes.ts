import { Router } from "express";
import DepartmentController from "../controllers/departmentController";

const router = Router();

// Get all departments
router.get("/", DepartmentController.getAllDepartments);

// Create a new department
router.post("/", DepartmentController.createDepartment);

// Get one department by ID
router.get("/:id", DepartmentController.getDepartmentById);

// Update a department
router.put("/:id", DepartmentController.updateDepartment);

// Delete a department
router.delete("/:id", DepartmentController.deleteDepartment);

export default router;