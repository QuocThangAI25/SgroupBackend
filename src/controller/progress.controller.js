import * as progressService from "../service/progress.service.js";

export const markComplete = async (req, res, next) => {
  try {
    const userId = req.user.id; // Lấy từ middleware verify token
    const lessonId = req.params.id;

    const result = await progressService.completeLessonService(
      userId,
      lessonId,
    );

    res.status(200).json({
      success: true,
      message: "Lesson marked as completed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const classId = req.params.classId;

    const progressData = await progressService.getClassProgressService(
      userId,
      classId,
    );

    res.status(200).json({
      success: true,
      data: progressData,
    });
  } catch (error) {
    next(error);
  }
};
