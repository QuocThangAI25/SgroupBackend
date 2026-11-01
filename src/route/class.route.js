// src/routes/class.route.js
import { Router } from "express";
import { authenticateToken, authorize } from "../middleware/auth.middleware.js";
import { verifyClassMentorOrAdmin } from "../middleware/checkClassRole.middleware.js";
import * as classController from "../controller/class.controller.js";
const router = Router();

// Bắt buộc đăng nhập cho tất cả các routes bên dưới
router.use(authenticateToken);

// User xem danh sách lớp mình tham gia
router.get("/my-classes", classController.getMyClasses);
// Lấy danh sách thành viên của lớp
router.get("/:id/members", classController.getClassMembers);
// Routes dành riêng cho Admin
router.post("/", authorize("ADMIN"), classController.createClass);
router.get("/", authorize("ADMIN"), classController.getAllClasses);
// Xóa tạm authorize("ADMIN") đi để test không cần token phân quyền
router.post(
  "/:id/members",
  authenticateToken, // 1. Xác thực đăng nhập, gán thông tin user vào req.user
  verifyClassMentorOrAdmin, // 2. Kiểm tra xem có phải Admin hoặc Mentor của lớp đó không
  classController.addMember, // 3. Chạy vào controller chính nếu hợp lệ
);
router.delete(
  "/:id/members/:memberId",
  authenticateToken,
  verifyClassMentorOrAdmin,
  classController.removeMember,
);

export default router;
