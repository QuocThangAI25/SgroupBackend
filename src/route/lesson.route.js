import { Router } from "express";
import * as lessonController from "../controller/lesson.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { isClassMentorOrAdmin } from "../middleware/class.middleware.js";

const router = Router();

// Tất cả các route bên dưới đều cần đăng nhập
router.use(authenticateToken);

// 1. Mentor/Admin tạo bài học trong lớp
router.post(
  "/classes/:classId/lessons",
  isClassMentorOrAdmin,
  lessonController.createLesson,
);

// 2. Member/Mentor/Admin xem danh sách bài học của lớp
router.get("/classes/:classId/lessons", lessonController.getLessonsByClass);

// 3. Mentor/Admin cập nhật & xóa bài học
router.patch("/lessons/:id", lessonController.updateLesson);
router.delete("/lessons/:id", lessonController.deleteLesson);

// 4. Member đánh dấu hoàn thành bài học
router.post("/lessons/:id/complete", lessonController.completeLesson);

// 5. Xem tiến độ học tập của member trong lớp
router.get("/classes/:classId/progress", lessonController.getClassProgress);

export default router;
