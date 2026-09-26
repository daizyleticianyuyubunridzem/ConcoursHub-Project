import { Request, Response, NextFunction } from "express";
import SchoolService from "../services/schoolService";
class SchoolController {

    // Get all schools
    async getAllSchools(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const schools = await SchoolService.getAllSchools();

            res.status(200).json(schools);
        } catch (error) {
            next(error);
        }
    }

    // Get one school
    async getSchoolById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const school = await SchoolService.getSchoolById(
                req.params.id as string
            );

            if (!school) {
                res.status(404).json({
                    message: "School not found"
                });
                return;
            }

            res.status(200).json(school);
        } catch (error) {
            next(error);
        }
    }

    // Create a school
    async createSchool(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const school = await SchoolService.createSchool(
                req.body
            );

            res.status(201).json(school);
        } catch (error) {
            next(error);
        }
    }

    // Update a school
    async updateSchool(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const school = await SchoolService.updateSchool(
                req.params.id as string,
                req.body
            );

            if (!school) {
                res.status(404).json({
                    message: "School not found"
                });
                return;
            }

            res.status(200).json(school);
        } catch (error) {
            next(error);
        }
    }

    // Delete a school
    async deleteSchool(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const school = await SchoolService.deleteSchool(
                req.params.id as string
            );

            if (!school) {
                res.status(404).json({
                    message: "School not found"
                });
                return;
            }

            res.status(200).json({
                message: "School deleted successfully",
                school
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new SchoolController();