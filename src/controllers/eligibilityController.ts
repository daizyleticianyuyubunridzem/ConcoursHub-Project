import { Request, Response, NextFunction } from "express";
import StudentProfileService from "../services/studentProfileService";
import EligibilityService from "../services/eligibilityService";

class EligibilityController {
    async checkEligibility(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const { studentProfileId, applicationSessionId } = req.body;

            if (!studentProfileId || !applicationSessionId) {
                return res.status(400).json({
                    message:
                        "studentProfileId and applicationSessionId are required."
                });
            }

            const studentProfile =
                await StudentProfileService.getStudentProfileById(
                    studentProfileId
                );

            if (!studentProfile) {
                return res.status(404).json({
                    message: "Student profile not found."
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