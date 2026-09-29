import { Request, Response, NextFunction } from "express";

import AuthService from "../services/authService";
class AuthController {

    // Register a new student account
    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            const { name, email, password } = req.body;

            // Pass the registration data to the authentication service
            const user = await AuthService.register( name, email, password
            );
            const { password: _password, ...safeUser } = user.toObject();
            res.status(201).json({
                message: "Account created successfully",
                user: safeUser,
            });

        } catch (error) {
            next(error);
        }
    }

    // Log an existing user into the system
    async login( req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get login credentials from the request body
            const { email, password } = req.body;

            // Authenticate the user
            const user = await AuthService.login(
                email,
                password
            );

            // Store the authenticated user's information in the session
            req.session.userId = user._id.toString();
            req.session.role = user.role;

            // Remove the password before sending the user data
            const { password: _password, ...safeUser } = user.toObject();

            res.status(200).json({
                message: "Login successful",
                user: safeUser,
            });

        } catch (error) {
            next(error);
        }
    }

    // Log the user out of the system
    async logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            // Destroy the user's current session
            req.session.destroy((error) => {

                if (error) {
                    next(error);
                    return;
                }
                res.clearCookie("connect.sid");

                res.status(200).json({
                    message: "Logout successful",
                });
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
