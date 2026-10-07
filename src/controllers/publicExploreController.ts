import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApplicationSession from "../models/applicationSessionModel";
import RequirementService from "../services/requirementService";

const publicPopulate = [
    { path: "admissionOpportunity", populate: { path: "programmes", populate: { path: "department", populate: { path: "school", populate: { path: "institution" } } } } },
];

class PublicExploreController {
    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sessions = await ApplicationSession.find({ isPublished: true }).populate(publicPopulate).sort({ applicationDeadline: 1 }) as any[];
            const listings = sessions.filter((session) => session.admissionOpportunity?.isActive);
            res.render("public/explore", { listings });
        } catch (error) { next(error); }
    }

    async details(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!mongoose.isValidObjectId(req.params.sessionId)) { res.status(404).render("public/not-found"); return; }
            const session = await ApplicationSession.findOne({ _id: req.params.sessionId, isPublished: true }).populate(publicPopulate) as any;
            if (!session?.admissionOpportunity?.isActive) { res.status(404).render("public/not-found"); return; }
            const requirements = await RequirementService.getRequirementsByApplicationSession(session.id);
            res.render("public/explore-details", { session, requirements });
        } catch (error) { next(error); }
    }
}

export default new PublicExploreController();
