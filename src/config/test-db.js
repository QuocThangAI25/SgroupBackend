import { connectDB, query } from "./db.config.js"; // Đổi thành đường dẫn tới file của bạn

async function test() {
  // 1. Kiểm tra kết nối
  await connectDB();

  // 2. Chạy thử một câu lệnh SELECT đơn giản
  try {
    const res = await query("SELECT NOW(), current_database();");
    console.log(" Current Time:", res.rows[0].now);
    console.log(" Database Name:", res.rows[0].current_database);
  } catch (err) {
    console.error(" Query Error:", err.message);
  }
}

test();
