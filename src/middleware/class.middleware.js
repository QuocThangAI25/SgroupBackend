import { ForbiddenError, NotFoundError } from "../core/error.response.js";
import * as classRepository from "../repository/class.repository.js"; // Giả sử bạn có classRepository

export const isClassMentorOrAdmin = async (req, res, next) => {
  try {
    const classId = req.params.classId || req.body.classId;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Nếu là ADMIN thì luôn cho phép truy cập
    if (userRole === "ADMIN") {
      return next();
    }

    // Lấy thông tin lớp học để kiểm tra mentorId
    const currentClass = await classRepository.findById(classId);
    if (!currentClass) {
      throw new NotFoundError("Không tìm thấy lớp học!");
    }

    // Kiểm tra xem user có phải là Mentor được gán cho lớp này hay không
    if (currentClass.mentorId !== userId) {
      throw new ForbiddenError("Bạn không phải là Mentor của lớp học này!");
    }

    next();
  } catch (error) {
    next(error);
  }
};
