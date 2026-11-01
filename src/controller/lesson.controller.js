import catchAsync from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/responseHelper.js";
import * as lessonService from "../service/lesson.service.js";

// Tạo bài học
export const createLesson = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const userId = req.user.id;
  const result = await lessonService.createLesson(classId, userId, req.body);
  return sendSuccess(res, 201, "Tạo bài học thành công!", result);
});

// Lấy danh sách bài học
export const getLessonsByClass = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const result = await lessonService.getLessonsByClass(classId);
  return sendSuccess(res, 200, "Lấy danh sách bài học thành công!", result);
});

// Cập nhật bài học
export const updateLesson = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await lessonService.updateLesson(id, req.body);
  return sendSuccess(res, 200, "Cập nhật bài học thành công!", result);
});

// Xóa bài học
export const deleteLesson = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await lessonService.deleteLesson(id);
  return sendSuccess(res, 200, "Xóa bài học thành công!", result);
});

// Đánh dấu hoàn thành bài học
export const completeLesson = catchAsync(async (req, res) => {
  const { id: lessonId } = req.params;
  const memberId = req.user.id; // Lấy ID của member đang đăng nhập
  const result = await lessonService.completeLesson(lessonId, memberId);
  return sendSuccess(res, 200, "Đã đánh dấu hoàn thành bài học!", result);
});

// Lấy tiến độ học tập của lớp
export const getClassProgress = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const memberId = req.user.id;
  const result = await lessonService.getClassProgress(classId, memberId);
  return sendSuccess(res, 200, "Lấy tiến độ học tập thành công!", result);
});
