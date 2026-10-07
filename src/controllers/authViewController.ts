import { Request, Response, NextFunction } from "express";

import AuthService from "../services/authService";
import { createUserSchema, loginUserSchema } from "../validators/userValidator";

class AuthViewController {

    showHome(req: Request, res: Response): void { res.render("public/home"); }

    showRegister(req: Request, res: Response): void { res.render("auth/register"); }

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
            const parsed = loginUserSchema.safeParse(req.body);
            if (!parsed.success) { res.status(400).render("auth/login", { error: parsed.error.issues[0]?.message }); return; }
            const { email, password } = parsed.data;

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
            res.redirect(user.role === "student" ? "/student" : "/admin");

        } catch (error) {
            res.status(401).render("auth/login", { error: error instanceof Error ? error.message : "Unable to sign in." });
        }
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const parsed = createUserSchema.safeParse(req.body);
        if (!parsed.success) { res.status(400).render("auth/register", { error: parsed.error.issues[0]?.message, values: req.body }); return; }
        try {
            const user = await AuthService.register(parsed.data.name, parsed.data.email, parsed.data.password);
            req.session.userId = user._id.toString();
            req.session.role = user.role;
            res.redirect("/student/profile/create");
        } catch (error) {
            if (error instanceof Error && error.message.toLowerCase().includes("email")) {
                res.status(400).render("auth/register", { error: "An account with this email already exists.", values: req.body });
                return;
            }
            next(error);
        }
    }

    logout(req: Request, res: Response, next: NextFunction): void {
        req.session.destroy((error) => {
            if (error) { next(error); return; }
            res.clearCookie("connect.sid");
            res.redirect("/");
        });
    }
}

export default new AuthViewController();
