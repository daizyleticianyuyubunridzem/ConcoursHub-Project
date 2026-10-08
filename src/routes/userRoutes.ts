import { Router } from "express";
import UserController from "../controllers/userController";
import roleMiddleware from "../middlewares/roleMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import validate from "../middlewares/validate";
import { createUserSchema, updateUserStatusSchema } from "../validators/userValidator";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('admin'));
router.get("/", UserController.getAllUsers);
router.post("/", validate(createUserSchema), UserController.createAdminUser);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.patch("/:id/status", validate(updateUserStatusSchema), UserController.updateStudentStatus);
router.delete("/:id", UserController.deleteUser);

export default router;
