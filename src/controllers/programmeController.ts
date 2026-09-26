import { Request, Response, NextFunction } from "express";
import ProgrammeService from "../services/programmeService";

class ProgrammeController {

    // Get all programmes
    async getAllProgrammes(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const programmes =
                await ProgrammeService.getAllProgrammes();

            res.status(200).json(programmes);
        } catch (error) {
            next(error);
        }
    }

    async getProgrammeById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const programme =
                await ProgrammeService.getProgrammeById(
                    req.params.id as string
                );

            if (!programme) {
                res.status(404).json({
                    message: "Programme not found"
                });
                return;
            }

            res.status(200).json(programme);
        } catch (error) {
            next(error);
        }
    }

    async createProgramme(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const programme =
                await ProgrammeService.createProgramme(
                    req.body
                );

            res.status(201).json(programme);
        } catch (error) {
            next(error);
        }
    }

   
    async updateProgramme(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const programme =
                await ProgrammeService.updateProgramme(
                    req.params.id as string,
                    req.body
                );

            if (!programme) {
                res.status(404).json({
                    message: "Programme not found"
                });
                return;
            }

            res.status(200).json(programme);
        } catch (error) {
            next(error);
        }
    }

    // Delete a programme
    async deleteProgramme(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const programme =
                await ProgrammeService.deleteProgramme(
                    req.params.id as string
                );

            // Return 404 if no programe exists
            if (!programme) {
                res.status(404).json({
                    message: "Programme not found"
                });
                return;
            }

            res.status(200).json({
                message: "Programme deleted successfully",
                programme
            });
        } catch (error) {
            next(error);
        }
    }
}

// Export one ProgrammeController instance for the routes
export default new ProgrammeController();