import { Request, Response, NextFunction } from "express";

import SavedOpportunityService from "../services/savedOpportunityService";
import { string } from "zod";

class SavedOpportunityController {

    // Get saved opportunities belonging to the currently logged-in user
    async getAllSavedOpportunities(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const userId = req.session.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required. Please log in.",
                });
                return;
            }

            const savedOpportunities =
                await SavedOpportunityService.getAllSavedOpportunities(
                    userId
                );

            res.status(200).json({
                success: true,
                data: savedOpportunities,
            });

        } catch (error) {
            next(error);
        }
    }


    // Get one saved opportunity belonging to the logged-in user
    async getSavedOpportunityById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const userId = req.session.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required. Please log in.",
                });
                return;
            }

            const savedOpportunity =
                await SavedOpportunityService.getSavedOpportunityById(
                    userId,
                    req.params.id as string
                );

            if (!savedOpportunity) {
                res.status(404).json({
                    success: false,
                    message: "Saved opportunity not found.",
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: savedOpportunity,
            });

        } catch (error) {
            next(error);
        }
    }


    // Get all opportunities saved by the currently logged-in user
    async getSavedOpportunitiesByUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const userId = req.session.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required. Please log in.",
                });
                return;
            }

            const savedOpportunities =
                await SavedOpportunityService.getSavedOpportunitiesByUser(
                    userId
                );

            res.status(200).json({
                success: true,
                data: savedOpportunities,
            });

        } catch (error) {
            next(error);
        }
    }


    // Save an admission opportunity for the currently logged-in user
    async saveOpportunity(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const userId = req.session.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required. Please log in.",
                });
                return;
            }

            const { opportunityId } = req.body;

            const savedOpportunity =
                await SavedOpportunityService.saveOpportunity(
                    userId,
                    opportunityId
                );

            res.status(201).json({
                success: true,
                message: "Opportunity saved successfully.",
                data: savedOpportunity,
            });

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

            const userId = req.session.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required. Please log in.",
                });
                return;
            }

            const savedOpportunity =
                await SavedOpportunityService.removeSavedOpportunity(
                    userId,
                    req.params.id as string
                );

            if (!savedOpportunity) {
                res.status(404).json({
                    success: false,
                    message: "Saved opportunity not found.",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Opportunity removed from saved opportunities.",
                data: savedOpportunity,
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new SavedOpportunityController();