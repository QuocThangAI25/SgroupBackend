import pool from "../config/db.config.js"; // Kết nối PostgreSQL pool của bạn

// 1. Tạo bài học mới
export const create = async (lessonData) => {
  const { classId, title, content, orderIndex, createdBy } = lessonData;
  const query = `
    INSERT INTO lessons (class_id, title, content, order_index, created_by) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [classId, title, content, orderIndex || 1, createdBy];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// 2. Tìm bài học theo ID
export const findById = async (id) => {
  const query = `SELECT * FROM lessons WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// 3. Lấy danh sách bài học theo lớp (sắp xếp theo order_index)
export const findByClassId = async (classId) => {
  const query = `
    SELECT * FROM lessons 
    WHERE class_id = $1 
    ORDER BY order_index ASC, created_at ASC
  `;
  const { rows } = await pool.query(query, [classId]);
  return rows;
};

// 4. Cập nhật bài học
export const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updateData)) {
    let dbKey = key;
    if (key === "classId") dbKey = "class_id";
    if (key === "order" || key === "orderIndex") dbKey = "order_index";
    if (key === "createdBy") dbKey = "created_by";

    fields.push(`${dbKey} = $${index++}`);
    values.push(value);
  }

  values.push(id);
  const query = `
    UPDATE lessons 
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $${index} 
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// 5. Xóa bài học
export const remove = async (id) => {
  const query = `DELETE FROM lessons WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rowCount > 0;
};
// Kiểm tra xem user có thuộc lớp học này không
export const checkUserInClass = async (userId, classId) => {
  const query = `
    SELECT * FROM class_members 
    WHERE user_id = $1 AND class_id = $2
  `;
  const { rows } = await pool.query(query, [userId, classId]);
  return rows.length > 0;
};
// 6. Đánh dấu hoàn thành bài học (LessonProgress)
export const markLessonComplete = async (userId, lessonId) => {
  const query = `
    INSERT INTO lesson_progress (user_id, lesson_id, is_completed, completed_at) 
    VALUES ($1, $2, TRUE, NOW())
    ON CONFLICT (user_id, lesson_id) 
    DO UPDATE SET is_completed = TRUE, completed_at = NOW()
    RETURNING *;
  `;
  // Truyền đúng thứ tự tham số khớp với $1 (userId) và $2 (lessonId)
  const { rows } = await pool.query(query, [userId, lessonId]);
  return rows[0];
};

// 7. Đếm tổng số bài học của một lớp
export const countByClassId = async (classId) => {
  const query = `SELECT COUNT(*) as total FROM lessons WHERE class_id = $1`;
  const { rows } = await pool.query(query, [classId]);
  return parseInt(rows[0].total, 10);
};

// 8. Đếm số bài học mà user đã hoàn thành trong lớp
// Đếm số bài học mà user đã hoàn thành trong lớp
export const countCompletedByMember = async (memberId, classId) => {
  const query = `
    SELECT COUNT(lp.id) as completed 
    FROM lesson_progress lp
    JOIN lessons l ON lp.lesson_id = l.id
    WHERE lp.user_id = $1 AND l.class_id = $2 AND lp.is_completed = TRUE
  `;
  const { rows } = await pool.query(query, [memberId, classId]);
  return parseInt(rows[0].completed, 10);
};
