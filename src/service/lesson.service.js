import * as lessonRepository from "../repository/lesson.repository.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";

// 1. Tạo bài học mới
export const createLesson = async (classId, userId, payload) => {
  const { title, content, order_index } = payload;
  const newLesson = await lessonRepository.create({
    classId,
    title,
    content,
    orderIndex: order_index || 1,
    createdBy: userId,
  });
  return newLesson;
};

// 2. Lấy danh sách bài học theo lớp
export const getLessonsByClass = async (classId) => {
  const lessons = await lessonRepository.findByClassId(classId);
  return lessons;
};

// 3. Cập nhật bài học
export const updateLesson = async (lessonId, payload) => {
  const lesson = await lessonRepository.findById(lessonId);
  if (!lesson) {
    throw new NotFoundError("Không tìm thấy bài học!");
  }
  const updated = await lessonRepository.update(lessonId, payload);
  return updated;
};

// 4. Xóa bài học
export const deleteLesson = async (lessonId) => {
  const lesson = await lessonRepository.findById(lessonId);
  if (!lesson) {
    throw new NotFoundError("Không tìm thấy bài học!");
  }
  await lessonRepository.remove(lessonId);
  return { message: "Xóa bài học thành công!" };
};

// 5. Đánh dấu hoàn thành bài học
export const completeLesson = async (lessonId, memberId) => {
  // 1. Kiểm tra bài học có tồn tại không và lấy ra class_id của nó
  const lesson = await lessonRepository.findById(lessonId);
  if (!lesson) {
    throw new NotFoundError("Không tìm thấy bài học!");
  }

  const isMember = await lessonRepository.checkUserInClass(
    memberId,
    lesson.class_id,
  );
  if (!isMember) {
    throw new BadRequestError(
      "Bạn không thuộc lớp học này nên không thể đánh dấu hoàn thành!",
    );
  }

  // 3. Nếu qua được cửa kiểm tra trên mới cho phép ghi nhận hoàn thành
  try {
    const progress = await lessonRepository.markLessonComplete(
      memberId,
      lessonId,
    );
    return progress;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY" || error.constraint) {
      throw new BadRequestError("Bạn đã hoàn thành bài học này rồi!");
    }
    throw error;
  }
};
// 6. Tính toán tiến độ học tập của member trong lớp
export const getClassProgress = async (classId, memberId) => {
  // Đếm tổng số bài học của lớp
  const totalLessons = await lessonRepository.countByClassId(classId);

  if (totalLessons === 0) {
    return { totalLessons: 0, completedLessons: 0, progress: 0 };
  }

  // Đảo lại đúng thứ tự tham số khớp với repository: (memberId, classId)
  const completedLessons = await lessonRepository.countCompletedByMember(
    memberId,
    classId,
  );

  // Tính phần trăm tiến độ
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return {
    totalLessons,
    completedLessons,
    progress,
  };
};
