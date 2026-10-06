import { Request, Response, NextFunction } from "express";

import AuthService from "../services/authService";

class AuthViewController {

    // Display the browser login page
    showLogin(
        req: Request,
        res: Response,
        next: NextFunction
    ): void {

        try {
            res.render("auth/login");
        } catch (error) {
            next(error);
        }
    }


    // Process the browser login form
    async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            // Get the login information submitted by the form
            const { email, password } = req.body;

            // Authenticate the user
            const user = await AuthService.login(
                email,
                password
            );

            // Store the authenticated user's information
            // in the browser session
            req.session.userId = user._id.toString();
            req.session.role = user.role;

            // Redirect the student to the dashboard
            res.redirect("/student");

        } catch (error) {
            next(error);
        }
    }
}

export default new AuthViewController();