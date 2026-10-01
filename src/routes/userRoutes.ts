import { Router } from "express";
import UserController from "../controllers/userController";
import roleMiddleware from "../middlewares/roleMiddleware";

const router = Router();

router.use(roleMiddleware('admin'));
router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
