// src/middleware/auth.middleware.js
import { UnauthorizedError, ForbiddenError } from "../core/error.response.js";
import { verifyToken } from "../utils/jwt.helper.js";

// 1. Middleware Xác thực Đăng nhập (Authentication)
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      "Bạn chưa đăng nhập! Vui lòng cung cấp token hợp lệ.",
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Dữ liệu payload token: { id, email, role }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError(
        "Token của bạn đã hết hạn, vui lòng đăng nhập lại!",
      );
    }
    throw new UnauthorizedError(
      "Token không hợp lệ hoặc đã bị chỉnh sửa trái phép!",
    );
  }
};

// 2. Middleware Phân quyền Tĩnh theo Role (Authorization - VD: ADMIN)
export const authorize = (...allowedRoles) => {
  // Dùng .flat() để xử lý an toàn dù truyền vào là chuỗi hay mảng
  const rolesArray = allowedRoles.flat();

  return (req, res, next) => {
    if (!req.user || !rolesArray.includes(req.user.role)) {
      throw new ForbiddenError("Bạn không có quyền thực hiện hành động này!");
    }
    next();
  };
};
