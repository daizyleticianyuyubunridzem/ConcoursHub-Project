import { Request, Response, NextFunction } from "express";

import StudentProfileService from "../services/studentProfileService";

class StudentProfileViewController {

    // Display the student's profile page
    async showProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            // Get the logged-in student's ID from the session
            const userId = req.session.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required."
                });

                return;
            }

            // Find the student profile belonging to the logged-in user
            const profile = await StudentProfileService.getStudentProfileByUserId(
                    userId
                );

            res.render("student/profile", {
                profile
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new StudentProfileViewController();