import pool from "../config/db.config.js";

// 1. Lấy danh sách users (Hỗ trợ sort an toàn)
export const findAll = async ({ sortBy = "id", order = "asc" }) => {
  const validSortColumns = ["id", "name", "email", "age"];
  if (!validSortColumns.includes(sortBy)) {
    throw new Error(`Invalid sort column: ${sortBy}`);
  }

  const validOrder = ["asc", "desc"];
  if (!validOrder.includes(order.toLowerCase())) {
    throw new Error(`Invalid order: ${order}`);
  }

  // Map 'name' trong code sang cột 'full_name' trong CSDL
  const dbColumn = sortBy === "name" ? "full_name" : sortBy;

  const result = await pool.query(
    `SELECT id, full_name AS name, email, age, role, created_at 
     FROM users 
     ORDER BY ${dbColumn} ${order.toUpperCase()}`,
  );
  return result.rows;
};

// 2. Tìm user theo ID
export const findById = async (id) => {
  const result = await pool.query(
    "SELECT id, full_name AS name, email, age, role, created_at FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0] || null;
};

// 3. Tìm user theo Email
// src/repository/user.repository.js

export const findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT id, full_name AS name, email, age, password_hash AS password, role, created_at FROM users WHERE email = $1",
    [email],
  );
  return result.rows[0] || null;
};

// 4. Tạo user mới (Ghi vào cột full_name và password_hash)
export const create = async ({
  name,
  email,
  age,
  password,
  role = "MEMBER",
}) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, age, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name AS name, email, age, role, created_at`,
    [name, email, age ?? null, password, role],
  );
  return result.rows[0];
};

// 5. Cập nhật user (Đã sửa từ name -> full_name)
export const update = async (id, { name, email, age }) => {
  const result = await pool.query(
    `UPDATE users 
     SET full_name = COALESCE($1, full_name), 
         email = COALESCE($2, email), 
         age = COALESCE($3, age),
         updated_at = NOW()
     WHERE id = $4 
     RETURNING id, full_name AS name, email, age, role, created_at`,
    [name ?? null, email ?? null, age ?? null, id],
  );
  return result.rows[0] || null;
};

// 6. Xóa user theo ID
export const deleteById = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, full_name AS name, email, age",
    [id],
  );
  return result.rows[0] || null;
};
