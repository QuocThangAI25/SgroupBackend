import catchAsync from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/responseHelper.js";
import * as uploadService from "../service/upload.service.js";
import * as userService from "../service/users.service.js"; // <--- Bổ sung import userService

// 1. Cập nhật Avatar User (Ghi vào bảng users)
export const uploadAvatar = catchAsync(async (req, res) => {
  const userId = req.user?.id || req.body.userId || 1; // Lấy ID user (tạm thời để 1 nếu chưa pass token)
  const result = await userService.updateAvatar(userId, req.file);
  return sendSuccess(res, 200, "Cập nhật avatar thành công!", result);
});

// 2. Upload 1 file tài liệu (Ghi vào bảng files)
export const uploadSingleFile = catchAsync(async (req, res) => {
  const userId = req.user?.id || req.user?._id || null;
  const result = await uploadService.uploadFileToR2(req.file, userId);
  return sendSuccess(res, 201, "Upload file thành công!", result);
});

// 3. Upload nhiều file tài liệu (Ghi vào bảng files)
export const uploadMultipleFiles = catchAsync(async (req, res) => {
  const userId = req.user?.id || req.user?._id || null;
  const result = await uploadService.uploadMultipleFilesToR2(req.files, userId);
  return sendSuccess(res, 201, "Upload danh sách file thành công!", result);
});
