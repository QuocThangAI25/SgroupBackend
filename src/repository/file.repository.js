import pool from "../config/db.config.js";

// Tạo một record file mới vào bảng files
export const create = async ({
  filename,
  originalName,
  mimetype,
  size,
  url,
  uploadedBy,
}) => {
  const query = `
    INSERT INTO files (filename, original_name, mimetype, size, url, uploaded_by)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, filename, original_name AS "originalName", mimetype, size, url, uploaded_by AS "uploadedBy", created_at AS "createdAt";
  `;
  const values = [filename, originalName, mimetype, size, url, uploadedBy];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Tìm file theo ID
export const findById = async (id) => {
  const result = await pool.query("SELECT * FROM files WHERE id = $1", [id]);
  return result.rows[0] || null;
};

// Xóa file theo ID
export const deleteById = async (id) => {
  const result = await pool.query(
    "DELETE FROM files WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0] || null;
};
