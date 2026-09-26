import { Request, Response, NextFunction } from "express";
import DepartmentService from "../services/departmentService";

class DepartmentController {

    // Get all departments
    async getAllDepartments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const departments =
                await DepartmentService.getAllDepartments();

            res.status(200).json(departments);
        } catch (error) {
            next(error);
        }
    }

    // Get one department by ID
    async getDepartmentById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const department =
                await DepartmentService.getDepartmentById(
                    req.params.id as string
                );

            // Return 404 if the department does not exist
            if (!department) {
                res.status(404).json({
                    message: "Department not found"
                });
                return;
            }

            res.status(200).json(department);
        } catch (error) {
            next(error);
        }
    }

    // Create a new department
    async createDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const department =
                await DepartmentService.createDepartment(
                    req.body
                );

            res.status(201).json(department);
        } catch (error) {
            next(error);
        }
    }

    // Update an existing department
    async updateDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const department = await DepartmentService.updateDepartment(
                    req.params.id as string,
                    req.body
                );

            // Return 404 if the department does not exist
            if (!department) {
                res.status(404).json({
                    message: "Department not found"
                });
                return;
            }

            res.status(200).json(department);
        } catch (error) {
            next(error);
        }
    }

    // Delete a department
    async deleteDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const department =
                await DepartmentService.deleteDepartment(
                    req.params.id as string
                );

            // Return 404 if the department does not exist
            if (!department) {
                res.status(404).json({
                    message: "Department not found"
                });
                return;
            }

            res.status(200).json({
                message: "Department deleted successfully",
                department
            });
        } catch (error) {
            next(error);
        }
    }
}

// Export DepartmentController instance for the routes
export default new DepartmentController();