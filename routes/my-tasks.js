import express from "express";
import controller from "../controller/my-tasks.js";

const router = express.Router();

router.get("/", controller.get);

router.get("/tasks", controller.gitTasks);

router.post("/", controller.addTask);

router.put("/:id", controller.editOneTask);

router.delete("/:id", controller.deleteTask);

export default router;
