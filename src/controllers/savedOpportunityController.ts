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

    // Get all opportunities saved by the currently logged-in user
    async getSavedOpportunitiesByUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // Get the user ID from the authenticated session
            const userId = req.session.userId;

            // Make sure the user is logged in
            if (!userId) {
                res.status(401).json({
                    message: "Authentication required. Please log in.",
                });
                return;
            }

            const savedOpportunities =
                await SavedOpportunityService.getSavedOpportunitiesByUser(
                    userId
                );

            res.status(200).json(savedOpportunities);
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
            // Get the logged-in user's ID from the session
            const userId = req.session.userId;

            // Make sure the user is logged in
            if (!userId) {
                res.status(401).json({
                    message: "Authentication required. Please log in.",
                });
                return;
            }

            // Get only the opportunity ID from the request
            const { opportunityId } = req.body;

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
            // Get the logged-in user's ID from the session
            const userId = req.session.userId;

            // Make sure the user is logged in
            if (!userId) {
                res.status(401).json({
                    message: "Authentication required. Please log in.",
                });
                return;
            }

            // Remove the saved opportunity only if it belongs to the logged-in user
            const savedOpportunity =
                await SavedOpportunityService.removeSavedOpportunity(
                    userId,
                    req.params.id as string
                );

            // If the saved opportunity does not exist
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
