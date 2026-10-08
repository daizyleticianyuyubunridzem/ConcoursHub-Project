import { Router } from "express";

import studentViewAuthMiddleware from "../middlewares/studentViewAuthMiddleware";
import studentViewRoleMiddleware from "../middlewares/studentViewRoleMiddleware";
import StudentProfileViewController from "../controllers/studentProfileViewController";


const router = Router();

router.use(studentViewAuthMiddleware);
router.use(studentViewRoleMiddleware);

router.get("/", StudentProfileViewController.showProfile);

router.get(
    "/create",
    StudentProfileViewController.showCreateProfile
);

router.post(
    "/create",
    StudentProfileViewController.createProfile
);

router.get("/edit", StudentProfileViewController.showEditProfile);
router.post("/edit", StudentProfileViewController.updateProfile);

export default router;
