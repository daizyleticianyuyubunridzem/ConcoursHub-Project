import { Router } from "express";
import StudentProfileController from "../controllers/studentProfileController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import studentProfileOwnerMiddleware from "../middlewares/studentProfileOwnerMiddleware";
import validate from "../middlewares/validate";

import { createStudentProfileSchema, updateStudentProfileSchema } from "../validators/studentProfileValidator";

const router = Router();

//authenctication middleware 
router.use(authMiddleware);

router.get("/", roleMiddleware("admin"), StudentProfileController.getAllStudentProfiles );
router.post("/", studentProfileOwnerMiddleware("body"), validate(createStudentProfileSchema), StudentProfileController.createStudentProfile);
router.get("/user/:userId", studentProfileOwnerMiddleware("userId"), StudentProfileController.getStudentProfileByUserId );
router.get( "/:id", studentProfileOwnerMiddleware("id"), StudentProfileController.getStudentProfileById);
router.put("/:id", studentProfileOwnerMiddleware("id"), validate(updateStudentProfileSchema), StudentProfileController.updateStudentProfile );
router.delete( "/:id", studentProfileOwnerMiddleware("id"), StudentProfileController.deleteStudentProfile);

export default router;

