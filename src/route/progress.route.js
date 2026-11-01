import express from "express";
import * as progressController from "../controller/progress.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // Middleware check token của bạn

const router = express.Router();

// API hoàn thành bài học
router.post("/:id/complete", verifyToken, progressController.markComplete);

// API xem tiến độ lớp học
router.get(
  "/classes/:classId/progress",
  verifyToken,
  progressController.getProgress,
);

export default router;
