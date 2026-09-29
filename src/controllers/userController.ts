import { Request, Response, NextFunction } from "express";
import UserService from "../services/userService";

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
    async createUser( req: Request, res: Response, next: NextFunction
    ): Promise<void> {
        try {
            const user = await UserService.createUser(req.body);

            res.status(201).json(user);
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
        try {
            const user = await UserService.deleteUser(
                req.params.id as string
            );

            if (!user) {
                res.status(404).json({
                    message: "User not found",
                });
                return;
            }

            res.status(200).json({
                message: "User deleted successfully",
                user,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();