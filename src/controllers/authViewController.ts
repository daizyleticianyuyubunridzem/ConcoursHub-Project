import { Request, Response, NextFunction } from "express";

import AuthService from "../services/authService";
import userRepository from "../repositories/userRepository";
import EmailService from "../services/emailService";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "node:crypto";
import { createUserSchema, loginUserSchema, passwordResetRequestSchema, passwordResetSchema } from "../validators/userValidator";

class AuthViewController {

    showForgotPassword(req: Request, res: Response): void {
        res.render("auth/forgot-password");
    }

    async requestPasswordReset(req: Request, res: Response): Promise<void> {
        const parsed = passwordResetRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).render("auth/forgot-password", { error: parsed.error.issues[0]?.message, email: req.body.email });
            return;
        }

        try {
            const baseUrl = process.env.APP_BASE_URL?.replace(/\/$/, "");
            if (!baseUrl) throw new Error("APP_BASE_URL is not configured.");

            // Check SMTP configuration before looking up the email so unavailable
            if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_FROM) {
                throw new Error("SMTP is not configured.");
            }

            const user = await userRepository.findByEmail(parsed.data.email);
            if (user?.isActive && user.role === "student") {
                const token = randomBytes(32).toString("hex");
                const tokenHash = createHash("sha256").update(token).digest("hex");
                await userRepository.setPasswordResetToken(user._id.toString(), tokenHash, new Date(Date.now() + 30 * 60 * 1000));
                try {
                    await EmailService.sendPasswordReset(user.email, `${baseUrl}/reset-password/${token}`);
                } catch (error) {
                    // Keep the response identical for known and unknown emails.
                    console.error("Password reset email delivery failed:", error);
                }
            }

            res.render("auth/forgot-password", {
                success: "If an active student account uses that email, a password reset link will arrive shortly.",
            });
        } catch (error) {
            console.error("Password reset email could not be sent:", error);
            res.status(503).render("auth/forgot-password", {
                error: "Password reset is temporarily unavailable. Please try again later or contact support.",
                email: parsed.data.email,
            });
        }
    }

    async showResetPassword(req: Request, res: Response): Promise<void> {
        const token = String(req.params.token);
        const tokenHash = createHash("sha256").update(token).digest("hex");
        try {
            const user = await userRepository.findByPasswordResetTokenHash(tokenHash);
            if (!user) {
                res.status(400).render("auth/reset-password", { error: "This reset link is invalid or has expired. Request a new one.", invalid: true });
                return;
            }
            res.render("auth/reset-password", { token });
        } catch (error) {
            console.error("Password reset link could not be checked:", error);
            res.status(503).render("auth/reset-password", { error: "We couldn't verify this link right now. Please try again later.", invalid: true });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const parsed = passwordResetSchema.safeParse(req.body);
        const token = String(req.params.token);
        if (!parsed.success) {
            res.status(400).render("auth/reset-password", { error: parsed.error.issues[0]?.message, token });
            return;
        }
        try {
            const tokenHash = createHash("sha256").update(token).digest("hex");
            const user = await userRepository.findByPasswordResetTokenHash(tokenHash);
            if (!user) {
                res.status(400).render("auth/reset-password", { error: "This reset link is invalid or has expired. Request a new one.", invalid: true });
                return;
            }
            const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
            await userRepository.updatePasswordAndClearResetToken(user._id.toString(), hashedPassword);
            res.render("auth/login", { success: "Your password has been updated. You can now sign in." });
        } catch (error) {
            console.error("Password could not be reset:", error);
            res.status(503).render("auth/reset-password", { error: "We couldn't update your password right now. Please try again later.", token });
        }
    }

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
