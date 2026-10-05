import { Request, Response, NextFunction }  from 'express';

const roleMiddleware = ( 
      ...allowedRoles: ( "student" | "admin")[]
    ) => {
    return (
    req: Request,
    res: Response,
    next: NextFunction
    ): void => {

        if(!req.session.role || !allowedRoles.includes(req.session.role)
        ){
            res.status(403).json({
                success: false,
                message: "Access denied!, you have no permission to access this resource"
            });
            return;
        }
        next();    
    };
};

export default roleMiddleware;