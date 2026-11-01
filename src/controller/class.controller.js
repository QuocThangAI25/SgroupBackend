import catchAsync from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/responseHelper.js";
import * as classService from "../service/class.service.js";

// POST /classes - Admin tạo lớp
export const createClass = catchAsync(async (req, res) => {
  const newClass = await classService.createClass(req.body);
  return sendSuccess(res, 201, "Tạo lớp học thành công!", newClass);
});

// GET /classes - Admin xem tất cả lớp
export const getAllClasses = catchAsync(async (req, res) => {
  const classes = await classService.getAllClasses();
  return sendSuccess(res, 200, "Lấy danh sách lớp học thành công!", classes);
});

// GET /classes/my-classes - Member/Mentor xem lớp của mình
export const getMyClasses = catchAsync(async (req, res) => {
  const userId = req.user.id; // Lấy từ authMiddleware / JWT
  const classes = await classService.getMyClasses(userId);
  return sendSuccess(
    res,
    200,
    "Lấy danh sách lớp học của bạn thành công!",
    classes,
  );
});

// POST /classes/:id/members - Admin thêm member hoặc mentor vào lớp
export const addMember = catchAsync(async (req, res) => {
  const classId = req.params.id;
  const { memberId, roleInClass } = req.body; // Lấy thêm roleInClass từ body

  if (!memberId) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng truyền memberId!" });
  }

  // Truyền thêm roleInClass vào service (nếu không truyền thì service tự hiểu là MEMBER)
  const result = await classService.addMember(classId, memberId, roleInClass);
  return sendSuccess(res, 201, "Thêm thành viên vào lớp thành công!", result);
});
// DELETE /classes/:id/members/:memberId - Admin xóa member khỏi lớp
export const removeMember = catchAsync(async (req, res) => {
  const { id: classId, memberId } = req.params;
  await classService.removeMember(classId, memberId);
  return sendSuccess(res, 200, "Xóa member khỏi lớp thành công!");
});
// GET /classes/:id/members - Xem danh sách thành viên trong lớp
export const getClassMembers = catchAsync(async (req, res) => {
  const classId = req.params.id;
  const members = await classService.getClassMembers(classId);
  return sendSuccess(
    res,
    200,
    "Lấy danh sách thành viên lớp học thành công!",
    members,
  );
});
