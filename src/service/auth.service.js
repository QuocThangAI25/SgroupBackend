import * as userRepository from "../repository/user.repository.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../core/error.response.js";
import { hashPassword, comparePassword } from "../utils/password.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.helper.js";

/**
 * Nghiệp vụ Đăng ký tài khoản
 */
export const register = async ({ name, email, password, age, role }) => {
  // 1. Kiểm tra email đã được đăng ký trước đó chưa
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ConflictError("Email này đã được sử dụng!");
  }

  // 2. Băm mật khẩu trước khi lưu
  const hashedPassword = await hashPassword(password);

  // 3. Lưu vào Database
  const newUser = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    age,
    role: role || "MEMBER",
  });

  // 4. Trả về thông tin user vừa tạo (đã bỏ password)
  return newUser;
};

/**
 * Nghiệp vụ Đăng nhập & Cấp Access Token + Refresh Token
 */
export const login = async ({ email, password }) => {
  // 1. Tìm user theo email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Email hoặc mật khẩu không chính xác!");
  }

  // 2. So sánh mật khẩu
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Email hoặc mật khẩu không chính xác!");
  }

  // 3. Tạo Payload
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // 4. Phát hành cả Access Token và Refresh Token
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // 5. Trả về kết quả đầy đủ
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Nghiệp vụ Lấy thông tin user hiện tại từ ID đã decode trong token
 */
export const getMe = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("Người dùng không còn tồn tại trên hệ thống!");
  }
  return user;
};
