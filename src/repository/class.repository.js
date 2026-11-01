import pool from "../config/db.config.js";

// 1. Tạo lớp học mới
export const createClass = async ({
  name,
  description,
  startDate,
  endDate,
  mentorId,
}) => {
  const query = `
    INSERT INTO classes (name, description, start_date, end_date, mentor_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [name, description, startDate, endDate, mentorId || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// 2. Lấy danh sách tất cả lớp học
export const findAllClasses = async () => {
  const query = `
    SELECT c.*, u.full_name AS mentor_name, u.email AS mentor_email
    FROM classes c
    LEFT JOIN users u ON c.mentor_id = u.id
    ORDER BY c.created_at DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

// 3. Tìm lớp theo ID
export const findById = async (id) => {
  const query = `
    SELECT c.*, u.full_name AS mentor_name 
    FROM classes c
    LEFT JOIN users u ON c.mentor_id = u.id
    WHERE c.id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// 4. Lấy danh sách lớp mà user đang tham gia (với tư cách Member hoặc Mentor)
export const findClassesByUserId = async (userId) => {
  const query = `
    SELECT DISTINCT c.*, u.full_name AS mentor_name
    FROM classes c
    LEFT JOIN users u ON c.mentor_id = u.id
    LEFT JOIN class_members cm ON c.id = cm.class_id
    WHERE cm.user_id = $1 OR c.mentor_id = $1
    ORDER BY c.created_at DESC;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

// 5. Thêm Member vào Lớp
export const addMemberToClass = async (classId, memberId, role = "MEMBER") => {
  const query = `
    INSERT INTO class_members (class_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (class_id, user_id) 
    DO UPDATE SET role = EXCLUDED.role
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [classId, memberId, role]);
  return rows[0];
};
// 6. Xóa Member khỏi Lớp
export const removeMemberFromClass = async (classId, memberId) => {
  const query = `
    DELETE FROM class_members
    WHERE class_id = $1 AND user_id = $2
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [classId, memberId]);
  return rows[0];
};
// Lấy danh sách thành viên của một lớp học
export const findMembersByClassId = async (classId) => {
  const query = `
    SELECT u.id, u.full_name, u.email, cm.joined_at
    FROM class_members cm
    JOIN users u ON cm.user_id = u.id
    WHERE cm.class_id = $1
    ORDER BY cm.joined_at DESC;
  `;
  const { rows } = await pool.query(query, [classId]);
  return rows;
};
