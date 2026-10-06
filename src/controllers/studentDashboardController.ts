import { Request, Response, NextFunction } from "express";
import UserService from "../services/userService";
import StudentProfileService from "../services/studentProfileService";

class StudentDashboardController {
    async showDashboard(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.session.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required.",
                });
                return;
            }

            const user = await UserService.getUserById(userId);

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
                return;
            }

            const profile =
                await StudentProfileService.getStudentProfileByUserId(userId);

            res.render("student/dashboard", {
                user,
                profile,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new StudentDashboardController();