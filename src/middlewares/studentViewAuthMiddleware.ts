import { Request, Response, NextFunction } from "express";

const studentViewAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    if (!req.session.userId) {
        res.redirect("/login");
        return;
    }
    next();
};

export default studentViewAuthMiddleware;