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
            const message = error instanceof Error ? error.message : "";
            const expectedAuthErrors = ["Invalid email or password", "This account has been deactivated"];
            const isExpectedAuthError = expectedAuthErrors.includes(message);

            if (isExpectedAuthError) {
                res.status(401).render("auth/login", { error: message });
                return;
            }

            console.error("Login could not reach the authentication service:", error);
            res.status(503).render("auth/login", {
                error: "We couldn't sign you in right now. Please try again in a few minutes.",
            });
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
            const duplicateEmail = error instanceof Error && (
                error.message === "This email already exists" ||
                ("code" in error && error.code === 11000 &&
                    "keyPattern" in error &&
                    typeof error.keyPattern === "object" && error.keyPattern !== null &&
                    "email" in error.keyPattern)
            );

            if (duplicateEmail) {
                res.status(400).render("auth/register", { error: "An account with this email already exists.", values: req.body });
                return;
            }

            console.error("Registration could not reach the account service:", error);
            res.status(503).render("auth/register", {
                error: "We couldn't create your account right now. Please try again in a few minutes.",
                values: { name: req.body.name, email: req.body.email },
            });
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
