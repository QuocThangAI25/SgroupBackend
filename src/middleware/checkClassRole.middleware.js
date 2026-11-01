import pool from "../config/db.config.js";

export const verifyClassMentorOrAdmin = async (req, res, next) => {
  try {
    // Bước 2: Lấy userId từ token (đã được giải mã bởi middleware verifyToken chạy trước đó)
    // và classId từ URL params
    const userId = req.user.id; // Tùy thuộc vào cách bạn gán payload vào req.user khi decode token
    const classId = req.params.id;

    // Nếu tài khoản là ADMIN toàn hệ thống thì cho phép đi tiếp luôn
    if (req.user.role === "ADMIN" || req.user.role === "admin") {
      return next();
    }

    // Bước 3: Truy vấn vào bảng class_members xem user này có role = 'MENTOR' ở lớp học này không
    const query = `
      SELECT role FROM class_members 
      WHERE class_id = $1 AND user_id = $2;
    `;
    const { rows } = await pool.query(query, [classId, userId]);

    if (rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Bạn không phải là thành viên của lớp học này!",
      });
    }

    const memberRole = rows[0].role;

    // Bước 4: Kiểm tra nếu là MENTOR thì cho phép qua, ngược lại từ chối
    if (memberRole === "MENTOR") {
      return next(); // Đúng là mentor của lớp -> Cho phép chạy tiếp vào Controller
    }

    return res.status(403).json({
      success: false,
      message:
        "Bạn không có quyền quản lý (chỉ Mentor của lớp mới được thao tác)!",
    });
  } catch (error) {
    console.error("Lỗi middleware phân quyền lớp:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi kiểm tra quyền.",
    });
  }
};
