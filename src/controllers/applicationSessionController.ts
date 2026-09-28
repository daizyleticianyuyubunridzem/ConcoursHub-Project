import { Request, Response, NextFunction } from "express";

import ApplicationSessionService from "../services/applicationSessionService";

class ApplicationSessionController {

    async getAllApplicationSessions(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const sessions =
                await ApplicationSessionService.getAllApplicationSessions();

            res.status(200).json(sessions);
        } catch (error) {
            next(error);
        }
    }

    // Find an applicationsession by ID
    async getApplicationSessionById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const session =
                await ApplicationSessionService.getApplicationSessionById(
                    req.params.id as string
                );


            if (!session) {
                res.status(404).json({
                    message: "Application session not found"
                });
                return;
            }

            res.status(200).json(session);
        } catch (error) {
            next(error);
        }
    }

    // Create a new application session
    async createApplicationSession(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const session =
                await ApplicationSessionService.createApplicationSession(
                    req.body
                );

            res.status(201).json(session);
        } catch (error) {
            next(error);
        }
    }

    async updateApplicationSession(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const session =
                await ApplicationSessionService.updateApplicationSession(
                    req.params.id as string,
                    req.body
                );

            // Return 404 if the session does not exist
            if (!session) {
                res.status(404).json({
                    message: "Application session not found"
                });
                return;
            }

            res.status(200).json(session);
        } catch (error) {
            next(error);
        }
    }

    async deleteApplicationSession(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const session =
                await ApplicationSessionService.deleteApplicationSession(
                    req.params.id as string
                );

            // Return 404 if the session does not exist
            if (!session) {
                res.status(404).json({
                    message: "Application session not found"
                });
                return;
            }

            res.status(200).json({
                message: "Application session deleted successfully",
                session
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ApplicationSessionController();