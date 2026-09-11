import { readData } from "../repository/readData.js";
import { writeData } from "../repository/writeData.js";
import { parseId } from "../utils/parseId.js";
import { NotFoundError, ConflictError } from "../core/error.response.js";

export const getAllUsers = async () => {
  const users = await readData();
  return users;
};

export const getUserById = async (userId) => {
  const id = parseId(userId);
  const users = await readData();
  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const createUser = async (userData) => {
  const users = await readData();

  // Check duplicate email
  const isExistingEmail = users.some((u) => u.email === userData.email);
  if (isExistingEmail) {
    throw new ConflictError("Email already exists");
  }

  // An toàn khi mảng rỗng []
  const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0);
  const newUser = {
    id: maxId + 1,
    ...userData,
  };

  users.push(newUser);
  await writeData(users);

  return newUser;
};

export const updateUser = async (userId, updateData) => {
  const id = parseId(userId);
  const users = await readData();

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    throw new NotFoundError("User not found");
  }

  if (updateData.email && updateData.email !== users[userIndex].email) {
    const isExistingEmail = users.some(
      (u) => u.id !== id && u.email === updateData.email,
    );
    if (isExistingEmail) {
      throw new ConflictError("Email already exists");
    }
  }

  // Update user fields (prevent overwriting ID)
  const updatedUser = {
    ...users[userIndex],
    ...updateData,
    id,
  };

  users[userIndex] = updatedUser;
  await writeData(users);

  return updatedUser;
};

export const deleteUser = async (userId) => {
  const id = parseId(userId);
  const users = await readData();

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    throw new NotFoundError("User not found");
  }

  const [deletedUser] = users.splice(userIndex, 1);
  await writeData(users);

  return deletedUser;
};
