
import { Request, Response, NextFunction } from "express";
import AdmissionOpportunityService from "../services/admissionOpportunityService";

class AdmissionOpportunityController {

    // Get all admission opportunities
    async getAllAdmissionOpportunities(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const opportunities =
                await AdmissionOpportunityService.getAllAdmissionOpportunities();

            res.status(200).json(opportunities);
        } catch (error) {
            next(error);
        }
    }

    // Get one admission opportunity by ID
    async getAdmissionOpportunityById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const opportunity =
                await AdmissionOpportunityService.getAdmissionOpportunityById(
                    req.params.id as string
                );

            // Return 404 if the opportunity does not exist
            if (!opportunity) {
                res.status(404).json({
                    message: "Admission opportunity not found"
                });
                return;
            }

            res.status(200).json(opportunity);
        } catch (error) {
            next(error);
        }
    }

    // Create a new admission opportunity
    async createAdmissionOpportunity(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const opportunity =
                await AdmissionOpportunityService.createAdmissionOpportunity(
                    req.body
                );

            res.status(201).json(opportunity);
        } catch (error) {
            next(error);
        }
    }

    // Update an existing admission opportunity
    async updateAdmissionOpportunity(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const opportunity =
                await AdmissionOpportunityService.updateAdmissionOpportunity(
                    req.params.id as string,
                    req.body
                );

            // Return 404 if the opportunity does not exist
            if (!opportunity) {
                res.status(404).json({
                    message: "Admission opportunity not found"
                });
                return;
            }

            res.status(200).json(opportunity);
        } catch (error) {
            next(error);
        }
    }

    // Delete an admission opportunity
    async deleteAdmissionOpportunity(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const opportunity =
                await AdmissionOpportunityService.deleteAdmissionOpportunity(
                    req.params.id as string
                );

            // Return 404 if the opportunity does not exist
            if (!opportunity) {
                res.status(404).json({
                    message: "Admission opportunity not found"
                });
                return;
            }

            res.status(200).json({
                message: "Admission opportunity deleted successfully",
                opportunity
            });
        } catch (error) {
            next(error);
        }
    }
}


export default new AdmissionOpportunityController();