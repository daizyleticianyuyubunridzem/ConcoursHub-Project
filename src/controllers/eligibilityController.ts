import { Request, Response, NextFunction } from "express";
import ApplicationSession from "../models/applicationSessionModel";
import StudentProfileService from "../services/studentProfileService";
import EligibilityService from "../services/eligibilityService";

class EligibilityController {
    async checkEligibility(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { applicationSessionId } = req.body;
            const userId = req.session.userId!;

            const [studentProfile, applicationSession] = await Promise.all([
                StudentProfileService.getStudentProfileByUserId(userId),
                ApplicationSession.findOne({
                    _id: applicationSessionId,
                    isPublished: true,
                }).populate("admissionOpportunity") as any,
            ]);

            if (!studentProfile) {
                return res.status(404).json({
                    success: false,
                    message: "Create your student profile before checking eligibility.",
                });
            }

            if (!applicationSession?.admissionOpportunity?.isActive) {
                return res.status(404).json({
                    success: false,
                    message: "Published concours session not found.",
                });
            }

            const result = await EligibilityService.checkEligibility(
                studentProfile,
                applicationSessionId
            );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new EligibilityController();