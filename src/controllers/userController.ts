import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import UserService from "../services/userService";

const safeUser = (user: any) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
});

const isDuplicateEmailError = (error: unknown): boolean =>
    typeof error === "object" && error !== null && "code" in error && error.code === 11000;

class UserController {

    // Get all users
    async getAllUsers( 
        req: Request, 
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const users = await UserService.getAllUsers();

            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    // Get one user by ID
    async getUserById( req: Request, res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user = await UserService.getUserById(
                req.params.id as string
            );

            if (!user) {
                res.status(404).json({
                    message: "User not found",
                });
                return;
            }

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    // Create a new user
    async createAdminUser( req: Request, res: Response, next: NextFunction
    ): Promise<void> {
        try {
            const user = await UserService.createUser({ ...req.body, role: "admin", isActive: true });
            res.status(201).json({ success: true, data: safeUser(user) });
        } catch (error) {
            if (isDuplicateEmailError(error)) {
                res.status(409).json({ success: false, message: "An account with this email already exists." });
                return;
            }
            next(error);
        }
    }

    async updateStudentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(404).json({ success: false, message: "Student account not found." });
            return;
        }
        try {
            const user = await UserService.setStudentActiveStatus(String(req.params.id), req.body.isActive);
            if (!user) {
                res.status(404).json({ success: false, message: "Student account not found." });
                return;
            }
            res.status(200).json({ success: true, data: safeUser(user) });
        } catch (error) {
            next(error);
        }
    }

    // Update an existing user
    async updateUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user = await UserService.updateUser(
                req.params.id as string,
                req.body
            );

            if (!user) {
                res.status(404).json({
                    message: "User not found",
                });
                return;
            }

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    // Delete a user
    async deleteUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(404).json({ success: false, message: "Student account not found." });
            return;
        }
        try {
            const user = await UserService.deleteUser(
                req.params.id as string
            );

            if (!user) {
                res.status(404).json({ success: false, message: "Student account not found." });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Student access has been removed. Their profile and saved concours have been retained.",
                data: safeUser(user),
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
