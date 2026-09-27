import { Router } from "express";
import * as uploadController from "../controller/upload.controller.js";
import * as userController from "../controller/users.controller.js"; // <--- Import userController
import {
  uploadSingleImage,
  uploadMultipleImages,
} from "../middleware/upload.middleware.js";

const router = Router();

// Route upload 1 file đơn lẻ (lưu vào bảng files)
router.post(
  "/file",
  uploadSingleImage("file"),
  uploadController.uploadSingleFile,
);
router.post(
  "/image",
  uploadSingleImage("image"),
  uploadController.uploadSingleFile,
);

// 👉 SỬA LẠI ROUTE NÀY: Gọi hàm cập nhật Avatar cho bảng users!
router.post(
  "/avatar",
  uploadSingleImage("avatar"),
  uploadController.uploadAvatar, // HOẶC userController.updateAvatar
);

// Route upload đa file (tối đa 5 file, lưu vào bảng files)
router.post(
  "/files",
  uploadMultipleImages("files", 5),
  uploadController.uploadMultipleFiles,
);

export default router;
