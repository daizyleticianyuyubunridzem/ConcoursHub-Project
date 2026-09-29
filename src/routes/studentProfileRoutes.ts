import { Router } from "express";
import StudentProfileController from "../controllers/studentProfileController";

const router = Router();

router.get("/", StudentProfileController.getAllStudentProfiles );
router.post("/", StudentProfileController.createStudentProfile);
router.get("/user/:userId", StudentProfileController.getStudentProfileByUserId );
router.get( "/:id", StudentProfileController.getStudentProfileById);
router.put("/:id", StudentProfileController.updateStudentProfile );
router.delete( "/:id", StudentProfileController.deleteStudentProfile);

export default router;