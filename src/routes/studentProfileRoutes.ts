import { Router } from "express";
import StudentProfileController from "../controllers/studentProfileController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

//authenctication middleware 
router.use(authMiddleware);

router.get("/", StudentProfileController.getAllStudentProfiles );
router.post("/", StudentProfileController.createStudentProfile);
router.get("/user/:userId", StudentProfileController.getStudentProfileByUserId );
router.get( "/:id", StudentProfileController.getStudentProfileById);
router.put("/:id", StudentProfileController.updateStudentProfile );
router.delete( "/:id", StudentProfileController.deleteStudentProfile);

export default router;