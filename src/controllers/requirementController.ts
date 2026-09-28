import { Request, Response, NextFunction } from "express";
import RequirementService from "../services/requirementService";

class RequirementController {

    // get all requirements
    async getAllRequirements(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requirements =
                await RequirementService.getAllRequirements();

            res.status(200).json(requirements);
        } catch (error) {
            next(error);
        }
    }

    // Get one requirement by ID
    async getRequirementById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requirement =
                await RequirementService.getRequirementById(
                    req.params.id as string
                );

            // Return 404 if the requirement does not exist
            if (!requirement) {
                res.status(404).json({
                    message: "Requirement not found"
                });
                return;
            }

            res.status(200).json(requirement);
        } catch (error) {
            next(error);
        }
    }

    // Create new requirement
    async createRequirement(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requirement =
                await RequirementService.createRequirement(
                    req.body
                );

            res.status(201).json(requirement);
        } catch (error) {
            next(error);
        }
    }

    // Update an existing requirement
    async updateRequirement(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requirement =
                await RequirementService.updateRequirement(
                    req.params.id as string,
                    req.body
                );

            // check if the requirement exists or not
            if (!requirement) {
                res.status(404).json({
                    message: "Requirement not found"
                });
                return;
            }

            res.status(200).json(requirement);
        } catch (error) {
            next(error);
        }
    }

    // Delete a requirement
    async deleteRequirement(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requirement =
                await RequirementService.deleteRequirement(
                    req.params.id as string
                );

            if (!requirement) {
                res.status(404).json({
                    message: "Requirement not found"
                });
                return;
            }

            res.status(200).json({
                message: "Requirement deleted successfully",
                requirement
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new RequirementController();