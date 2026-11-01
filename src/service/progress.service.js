import * as progressRepo from "../repository/progress.repository.js";
import * as lessonRepo from "../repository/lesson.repository.js"; // Hoặc hàm kiểm tra lesson tồn tại
import { NotFoundError } from "../core/error.response.js";

export const completeLessonService = async (userId, lessonId) => {
  // Kiểm tra bài học có tồn tại không
  const lesson = await lessonRepo.findById(lessonId);
  if (!lesson) {
    throw new NotFoundError("Lesson not found");
  }

  // Thực hiện ghi nhận hoàn thành
  const progress = await progressRepo.markLessonComplete(userId, lessonId);
  return progress;
};

export const getClassProgressService = async (userId, classId) => {
  const lessonsProgress = await progressRepo.getProgressByClassAndUser(
    userId,
    classId,
  );

  const totalLessons = lessonsProgress.length;
  const completedLessons = lessonsProgress.filter(
    (item) => item.is_completed,
  ).length;
  const percent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons,
    percent: `${percent}%`,
    details: lessonsProgress,
  };
};
