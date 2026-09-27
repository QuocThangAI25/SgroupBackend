import * as userRepository from "../repository/user.repository.js";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../core/error.response.js";
import { uploadToR2, deleteFromR2 } from "../utils/s3.helper.js"; // <--- Import helper R2

export const getAllUsers = async (query) => {
  return await userRepository.findAll(query);
};

export const getUserById = async (userId) => {
  const id = Number(userId);
  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const createUser = async (userData) => {
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new ConflictError("Email already exists");
  }

  return await userRepository.create(userData);
};

export const updateUser = async (userId, updateData) => {
  const id = Number(userId);

  const existingUser = await userRepository.findById(id);
  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  if (updateData.email && updateData.email !== existingUser.email) {
    const emailTaken = await userRepository.findByEmail(updateData.email);
    if (emailTaken && emailTaken.id !== id) {
      throw new ConflictError("Email already exists");
    }
  }

  return await userRepository.update(id, updateData);
};

export const deleteUser = async (userId) => {
  const id = Number(userId);

  const existingUser = await userRepository.findById(id);
  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  // Tùy chọn: dọn dẹp avatar trên R2 khi xóa User
  if (existingUser.avatar) {
    const oldFileKey = existingUser.avatar.replace(
      `${process.env.R2_PUBLIC_DOMAIN}/`,
      "",
    );
    await deleteFromR2(oldFileKey);
  }

  return await userRepository.deleteById(id);
};

/**
 * Cập nhật Avatar cho User
 */
export const updateAvatar = async (userId, file) => {
  if (!file) {
    throw new BadRequestError("Please select an image file");
  }

  const id = Number(userId);
  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // 1. Xóa avatar cũ trên R2 (nếu có)
  if (user.avatar && user.avatar.includes(process.env.R2_PUBLIC_DOMAIN)) {
    const oldFileKey = user.avatar.replace(
      `${process.env.R2_PUBLIC_DOMAIN}/`,
      "",
    );
    await deleteFromR2(oldFileKey);
  }

  // 2. Upload file avatar mới lên R2 lấy URL
  const avatarUrl = await uploadToR2(file);

  // 3. Update URL avatar mới vào Database thông qua Repository
  return await userRepository.update(id, { avatar: avatarUrl });
};
