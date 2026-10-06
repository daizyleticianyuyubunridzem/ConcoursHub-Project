import { Request, Response, NextFunction } from "express";

const studentViewRoleMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    if (req.session.role !== "student") {
        res.status(403).render("errors/403");
        return;
    }
    next();
};

export default studentViewRoleMiddleware;