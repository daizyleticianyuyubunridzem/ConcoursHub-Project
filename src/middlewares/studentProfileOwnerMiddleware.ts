import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import StudentProfile from "../models/studentProfileModel";

type ProfileTarget = "id" | "userId" | "body";

const studentProfileOwnerMiddleware = (target: ProfileTarget) => async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.session.userId) {
        res.status(401).json({ success: false, message: "Authentication required." });
        return;
    }

    if (req.session.role === "admin") {
        next();
        return;
    }

    if (req.session.role !== "student") {
        res.status(403).json({ success: false, message: "Access denied." });
        return;
    }

    try {
        if (target === "userId") {
            if (String(req.params.userId).toLowerCase() !== req.session.userId.toLowerCase()) {
                res.status(403).json({ success: false, message: "You can only access your own student profile." });
                return;
            }
            next();
            return;
        }

        if (target === "body") {
            const requestedOwner = String(req.body?.user || "");
            if (requestedOwner.toLowerCase() !== req.session.userId.toLowerCase()) {
                res.status(403).json({ success: false, message: "You can only create a profile for your own account." });
                return;
            }
            next();
            return;
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(404).json({ success: false, message: "Student profile not found." });
            return;
        }

        const profile = await StudentProfile.findById(req.params.id).select("user");
        if (profile && profile.user.toString().toLowerCase() !== req.session.userId.toLowerCase()) {
            res.status(403).json({ success: false, message: "You can only access your own student profile." });
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
};

export default studentProfileOwnerMiddleware;
