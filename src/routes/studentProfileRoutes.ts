import { Router } from "express";
import StudentProfileController from "../controllers/studentProfileController";
import authMiddleware from "../middlewares/authMiddleware";
import validate from "../middlewares/validate";

import { createStudentProfileSchema, updateStudentProfileSchema } from "../validators/studentProfileValidator";

const router = Router();

//authenctication middleware 
router.use(authMiddleware);

router.get("/", StudentProfileController.getAllStudentProfiles );
router.post("/", validate(createStudentProfileSchema), StudentProfileController.createStudentProfile);
router.get("/user/:userId", StudentProfileController.getStudentProfileByUserId );
router.get( "/:id", StudentProfileController.getStudentProfileById);
router.put("/:id", validate(updateStudentProfileSchema), StudentProfileController.updateStudentProfile );
router.delete( "/:id", StudentProfileController.deleteStudentProfile);

export default router;

