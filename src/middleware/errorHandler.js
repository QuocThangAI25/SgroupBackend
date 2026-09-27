import multer from "multer";
import ApiError from "../core/error.response.js";

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err instanceof multer.MulterError) {
    let message = err.message;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Kích thước file vượt quá giới hạn cho phép (Tối đa 2MB)!";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = `Field tải lên '${err.field || ""}' không đúng quy định!`;
    }
    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (err instanceof ApiError) {
    const response = {
      success: false,
      message: err.message,
    };
    if (err.errors) response.errors = err.errors;
    return res.status(err.statusCode).json(response);
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
