import { Request, Response, NextFunction } from "express";

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void  => {

    //chekk if current id contains user session
    if(!req.session.userId){
        res.status(401).json({
            message: "Authentication required. Please log in"
        })
        return;
    }

    next();

};

export default authMiddleware;

