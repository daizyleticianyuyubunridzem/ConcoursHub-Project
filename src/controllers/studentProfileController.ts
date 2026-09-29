import { Request, Response, NextFunction } from "express";
import StudentProfileService from "../services/studentProfileService";

class StudentProfileController {

    // Get all student profiles
    async getAllStudentProfiles(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const profiles =
                await StudentProfileService.getAllStudentProfiles();

            res.status(200).json(profiles);
        } catch (error) {
            next(error);
        }
    }

    // Get one student profile by ID
    async getStudentProfileById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const profile =
                await StudentProfileService.getStudentProfileById(
                    req.params.id as string
                );

            if (!profile) {
                res.status(404).json({
                    message: "Student profile not found",
                });
                return;
            }

            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }

    // Get a student profile by user ID
    async getStudentProfileByUserId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const profile =
                await StudentProfileService.getStudentProfileByUserId(
                    req.params.userId as string
                );

            if (!profile) {
                res.status(404).json({
                    message: "Student profile not found",
                });
                return;
            }

            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }

    // Create a new student profile
    async createStudentProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const profile =
                await StudentProfileService.createStudentProfile(
                    req.body
                );

            res.status(201).json(profile);
        } catch (error) {
            next(error);
        }
    }

    // Update an existing student profile
    async updateStudentProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const profile =
                await StudentProfileService.updateStudentProfile(
                    req.params.id as string,
                    req.body
                );

            if (!profile) {
                res.status(404).json({
                    message: "Student profile not found",
                });
                return;
            }

            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }

    // Delete a student profile
    async deleteStudentProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const profile =
                await StudentProfileService.deleteStudentProfile(
                    req.params.id as string
                );

            if (!profile) {
                res.status(404).json({
                    message: "Student profile not found",
                });
                return;
            }

            res.status(200).json({
                message: "Student profile deleted successfully",
                profile,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new StudentProfileController();