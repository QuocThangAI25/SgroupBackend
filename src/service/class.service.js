import * as classRepository from "../repository/class.repository.js";

// Tạo Lớp
export const createClass = async (classData) => {
  if (!classData.name) {
    throw new Error("Tên lớp học là bắt buộc!");
  }
  return await classRepository.createClass(classData);
};

// Lấy tất cả Lớp
export const getAllClasses = async () => {
  return await classRepository.findAllClasses();
};

// Lấy danh sách Lớp của User hiện tại
export const getMyClasses = async (userId) => {
  return await classRepository.findClassesByUserId(userId);
};

// Thêm Member vào Lớp (Bắt lỗi trùng lặp)
// Thêm member hoặc mentor vào lớp
export const addMember = async (classId, memberId, roleInClass) => {
  const existingClass = await classRepository.findById(classId);
  if (!existingClass) {
    throw new Error("Lớp học không tồn tại!");
  }

  // Mặc định là 'MEMBER' nếu không truyền roleInClass
  const role = roleInClass || "MEMBER";

  try {
    // Truyền thêm role xuống repository
    return await classRepository.addMemberToClass(classId, memberId, role);
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Thành viên này đã có trong lớp học từ trước!");
    }
    throw error;
  }
};

// Xóa Member khỏi Lớp
export const removeMember = async (classId, memberId) => {
  const result = await classRepository.removeMemberFromClass(classId, memberId);
  if (!result) {
    throw new Error("Member không có trong lớp học này!");
  }
  return result;
};
export const getClassMembers = async (classId) => {
  const existingClass = await classRepository.findById(classId);
  if (!existingClass) {
    throw new Error("Lớp học không tồn tại!");
  }
  return await classRepository.findMembersByClassId(classId);
};
