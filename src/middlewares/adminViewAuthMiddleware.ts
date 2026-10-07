import { Request, Response, NextFunction } from "express";

const adminViewAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.session.userId) { res.redirect("/login"); return; }
    if (req.session.role !== "admin") { res.status(403).render("errors/403"); return; }
    next();
};

export default adminViewAuthMiddleware;
