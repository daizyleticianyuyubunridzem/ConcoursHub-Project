import { Request, Response, NextFunction } from "express";

import SavedOpportunityService from "../services/savedOpportunityService";

class SavedOpportunityController {

    // Get all saved opportunities
    async getAllSavedOpportunities(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const savedOpportunities =
                await SavedOpportunityService.getAllSavedOpportunities();

            res.status(200).json(savedOpportunities);
        } catch (error) {
            next(error);
        }
    }

    // Get one saved opportunity by ID
    async getSavedOpportunityById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const savedOpportunity =
                await SavedOpportunityService.getSavedOpportunityById(
                    req.params.id as string
                );

            if (!savedOpportunity) {
                res.status(404).json({
                    message: "Saved opportunity not found",
                });
                return;
            }

            res.status(200).json(savedOpportunity);
        } catch (error) {
            next(error);
        }
    }

    // Get all opportunities saved by a specific user
    async getSavedOpportunitiesByUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const savedOpportunities =
                await SavedOpportunityService.getSavedOpportunitiesByUser(
                    req.params.userId as string
                );

            res.status(200).json(savedOpportunities);
        } catch (error) {
            next(error);
        }
    }

    // Save an admission opportunity
    async saveOpportunity(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { userId, opportunityId } = req.body;

            const savedOpportunity =
                await SavedOpportunityService.saveOpportunity(
                    userId,
                    opportunityId
                );

            res.status(201).json(savedOpportunity);
        } catch (error) {
            next(error);
        }
    }

    // Remove a saved opportunity
    async removeSavedOpportunity(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const savedOpportunity =
                await SavedOpportunityService.removeSavedOpportunity(
                    req.params.id as string
                );

            if (!savedOpportunity) {
                res.status(404).json({
                    message: "Saved opportunity not found",
                });
                return;
            }

            res.status(200).json({
                message: "Opportunity removed from saved opportunities",
                savedOpportunity,
            });
        } catch (error) {
            next(error);
        }
    }
}


export default new SavedOpportunityController();