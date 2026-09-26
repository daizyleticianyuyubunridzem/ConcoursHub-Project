import { Request, Response, NextFunction } from "express";
import InstitutionService from "../services/institutionService";

class InstitutionController {

//Get all institution
    async getAllInstitutions(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const institutions = await InstitutionService.getAllInstitutions();

            res.status(200).json(institutions);
        } catch (error) {
            next(error);
        }
    }

    // Get one institution
    async getInstitutionById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const institution = await InstitutionService.getInstitutionById(
                req.params.id as string
            );

            if (!institution) {
                res.status(404).json({
                    message: "Institution not found"
                });
                return;
            }

            res.status(200).json(institution);
        } catch (error) {
            next(error);
        }
    }

    async createInstitution(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const institution = await InstitutionService.createInstitution(
                req.body
            );

            res.status(201).json(institution);
        } catch (error) {
            next(error);
        }
    }

    async updateInstitution(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const institution = await InstitutionService.updateInstitution(
                req.params.id as string,
                req.body
            );

            if (!institution) {
                res.status(404).json({
                    message: "Institution not found"
                });
                return;
            }

            res.status(200).json(institution);
        } catch (error) {
            next(error);
        }
    }

    async deleteInstitution(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const institution = await InstitutionService.deleteInstitution(
                req.params.id as string
            );

            if (!institution) {
                res.status(404).json({
                    message: "Institution not found"
                });
                return;
            }

            res.status(200).json({
                message: "Institution deleted successfully",
                institution
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new InstitutionController();