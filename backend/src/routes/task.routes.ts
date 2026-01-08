// task.routes.ts
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { getTasks, createTask, toggleTask, deleteTask } from "../controllers/task.controller";
const router = Router();
router.use(auth);
router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);
export default router;
