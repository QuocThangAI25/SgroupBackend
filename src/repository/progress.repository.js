import pool from "../config/db.config.js";

// Đánh dấu hoàn thành bài học (Upsert)
export const markLessonComplete = async (userId, lessonId) => {
  const query = `
    INSERT INTO lesson_progress (user_id, lesson_id, is_completed, completed_at)
    VALUES ($1, $2, TRUE, NOW()) -- Phải gán cứng TRUE và NOW() ở đây
    ON CONFLICT (user_id, lesson_id) 
    DO UPDATE SET is_completed = TRUE, completed_at = NOW() -- Và cập nhật lại khi bị trùng
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [userId, lessonId]);
  return rows[0];
};
// Lấy danh sách tiến độ của user trong một lớp học cụ thể
export const getProgressByClassAndUser = async (userId, classId) => {
  const query = `
    SELECT l.id AS lesson_id, l.title, 
           COALESCE(lp.is_completed, FALSE) AS is_completed,
           lp.completed_at
    FROM lessons l
    LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
    WHERE l.class_id = $2
    ORDER BY l.order_index ASC;
  `;
  const { rows } = await pool.query(query, [userId, classId]);
  return rows;
};

export const countCompletedByMember = async (memberId, classId) => {
  const query = `
    SELECT COUNT(lp.id) as completed 
    FROM lesson_progress lp
    JOIN lessons l ON lp.lesson_id = l.id
    WHERE lp.user_id = $1 AND l.class_id = $2 AND lp.is_completed = TRUE
  `;
  // Lưu ý kiểm tra xem project của bạn dùng pool.query hay db.query nhé
  const { rows } = await pool.query(query, [memberId, classId]);
  return parseInt(rows[0].completed, 10);
};
