import { Router } from "express";
import * as userController from "../controller/users.controller.js";
import {
  validate,
  createUserRules,
  updateUserRules,
  userIdParamRules,
} from "../middleware/validate.js";
// Import các middleware xác thực và phân quyền của bạn vào đây:
// import { authenticateToken } from "../middleware/auth.js";
// import { authorize } from "../middleware/role.js";
import { authenticateToken, authorize } from "../middleware/auth.middleware.js";
const router = Router();

// Lấy thông tin tất cả người dùng (Cần quyền Admin)
router.get(
  "/",
  authenticateToken,
  authorize(["ADMIN"]),
  userController.getAllUsers,
);

// Lấy thông tin người dùng theo ID
router.get(
  "/:id",
  authenticateToken,
  validate(userIdParamRules),
  userController.getUserById,
);

// Quản trị viên tạo mới người dùng
router.post(
  "/",
  authenticateToken,
  authorize(["ADMIN"]),
  validate(createUserRules),
  userController.createUser,
);

// Quản trị viên cập nhật thông tin người dùng
router.patch(
  "/:id",
  authenticateToken,
  authorize(["ADMIN"]),
  validate([...userIdParamRules, ...updateUserRules]),
  userController.updateUser,
);

// Quản trị viên xóa người dùng
router.delete(
  "/:id",
  authenticateToken,
  authorize(["ADMIN"]),
  validate(userIdParamRules),
  userController.deleteUser,
);

export default router;
