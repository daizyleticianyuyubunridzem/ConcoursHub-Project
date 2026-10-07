import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApplicationSession from "../models/applicationSessionModel";
import SavedOpportunity from "../models/savedOpportunityModel";
import StudentProfileService from "../services/studentProfileService";
import EligibilityService from "../services/eligibilityService";
import RequirementService from "../services/requirementService";
import UserService from "../services/userService";

const sessionPopulate = [
    { path: "admissionOpportunity", populate: { path: "programmes", populate: { path: "department", populate: { path: "school", populate: { path: "institution" } } } } },
];

class StudentOpportunityViewController {
    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sessions = await ApplicationSession.find({ isPublished: true }).populate(sessionPopulate).sort({ applicationDeadline: 1 });
            const userId = req.session.userId!;
            const saves = await SavedOpportunity.find({ user: userId });
            const savedByOpportunity = new Map(saves.map((save) => [save.admissionOpportunity.toString(), save._id.toString()]));
            const listings = sessions.filter((session: any) => session.admissionOpportunity?.isActive).map((session: any) => ({ session, savedId: savedByOpportunity.get(session.admissionOpportunity._id.toString()) }));
            res.render("student/opportunities", { listings });
        } catch (error) { next(error); }
    }

    async details(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!mongoose.isValidObjectId(req.params.sessionId)) { res.status(404).render("errors/404"); return; }
            const session = await ApplicationSession.findOne({ _id: req.params.sessionId, isPublished: true }).populate(sessionPopulate) as any;
            if (!session?.admissionOpportunity?.isActive) { res.status(404).render("errors/404"); return; }
            const [requirements, saved] = await Promise.all([
                RequirementService.getRequirementsByApplicationSession(session.id),
                SavedOpportunity.findOne({ user: req.session.userId, admissionOpportunity: session.admissionOpportunity._id }),
            ]);
            res.render("student/opportunity-details", { session, requirements, savedId: saved?._id.toString() });
        } catch (error) { next(error); }
    }

    async eligibilityIndex(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sessions = await ApplicationSession.find({ isPublished: true }).populate(sessionPopulate).sort({ applicationDeadline: 1 }) as any[];
            const listings = sessions.filter((session) => session.admissionOpportunity?.isActive);
            const profile = await StudentProfileService.getStudentProfileByUserId(req.session.userId!);
            res.render("student/eligibility-index", { listings, hasProfile: Boolean(profile) });
        } catch (error) { next(error); }
    }

    async eligibility(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const session = await ApplicationSession.findOne({ _id: req.params.sessionId, isPublished: true }).populate(sessionPopulate) as any;
            if (!session?.admissionOpportunity?.isActive) { res.status(404).render("errors/404"); return; }
            const profile = await StudentProfileService.getStudentProfileByUserId(req.session.userId!);
            if (!profile) { res.redirect("/student/profile/create"); return; }
            const result = await EligibilityService.checkEligibility(profile, session.id);
            res.render("student/eligibility", { session, result });
        } catch (error) { next(error); }
    }

    async account(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await UserService.getUserById(req.session.userId!);
            res.render("student/account", { user });
        } catch (error) { next(error); }
    }

    async saved(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const saved = await SavedOpportunity.find({ user: req.session.userId }).populate({ path: "admissionOpportunity" });
            const opportunityIds = saved.map((entry: any) => entry.admissionOpportunity?._id).filter(Boolean);
            const sessions = await ApplicationSession.find({ isPublished: true, admissionOpportunity: { $in: opportunityIds } }).populate(sessionPopulate).sort({ applicationDeadline: 1 }) as any[];
            const savedByOpportunity = new Map(saved.map((entry: any) => [entry.admissionOpportunity?._id.toString(), entry._id.toString()]));
            const listings = sessions.filter((session: any) => session.admissionOpportunity?.isActive).map((session: any) => ({ session, savedId: savedByOpportunity.get(session.admissionOpportunity._id.toString()) }));
            res.render("student/saved-opportunities", { listings });
        } catch (error) { next(error); }
    }
}

export default new StudentOpportunityViewController();
